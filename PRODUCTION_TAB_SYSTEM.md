# Angular 20 Production-Ready Tab System

This implementation provides a modern, scalable, and production-ready tab system built with Angular 20, Material 3, and signals.

## 🚀 Features

### Core Features
- **Angular 20 with Signals**: Modern reactive programming with `signal()`, `computed()`, and `effect()`
- **Material 3 Design**: Latest Material Design components and theming
- **Dynamic Component Loading**: Configurable loading strategies (eager, lazy, onClickOnly)
- **Advanced Validation**: Real-time form validation with cross-tab dependencies
- **Progress Tracking**: Visual progress indicators for long-running operations
- **Error Handling**: Comprehensive error handling with retry mechanisms
- **Accessibility**: WCAG compliant with full keyboard navigation support

### Advanced Capabilities
- **Read-only Mode**: Components can be set to display-only mode
- **Disabled Tabs**: Tabs can be disabled with custom tooltips
- **Per-tab Actions**: Individual Save/Reset buttons within tabs
- **Global Operations**: Save All / Reset All with progress tracking
- **State Persistence**: Optional localStorage persistence of tab states
- **Concurrent Loading**: Configurable concurrency for tab loading operations
- **Keyboard Navigation**: Full keyboard support (Ctrl+S, Ctrl+R, arrow keys)
- **Auto-loading**: Smart loading during Save All operations

## 📁 File Structure

```
src/app/
├── shared/
│   ├── components/
│   │   ├── tab-group-new/
│   │   │   ├── shared-tab-group-new.component.ts    # Main tab component
│   │   │   └── tab.interfaces.ts                    # Types and interfaces
│   │   └── account-information/
│   │       └── account-information.component.ts     # Example tab component
│   └── services/
│       └── booking.service.ts                       # Data service with signals
├── components/
│   └── booking-new/
│       └── booking-new.component.ts                 # Main booking container
├── app-simple.ts                                    # Simplified app component
└── main-new.ts                                      # Bootstrap configuration
```

## 🛠️ Implementation Guide

### 1. Basic Tab Component

Create a component that implements `TabValidatable`:

```typescript
@Component({
  selector: 'app-my-tab',
  standalone: true,
  // ... other config
})
export class MyTabComponent implements TabValidatable<MyData> {
  
  // Required methods
  isValid(): boolean {
    return this.form.valid;
  }
  
  isDirty(): boolean {
    return this.form.dirty;
  }
  
  async save(): Promise<void> {
    // Save logic
  }
  
  reset(): void {
    this.form.reset();
  }
  
  getData(): MyData {
    return this.form.getRawValue();
  }
  
  // Optional methods
  setReadOnly?(readOnly: boolean): void {
    readOnly ? this.form.disable() : this.form.enable();
  }
  
  initializeData?(data: Partial<MyData>): void {
    this.form.patchValue(data);
  }
}
```

### 2. Configure Tabs

```typescript
const tabConfigs: TabConfig[] = [
  {
    id: 'personal',
    label: 'Personal Information',
    component: PersonalInfoComponent,
    mode: 'eager',                    // Load immediately
    enabled: true,
    icon: 'person',
    iconTooltip: 'Personal details',
    showPerTabActions: true,
    required: true,
    order: 1,
  },
  {
    id: 'payment',
    label: 'Payment Method',
    component: PaymentComponent,
    mode: 'lazy',                     // Load after delay
    enabled: true,
    showPerTabActions: true,
    required: true,
    order: 2,
  },
  {
    id: 'review',
    label: 'Review',
    component: ReviewComponent,
    mode: 'onClickOnly',              // Load only when clicked
    readOnly: true,                   // Display only
    enabled: false,                   // Initially disabled
    disabledTooltip: 'Complete other sections first',
    order: 3,
  },
];
```

### 3. Use the Tab Group

```typescript
<app-shared-tab-group-new
  [tabConfigs]="tabConfigs"
  [options]="{
    globalLoadStrategy: 'lazy',
    validateOnTabSwitch: true,
    saveMode: 'parent',
    showGlobalActions: true,
    saveAllLoad: 'missing',
    emitProgress: true,
    persistState: true,
    keyboardNavigation: true
  }"
  (saveAllProgress)="onProgress($event)"
  (globalSave)="onGlobalSave($event)"
  (globalReset)="onGlobalReset()"
  (tabChanged)="onTabChanged($event)"
  (validationChanged)="onValidationChanged($event)">
</app-shared-tab-group-new>
```

### 4. Handle Events

```typescript
onProgress(event: SaveAllProgressEvent): void {
  // Update progress bar
  this.progressValue = event.progress || 0;
  this.progressMessage = event.message || '';
}

onGlobalSave(payload: Record<string, unknown>): void {
  // Handle complete form submission
  const formData = {
    personal: payload['personal'],
    payment: payload['payment'],
    // ... other tabs
  };
  
  this.submitForm(formData);
}

onValidationChanged(event: TabValidationChangeEvent): void {
  // Update UI based on validation state
  if (event.tabId === 'personal' && event.isValid) {
    this.enableTab('payment');
  }
}
```

## ⚙️ Configuration Options

### Loading Strategies
- **eager**: Load all tabs immediately on component init
- **lazy**: Load first tab immediately, others after delay
- **onClickOnly**: Load tabs only when clicked

### Save Modes
- **parent**: Emit data to parent component for handling
- **internal**: Each tab saves itself independently

### Auto-load During Save All
- **none**: Don't auto-load any tabs
- **missing**: Load only unloaded tabs that are included in save
- **all**: Load all enabled tabs before saving

## 🎯 Production Features

### Error Handling
- Automatic retry for failed tab loads
- Comprehensive error messages with user-friendly actions
- Graceful degradation for network issues

### Performance
- Lazy loading reduces initial bundle size
- Concurrent loading with backpressure control
- Efficient change detection with signals
- Memory management with proper cleanup

### Accessibility
- Full WCAG 2.1 AA compliance
- Screen reader support with ARIA labels
- Keyboard navigation (Tab, Shift+Tab, Ctrl+Arrow keys)
- High contrast mode support
- Reduced motion support

### User Experience
- Visual progress indicators for long operations
- Contextual tooltips and help text
- Validation summaries with actionable errors
- Auto-save capabilities
- Responsive design for mobile devices

## 🧪 Testing

The system is designed for easy testing:

```typescript
// Test tab validation
const component = fixture.componentInstance;
expect(component.isValid()).toBe(false);

component.form.patchValue({ name: 'Test' });
expect(component.isValid()).toBe(true);

// Test save operation
await component.save();
expect(mockService.save).toHaveBeenCalledWith(expectedData);
```

## 🚀 Getting Started

1. **Copy the files** to your Angular project
2. **Install dependencies**: `@angular/material`, `@angular/cdk`
3. **Update imports** in your existing components
4. **Configure tabs** according to your needs
5. **Test thoroughly** in your environment

## 📈 Scalability

This implementation scales to:
- ✅ **100+ tabs** with lazy loading
- ✅ **Complex validation** across multiple forms
- ✅ **Large datasets** with efficient change detection
- ✅ **Multiple instances** on the same page
- ✅ **Dynamic tab management** (add/remove at runtime)

## 🔧 Customization

The system is highly customizable:
- **Custom validators** per tab
- **Custom loading strategies**
- **Custom save behaviors**
- **Custom UI themes**
- **Custom progress indicators**
- **Custom error handling**

## 📝 Migration Guide

To migrate from the existing tab system:

1. **Replace imports**: Update to new component imports
2. **Update interfaces**: Implement `TabValidatable` in your components
3. **Configure tabs**: Use new `TabConfig` format
4. **Handle events**: Update event handlers for new event types
5. **Test thoroughly**: Verify all functionality works as expected

## 🆘 Troubleshooting

### Common Issues

**Tabs not loading**: Check that components implement `TabValidatable`
**Validation not working**: Ensure `isValid()` method returns correct state
**Save failing**: Verify `save()` method handles async operations properly
**Performance issues**: Check for memory leaks in component cleanup

### Debug Mode

Enable debug logging by setting:
```typescript
const tabOptions = {
  // ... other options
  debugMode: true, // Add this to see detailed logs
};
```

## 📚 Further Reading

- [Angular Signals Guide](https://angular.dev/guide/signals)
- [Material 3 Design System](https://m3.material.io/)
- [Angular Accessibility Guide](https://angular.dev/guide/accessibility)
- [TypeScript Best Practices](https://typescript-eslint.io/rules/)

---

**Built with ❤️ by the Twenty Development Team**
