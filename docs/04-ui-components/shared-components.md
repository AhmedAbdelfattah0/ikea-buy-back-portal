# Shared Components

## Overview

Shared components are reusable UI components used across multiple features in the IKEA Buyback Portal. These components follow IKEA's design system (SKAPA) and maintain consistency throughout the application.

## Component Library

### Components Status

| Component | Status | Location |
|-----------|--------|----------|
| Modal | Pending | `shared/components/modal/` |
| Toaster | Pending | `shared/components/toaster/` |
| Error Message | Pending | `shared/components/error-message/` |
| Loading Spinner | **Not Used** | Use SKAPA skeleton loaders instead |

**Note**: IKEA Buyback Portal uses **SKAPA skeleton loaders** for loading states, not traditional spinners.

## Modal Component

### Purpose

Reusable modal dialog for confirmations, alerts, and forms.

### Location

```
src/app/shared/components/modal/
├── modal.component.ts
├── modal.component.html
└── modal.component.scss
```

### Implementation

```typescript
// modal.component.ts
import { Component, Input, Output, EventEmitter, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-modal',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './modal.component.html',
  styleUrl: './modal.component.scss',
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class ModalComponent {
  @Input() isOpen: boolean = false;
  @Input() heading: string = '';
  @Input() showCloseButton: boolean = true;
  @Input() size: 'small' | 'medium' | 'large' = 'medium';

  @Output() close = new EventEmitter<void>();

  onClose(): void {
    this.close.emit();
  }

  onBackdropClick(event: MouseEvent): void {
    if ((event.target as HTMLElement).classList.contains('modal-backdrop')) {
      this.onClose();
    }
  }
}
```

### Template

```html
<!-- modal.component.html -->
@if (isOpen) {
  <div class="modal-backdrop" (click)="onBackdropClick($event)">
    <div class="modal-container" [class]="'modal-' + size">
      <skapa-modal
        [open]="isOpen"
        (close)="onClose()"
        [heading]="heading">

        <!-- Content Slot -->
        <div slot="content">
          <ng-content select="[slot='content']"></ng-content>
        </div>

        <!-- Actions Slot -->
        <div slot="actions">
          <ng-content select="[slot='actions']"></ng-content>

          @if (!hasActionsContent) {
            <skapa-button variant="primary" (click)="onClose()">
              Close
            </skapa-button>
          }
        </div>
      </skapa-modal>
    </div>
  </div>
}
```

### Styles

```scss
// modal.component.scss
@use '../../../assets/global/variables' as *;
@use '../../../assets/global/mixins' as *;

.modal-backdrop {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  @include flex-center;
  z-index: 1000;
  animation: fadeIn 0.2s ease;
}

.modal-container {
  max-height: 90vh;
  overflow-y: auto;
  animation: slideInUp 0.3s ease;

  &.modal-small {
    max-width: 400px;
  }

  &.modal-medium {
    max-width: 600px;
  }

  &.modal-large {
    max-width: 900px;
  }
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

@keyframes slideInUp {
  from {
    transform: translateY(50px);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
}
```

### Usage

```typescript
// In component
export class MyComponent {
  isModalOpen = signal<boolean>(false);

  openModal(): void {
    this.isModalOpen.set(true);
  }

  closeModal(): void {
    this.isModalOpen.set(false);
  }

  confirmAction(): void {
    // Perform action
    this.closeModal();
  }
}
```

```html
<!-- In template -->
<skapa-button (click)="openModal()">
  Open Modal
</skapa-button>

<app-modal
  [isOpen]="isModalOpen()"
  (close)="closeModal()"
  heading="Confirm Action"
  size="medium">

  <div slot="content">
    <p>Are you sure you want to proceed?</p>
  </div>

  <div slot="actions">
    <skapa-button variant="secondary" (click)="closeModal()">
      Cancel
    </skapa-button>
    <skapa-button variant="primary" (click)="confirmAction()">
      Confirm
    </skapa-button>
  </div>
</app-modal>
```

## Toaster Component

### Purpose

Display toast notifications for success, error, info, and warning messages.

### Location

```
src/app/shared/components/toaster/
├── toaster.component.ts
├── toaster.component.html
├── toaster.component.scss
└── toaster.service.ts
```

### Service Implementation

```typescript
// toaster.service.ts
import { Injectable, signal } from '@angular/core';

export interface Toast {
  id: string;
  type: 'success' | 'error' | 'info' | 'warning';
  message: string;
  duration?: number;
}

@Injectable({ providedIn: 'root' })
export class ToasterService {
  private _toasts = signal<Toast[]>([]);
  readonly toasts = this._toasts.asReadonly();

  private defaultDuration = 5000; // 5 seconds

  show(type: Toast['type'], message: string, duration?: number): void {
    const toast: Toast = {
      id: this.generateId(),
      type,
      message,
      duration: duration || this.defaultDuration
    };

    this._toasts.update(toasts => [...toasts, toast]);

    // Auto-remove after duration
    if (toast.duration) {
      setTimeout(() => this.remove(toast.id), toast.duration);
    }
  }

  success(message: string, duration?: number): void {
    this.show('success', message, duration);
  }

  error(message: string, duration?: number): void {
    this.show('error', message, duration);
  }

  info(message: string, duration?: number): void {
    this.show('info', message, duration);
  }

  warning(message: string, duration?: number): void {
    this.show('warning', message, duration);
  }

  remove(id: string): void {
    this._toasts.update(toasts => toasts.filter(t => t.id !== id));
  }

  clear(): void {
    this._toasts.set([]);
  }

  private generateId(): string {
    return `toast-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }
}
```

### Component Implementation

```typescript
// toaster.component.ts
import { Component, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ToasterService } from './toaster.service';

@Component({
  selector: 'app-toaster',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './toaster.component.html',
  styleUrl: './toaster.component.scss'
})
export class ToasterComponent {
  toasts = computed(() => this.toasterService.toasts());

  constructor(private toasterService: ToasterService) {}

  remove(id: string): void {
    this.toasterService.remove(id);
  }

  getIcon(type: string): string {
    const icons = {
      success: 'checkmark-circle',
      error: 'warning-triangle',
      info: 'information-circle',
      warning: 'warning-triangle'
    };
    return icons[type] || 'information-circle';
  }
}
```

### Template

```html
<!-- toaster.component.html -->
<div class="toaster-container">
  @for (toast of toasts(); track toast.id) {
    <div class="toast" [class]="'toast-' + toast.type">
      <skapa-icon [icon]="getIcon(toast.type)"></skapa-icon>
      <span class="message">{{ toast.message }}</span>
      <button class="close-button" (click)="remove(toast.id)">
        <skapa-icon icon="close"></skapa-icon>
      </button>
    </div>
  }
</div>
```

### Styles

```scss
// toaster.component.scss
@use '../../../assets/global/variables' as *;
@use '../../../assets/global/mixins' as *;

.toaster-container {
  position: fixed;
  top: $spacing-lg;
  right: $spacing-lg;
  z-index: 2000;
  display: flex;
  flex-direction: column;
  gap: $spacing-sm;
  max-width: 400px;

  .toast {
    display: flex;
    align-items: center;
    gap: $spacing-sm;
    padding: $spacing-md;
    background: $color-white;
    border-radius: $border-radius;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    animation: slideInRight 0.3s ease;

    &.toast-success {
      border-left: 4px solid $color-success;
    }

    &.toast-error {
      border-left: 4px solid $color-error;
    }

    &.toast-info {
      border-left: 4px solid $color-info;
    }

    &.toast-warning {
      border-left: 4px solid $color-warning;
    }

    .message {
      flex: 1;
      color: $color-text;
    }

    .close-button {
      background: none;
      border: none;
      cursor: pointer;
      padding: 0;
      color: $color-text-secondary;

      &:hover {
        color: $color-text;
      }
    }
  }
}

@keyframes slideInRight {
  from {
    transform: translateX(100%);
    opacity: 0;
  }
  to {
    transform: translateX(0);
    opacity: 1;
  }
}

// RTL Support
[dir='rtl'] {
  .toaster-container {
    left: $spacing-lg;
    right: auto;

    .toast {
      border-left: none;
      border-right: 4px solid;
    }
  }

  @keyframes slideInRight {
    from {
      transform: translateX(-100%);
      opacity: 0;
    }
    to {
      transform: translateX(0);
      opacity: 1;
    }
  }
}
```

### Usage

```typescript
// In component
export class MyComponent {
  constructor(private toaster: ToasterService) {}

  onSuccess(): void {
    this.toaster.success('Item added to buyback list!');
  }

  onError(): void {
    this.toaster.error('Failed to submit. Please try again.');
  }

  onInfo(): void {
    this.toaster.info('Your session will expire in 5 minutes.');
  }

  onWarning(): void {
    this.toaster.warning('Please complete all required fields.');
  }
}
```

```html
<!-- In app.component.html (root) -->
<app-toaster></app-toaster>
<router-outlet></router-outlet>
```

## Error Message Component

### Purpose

Display formatted error messages consistently.

### Location

```
src/app/shared/components/error-message/
├── error-message.component.ts
├── error-message.component.html
└── error-message.component.scss
```

### Implementation

```typescript
// error-message.component.ts
import { Component, Input, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-error-message',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './error-message.component.html',
  styleUrl: './error-message.component.scss',
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class ErrorMessageComponent {
  @Input() message: string = '';
  @Input() type: 'error' | 'warning' | 'info' = 'error';
  @Input() showIcon: boolean = true;
}
```

### Template

```html
<!-- error-message.component.html -->
@if (message) {
  <div class="error-message" [class]="'message-' + type">
    @if (showIcon) {
      <skapa-icon [icon]="getIcon()"></skapa-icon>
    }
    <span class="message-text">{{ message }}</span>
  </div>
}
```

### Styles

```scss
// error-message.component.scss
@use '../../../assets/global/variables' as *;
@use '../../../assets/global/mixins' as *;

.error-message {
  display: flex;
  align-items: center;
  gap: $spacing-sm;
  padding: $spacing-md;
  border-radius: $border-radius;
  margin: $spacing-md 0;

  &.message-error {
    background: rgba($color-error, 0.1);
    border: 1px solid $color-error;
    color: $color-error;
  }

  &.message-warning {
    background: rgba($color-warning, 0.1);
    border: 1px solid $color-warning;
    color: $color-warning;
  }

  &.message-info {
    background: rgba($color-info, 0.1);
    border: 1px solid $color-info;
    color: $color-info;
  }

  .message-text {
    flex: 1;
    font-size: $font-size-sm;
  }
}
```

### Usage

```typescript
// In component
export class MyComponent {
  errorMessage = signal<string | null>(null);

  onSubmit(): void {
    if (!this.isValid()) {
      this.errorMessage.set('Please fill in all required fields');
      return;
    }

    // Submit logic
  }
}
```

```html
<!-- In template -->
<app-error-message
  [message]="errorMessage() || ''"
  type="error">
</app-error-message>
```

## Empty State Component

### Purpose

Display when lists or searches return no results.

### Implementation

```typescript
// empty-state.component.ts
import { Component, Input, Output, EventEmitter, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-empty-state',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './empty-state.component.html',
  styleUrl: './empty-state.component.scss',
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class EmptyStateComponent {
  @Input() icon: string = 'information-circle';
  @Input() title: string = '';
  @Input() description: string = '';
  @Input() actionLabel: string = '';

  @Output() action = new EventEmitter<void>();

  onAction(): void {
    this.action.emit();
  }
}
```

### Template

```html
<!-- empty-state.component.html -->
<div class="empty-state">
  <skapa-icon [icon]="icon" size="64"></skapa-icon>
  <h2>{{ title }}</h2>
  <p>{{ description }}</p>

  @if (actionLabel) {
    <skapa-button variant="primary" (click)="onAction()">
      {{ actionLabel }}
    </skapa-button>
  }
</div>
```

### Usage

```html
@if (items().length === 0) {
  <app-empty-state
    icon="shopping-bag-add"
    title="No items in your list"
    description="Start by searching for products"
    actionLabel="Find Products"
    (action)="goToSearch()">
  </app-empty-state>
}
```

## Best Practices

### ✅ Do's

1. **Use SKAPA components** - Leverage design system
2. **Make components reusable** - Generic and configurable
3. **Support RTL** - Test with Arabic
4. **Use signals** - For reactive state
5. **Document props** - Clear @Input/@Output documentation
6. **Handle edge cases** - Empty states, errors
7. **Follow IKEA branding** - Colors, fonts, spacing

### ❌ Don'ts

1. **Don't create feature-specific shared components** - Keep generic
2. **Don't forget CUSTOM_ELEMENTS_SCHEMA** - Required for SKAPA
3. **Don't skip accessibility** - ARIA labels, keyboard navigation
4. **Don't hardcode strings** - Use translations
5. **Don't create traditional spinners** - Use SKAPA skeleton loaders

## Component Checklist

When creating a new shared component:

- [ ] Standalone component
- [ ] CUSTOM_ELEMENTS_SCHEMA included
- [ ] Uses SKAPA components
- [ ] RTL support tested
- [ ] Accessible (ARIA labels, keyboard nav)
- [ ] Documented @Input/@Output
- [ ] Usage examples provided
- [ ] Styles follow global SCSS variables
- [ ] Supports all required sizes/variants
- [ ] Error handling included

---

**Next**: [Styling Guide](./styling-guide.md)
