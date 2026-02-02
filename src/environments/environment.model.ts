/**
 * Environment Configuration Interface
 * Defines the structure for environment-specific settings
 */
export interface Environment {
  production: boolean;
  market: 'sa' | 'bh';
  apiBaseUrl: string;
  apiEndpoints: ApiEndpoints;
  supportedLanguages: string[];
  defaultLanguage: string;
  currency: {
    code: string;
    symbol: string;
  };
  features: FeatureFlags;
}

/**
 * API Endpoints Configuration
 */
export interface ApiEndpoints {
  products: string;
  categories: string;
  productSearch: string;
  offers: string;
  offerCalculation: string;
  submissions: string;
  stores: string;
  config: string;
}

/**
 * Feature Flags
 * Enable/disable features per environment
 */
export interface FeatureFlags {
  enableAnalytics: boolean;
  enableErrorTracking: boolean;
  enableDevTools: boolean;
  mockApiResponses: boolean;
}
