import {
  ConnectedPosition,
  Overlay,
  OverlayConfig,
  OverlayRef,
} from '@angular/cdk/overlay';
import { ComponentPortal } from '@angular/cdk/portal';
import { Injectable, Injector, inject } from '@angular/core';
import { PopoverRef } from './popover-ref';
import { PopoverComponent } from './popover.component';
import { POPOVER_CONFIG } from './popover.tokens';
import {
  DEFAULT_HOVER_CLOSE_DELAY_MS,
  PopoverConfig,
  PopoverContent,
  PopoverPlacement,
} from './popover.types';

const ARROW_SIZE = 10; // centralize magic numbers (Sonar)
const ARROW_VERTICAL_MARGIN = 15;
const ARROW_HORIZONTAL_MARGIN = 20;
const DEFAULT_OFFSET = 8;
const DEFAULT_VIEWPORT_MARGIN = 8;

@Injectable({ providedIn: 'root' })
export class PopoverService {
  private overlay = inject(Overlay);
  private injector = inject(Injector);
  private idCounter = 0;

  open(
    target: HTMLElement,
    content: PopoverContent,
    config?: PopoverConfig
  ): PopoverRef {
    const cfg = this.withDefaults(config);
    return this.createPopover(target, content, cfg);
  }

  private createPopover(
    target: HTMLElement,
    content: PopoverContent,
    cfg: PopoverConfig
  ): PopoverRef {
    const overlayRef = this.overlay.create(this.overlayConfigFor(target, cfg));

    const injector = Injector.create({
      providers: [{ provide: POPOVER_CONFIG, useValue: cfg }],
      parent: this.injector,
    });

    const portal = new ComponentPortal(PopoverComponent, undefined, injector);
    const cmpRef = overlayRef.attach(portal);

    // Assign an id for ARIA and return it via PopoverRef
    const panelId = `shared-popover-panel-${++this.idCounter}`;
    overlayRef.overlayElement.id = panelId;

    const popRef = new PopoverRef(overlayRef, cfg.data);

    cmpRef.instance.init(content);
    cmpRef.instance.setPopoverRef(popRef);
    (popRef as any).panelId = panelId; // expose for directive (typed any at boundary)

    // Arrow + placement positioning
    this.applyArrowAndPlacement(overlayRef, cfg);

    // Adjust arrow position using requestAnimationFrame for better performance
    // This ensures arrow positioning happens in the next frame after overlay renders
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        this.adjustArrowPosition(overlayRef, target, cfg);
      });
    });

    // Dismissals
    const subs: Array<() => void> = [];

    // Add scroll/resize listener to readjust arrow position
    const adjustArrow = () => {
      // Use requestAnimationFrame to batch position updates
      requestAnimationFrame(() => {
        this.adjustArrowPosition(overlayRef, target, cfg);
      });
    };
    window.addEventListener('scroll', adjustArrow, true);
    window.addEventListener('resize', adjustArrow);
    subs.push(() => {
      window.removeEventListener('scroll', adjustArrow, true);
      window.removeEventListener('resize', adjustArrow);
    });

    if (!cfg.disableBackdrop && cfg.autoClose !== 'hover') {
      const s = overlayRef.backdropClick().subscribe(() => popRef.close());
      subs.push(() => s.unsubscribe());
    }

    if (cfg.autoClose === 'outside' && cfg.trigger !== 'hover') {
      const s = overlayRef
        .outsidePointerEvents()
        .subscribe(() => popRef.close());
      subs.push(() => s.unsubscribe());
    }

    const escSub = overlayRef.keydownEvents().subscribe((ev) => {
      if (ev.key === 'Escape') popRef.close();
    });
    subs.push(() => escSub.unsubscribe());

    if (cfg.closeOnNavigation !== false) {
      this.overlay.scrollStrategies.close().attach(overlayRef);
    }

    if (cfg.autoClose === 'timeout' && cfg.timeoutMs && cfg.timeoutMs > 0) {
      const t = setTimeout(() => popRef.close(), cfg.timeoutMs);
      subs.push(() => clearTimeout(t));
    }

    overlayRef.detachments().subscribe(() => subs.forEach((fn) => fn()));

    return popRef;
  }

  private overlayConfigFor(
    target: HTMLElement,
    cfg: PopoverConfig
  ): OverlayConfig {
    const positionStrategy = this.overlay
      .position()
      .flexibleConnectedTo(target)
      .withPositions(
        this.mapPlacement(
          cfg.placement ?? 'bottom',
          cfg.offset ?? DEFAULT_OFFSET,
          cfg.smartPositioning ?? false
        )
      )
      .withFlexibleDimensions(true)
      .withPush(true)
      .withViewportMargin(DEFAULT_VIEWPORT_MARGIN);

    return new OverlayConfig({
      hasBackdrop: !cfg.disableBackdrop && cfg.trigger === 'click',
      backdropClass: 'cdk-overlay-transparent-backdrop',
      positionStrategy,
      scrollStrategy: this.overlay.scrollStrategies.reposition(),
      panelClass: ['shared-popover-panel'],
    });
  }

  private mapPlacement(
    place: PopoverPlacement,
    offset: number,
    smartPositioning: boolean
  ): ConnectedPosition[] {
    const base: Record<string, ConnectedPosition> = {
      top: {
        originX: 'center',
        originY: 'top',
        overlayX: 'center',
        overlayY: 'bottom',
        offsetY: -offset,
      },
      bottom: {
        originX: 'center',
        originY: 'bottom',
        overlayX: 'center',
        overlayY: 'top',
        offsetY: offset,
      },
      left: {
        originX: 'start',
        originY: 'center',
        overlayX: 'end',
        overlayY: 'center',
        offsetX: -offset,
      },
      right: {
        originX: 'end',
        originY: 'center',
        overlayX: 'start',
        overlayY: 'center',
        offsetX: offset,
      },
    };

    const startEnd = (
      p: 'top' | 'bottom' | 'left' | 'right',
      se: 'start' | 'end'
    ): ConnectedPosition => {
      const b = base[p];
      if (p === 'top' || p === 'bottom') {
        return {
          ...b,
          originX: se === 'start' ? 'start' : 'end',
          overlayX: se === 'start' ? 'start' : 'end',
        };
      }
      return {
        ...b,
        originY: se === 'start' ? 'top' : 'bottom',
        overlayY: se === 'start' ? 'top' : 'bottom',
      };
    };

    switch (place) {
      case 'top':
        return [base['top'], base['bottom'], base['left'], base['right']];
      case 'bottom':
        return [base['bottom'], base['top'], base['left'], base['right']];
      case 'left':
        return [base['left'], base['right'], base['top'], base['bottom']];
      case 'right':
        return [base['right'], base['left'], base['top'], base['bottom']];
      case 'top-start':
        return smartPositioning
          ? [startEnd('top', 'start'), startEnd('left', 'start'), base['left']]
          : [startEnd('top', 'start')];
      case 'top-end':
        return smartPositioning
          ? [startEnd('top', 'end'), startEnd('left', 'end'), base['left']]
          : [startEnd('top', 'end')];
      case 'bottom-start':
        return smartPositioning
          ? [
              startEnd('bottom', 'start'),
              startEnd('bottom', 'end'),
              base['bottom'],
            ]
          : [startEnd('bottom', 'start')];
      case 'bottom-end':
        return smartPositioning
          ? [
              startEnd('bottom', 'end'),
              startEnd('bottom', 'start'),
              base['bottom'],
            ]
          : [startEnd('bottom', 'end')];
      case 'left-start':
        return [
          startEnd('left', 'start'),
          startEnd('left', 'end'),
          base['left'],
        ];
      case 'left-end':
        return [
          startEnd('left', 'end'),
          startEnd('left', 'start'),
          base['left'],
        ];
      case 'right-start':
        return [
          startEnd('right', 'start'),
          startEnd('right', 'end'),
          base['right'],
        ];
      case 'right-end':
        return [
          startEnd('right', 'end'),
          startEnd('right', 'start'),
          base['right'],
        ];
      default:
        return [base['bottom'], base['top'], base['left'], base['right']];
    }
  }

  private applyArrowAndPlacement(ref: OverlayRef, cfg: PopoverConfig): void {
    const panel = ref.overlayElement as HTMLElement;
    const placement = cfg.placement ?? 'bottom';
    panel.style.setProperty('--arrow-size', `${ARROW_SIZE}px`);

    // Remove any existing placement classes
    panel.classList.forEach((cls) => {
      if (cls.startsWith('shared-popover-panel--')) {
        panel.classList.remove(cls);
      }
    });

    panel.classList.add('shared-popover-panel--' + placement);
  }

  private adjustArrowPosition(
    ref: OverlayRef,
    target: HTMLElement,
    cfg: PopoverConfig
  ): void {
    const requestedPlacement = cfg.placement ?? 'bottom';

    try {
      const panel = ref.overlayElement as HTMLElement;
      const arrow = panel.querySelector('.arrow') as HTMLElement;
      if (!arrow) {
        return;
      }

      const targetRect = target.getBoundingClientRect();
      const panelRect = panel.getBoundingClientRect();

      // Detect actual placement by comparing positions
      const actualPlacement = this.detectActualPlacement(
        targetRect,
        panelRect,
        requestedPlacement
      );

      // Update placement class if it changed
      if (actualPlacement !== requestedPlacement) {
        panel.classList.forEach((cls) => {
          if (cls.startsWith('shared-popover-panel--')) {
            panel.classList.remove(cls);
          }
        });
        panel.classList.add('shared-popover-panel--' + actualPlacement);
      }

      const placement = actualPlacement;

      // Handle vertical placements (left/right)
      if (placement === 'left' || placement === 'right') {
        const targetCenter = targetRect.top + targetRect.height / 2;
        let arrowTop = targetCenter - panelRect.top;

        const minTop = ARROW_VERTICAL_MARGIN;
        const maxTop = panelRect.height - ARROW_VERTICAL_MARGIN;
        arrowTop = Math.max(minTop, Math.min(maxTop, arrowTop));

        arrow.style.top = `${arrowTop}px`;
      } // Handle horizontal placements (top/bottom with -start/-end variants)
      else if (placement.includes('bottom') || placement.includes('top')) {
        // For -end placements, use right positioning; for -start and center, use left
        const targetCenter = targetRect.left + targetRect.width / 2;

        if (placement.endsWith('-end')) {
          // Calculate distance from right edge
          const panelRight = panelRect.right;
          let arrowRight = panelRight - targetCenter;

          const minRight = ARROW_HORIZONTAL_MARGIN;
          const maxRight = panelRect.width - ARROW_HORIZONTAL_MARGIN;
          arrowRight = Math.max(minRight, Math.min(maxRight, arrowRight));

          arrow.style.right = `${arrowRight}px`;
          arrow.style.left = ''; // Clear left
        } else {
          // For -start and center placements, use left positioning
          let arrowLeft = targetCenter - panelRect.left;

          const minLeft = ARROW_HORIZONTAL_MARGIN;
          const maxLeft = panelRect.width - ARROW_HORIZONTAL_MARGIN;
          arrowLeft = Math.max(minLeft, Math.min(maxLeft, arrowLeft));

          arrow.style.left = `${arrowLeft}px`;
          arrow.style.right = ''; // Clear right
        }
      }
    } catch (error) {
      // Fail silently
    }
  }

  private detectActualPlacement(
    targetRect: DOMRect,
    panelRect: DOMRect,
    requestedPlacement: PopoverPlacement
  ): PopoverPlacement {
    // Detect if popover is above or below the target
    const isAbove = panelRect.bottom < targetRect.top;
    const isBelow = panelRect.top > targetRect.bottom;
    const isLeft = panelRect.right < targetRect.left;
    const isRight = panelRect.left > targetRect.right;

    // Detect horizontal alignment
    const isAlignedStart = Math.abs(panelRect.left - targetRect.left) < 5;
    const isAlignedEnd = Math.abs(panelRect.right - targetRect.right) < 5;

    // Detect vertical alignment for left/right placements
    const isAlignedTop = Math.abs(panelRect.top - targetRect.top) < 5;
    const isAlignedBottom = Math.abs(panelRect.bottom - targetRect.bottom) < 5;

    if (isAbove) {
      if (isAlignedEnd) return 'top-end';
      if (isAlignedStart) return 'top-start';
      return 'top';
    } else if (isBelow) {
      if (isAlignedEnd) return 'bottom-end';
      if (isAlignedStart) return 'bottom-start';
      return 'bottom';
    } else if (isLeft) {
      if (isAlignedTop) return 'left-start';
      if (isAlignedBottom) return 'left-end';
      return 'left';
    } else if (isRight) {
      if (isAlignedTop) return 'right-start';
      if (isAlignedBottom) return 'right-end';
      return 'right';
    }

    return requestedPlacement;
  }

  private withDefaults(config?: PopoverConfig): PopoverConfig {
    return {
      trigger: 'click',
      placement: 'bottom',
      offset: DEFAULT_OFFSET,
      hasArrow: true,
      role: 'dialog',
      autoClose: 'outside',
      hoverCloseDelayMs: DEFAULT_HOVER_CLOSE_DELAY_MS,
      openDelayMs: 0,
      closeOnNavigation: true,
      showCopy: true,
      showClose: true,
      ...config,
    } satisfies PopoverConfig;
  }
}
