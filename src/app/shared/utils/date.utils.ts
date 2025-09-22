/**
 * Date utility functions for the application
 * Pure functions with no dependencies on Angular or other frameworks
 */

export class DateUtils {
  /**
   * Format a date to a human-readable string
   */
  static formatDate(date: Date | string | number): string {
    const d = new Date(date);
    return d.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  }

  /**
   * Format a date and time to a human-readable string
   */
  static formatDateTime(date: Date | string | number): string {
    const d = new Date(date);
    return d.toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  }

  /**
   * Get relative time (e.g., "2 hours ago")
   */
  static getRelativeTime(date: Date | string | number): string {
    const now = new Date();
    const target = new Date(date);
    const diffInSeconds = Math.floor((now.getTime() - target.getTime()) / 1000);

    if (diffInSeconds < 60) return 'just now';
    if (diffInSeconds < 3600)
      return `${Math.floor(diffInSeconds / 60)} minutes ago`;
    if (diffInSeconds < 86400)
      return `${Math.floor(diffInSeconds / 3600)} hours ago`;
    if (diffInSeconds < 2592000)
      return `${Math.floor(diffInSeconds / 86400)} days ago`;

    return DateUtils.formatDate(target);
  }
}
