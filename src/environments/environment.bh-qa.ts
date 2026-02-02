import { Environment } from './environment.model';

/**
 * Bahrain - QA Environment Configuration
 */
export const environment: Environment = {
  production: false,
  market: 'bh',
  apiBaseUrl: 'https://qa-api.ikea.bh',
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
    enableDevTools: true,
    mockApiResponses: false
  }
};
