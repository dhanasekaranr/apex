import { CommonModule } from '@angular/common';
import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatListModule } from '@angular/material/list';
import { MatTabGroup, MatTabsModule } from '@angular/material/tabs';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { MarkdownRendererComponent } from '../../shared/components/markdown-renderer/markdown-renderer.component';
import {
  DocumentationCategory,
  DocumentationItem,
  DocumentationService,
} from '../../shared/services/documentation.service';

@Component({
  selector: 'app-documentation-viewer',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    MatTabsModule,
    MatListModule,
    MatIconModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatCardModule,
    MatChipsModule,
    MatExpansionModule,
    MarkdownRendererComponent,
  ],
  templateUrl: './documentation-viewer.component.html',
  styleUrls: ['./documentation-viewer.component.scss'],
})
export class DocumentationViewerComponent
  implements OnInit, OnDestroy, AfterViewInit
{
  @ViewChild(MatTabGroup) tabGroup!: MatTabGroup;
  documentationCategories: DocumentationCategory[] = [];
  allDocuments: DocumentationItem[] = [];
  selectedTabIndex: number = 0;
  searchQuery: string = '';
  searchResults: DocumentationItem[] = [];

  private destroy$ = new Subject<void>();
  private resizeObserver?: ResizeObserver;

  constructor(
    private documentationService: DocumentationService,
    private route: ActivatedRoute,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.loadDocumentation();
    this.handleRouteParams();
  }

  ngAfterViewInit(): void {
    // Force tab group to update pagination after view init
    setTimeout(() => {
      if (this.tabGroup) {
        this.updateTabPagination();
        this.setupResizeObserver();
      }
    }, 100);
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();

    // Clean up resize observer
    if (this.resizeObserver) {
      this.resizeObserver.disconnect();
    }
  }

  private loadDocumentation(): void {
    this.documentationService.documentation$
      .pipe(takeUntil(this.destroy$))
      .subscribe((categories: DocumentationCategory[]) => {
        this.documentationCategories = categories;
        // Flatten all documents for easy access
        this.allDocuments = categories.reduce(
          (docs: DocumentationItem[], category) => {
            return docs.concat(category.items);
          },
          []
        );

        // Update pagination after data loads
        setTimeout(() => {
          this.updateTabPagination();
        }, 200);
      });
  }

  private handleRouteParams(): void {
    this.route.params.pipe(takeUntil(this.destroy$)).subscribe((params) => {
      if (params['id']) {
        this.selectDocumentTabById(params['id']);
      }
    });
  }

  selectDocumentTab(documentIndex: number): void {
    // Add 1 to account for the overview tab
    this.selectedTabIndex = documentIndex + 1;
    const document = this.allDocuments[documentIndex];
    if (document) {
      this.router.navigate(['/documentation', document.id], {
        replaceUrl: true,
      });
    }
  }

  selectDocumentTabById(id: string): void {
    if (!id || !this.isValidDocument(id)) {
      console.warn(`Documentation item with id '${id}' not found`);
      return;
    }

    const documentIndex = this.allDocuments.findIndex((doc) => doc.id === id);
    if (documentIndex !== -1) {
      this.selectDocumentTab(documentIndex);
    }
  }

  onSearchChange(): void {
    if (this.searchQuery.trim()) {
      this.searchResults = this.documentationService.searchDocumentation(
        this.searchQuery
      );
    } else {
      this.searchResults = [];
    }
  }

  getCategoryName(categoryId: string): string {
    const category = this.documentationCategories.find(
      (c) => c.id === categoryId
    );
    return category?.name || categoryId;
  }

  getCategoryIcon(categoryId: string): string {
    const icons: { [key: string]: string } = {
      'getting-started': 'rocket_launch',
      architecture: 'architecture',
      components: 'widgets',
      themes: 'palette',
    };
    return icons[categoryId] || 'description';
  }

  /**
   * TrackBy function for categories list
   */
  trackByCategoryId(index: number, category: DocumentationCategory): string {
    return category.id;
  }

  /**
   * TrackBy function for documentation items
   */
  trackByItemId(index: number, item: DocumentationItem): string {
    return item.id;
  }

  /**
   * Check if a document exists before selecting
   */
  private isValidDocument(id: string): boolean {
    return this.documentationService.getDocumentationItem(id) !== null;
  }

  /**
   * Handle tab change events
   */
  onTabChange(event: any): void {
    this.selectedTabIndex = event.index;

    // If it's not the overview tab, update the route
    if (event.index > 0 && this.allDocuments.length > 0) {
      const documentIndex = event.index - 1; // Subtract 1 for overview tab
      if (documentIndex < this.allDocuments.length) {
        const document = this.allDocuments[documentIndex];
        this.router.navigate(['/documentation', document.id], {
          replaceUrl: true,
        });
      }
    } else if (event.index === 0) {
      // Overview tab selected
      this.router.navigate(['/documentation'], { replaceUrl: true });
    }

    // Update pagination after tab change
    setTimeout(() => {
      this.updateTabPagination();
    }, 100);
  }

  /**
   * Clear search query and results
   */
  clearSearch(): void {
    this.searchQuery = '';
    this.searchResults = [];
  }

  /**
   * Get document by index from all documents
   */
  getDocumentByIndex(index: number): DocumentationItem | null {
    return this.allDocuments[index] || null;
  }

  /**
   * Get category for a document
   */
  getCategoryForDocument(
    document: DocumentationItem
  ): DocumentationCategory | null {
    return (
      this.documentationCategories.find(
        (cat) => cat.id === document.category
      ) || null
    );
  }

  /**
   * Select document and switch to appropriate tab
   */
  selectDocumentAndTab(document: DocumentationItem): void {
    const documentIndex = this.allDocuments.findIndex(
      (doc) => doc.id === document.id
    );
    if (documentIndex !== -1) {
      this.selectDocumentTab(documentIndex);
    }
  }

  /**
   * Select document from search results
   */
  selectDocumentFromSearch(document: DocumentationItem): void {
    this.clearSearch();
    this.selectDocumentAndTab(document);
  }

  /**
   * Get icon for specific document types
   */
  getDocumentIcon(documentId: string): string {
    const icons: { [key: string]: string } = {
      overview: 'info',
      'setup-guide': 'build',
      changelog: 'update',
      'styling-system': 'palette',
      'navigation-system': 'navigation',
      'consolidation-summary': 'summarize',
      'breadcrumb-component': 'linear_scale',
      'theme-overview': 'color_lens',
      'styling-guide': 'design_services',
    };
    return icons[documentId] || 'description';
  }

  /**
   * Setup resize observer to monitor container size changes
   */
  private setupResizeObserver(): void {
    if (!this.tabGroup?._elementRef?.nativeElement) {
      return;
    }

    try {
      this.resizeObserver = new ResizeObserver(() => {
        // Debounce the pagination update
        setTimeout(() => {
          this.updateTabPagination();
        }, 100);
      });

      // Observe the tab group container
      this.resizeObserver.observe(this.tabGroup._elementRef.nativeElement);

      // Also observe the parent container if available
      const parentContainer = this.tabGroup._elementRef.nativeElement.closest(
        '.documentation-container'
      );
      if (parentContainer) {
        this.resizeObserver.observe(parentContainer);
      }
    } catch (error) {
      console.warn(
        'Could not setup resize observer for tab pagination:',
        error
      );
    }
  }

  /**
   * Force tab pagination to update and show arrows when needed
   */
  private updateTabPagination(): void {
    if (!this.tabGroup || !this.tabGroup._tabHeader) {
      return;
    }

    try {
      // Access the tab header and force pagination update
      const tabHeader = this.tabGroup._tabHeader;

      // Trigger a resize/update event to force Material to recalculate pagination
      if ((tabHeader as any).updatePagination) {
        (tabHeader as any).updatePagination();
      } else if ((tabHeader as any)._updatePagination) {
        (tabHeader as any)._updatePagination();
      }

      // Force change detection to ensure UI updates
      this.cdr.detectChanges();

      // Also trigger a window resize event which often forces Material to recalculate
      setTimeout(() => {
        window.dispatchEvent(new Event('resize'));
      }, 50);
    } catch (error) {
      console.warn('Could not force tab pagination update:', error);
    }
  }

  /**
   * Load documentation and update pagination after data loads
   */
  private loadDocumentationAndUpdatePagination(): void {
    this.loadDocumentation();

    // Update pagination after a short delay to allow data to load
    setTimeout(() => {
      this.updateTabPagination();
    }, 100);
  }
}
