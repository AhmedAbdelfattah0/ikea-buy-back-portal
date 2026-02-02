/**
 * Application Constants
 * Contains all global constants used throughout the application
 */

/**
 * Product Condition Constants
 */
export namespace ProductCondition {
  export const LIKE_NEW = 'LIKE_NEW';
  export const VERY_GOOD = 'VERY_GOOD';
  export const WELL_USED = 'WELL_USED';

  export const ALL = [LIKE_NEW, VERY_GOOD, WELL_USED] as const;

  export type Condition = typeof ALL[number];

  export const LABELS: Record<Condition, string> = {
    [LIKE_NEW]: 'Like New',
    [VERY_GOOD]: 'Very Good',
    [WELL_USED]: 'Well Used'
  };
}

/**
 * Local Storage Keys
 */
export namespace StorageKeys {
  export const BUYBACK_LIST = 'buyback_list';
  export const LOCALE_PREFERENCE = 'locale_preference';
  export const FAMILY_MEMBER_STATUS = 'is_family_member';
  export const SELECTED_STORE = 'selected_store';
  export const USER_EMAIL = 'user_email';
  export const LAST_QUOTATION = 'last_quotation';
}

/**
 * Session Storage Keys
 */
export namespace SessionKeys {
  export const CURRENT_STEP = 'current_step';
  export const SEARCH_QUERY = 'search_query';
  export const SELECTED_CATEGORY = 'selected_category';
}

/**
 * Cookie Keys
 */
export namespace CookieKeys {
  export const SESSION_ID = 'session_id';
  export const USER_PREFERENCE = 'user_preference';
}

/**
 * API Constants
 */
export namespace API {
  export const DEFAULT_PAGE_SIZE = 20;
  export const MAX_PAGE_SIZE = 100;
  export const REQUEST_TIMEOUT = 30000; // 30 seconds
  export const RETRY_ATTEMPTS = 3;
  export const RETRY_DELAY = 1000; // 1 second
}

/**
 * Pagination Constants
 */
export namespace Pagination {
  export const DEFAULT_PAGE = 1;
  export const DEFAULT_PAGE_SIZE = 20;
  export const PAGE_SIZE_OPTIONS = [10, 20, 50, 100];
}

/**
 * Validation Constants
 */
export namespace Validation {
  export const EMAIL_PATTERN = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  export const MIN_EMAIL_LENGTH = 5;
  export const MAX_EMAIL_LENGTH = 100;
  export const MIN_SEARCH_LENGTH = 2;
  export const MAX_ITEMS_IN_BUYBACK_LIST = 50;
}

/**
 * Date Format Constants
 */
export namespace DateFormats {
  export const DISPLAY_DATE = 'dd/MM/yyyy';
  export const DISPLAY_DATE_TIME = 'dd/MM/yyyy HH:mm';
  export const API_DATE = 'yyyy-MM-dd';
  export const API_DATE_TIME = 'yyyy-MM-ddTHH:mm:ss';
}

/**
 * File Constants
 */
export namespace Files {
  export const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
  export const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp'];
  export const ALLOWED_DOCUMENT_TYPES = ['application/pdf'];
}

/**
 * Debounce/Throttle Times
 */
export namespace Timings {
  export const SEARCH_DEBOUNCE = 300; // 300ms
  export const AUTO_SAVE_DEBOUNCE = 1000; // 1 second
  export const TOAST_DURATION = 3000; // 3 seconds
  export const MODAL_ANIMATION = 250; // 250ms
}

/**
 * Category Levels
 */
export namespace CategoryLevel {
  export const LEVEL_1 = 1;
  export const LEVEL_2 = 2;
  export const LEVEL_3 = 3;
  export const LEVEL_4 = 4;
  export const MAX_LEVEL = 4;
}

/**
 * User Types
 */
export namespace UserType {
  export const FAMILY_MEMBER = 'FAMILY_MEMBER';
  export const NON_MEMBER = 'NON_MEMBER';
}

/**
 * Quotation Status
 */
export namespace QuotationStatus {
  export const DRAFT = 'DRAFT';
  export const SUBMITTED = 'SUBMITTED';
  export const ACCEPTED = 'ACCEPTED';
  export const REJECTED = 'REJECTED';
  export const EXPIRED = 'EXPIRED';
  export const COMPLETED = 'COMPLETED';
}

/**
 * HTTP Status Codes
 */
export namespace HttpStatus {
  export const OK = 200;
  export const CREATED = 201;
  export const NO_CONTENT = 204;
  export const BAD_REQUEST = 400;
  export const UNAUTHORIZED = 401;
  export const FORBIDDEN = 403;
  export const NOT_FOUND = 404;
  export const CONFLICT = 409;
  export const UNPROCESSABLE_ENTITY = 422;
  export const INTERNAL_SERVER_ERROR = 500;
  export const SERVICE_UNAVAILABLE = 503;
}

/**
 * Error Codes
 */
export namespace ErrorCodes {
  export const NETWORK_ERROR = 'NETWORK_ERROR';
  export const TIMEOUT_ERROR = 'TIMEOUT_ERROR';
  export const VALIDATION_ERROR = 'VALIDATION_ERROR';
  export const SERVER_ERROR = 'SERVER_ERROR';
  export const NOT_FOUND_ERROR = 'NOT_FOUND_ERROR';
  export const UNAUTHORIZED_ERROR = 'UNAUTHORIZED_ERROR';
  export const UNKNOWN_ERROR = 'UNKNOWN_ERROR';
}

/**
 * Error Modal Cases
 */
export const errorCase = {
  LOADER: {
    errType: 'LOADER',
    loader: true,
    loaderBG: true
  },

  genericError: {
    errType: 'API_FAILS',
    disc: 'GENERIC_ERROR_MESSAGE',
    primaryBtn: {
      btnText: 'OK',
      isVisible: true
    }
  },

  PRODUCT_NOT_FOUND: {
    errType: 'PRODUCT_NOT_FOUND',
    disc: 'PRODUCT_NOT_FOUND_MESSAGE',
    primaryBtn: {
      btnText: 'OK',
      isVisible: true
    }
  },

  INVALID_CONDITION: {
    errType: 'INVALID_CONDITION',
    disc: 'INVALID_CONDITION_MESSAGE',
    primaryBtn: {
      btnText: 'OK',
      isVisible: true
    }
  },

  REMOVE_ITEM_CONFIRMATION: {
    errType: 'REMOVE_ITEM_CONFIRMATION',
    title: 'CONFIRM_REMOVAL',
    disc: 'REMOVE_ITEM_CONFIRMATION_MESSAGE',
    primaryBtn: {
      btnText: 'CONFIRM',
      isVisible: true
    },
    secondaryBtn: {
      btnText: 'CANCEL',
      isVisible: true
    }
  },

  CLEAR_LIST_CONFIRMATION: {
    errType: 'CLEAR_LIST_CONFIRMATION',
    title: 'CONFIRM_CLEAR',
    disc: 'CLEAR_LIST_CONFIRMATION_MESSAGE',
    primaryBtn: {
      btnText: 'CONFIRM',
      isVisible: true
    },
    secondaryBtn: {
      btnText: 'CANCEL',
      isVisible: true
    }
  },

  QUOTATION_EXPIRED: {
    errType: 'QUOTATION_EXPIRED',
    disc: 'QUOTATION_EXPIRED_MESSAGE',
    primaryBtn: {
      btnText: 'OK',
      isVisible: true
    }
  },

  STORE_NOT_FOUND: {
    errType: 'STORE_NOT_FOUND',
    disc: 'STORE_NOT_FOUND_MESSAGE',
    primaryBtn: {
      btnText: 'OK',
      isVisible: true
    }
  }
};

/**
 * Toaster Cases
 */
export const toasterCases = {
  DEFAULT: {
    toasterType: '',
    isVisible: false,
    Message: '',
    viewLink: {
      link: '',
      isVisible: false,
    },
  },

  ITEM_ADDED: {
    toasterType: 'ITEM_ADDED_SUCCESS',
    isVisible: true,
    viewLink: {
      link: '/buyback-list',
      isVisible: true,
    },
  },

  ITEM_REMOVED: {
    toasterType: 'ITEM_REMOVED_SUCCESS',
    isVisible: true,
    viewLink: {
      link: '',
      isVisible: false,
    },
  },

  ITEM_UPDATED: {
    toasterType: 'ITEM_UPDATED_SUCCESS',
    isVisible: true,
    viewLink: {
      link: '',
      isVisible: false,
    },
  },

  QUOTATION_SUBMITTED: {
    toasterType: 'QUOTATION_SUBMITTED_SUCCESS',
    isVisible: true,
    viewLink: {
      link: '',
      isVisible: false,
    },
  },

  ERROR_OCCURRED: {
    toasterType: 'ERROR_OCCURRED',
    isVisible: true,
    viewLink: {
      link: '',
      isVisible: false,
    },
  }
};
