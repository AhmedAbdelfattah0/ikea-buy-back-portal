/**
 * Route Constants
 * Contains all route paths used in the application
 * Note: These routes do NOT include the /{market}/{lang}/ prefix
 * That's handled by APP_BASE_HREF
 */

export namespace Routes {
  // Root
  export const ROOT = '';

  // Product Discovery
  export const SEARCH = 'search';
  export const CATEGORIES = 'categories';
  export const CATEGORY_BROWSE = 'categories/browse';

  // Buyback List
  export const BUYBACK_QUOTE = 'buy-back-quote';

  // Submission
  export const SUMMARY = 'summary';
  export const CONFIRMATION = 'confirmation';

  // Error Pages
  export const NOT_FOUND = '404';
  export const ERROR = 'error';
}

/**
 * Route Titles (for page titles)
 */
export namespace RouteTitles {
  export const SEARCH = 'Search Products';
  export const CATEGORIES = 'Browse Categories';
  export const BUYBACK_LIST = 'Your Buyback List';
  export const SUMMARY = 'Review & Submit';
  export const CONFIRMATION = 'Confirmation';
  export const NOT_FOUND = 'Page Not Found';
  export const ERROR = 'Error';
}

/**
 * External URLs
 */
export namespace ExternalUrls {
  export const IKEA_MAIN_SITE_SA = 'https://www.ikea.com/sa/en/';
  export const IKEA_MAIN_SITE_BH = 'https://www.ikea.com/bh/en/';
  export const IKEA_FAMILY_SA = 'https://www.ikea.com/sa/en/ikea-family/';
  export const IKEA_FAMILY_BH = 'https://www.ikea.com/bh/en/ikea-family/';
  export const PRIVACY_POLICY = '/privacy-policy';
  export const TERMS_CONDITIONS = '/terms-and-conditions';
  export const CONTACT_US = '/contact-us';
}
