/**
 * Translation Interface
 * Defines the structure for translation objects
 */
export interface Translation {
  common: CommonTranslations;
  productDiscovery: ProductDiscoveryTranslations;
  conditionAssessment: ConditionAssessmentTranslations;
  buybackList: BuybackListTranslations;
  estimation: EstimationTranslations;
  confirmation: ConfirmationTranslations;
  offer: OfferTranslations;
  submission: SubmissionTranslations;
  errors: ErrorTranslations;
  validation: ValidationTranslations;
  toaster: ToasterTranslations;
  modal: ModalTranslations;
}

export interface CommonTranslations {
  appTitle: string;
  submit: string;
  cancel: string;
  next: string;
  previous: string;
  back: string;
  close: string;
  save: string;
  delete: string;
  edit: string;
  search: string;
  loading: string;
  retry: string;
  confirm: string;
  yes: string;
  no: string;
  copy: string;
}

export interface ProductDiscoveryTranslations {
  title: string;
  pageHeading: string;
  pageDescription: string;
  searchPlaceholder: string;
  categories: string;
  selectCategory: string;
  level1: string;
  level2: string;
  level3: string;
  level4: string;
  noResults: string;
  searchResults: string;
  productsFound: string;
  selectProduct: string;
  addToBuyback: string;
}

export interface ConditionAssessmentTranslations {
  title: string;
  selectCondition: string;
  likeNew: string;
  likeNewDescription: string;
  veryGood: string;
  veryGoodDescription: string;
  wellUsed: string;
  wellUsedDescription: string;
  conditionRequired: string;
}

export interface BuybackListTranslations {
  title: string;
  yourItems: string;
  noItems: string;
  itemCount: string;
  removeItem: string;
  updateCondition: string;
  continueToOffer: string;
  addMoreProducts: string;
  estimatedOffer: string;
  itemPrice: string;
  totalEstimate: string;
  familyMemberPrice: string;
}

export interface EstimationTranslations {
  title: string;
  description: string;
  requirementsTitle: string;
  requirementsDescription: string;
  requirementClean: string;
  requirementCleanDescription: string;
  requirementAssembled: string;
  requirementAssembledDescription: string;
  requirementSticker: string;
  requirementStickerDescription: string;
  readyToSell: string;
  removeProduct: string;
  sellBack: string;
  goBackToHomepage: string;
  privacyNotice: string;
  readPrivacyPolicy: string;
}

export interface ConfirmationTranslations {
  title: string;
  quotationLabel: string;
  step1: string;
  step2: string;
  step3: string;
  step4: string;
  estimateAnother: string;
  shareFeedback: string;
}

export interface OfferTranslations {
  title: string;
  totalOffer: string;
  familyMember: string;
  nonFamilyMember: string;
  perItem: string;
  currency: string;
  becomeFamilyMember: string;
  familyBenefits: string;
  offerBreakdown: string;
  acceptOffer: string;
  declineOffer: string;
}

export interface SubmissionTranslations {
  title: string;
  reviewTitle: string;
  email: string;
  emailPlaceholder: string;
  storeLocation: string;
  selectStore: string;
  confirmSubmission: string;
  submitting: string;
  successTitle: string;
  quotationNumber: string;
  quotationGenerated: string;
  nextSteps: string;
  nextStepsDescription: string;
  printQuotation: string;
  downloadQuotation: string;
  backToHome: string;
}

export interface ErrorTranslations {
  general: string;
  networkError: string;
  notFound: string;
  serverError: string;
  timeout: string;
  unauthorized: string;
  tryAgain: string;
}

export interface ValidationTranslations {
  required: string;
  invalidEmail: string;
  minLength: string;
  maxLength: string;
  invalidFormat: string;
}

export interface ToasterTranslations {
  VIEW: string;
  ITEM_ADDED_SUCCESS: string;
  ITEM_REMOVED_SUCCESS: string;
  ITEM_UPDATED_SUCCESS: string;
  QUOTATION_SUBMITTED_SUCCESS: string;
  ERROR_OCCURRED: string;
}

export interface ModalTranslations {
  CLOSE_DIALOG: string;
  OK: string;
  CONFIRM: string;
  CANCEL: string;
  PASSWORD: string;
  REVEAL_PASSWORD: string;
  API_FAILS: string;
  GENERIC_ERROR_MESSAGE: string;
  PRODUCT_NOT_FOUND: string;
  PRODUCT_NOT_FOUND_MESSAGE: string;
  INVALID_CONDITION: string;
  INVALID_CONDITION_MESSAGE: string;
  CONFIRM_REMOVAL: string;
  REMOVE_ITEM_CONFIRMATION: string;
  REMOVE_ITEM_CONFIRMATION_MESSAGE: string;
  CONFIRM_CLEAR: string;
  CLEAR_LIST_CONFIRMATION: string;
  CLEAR_LIST_CONFIRMATION_MESSAGE: string;
  QUOTATION_EXPIRED: string;
  QUOTATION_EXPIRED_MESSAGE: string;
  STORE_NOT_FOUND: string;
  STORE_NOT_FOUND_MESSAGE: string;
}
