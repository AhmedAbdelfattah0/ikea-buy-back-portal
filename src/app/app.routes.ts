import { Routes } from '@angular/router';
import { Routes as RouteConstants } from './shared/constants/routes.constants';

/**
 * Application Routes
 *
 * NOTE: These routes do NOT include the /{market}/{lang}/ prefix
 * That's handled automatically by APP_BASE_HREF in app.config.ts
 *
 * All URLs will be: /{market}/{lang}/{route}
 * Examples:
 * - /sa/en/search
 * - /sa/ar/categories
 * - /bh/en/buyback-list
 */
export const routes: Routes = [
  {
    path: '',
    redirectTo: RouteConstants.BUYBACK_QUOTE,
    pathMatch: 'full'
  },
  // {
  //   path: RouteConstants.SEARCH,
  //   loadComponent: () =>
  //     import('./features/product-discovery/pages/search/search.component').then(m => m.SearchComponent),
  //   title: 'Search Products - IKEA Buyback Portal'
  // },
  {
    path: RouteConstants.CATEGORIES,
    loadComponent: () =>
      import('./features/product-discovery/pages/category-browse/category-browse.component').then(
        m => m.CategoryBrowseComponent
      ),
    title: 'Browse Categories - IKEA Buyback Portal'
  },
  {
    path: RouteConstants.BUYBACK_QUOTE,
    loadComponent: () =>
      import('./features/buyback-list/pages/buyback-list/buyback-list.component').then(m => m.BuybackListComponent),
    title: 'Buy back estimator tool - IKEA Buyback Portal'
  },
  {
    path: RouteConstants.SUMMARY,
    loadComponent: () =>
      import('./features/submission/pages/summary/summary.component').then(m => m.SummaryComponent),
    title: 'Review & Submit - IKEA Buyback Portal'
  },
  {
    path: RouteConstants.CONFIRMATION,
    loadComponent: () =>
      import('./features/submission/pages/confirmation/confirmation.component').then(m => m.ConfirmationComponent),
    title: 'Confirmation - IKEA Buyback Portal'
  },
  {
    path: '**',
    redirectTo: RouteConstants.BUYBACK_QUOTE
  }
];
