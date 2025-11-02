import { CommonModule } from '@angular/common';
import {
  ChangeDetectorRef,
  Component,
  ElementRef,
  Input,
  OnDestroy,
  OnInit,
  ViewChild,
  inject,
} from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { marked } from 'marked';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { DocumentationService } from '../../services/documentation.service';

@Component({
  selector: 'app-markdown-renderer',
  standalone: true,
  imports: [CommonModule, MatProgressSpinnerModule, MatCardModule],
  template: `
    <div class="markdown-container">
      @if (isLoading) {
      <div class="loading-container">
        <mat-spinner diameter="40"></mat-spinner>
        <p>Loading documentation...</p>
      </div>
      } @if (!isLoading) {
      <div
        class="markdown-content"
        [innerHTML]="renderedContent"
        #markdownContent
      ></div>
      }
    </div>
  `,
  styleUrls: ['./markdown-renderer.component.scss'],
})
export class MarkdownRendererComponent implements OnInit, OnDestroy {
  @Input() markdownPath: string = '';
  @ViewChild('markdownContent', { static: false })
  markdownContentRef?: ElementRef;

  renderedContent: SafeHtml = '';
  isLoading = false;
  private destroy$ = new Subject<void>();

  private readonly documentationService = inject(DocumentationService);
  private readonly sanitizer = inject(DomSanitizer);
  private readonly cdr = inject(ChangeDetectorRef);

  constructor() {
    // Configure marked options
    marked.setOptions({
      breaks: true,
      gfm: true,
    });
  }

  ngOnInit(): void {
    if (this.markdownPath) {
      this.loadMarkdown();
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private loadMarkdown(): void {
    if (!this.markdownPath) return;

    // Use setTimeout to avoid ExpressionChangedAfterItHasBeenCheckedError
    setTimeout(() => {
      this.isLoading = true;
      this.cdr.detectChanges();
    });

    this.documentationService
      .loadMarkdownContent(this.markdownPath)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (markdown) => {
          try {
            const html = marked(markdown) as string;
            this.renderedContent = this.sanitizer.bypassSecurityTrustHtml(html);
            setTimeout(() => {
              this.isLoading = false;
              this.cdr.detectChanges();
            });
            this.enhanceRenderedContent();
          } catch (error) {
            console.error('Error parsing markdown:', error);
            this.showError();
          }
        },
        error: (error) => {
          console.error('Error loading markdown:', error);
          this.showError();
        },
      });
  }

  private showError(): void {
    this.renderedContent = this.sanitizer.bypassSecurityTrustHtml(
      `<div class="error-message">
        <h3>Error Loading Documentation</h3>
        <p>Failed to load the requested documentation.</p>
      </div>`
    );
    setTimeout(() => {
      this.isLoading = false;
      this.cdr.detectChanges();
    });
  }

  private enhanceRenderedContent(): void {
    // Add any post-processing logic here
    setTimeout(() => {
      if (this.markdownContentRef?.nativeElement) {
        this.addClickHandlers();
        this.addCodeSyntaxHighlighting();
      }
    }, 100);
  }

  private addClickHandlers(): void {
    if (!this.markdownContentRef?.nativeElement) return;

    const links =
      this.markdownContentRef.nativeElement.querySelectorAll('a[href^="#"]');
    links.forEach((link: HTMLAnchorElement) => {
      link.addEventListener('click', (e) => {
        e.preventDefault();
        const target = document.querySelector(link.getAttribute('href') || '');
        if (target) {
          target.scrollIntoView({ behavior: 'smooth' });
        }
      });
    });
  }

  private addCodeSyntaxHighlighting(): void {
    if (!this.markdownContentRef?.nativeElement) return;

    // Add basic syntax highlighting classes
    const codeBlocks =
      this.markdownContentRef.nativeElement.querySelectorAll('pre code');
    codeBlocks.forEach((block: HTMLElement) => {
      block.classList.add('language-typescript'); // Default to TypeScript
    });
  }
}
