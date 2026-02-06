// Responsive Testing Service

export interface Breakpoint {
  name: string;
  width: number;
  height: number;
  device?: string;
  icon: string;
}

export const breakpoints: Breakpoint[] = [
  { name: 'Mobile S', width: 320, height: 568, device: 'iPhone 5/SE', icon: '📱' },
  { name: 'Mobile M', width: 375, height: 667, device: 'iPhone 8', icon: '📱' },
  { name: 'Mobile L', width: 414, height: 896, device: 'iPhone 11 Pro Max', icon: '📱' },
  { name: 'Tablet', width: 768, height: 1024, device: 'iPad Mini', icon: '📟' },
  { name: 'Laptop', width: 1024, height: 768, device: 'Small Laptop', icon: '💻' },
  { name: 'Desktop', width: 1280, height: 800, device: 'MacBook Air', icon: '💻' },
  { name: 'Desktop L', width: 1440, height: 900, device: 'MacBook Pro', icon: '🖥️' },
  { name: 'Desktop XL', width: 1920, height: 1080, device: 'Full HD', icon: '🖥️' },
  { name: '4K', width: 2560, height: 1440, device: 'QHD Display', icon: '🖥️' },
];

export interface DeviceFrame {
  name: string;
  type: 'phone' | 'tablet' | 'laptop' | 'desktop';
  width: number;
  height: number;
  frameColor: string;
  bezelWidth: number;
  borderRadius: number;
  notch?: boolean;
  homeIndicator?: boolean;
  camera?: boolean;
}

export const deviceFrames: DeviceFrame[] = [
  {
    name: 'iPhone 15 Pro',
    type: 'phone',
    width: 393,
    height: 852,
    frameColor: '#1a1a1a',
    bezelWidth: 12,
    borderRadius: 50,
    notch: true,
    homeIndicator: true,
    camera: true,
  },
  {
    name: 'iPhone 15 Pro Max',
    type: 'phone',
    width: 430,
    height: 932,
    frameColor: '#1a1a1a',
    bezelWidth: 12,
    borderRadius: 54,
    notch: true,
    homeIndicator: true,
    camera: true,
  },
  {
    name: 'Samsung Galaxy S24',
    type: 'phone',
    width: 412,
    height: 915,
    frameColor: '#2a2a2a',
    bezelWidth: 10,
    borderRadius: 40,
    notch: false,
    homeIndicator: true,
    camera: true,
  },
  {
    name: 'iPad Pro 11"',
    type: 'tablet',
    width: 834,
    height: 1194,
    frameColor: '#1a1a1a',
    bezelWidth: 20,
    borderRadius: 30,
    notch: false,
    homeIndicator: true,
    camera: true,
  },
  {
    name: 'MacBook Air',
    type: 'laptop',
    width: 1280,
    height: 832,
    frameColor: '#c4c4c4',
    bezelWidth: 40,
    borderRadius: 12,
    notch: true,
    camera: true,
  },
  {
    name: 'Generic Desktop',
    type: 'desktop',
    width: 1920,
    height: 1080,
    frameColor: '#1a1a1a',
    bezelWidth: 8,
    borderRadius: 8,
    camera: false,
  },
];

export interface TestConfig {
  breakpoint: Breakpoint;
  deviceFrame?: DeviceFrame;
  scale: number;
  orientation: 'portrait' | 'landscape';
  showDeviceFrame: boolean;
  showRulers: boolean;
  showGrid: boolean;
  showSafeAreas: boolean;
}

export interface AccessibilityResult {
  passed: boolean;
  rule: string;
  message: string;
  severity: 'error' | 'warning' | 'info';
}

export interface PerformanceMetrics {
  loadTime: number;
  domContentLoaded: number;
  firstPaint: number;
  firstContentfulPaint: number;
  largestContentfulPaint: number;
  totalRequests: number;
  totalSize: number;
}

class ResponsiveTestingService {
  private observers: Map<string, ResizeObserver> = new Map();

  // Get recommended breakpoints for a project
  getRecommendedBreakpoints(projectType: 'web' | 'app' | 'ecommerce' = 'web'): Breakpoint[] {
    switch (projectType) {
      case 'app':
        return breakpoints.slice(0, 4); // Mobile focused
      case 'ecommerce':
        return breakpoints; // All breakpoints
      default:
        return breakpoints.slice(2); // Web focused
    }
  }

  // Calculate scale to fit preview in container
  calculateScale(
    contentWidth: number,
    contentHeight: number,
    containerWidth: number,
    containerHeight: number,
    padding: number = 40
  ): number {
    const availableWidth = containerWidth - padding * 2;
    const availableHeight = containerHeight - padding * 2;

    const scaleX = availableWidth / contentWidth;
    const scaleY = availableHeight / contentHeight;

    return Math.min(scaleX, scaleY, 1); // Max scale 1 (100%)
  }

  // Get CSS media query for breakpoint
  getMediaQuery(breakpoint: Breakpoint, orientation: 'portrait' | 'landscape'): string {
    const width = orientation === 'landscape' ? breakpoint.height : breakpoint.width;
    return `@media (max-width: ${width}px) {
  /* Styles for ${breakpoint.name} */
}`;
  }

  // Simulate network conditions
  async simulateNetwork(
    condition: 'fast' | 'slow' | 'offline'
  ): Promise<{ downloadSpeed: number; latency: number }> {
    const conditions = {
      fast: { downloadSpeed: 10, latency: 20 }, // 10 Mbps, 20ms
      slow: { downloadSpeed: 1, latency: 200 }, // 1 Mbps, 200ms
      offline: { downloadSpeed: 0, latency: Infinity },
    };

    return conditions[condition];
  }

  // Check responsive issues
  checkResponsiveIssues(html: string, width: number): string[] {
    const issues: string[] = [];
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, 'text/html');

    // Check for horizontal overflow
    const wideElements = doc.querySelectorAll('[style*="width"]');
    wideElements.forEach(el => {
      const styleWidth = el.getAttribute('style')?.match(/width:\s*(\d+)px/);
      if (styleWidth && parseInt(styleWidth[1]) > width) {
        issues.push(`Element with fixed width ${styleWidth[1]}px may overflow at ${width}px`);
      }
    });

    // Check for missing viewport meta
    const viewport = doc.querySelector('meta[name="viewport"]');
    if (!viewport) {
      issues.push('Missing viewport meta tag for responsive design');
    }

    // Check for images without responsive attributes
    const images = doc.querySelectorAll('img:not([srcset]):not([sizes])');
    if (images.length > 0) {
      issues.push(`${images.length} images without responsive srcset`);
    }

    return issues;
  }

  // Accessibility checks
  checkAccessibility(html: string): AccessibilityResult[] {
    const results: AccessibilityResult[] = [];
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, 'text/html');

    // Check alt text on images
    const images = doc.querySelectorAll('img');
    images.forEach((img, i) => {
      if (!img.getAttribute('alt')) {
        results.push({
          passed: false,
          rule: 'alt-text',
          message: `Image ${i + 1} missing alt text`,
          severity: 'error',
        });
      }
    });

    // Check heading hierarchy
    const h1s = doc.querySelectorAll('h1');
    if (h1s.length === 0) {
      results.push({
        passed: false,
        rule: 'heading-hierarchy',
        message: 'No H1 heading found',
        severity: 'warning',
      });
    } else if (h1s.length > 1) {
      results.push({
        passed: false,
        rule: 'heading-hierarchy',
        message: 'Multiple H1 headings (should be only one)',
        severity: 'warning',
      });
    }

    // Check form labels
    const inputs = doc.querySelectorAll('input:not([type="hidden"]), select, textarea');
    inputs.forEach((input, i) => {
      const id = input.getAttribute('id');
      const ariaLabel = input.getAttribute('aria-label');
      const ariaLabelledBy = input.getAttribute('aria-labelledby');
      const hasLabel = id && doc.querySelector(`label[for="${id}"]`);
      
      if (!hasLabel && !ariaLabel && !ariaLabelledBy) {
        results.push({
          passed: false,
          rule: 'form-labels',
          message: `Form input ${i + 1} missing label`,
          severity: 'error',
        });
      }
    });

    // Check color contrast (basic)
    const elements = doc.querySelectorAll('p, span, a, button, h1, h2, h3, h4, h5, h6');
    elements.forEach((el, i) => {
      const style = el.getAttribute('style') || '';
      const color = style.match(/color:\s*([^;]+)/);
      const bgColor = style.match(/background(?:-color)?:\s*([^;]+)/);
      
      if (color && !bgColor && el.textContent?.trim()) {
        results.push({
          passed: false,
          rule: 'color-contrast',
          message: `Text element ${i + 1} may have insufficient contrast`,
          severity: 'warning',
        });
      }
    });

    // Check keyboard navigation
    const clickableElements = doc.querySelectorAll('a, button, [onclick]');
    clickableElements.forEach((el, i) => {
      const tabIndex = el.getAttribute('tabindex');
      const isFocusable = el.tagName === 'A' || el.tagName === 'BUTTON' || tabIndex !== null;
      
      if (!isFocusable) {
        results.push({
          passed: false,
          rule: 'keyboard-navigation',
          message: `Clickable element ${i + 1} may not be keyboard accessible`,
          severity: 'warning',
        });
      }
    });

    return results;
  }

  // Performance metrics simulation
  async measurePerformance(html: string): Promise<PerformanceMetrics> {
    // In real implementation, this would use Performance API
    // This is a simulation
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, 'text/html');

    // Count resources
    const images = doc.querySelectorAll('img');
    const scripts = doc.querySelectorAll('script');
    const styles = doc.querySelectorAll('link[rel="stylesheet"]');

    // Estimate size
    let totalSize = html.length; // Base HTML size
    images.forEach(() => totalSize += 50000); // Assume 50KB per image
    scripts.forEach(() => totalSize += 30000); // Assume 30KB per script
    styles.forEach(() => totalSize += 20000); // Assume 20KB per stylesheet

    const totalRequests = images.length + scripts.length + styles.length + 1;

    // Simulate load times
    const loadTime = totalSize / 100000; // Rough estimate
    const domContentLoaded = loadTime * 0.6;
    const firstPaint = loadTime * 0.2;
    const firstContentfulPaint = loadTime * 0.3;
    const largestContentfulPaint = loadTime * 0.8;

    return {
      loadTime: parseFloat(loadTime.toFixed(2)),
      domContentLoaded: parseFloat(domContentLoaded.toFixed(2)),
      firstPaint: parseFloat(firstPaint.toFixed(2)),
      firstContentfulPaint: parseFloat(firstContentfulPaint.toFixed(2)),
      largestContentfulPaint: parseFloat(largestContentfulPaint.toFixed(2)),
      totalRequests,
      totalSize,
    };
  }

  // Generate CSS for safe areas (notch, home indicator)
  generateSafeAreaCSS(deviceFrame: DeviceFrame): string {
    if (deviceFrame.type === 'phone') {
      return `
/* iPhone Safe Areas */
@supports (padding-top: env(safe-area-inset-top)) {
  .safe-area {
    padding-top: env(safe-area-inset-top);
    padding-bottom: env(safe-area-inset-bottom);
    padding-left: env(safe-area-inset-left);
    padding-right: env(safe-area-inset-right);
  }
}`;
    }
    return '';
  }

  // Subscribe to resize events
  subscribeToResize(
    element: Element,
    callback: (entries: ResizeObserverEntry[]) => void
  ): string {
    const id = Math.random().toString(36).substr(2, 9);
    const observer = new ResizeObserver(callback);
    observer.observe(element);
    this.observers.set(id, observer);
    return id;
  }

  // Unsubscribe from resize events
  unsubscribeFromResize(id: string): void {
    const observer = this.observers.get(id);
    if (observer) {
      observer.disconnect();
      this.observers.delete(id);
    }
  }

  // Get CSS Grid overlay
  getGridOverlayCSS(): string {
    return `
.responsive-grid-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  pointer-events: none;
  z-index: 9999;
  background-image: 
    linear-gradient(to right, rgba(255, 0, 0, 0.1) 1px, transparent 1px),
    linear-gradient(to bottom, rgba(255, 0, 0, 0.1) 1px, transparent 1px);
  background-size: 50px 50px;
}`;
  }

  // Cleanup
  cleanup(): void {
    this.observers.forEach(observer => observer.disconnect());
    this.observers.clear();
  }
}

export const responsiveTestingService = new ResponsiveTestingService();
