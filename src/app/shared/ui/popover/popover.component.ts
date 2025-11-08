import { A11yModule, FocusTrapFactory } from '@angular/cdk/a11y';
import { ComponentPortal, PortalModule } from '@angular/cdk/portal';
import { NgTemplateOutlet } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  ElementRef,
  inject,
  Input,
  OnDestroy,
  signal,
  TemplateRef,
  ViewChild,
  ViewContainerRef,
} from '@angular/core';
import { POPOVER_CONFIG } from './popover.tokens';
import { PopoverConfig, PopoverContent } from './popover.types';

@Component({
  selector: 'shared-popover',
  standalone: true,
  imports: [PortalModule, A11yModule, NgTemplateOutlet],
  template: `
    <div
      class="popover"
      [attr.role]="cfg.role ?? 'dialog'"
      [attr.aria-modal]="(cfg.role ?? 'dialog') === 'dialog' ? 'true' : null"
      [attr.aria-labelledby]="cfg.showHeader && titleId ? titleId : null"
      [attr.aria-describedby]="'popover-content-' + titleId"
      tabindex="-1"
    >
      @if (cfg.showHeader || cfg.showClose) {
      <div class="popover-header">
        @if (cfg.showHeader) {
        <div class="title" [attr.id]="titleId">{{ cfg.headerText }}</div>
        }
        <div class="spacer"></div>
        @if (showCopy()) {
        <button
          type="button"
          class="icon-btn"
          (click)="onCopyClick($event)"
          [attr.aria-label]="copyAriaLabel"
          [attr.aria-describedby]="'copy-status-' + titleId"
        >
          <span class="icon" aria-hidden="true">📋</span>
        </button>
        } @if (cfg.showClose !== false) {
        <button
          type="button"
          class="icon-btn"
          (click)="onCloseClick($event)"
          aria-label="Close popover"
          [attr.aria-keyshortcuts]="'Escape'"
        >
          <span class="icon" aria-hidden="true">✕</span>
        </button>
        }
      </div>
      }

      <div
        class="popover-content"
        #contentContainer
        [attr.id]="'popover-content-' + titleId"
        [style.maxHeight]="cfg.maxHeight || '60vh'"
        [style.maxWidth]="cfg.maxWidth || 'min(90vw, 420px)'"
        [style.width]="cfg.width || 'auto'"
        role="region"
        [attr.aria-label]="cfg.showHeader ? null : 'Popover content'"
      >
        @if (typeof content === 'string') {
        <pre class="text" [attr.aria-label]="'Content: ' + content">{{
          content
        }}</pre>
        } @else { @if (isTemplate()) {
        <ng-container
          *ngTemplateOutlet="getTemplateRef(); context: { $implicit: cfg.data }"
        ></ng-container>
        } @else {
        <ng-template [cdkPortalOutlet]="componentPortal"></ng-template>
        } }
      </div>

      @if (cfg.hasArrow !== false) {
      <div class="arrow" aria-hidden="true"></div>
      }

      <!-- WCAG 2.2 AAA compliant live region for feedback -->
      <div
        class="sr-only"
        aria-live="polite"
        aria-atomic="true"
        [attr.id]="'copy-status-' + titleId"
      >
        {{ liveMessage() }}
      </div>
    </div>
  `,
  styles: [
    `
      :host {
        display: block;
      }
      .popover {
        background: var(--popover-bg, #111827);
        color: var(--popover-fg, #e5e7eb);
        border: 1px solid
          color-mix(in oklab, var(--popover-bg, #111827), white 20%);
        box-shadow: 0 10px 30px rgba(0, 0, 0, 0.35);
        border-radius: 12px;
        overflow: hidden;
        min-width: 220px;
      }
      .popover:focus {
        outline: 3px solid #3b82f6;
        outline-offset: 2px;
      }
      .popover-header {
        display: flex;
        align-items: center;
        gap: 8px;
        padding: 8px 10px;
        border-bottom: 1px solid rgba(255, 255, 255, 0.08);
        background: color-mix(in oklab, var(--popover-bg, #111827), black 15%);
      }
      .title {
        font-weight: 700;
        font-size: 14px;
      }
      .spacer {
        flex: 1;
      }
      .icon-btn {
        background: transparent;
        border: none;
        cursor: pointer;
        font-size: 14px;
        line-height: 1;
        padding: 6px;
        border-radius: 8px;
        color: inherit;
        position: relative;
        z-index: 10;
        min-width: 28px;
        min-height: 28px;
        display: flex;
        align-items: center;
        justify-content: center;
      }
      .icon-btn:hover,
      .icon-btn:focus {
        background: rgba(255, 255, 255, 0.08);
        outline: 2px solid transparent;
      }
      .icon-btn:focus-visible {
        outline: 3px solid #3b82f6;
      }
      .popover-content {
        padding: 12px;
        max-width: min(90vw, 420px);
        max-height: 60vh;
        overflow: auto;
      }
      .text {
        white-space: pre-wrap;
        word-wrap: break-word;
        margin: 0;
        font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas,
          'Liberation Mono', 'Courier New', monospace;
        font-size: 12.5px;
      }
      .arrow {
        position: absolute;
        width: 14px;
        height: 14px;
        background: var(--popover-bg, #111827);
        transform: rotate(45deg);
        box-shadow: -1px -1px 0 0 rgba(255, 255, 255, 0.08);
      }
      .sr-only {
        position: absolute;
        width: 1px;
        height: 1px;
        margin: -1px;
        padding: 0;
        overflow: hidden;
        clip: rect(0 0 0 0);
        border: 0;
      }
      @media (prefers-reduced-motion: no-preference) {
        .popover {
          transition: opacity 0.12s ease, transform 0.12s ease;
        }
      }
    `,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PopoverComponent implements OnDestroy {
  cfg: PopoverConfig = inject(POPOVER_CONFIG);
  private host = inject(ElementRef<HTMLElement>);
  private vcr = inject(ViewContainerRef);
  private focusTrapFactory = inject(FocusTrapFactory);

  @Input() titleId = `popover-title-${Math.random().toString(36).slice(2)}`;
  @ViewChild('contentContainer', { static: true })
  contentEl?: ElementRef<HTMLElement>;

  content!: PopoverContent;
  componentPortal?: ComponentPortal<unknown>;

  private _copyOk = signal<boolean>(false);
  private _live = signal<string>('');
  copyOk = computed(() => this._copyOk());
  liveMessage = computed(() => this._live());
  copyAriaLabel = 'Copy content to clipboard';

  private trap?: ReturnType<FocusTrapFactory['create']>;

  init(content: PopoverContent): void {
    this.content = content;
    if (this.isComponent()) {
      const cmp = content as unknown as any; // Sonar: intentional downcast at boundary
      this.componentPortal = new ComponentPortal(
        cmp,
        this.vcr,
        undefined,
        undefined
      );
    }
    if (this.cfg.trapFocus) {
      this.trap = this.focusTrapFactory.create(this.host.nativeElement);
      this.trap.focusInitialElementWhenReady();
    } else {
      // Ensure container is focusable for ESC and screen readers
      queueMicrotask(() =>
        this.host.nativeElement.querySelector('.popover')?.focus()
      );
    }
  }

  isTemplate(): boolean {
    return (this.content as unknown) instanceof TemplateRef;
  }
  isComponent(): boolean {
    return typeof this.content === 'function';
  }

  getTemplateRef(): TemplateRef<unknown> {
    return this.content as TemplateRef<unknown>;
  }

  showCopy(): boolean {
    return this.cfg.showCopy !== false && typeof this.content === 'string';
  }

  async copy(): Promise<void> {
    if (typeof this.content !== 'string') {
      return;
    }

    try {
      await navigator.clipboard.writeText(this.content);
      this.announce('Copied to clipboard');
    } catch (error) {
      // Fallback for browsers that don't support Clipboard API or require HTTPS
      const ta = document.createElement('textarea');
      ta.value = this.content;
      ta.style.position = 'fixed';
      ta.style.opacity = '0';
      ta.style.top = '0';
      ta.style.left = '0';
      document.body.appendChild(ta);
      ta.select();
      try {
        const success = document.execCommand('copy');
        if (success) {
          this.announce('Copied to clipboard');
        } else {
          this.announce('Copy failed');
        }
      } catch (fallbackError) {
        this.announce('Copy failed');
      } finally {
        document.body.removeChild(ta);
      }
    }
  }

  private announce(msg: string): void {
    this._copyOk.set(true);
    this._live.set(msg);
    // Timeout required for screen readers to announce the message
    // Using requestAnimationFrame + setTimeout for better performance
    requestAnimationFrame(() => {
      setTimeout(() => {
        this._copyOk.set(false);
        this._live.set('');
      }, 1200);
    });
  }

  private popoverRef?: any; // Will be set by the service

  setPopoverRef(ref: any): void {
    this.popoverRef = ref;
  }

  onCopyClick(event: Event): void {
    event.preventDefault();
    event.stopPropagation();
    this.copy();
  }

  onCloseClick(event: Event): void {
    event.preventDefault();
    event.stopPropagation();
    this.close();
  }

  close(): void {
    if (this.popoverRef) {
      this.popoverRef.close();
    }
  }

  ngOnDestroy(): void {
    this.trap?.destroy();
  }
}
