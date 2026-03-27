/**
 * Simple Analytics Service
 * In a real-world app, these events would be sent to a backend or a service like Google Analytics, Mixpanel, or PostHog.
 */

type EventType = 'page_view' | 'section_view' | 'interaction' | 'form_submission';

interface AnalyticsEvent {
  type: EventType;
  name: string;
  metadata?: Record<string, any>;
  timestamp: string;
}

class AnalyticsService {
  private static instance: AnalyticsService;
  private isEnabled: boolean = true;

  private constructor() {
    // Initialize analytics
    this.track('page_view', 'portfolio_home');
  }

  public static getInstance(): AnalyticsService {
    if (!AnalyticsService.instance) {
      AnalyticsService.instance = new AnalyticsService();
    }
    return AnalyticsService.instance;
  }

  public track(type: EventType, name: string, metadata?: Record<string, any>) {
    if (!this.isEnabled) return;

    const event: AnalyticsEvent = {
      type,
      name,
      metadata,
      timestamp: new Date().toISOString(),
    };

    // For now, we log to console in a stylized way to simulate a real tracker
    console.group(`%c[Analytics] ${type.toUpperCase()}: ${name}`, 'color: #00FF00; font-weight: bold;');
    console.log('Metadata:', metadata);
    console.log('Timestamp:', event.timestamp);
    console.groupEnd();

    // Here you would typically call your API:
    // fetch('/api/analytics', { method: 'POST', body: JSON.stringify(event) });
  }

  public disable() {
    this.isEnabled = false;
  }

  public enable() {
    this.isEnabled = true;
  }
}

export const analytics = AnalyticsService.getInstance();
