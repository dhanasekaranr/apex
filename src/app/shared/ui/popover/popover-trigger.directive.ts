import {
  DestroyRef,
  Directive,
  ElementRef,
  HostListener,
  Input,
  OnDestroy,
  TemplateRef,
  inject,
} from '@angular/core';
import { PopoverService } from './popover.service';
import {
  DEFAULT_HOVER_CLOSE_DELAY_MS,
  PopoverConfig,
  PopoverContent,
  PopoverTrigger,
} from './popover.types';

@Directive({
  selector: '[popoverTrigger]',
  standalone: true,
})
export class PopoverTriggerDirective implements OnDestroy {
  private host = inject(ElementRef<HTMLElement>);
  private svc = inject(PopoverService);
  private destroyRef = inject(DestroyRef);

  @Input('popoverTrigger') content!: PopoverContent; // string | TemplateRef | Component
  @Input() popoverConfig?: PopoverConfig;

  private isOpen = false;
  private currentRef?: ReturnType<PopoverService['open']>;
  private hoverTimer?: ReturnType<typeof setTimeout>;
  private closeTimer?: ReturnType<typeof setTimeout>;
  private controlledId?: string;

  constructor() {
    // Ensure trigger has button-like semantics for SR when used on spans/icons
    const el = this.host.nativeElement;
    if (!['BUTTON', 'A', 'INPUT'].includes(el.tagName)) {
      el.setAttribute('tabindex', el.getAttribute('tabindex') ?? '0');
      el.setAttribute('role', el.getAttribute('role') ?? 'button');
    }
  }

  ngOnDestroy(): void {
    this.clearTimers();
    this.currentRef?.close();
    this.removeAria();
  }

  private open(): void {
    if (this.isOpen) return;
    const cfg = this.popoverConfig ?? {};
    this.currentRef = this.svc.open(
      this.host.nativeElement,
      this.normalizeContent(),
      cfg
    );
    this.isOpen = true;

    // Manage ARIA on trigger
    const role = cfg.role ?? 'dialog';
    this.host.nativeElement.setAttribute('aria-haspopup', role);
    this.host.nativeElement.setAttribute('aria-expanded', 'true');

    // Link aria-controls
    const panelId = (this.currentRef as any).panelId as string | undefined;
    if (panelId) {
      this.controlledId = panelId;
      this.host.nativeElement.setAttribute('aria-controls', panelId);
      // For tooltip role also add aria-describedby when no header
      if ((cfg.role ?? 'dialog') === 'tooltip') {
        this.host.nativeElement.setAttribute('aria-describedby', panelId);
      }
    }

    // Handle popover close
    this.currentRef.afterClosed().then(() => this.afterCloseCleanup());

    // For hover triggers, add hover support to the popover panel itself
    if (cfg.trigger === 'hover') {
      const panelId = (this.currentRef as any).panelId as string | undefined;
      if (panelId) {
        const panelElement = document.getElementById(panelId);
        if (panelElement) {
          const onPanelEnter = () => this.clearTimers();
          const onPanelLeave = () => {
            const delay = cfg.hoverCloseDelayMs ?? DEFAULT_HOVER_CLOSE_DELAY_MS;
            this.closeTimer = setTimeout(() => this.close(), delay);
          };
          panelElement.addEventListener('mouseenter', onPanelEnter);
          panelElement.addEventListener('mouseleave', onPanelLeave);

          // Clean up panel listeners when popover closes
          this.currentRef.afterClosed().then(() => {
            panelElement.removeEventListener('mouseenter', onPanelEnter);
            panelElement.removeEventListener('mouseleave', onPanelLeave);
          });
        }
      }
    }
  }

  private afterCloseCleanup(): void {
    this.isOpen = false;
    this.host.nativeElement.setAttribute('aria-expanded', 'false');
    // Return focus to trigger for dialog role
    const cfg = this.popoverConfig ?? {};
    if ((cfg.role ?? 'dialog') === 'dialog') {
      this.host.nativeElement.focus({ preventScroll: true });
    }
  }

  private close(): void {
    if (!this.isOpen) return;
    this.currentRef?.close();
  }

  private normalizeContent(): PopoverContent {
    const c = this.content;
    if (c instanceof TemplateRef) return c as TemplateRef<unknown>;
    return c;
  }

  private clearTimers(): void {
    if (this.hoverTimer) {
      clearTimeout(this.hoverTimer);
      this.hoverTimer = undefined;
    }
    if (this.closeTimer) {
      clearTimeout(this.closeTimer);
      this.closeTimer = undefined;
    }
  }

  private removeAria(): void {
    const el = this.host.nativeElement;
    el.removeAttribute('aria-expanded');
    if (this.controlledId) {
      el.removeAttribute('aria-controls');
      el.removeAttribute('aria-describedby');
      this.controlledId = undefined;
    }
  }

  // === Trigger Behaviors ===
  @HostListener('click', ['$event'])
  onClick(ev: MouseEvent): void {
    const trig: PopoverTrigger | undefined =
      this.popoverConfig?.trigger ?? 'click';
    if (trig !== 'click') return;
    ev.stopPropagation();
    this.isOpen ? this.close() : this.open();
  }

  @HostListener('keydown', ['$event'])
  onKeydown(ev: KeyboardEvent): void {
    const trig = this.popoverConfig?.trigger ?? 'click';
    if (trig === 'click' && (ev.key === 'Enter' || ev.key === ' ')) {
      ev.preventDefault();
      this.isOpen ? this.close() : this.open();
    }
    if (ev.key === 'Escape') {
      this.close();
    }
  }

  @HostListener('mouseenter') onMouseEnter(): void {
    const cfg = this.popoverConfig ?? {};
    if ((cfg.trigger ?? 'click') !== 'hover') return;
    this.clearTimers();
    const delay = cfg.openDelayMs ?? 0;
    this.hoverTimer = setTimeout(() => {
      if (!this.isOpen) {
        this.open();
      }
    }, delay);
  }

  @HostListener('mouseleave') onMouseLeave(): void {
    const cfg = this.popoverConfig ?? {};
    if ((cfg.trigger ?? 'click') !== 'hover') return;
    this.clearTimers();
    const delay = cfg.hoverCloseDelayMs ?? DEFAULT_HOVER_CLOSE_DELAY_MS;
    this.closeTimer = setTimeout(() => {
      if (this.isOpen) {
        this.close();
      }
    }, delay);
  }

  // Keyboard-accessible hover via focus/blur
  @HostListener('focus') onFocus(): void {
    const cfg = this.popoverConfig ?? {};
    if ((cfg.trigger ?? 'click') !== 'hover') return;
    this.clearTimers();
    const delay = cfg.openDelayMs ?? 0;
    this.hoverTimer = setTimeout(() => {
      if (!this.isOpen) {
        this.open();
      }
    }, delay);
  }

  @HostListener('blur') onBlur(): void {
    const cfg = this.popoverConfig ?? {};
    if ((cfg.trigger ?? 'click') !== 'hover') return;
    this.clearTimers();
    const delay = cfg.hoverCloseDelayMs ?? 200;
    this.closeTimer = setTimeout(() => {
      if (this.isOpen) {
        this.close();
      }
    }, delay);
  }
}
