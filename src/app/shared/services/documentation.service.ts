import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';

export interface DocumentationItem {
  id: string;
  title: string;
  path: string;
  category: string;
  description?: string;
  order: number;
}

export interface DocumentationCategory {
  id: string;
  name: string;
  description?: string;
  order: number;
  items: DocumentationItem[];
}

@Injectable({
  providedIn: 'root',
})
export class DocumentationService {
  private readonly http = inject(HttpClient);

  private documentationSubject = new BehaviorSubject<DocumentationCategory[]>(
    this.getDocumentationStructure()
  );
  public documentation$: Observable<DocumentationCategory[]> =
    this.documentationSubject.asObservable();

  /**
   * Get all documentation categories and items
   */
  getDocumentation(): DocumentationCategory[] {
    return this.documentationSubject.value;
  }

  /**
   * Get documentation item by ID
   */
  getDocumentationItem(id: string): DocumentationItem | null {
    const categories = this.getDocumentation();
    for (const category of categories) {
      const item = category.items.find((item) => item.id === id);
      if (item) {
        return item;
      }
    }
    return null;
  }

  /**
   * Load markdown content from a file
   */
  loadMarkdownContent(path: string): Observable<string> {
    return this.http.get(path, { responseType: 'text' }).pipe(
      catchError((error) => {
        console.error(`Failed to load markdown from ${path}:`, error);
        return of(
          `# Error Loading Documentation\n\nFailed to load content from: ${path}`
        );
      })
    );
  }

  /**
   * Search documentation items
   */
  searchDocumentation(query: string): DocumentationItem[] {
    const categories = this.getDocumentation();
    const results: DocumentationItem[] = [];
    const searchTerm = query.toLowerCase();

    categories.forEach((category) => {
      category.items.forEach((item) => {
        if (
          item.title.toLowerCase().includes(searchTerm) ||
          item.description?.toLowerCase().includes(searchTerm) ||
          item.category.toLowerCase().includes(searchTerm)
        ) {
          results.push(item);
        }
      });
    });

    return results;
  }

  /**
   * Get the default documentation structure
   */
  private getDocumentationStructure(): DocumentationCategory[] {
    return [
      {
        id: 'getting-started',
        name: 'Getting Started',
        description: 'Essential documentation to get up and running',
        order: 1,
        items: [
          {
            id: 'overview',
            title: 'Documentation Overview',
            path: '/assets/docs/README.md',
            category: 'getting-started',
            description: 'Quick overview and navigation to all guides',
            order: 1,
          },
          {
            id: 'setup-guide',
            title: 'Setup & Configuration',
            path: '/assets/docs/SETUP_GUIDE.md',
            category: 'getting-started',
            description: 'Installation, configuration, and development setup',
            order: 2,
          },
        ],
      },
      {
        id: 'architecture',
        name: 'Architecture & Patterns',
        description: 'System architecture and design patterns',
        order: 2,
        items: [
          {
            id: 'navigation-system',
            title: 'Navigation System',
            path: '/assets/docs/NAVIGATION_SYSTEM.md',
            category: 'architecture',
            description: 'Dynamic navigation, menus, and breadcrumbs',
            order: 1,
          },
          {
            id: 'styling-system',
            title: 'Styling System',
            path: '/assets/docs/STYLING_SYSTEM.md',
            category: 'architecture',
            description: 'Material 3 theming, colors, and component styles',
            order: 2,
          },
        ],
      },
    ];
  }
}
