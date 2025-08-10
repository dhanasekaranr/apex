/**
 * @fileoverview Modern Angular 20 shared tab group component with signals
 * Features: signal inputs, progress tracking, auto-loading, read-only support
 * @version 2.0.0
 */

import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  EventEmitter,
  input,
  Output,
  QueryList,
  signal,
  ViewChildren,
  ViewContainerRef,
} from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTabsModule } from '@angular/material/tabs';
import { MatTooltipModule } from '@angular/material/tooltip';
import { LoadStrategy, TabConfig, TabValidatable } from './tab.interfaces';

@Component({
  selector: 'app-shared-tab-group',
  standalone: true,
  imports: [
    CommonModule,
    MatTabsModule,
    MatButtonModule,
    MatIconModule,
    MatTooltipModule,
    MatProgressSpinnerModule,
  ],
  templateUrl: './shared-tab-group.component.html',
  styleUrl: './shared-tab-group.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'app-tabs-theme' },
})
export class SharedTabGroupComponent {
  // Signal inputs (Angular 20)
  tabConfigs = input.required<TabConfig[]>();
  globalLoadStrategy = input<LoadStrategy>('lazy');
  validateOnTabSwitch = input(true);
  saveMode = input<'parent' | 'internal'>('parent');
  showGlobalActions = input(true);

  /** Auto-load behavior when calling saveAll(): 'none' | 'missing' | 'all' */
  saveAllLoad = input<'none' | 'missing' | 'all'>('missing');
  /** Max ms to wait for auto-loaded tabs before bailing */
  saveAllAutoLoadTimeoutMs = input(8000);
  /** Max concurrent auto-load operations during Save All */
  saveAllLoadConcurrency = input(2);
  /** Emit progress events while Save All runs */
  emitProgress = input(true);

  @ViewChildren('host', { read: ViewContainerRef })
  hosts!: QueryList<ViewContainerRef>;

  // Progress output
  @Output() saveAllProgress = new EventEmitter<{
    phase: 'autoload' | 'validate' | 'saving' | 'emit' | 'complete' | 'error';
    totalToLoad?: number;
    loadedCount?: number;
    currentTabIndex?: number;
    currentTabId?: string;
    message?: string;
  }>();

  // Global save output for parent mode
  @Output() globalSave = new EventEmitter<Record<string, unknown>>();

  // Internal signals
  readonly selectedIndex = signal(0);
  private readonly _states = signal<
    { loaded: boolean; valid: boolean; dirty: boolean; cmp?: TabValidatable }[]
  >([]);
  states = computed(() => this._states());
  readonly loadingSet = signal(new Set<number>());

  constructor() {
    // React to tabConfigs changes
    effect(() => {
      const cfgs = this.tabConfigs();
      if (!cfgs?.length) return;
      this._states.set(
        Array.from({ length: cfgs.length }, () => ({
          loaded: false,
          valid: true,
          dirty: false,
        }))
      );
      queueMicrotask(() => this.loadInitial());
    });
  }

  // --- Initial load per strategy (+ per-tab override) ---
  private loadInitial() {
    const cfgs = this.tabConfigs();
    const first = cfgs.findIndex((t) => t.enabled !== false);
    if (first === -1) return;

    const modeOf = (i: number): LoadStrategy =>
      cfgs[i].mode ?? this.globalLoadStrategy();

    if (this.globalLoadStrategy() === 'eager') {
      cfgs.forEach((t, i) => t.enabled !== false && this.ensureLoaded(i));
      this.selectedIndex.set(first);
      return;
    }

    // Always load the first enabled
    this.ensureLoaded(first);
    this.selectedIndex.set(first);

    if (this.globalLoadStrategy() === 'lazy') {
      queueMicrotask(() =>
        cfgs.forEach((t, i) => {
          if (i === first || t.enabled === false) return;
          const m = modeOf(i);
          if (m === 'eager' || m === 'lazy') this.ensureLoaded(i);
        })
      );
    }
  }

  private ensureLoaded(index: number) {
    const s = this._states();
    const cfgs = this.tabConfigs();
    if (s[index]?.loaded || cfgs[index].enabled === false) return;

    // Spin
    this.loadingSet.update((set) => (set.add(index), new Set(set)));

    const tryCreate = () => {
      const host = this.hosts?.get(index);
      if (!host) {
        queueMicrotask(tryCreate);
        return;
      }
      host.clear();
      const ref = host.createComponent(cfgs[index].component);

      // Initial data
      const data = cfgs[index].data;
      if (data && typeof data === 'object') {
        Object.assign(ref.instance as any, data);
      }

      // Set read-only if needed
      if (cfgs[index].readOnly) {
        const inst = ref.instance as TabValidatable;
        if (typeof inst.setReadOnly === 'function') inst.setReadOnly(true);
        else (inst as any).readOnly = true; // fallback
      }

      const cmp = ref.instance as TabValidatable;
      s[index] = {
        ...s[index],
        loaded: true,
        valid: cmp.isValid(),
        dirty: cmp.isDirty(),
        cmp,
      };
      this._states.set([...s]);

      // Light bridge for validity/dirty (replace with status$ if you expose one)
      const sync = () => {
        const cur = this._states();
        const c = cur[index];
        if (!c?.cmp) return;
        const next = { ...c, valid: c.cmp.isValid(), dirty: c.cmp.isDirty() };
        if (next.valid !== c.valid || next.dirty !== c.dirty)
          this._states.set(Object.assign([...cur], { [index]: next }));
      };
      const id = setInterval(sync, 250);
      ref.onDestroy(() => clearInterval(id));

      // Stop spinner
      this.loadingSet.update((set) => {
        set.delete(index);
        return new Set(set);
      });
    };

    queueMicrotask(tryCreate);
  }

  // Utility: wait until a condition is true or timeout
  private waitUntil(
    predicate: () => boolean,
    timeoutMs: number,
    stepMs = 30
  ): Promise<void> {
    return new Promise((resolve, reject) => {
      const start = Date.now();
      const tick = () => {
        if (predicate()) return resolve();
        if (Date.now() - start >= timeoutMs)
          return reject(new Error('waitUntil timeout'));
        setTimeout(tick, stepMs);
      };
      tick();
    });
  }

  private async ensureLoadedAsync(index: number): Promise<void> {
    if (this._states()[index]?.loaded) return;
    this.ensureLoaded(index);
    await this.waitUntil(
      () => !!this._states()[index]?.loaded,
      this.saveAllAutoLoadTimeoutMs()
    );
  }

  private async autoLoadTargetsConcurrently(targets: number[]) {
    const cfgs = this.tabConfigs();
    const total = targets.length;
    if (this.emitProgress() && total > 0)
      this.saveAllProgress.emit({
        phase: 'autoload',
        totalToLoad: total,
        loadedCount: 0,
      });

    let loadedCount = 0;
    const queue = [...targets];
    const workers = Math.max(
      1,
      Math.min(this.saveAllLoadConcurrency(), queue.length)
    );

    const runNext = async (): Promise<void> => {
      const idx = queue.shift();
      if (idx === undefined) return;
      try {
        await this.ensureLoadedAsync(idx);
        loadedCount++;
        if (this.emitProgress())
          this.saveAllProgress.emit({
            phase: 'autoload',
            totalToLoad: total,
            loadedCount,
            currentTabIndex: idx,
            currentTabId: cfgs[idx].id,
          });
      } catch (err) {
        if (this.emitProgress())
          this.saveAllProgress.emit({
            phase: 'error',
            currentTabIndex: idx,
            currentTabId: cfgs[idx].id,
            message: 'Auto-load failed',
          });
        throw err;
      }
      return runNext();
    };

    await Promise.all(Array.from({ length: workers }, () => runNext()));
  }

  // --- Navigation guard ---
  onTabChange(nextIndex: number) {
    const cur = this.selectedIndex();
    if (nextIndex === cur) return;

    const cfgs = this.tabConfigs();
    const curCfg = cfgs[cur];
    const curState = this._states()[cur];

    if (
      this.validateOnTabSwitch() &&
      !curCfg?.readOnly &&
      curState?.loaded &&
      (!curState.valid || curState.dirty) &&
      cfgs[nextIndex].mode !== 'onClickOnly' // Allow switching to onClickOnly tabs even if current is invalid
    ) {
      this.selectedIndex.set(cur); // veto
      return;
    }

    const nextMode = cfgs[nextIndex].mode ?? this.globalLoadStrategy();
    
    // Check if onClickOnly tab requires validation
    if (nextMode === 'onClickOnly' && !this._states()[nextIndex]?.loaded) {
      if (cfgs[nextIndex].requiresValidation && !this.allLoadedTabsValid()) {
        // Don't switch, but don't veto either - just show a message via tooltip system
        return;
      }
      this.ensureLoaded(nextIndex);
    }
    
    this.selectedIndex.set(nextIndex);
  }

  // Helper method to check if all loaded tabs are valid
  private allLoadedTabsValid(): boolean {
    const states = this._states();
    return states.every(state => !state.loaded || (state.loaded && state.valid));
  }

  // Helper method for template
  getTabMode(tab: TabConfig, index: number): LoadStrategy {
    return tab.mode ?? this.globalLoadStrategy();
  }

  // Enhanced tooltip system
  getTabTooltip(tab: TabConfig, index: number): string {
    const baseTooltip = tab.iconTooltip || tab.label;
    const state = this._states()[index];
    const mode = this.getTabMode(tab, index);
    
    // Add status information to tooltip
    if (tab.enabled === false) {
      return `${baseTooltip} (Disabled: ${tab.disabledTooltip || 'Feature not available'})`;
    }
    
    if (tab.readOnly) {
      return `${baseTooltip} (Read-only)`;
    }
    
    if (state?.loaded) {
      const validationStatus = state.valid ? 'Valid' : 'Has validation errors';
      const dirtyStatus = state.dirty ? ' - Unsaved changes' : '';
      return `${baseTooltip} (${validationStatus}${dirtyStatus})`;
    }
    
    if (mode === 'onClickOnly') {
      if (tab.requiresValidation && !this.allLoadedTabsValid()) {
        return `${baseTooltip} (Click to load - Blocked: Fix validation errors in other tabs first)`;
      }
      return `${baseTooltip} (Click to load)`;
    }
    
    return `${baseTooltip} (Loading...)`;
  }

  // Enhanced click-to-load icon logic
  canShowClickToLoadIcon(tab: TabConfig, index: number): boolean {
    return tab.enabled !== false && 
           !tab.readOnly && 
           !this._states()[index]?.loaded && 
           !this.loadingSet().has(index) && 
           this.getTabMode(tab, index) === 'onClickOnly';
  }

  getClickToLoadIcon(tab: TabConfig, index: number): string {
    if (tab.requiresValidation && !this.allLoadedTabsValid()) {
      return 'block'; // Blocked icon
    }
    return 'play_circle_outline'; // Normal click to load icon
  }

  getClickToLoadColor(tab: TabConfig, index: number): string {
    if (tab.requiresValidation && !this.allLoadedTabsValid()) {
      return '#ff5722'; // Warning/error color
    }
    return '#1976d2'; // Primary color
  }

  getClickToLoadTooltip(tab: TabConfig, index: number): string {
    if (tab.requiresValidation && !this.allLoadedTabsValid()) {
      const invalidTabs = this.getInvalidTabNames();
      return `Cannot load: Please fix validation errors in ${invalidTabs.join(', ')} first`;
    }
    return 'Click to load content';
  }

  private getInvalidTabNames(): string[] {
    const states = this._states();
    const configs = this.tabConfigs();
    const invalidTabs: string[] = [];
    
    states.forEach((state, index) => {
      if (state.loaded && !state.valid) {
        invalidTabs.push(configs[index].label);
      }
    });
    
    return invalidTabs;
  }

  // --- Actions ---
  async saveAll() {
    const cfgs = this.tabConfigs();

    // 0) Auto-load behavior per configuration
    const loadMode = this.saveAllLoad();
    if (loadMode !== 'none') {
      const targets: number[] = [];
      if (loadMode === 'all') {
        for (let i = 0; i < cfgs.length; i++)
          if (cfgs[i].enabled !== false && !this._states()[i]?.loaded)
            targets.push(i);
      } else {
        // 'missing'
        for (let i = 0; i < cfgs.length; i++)
          if (!this._states()[i]?.loaded && cfgs[i].enabled !== false)
            targets.push(i);
      }
      try {
        await this.autoLoadTargetsConcurrently(targets);
      } catch {
        // Focus first failing target if any
        const first = targets.find((i) => !this._states()[i]?.loaded);
        if (first !== undefined) this.selectedIndex.set(first);
        return;
      }
    }

    // 1) Validate only non-read-only tabs
    if (this.emitProgress()) this.saveAllProgress.emit({ phase: 'validate' });
    for (let i = 0; i < cfgs.length; i++) {
      const st = this._states()[i];
      if (!st?.loaded || !st.cmp) {
        this.selectedIndex.set(i);
        return;
      }
      if (!cfgs[i].readOnly && !st.cmp.isValid()) {
        this.selectedIndex.set(i);
        return;
      }
    }

    // 2) Save according to mode
    if (this.saveMode() === 'parent') {
      const payload: Record<string, unknown> = {};
      for (let i = 0; i < cfgs.length; i++) {
        const st = this._states()[i]!;
        if (cfgs[i].includeInGlobalPayload === false) continue;
        payload[cfgs[i].id] = st.cmp!.getData();
      }
      if (this.emitProgress()) this.saveAllProgress.emit({ phase: 'emit' });
      this.globalSave.emit(payload);
      if (this.emitProgress()) this.saveAllProgress.emit({ phase: 'complete' });
      return;
    }

    // Internal: call each tab.save() sequentially, skipping read-only
    for (let i = 0; i < cfgs.length; i++) {
      const st = this._states()[i]!;
      if (cfgs[i].readOnly) continue;
      if (this.emitProgress())
        this.saveAllProgress.emit({
          phase: 'saving',
          currentTabIndex: i,
          currentTabId: cfgs[i].id,
        });
      await st.cmp!.save();
      const copy = [...this._states()];
      copy[i] = { ...copy[i], dirty: false };
      this._states.set(copy);
    }
    if (this.emitProgress()) this.saveAllProgress.emit({ phase: 'complete' });
  }

  resetAll() {
    const copy = [...this._states()];
    for (let i = 0; i < copy.length; i++) {
      const st = copy[i];
      if (st?.loaded && st.cmp) st.cmp.reset();
      copy[i] = { ...copy[i], dirty: false, valid: st?.cmp?.isValid() ?? true };
    }
    this._states.set(copy);
  }

  async saveTab(index: number) {
    const cfg = this.tabConfigs()[index];
    const st = this._states()[index];
    if (cfg.readOnly || !st?.loaded || !st.cmp || !st.cmp.isValid()) return;
    await st.cmp.save();
    const copy = [...this._states()];
    copy[index] = { ...copy[index], dirty: false };
    this._states.set(copy);
  }

  resetTab(index: number) {
    const st = this._states()[index];
    if (!st?.loaded || !st.cmp) return;
    st.cmp.reset();
    const copy = [...this._states()];
    copy[index] = { ...copy[index], dirty: false, valid: st.cmp.isValid() };
    this._states.set(copy);
  }

  // Helpers
  canSaveAll() {
    return this._states().every(
      (s, i) => this.tabConfigs()[i].readOnly || (s.loaded && s.valid)
    );
  }

  hasAnyLoaded() {
    return this._states().some((s) => s.loaded);
  }
}
