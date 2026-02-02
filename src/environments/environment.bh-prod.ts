import { Environment } from './environment.model';

/**
 * Bahrain - Production Environment Configuration
 */
export const environment: Environment = {
  production: true,
  market: 'bh',
  apiBaseUrl: 'https://api.ikea.bh',
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
    code: 'BHD',
    symbol: 'د.ب'
  },
  features: {
    enableAnalytics: true,
    enableErrorTracking: true,
    enableDevTools: false,
    mockApiResponses: false
  }
};
