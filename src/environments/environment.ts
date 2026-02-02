import { Environment } from './environment.model';

/**
 * Local Development Environment Configuration
 * Used for local development with mock data
 */
export const environment: Environment = {
  production: false,
  market: 'sa',
  apiBaseUrl: 'http://localhost:4200/api',
  apiEndpoints: {
    products: '/buyback/products',
    categories: '/buyback/categories',
    productSearch: '/buyback/search',
    offers: '/buyback/offers',
    offerCalculation: '/buyback/calculate-offer',
    submissions: '/buyback/submissions',
    stores: '/buyback/stores',
    config: '/buyback/config'
  },
  supportedLanguages: ['en', 'ar'],
  defaultLanguage: 'en',
  currency: {
    code: 'SAR',
    symbol: 'ر.س'
  },
  features: {
    enableAnalytics: false,
    enableErrorTracking: false,
    enableDevTools: true,
    mockApiResponses: true
  }
};
