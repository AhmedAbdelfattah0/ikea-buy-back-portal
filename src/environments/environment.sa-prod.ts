import { Environment } from './environment.model';

/**
 * Saudi Arabia - Production Environment Configuration
 */
export const environment: Environment = {
  production: true,
  market: 'sa',
  apiBaseUrl: 'https://api.ikea.sa',
  apiEndpoints: {
    products: '/api/buyback/products',
    categories: '/api/buyback/categories',
    productSearch: '/api/buyback/search',
    offers: '/api/buyback/offers',
    offerCalculation: '/api/buyback/calculate-offer',
    submissions: '/api/buyback/submissions',
    stores: '/api/buyback/stores',
    config: '/api/buyback/config'
  },
  supportedLanguages: ['en', 'ar'],
  defaultLanguage: 'en',
  currency: {
    code: 'SAR',
    symbol: 'ر.س'
  },
  features: {
    enableAnalytics: true,
    enableErrorTracking: true,
    enableDevTools: false,
    mockApiResponses: false
  }
};
