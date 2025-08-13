# HappyHourHunt Design System & Component Library

> **📝 Note to Claude**: This file serves as the single source of truth for all reusable components, styling standards, and design patterns. Reference this file when building new features or components. **Always update this file when creating new reusable components.**

## 🎨 Theme Strategy

### **Theme Philosophy**
- **Backend Pages** (Profile, Admin, Auth): **Dark themed** for focused work environments
- **Frontend Pages** (Search, Home, Public): **Light themed** for broad accessibility

### **Theme Implementation**
All components support `theme="light" | "dark"` prop for consistent theming across the application.

## 📏 Layout Constraints

### **Width Guidelines**
- **Maximum Section Width**: 1280px for all content sections
- **Text Body Width**: 600-700px maximum for optimal readability
- **Form Width**: 600-800px for optimal form completion experience
- **Card Grids**: Use responsive breakpoints with max container width

## 🧩 Component Library

### **Layout Components**

#### **CardWrapper** (`/SmallComponents/CardWrapper.tsx`)
**Purpose**: Flexible container for content sections with consistent styling
```tsx
<CardWrapper 
  variant="dark" | "default" | "glass" | "outlined" | "elevated" | "glass-80" | "dark-glass"
  padding="none" | "sm" | "md" | "lg" | "xl"  // Default: "md"
  rounded="sm" | "md" | "lg" | "xl" | "2xl"   // Default: "2xl" 
  hover={boolean}                            // Default: false
  selected={boolean}                         // Default: false
>
  {children}
</CardWrapper>
```

**Variants**:
- `default`: Light background, border, shadow
- `dark`: Dark background for backend pages (`bg-stone-800/50 border border-white/10`)
- `dark-glass`: Dark with backdrop blur
- `glass`: Light with transparency
- `outlined`: Transparent with border only

**Usage**: Use as base container for form sections, content cards, modal content

---

#### **MaxWidthContainer** (`/Layout/MaxWidthContainer.tsx`)
**Purpose**: Responsive container with max-width constraints
```tsx
<MaxWidthContainer size="sm" | "md" | "lg" | "xl" | "2xl" | "full">
  {children}
</MaxWidthContainer>
```

---

### **Form Components**

#### **FormSection** (`/SmallComponents/FormSection.tsx`)
**Purpose**: Themed section wrapper with title and icon for organizing form content
```tsx
<FormSection 
  title="Section Title"
  icon={LucideIcon}        // Optional
  theme="light" | "dark"   // Default: "dark"
  className=""             // Optional additional classes
>
  {form fields and content}
</FormSection>
```

**Usage**: Group related form fields together with consistent section styling

---

#### **FormField** (`/SmallComponents/FormField.tsx`)
**Purpose**: Complete form input with label, icon, help text, and error states
```tsx
<FormField
  label="Field Label"
  icon={LucideIcon}         // Optional
  theme="light" | "dark"    // Default: "dark"
  helpText="Optional help"  // Optional
  error="Error message"     // Optional
  // All standard HTML input props
  type="text"
  value={value}
  onChange={handler}
  placeholder="Placeholder"
  disabled={boolean}
  required={boolean}
/>
```

**Features**:
- Automatic icon positioning
- Theme-appropriate colors
- Built-in accessibility (labels, ARIA)
- Error state styling
- Focus management

---

#### **TextInput** (`/SmallComponents/TextInput.tsx`)
**Purpose**: Basic input component (legacy - prefer FormField for new development)

---

### **Interactive Components**

#### **ActionButton** (`/SmallComponents/ActionButton.tsx`)
**Purpose**: Primary button component with loading states and consistent styling
```tsx
<ActionButton
  variant="primary" | "secondary" | "outline"  // Default: "primary"
  size="sm" | "md" | "lg"                      // Default: "md"
  theme="light" | "dark"                       // Default: "dark"
  loading={boolean}                            // Default: false
  fullWidth={boolean}                          // Default: false
  // All standard HTML button props
  onClick={handler}
  disabled={boolean}
  type="submit" | "button"
>
  Button Text
</ActionButton>
```

**Variants**:
- `primary`: Gradient background (po1 to py1)
- `secondary`: Solid background with theme colors
- `outline`: Border only with hover effects

---

#### **SiteButton** (`/SmallComponents/siteButton.tsx`)
**Purpose**: Legacy button component (prefer ActionButton for new development)

---

### **Media Components**

#### **AvatarUpload** (`/SmallComponents/AvatarUpload.tsx`)
**Purpose**: Complete avatar upload component with validation, compression, and error handling
```tsx
<AvatarUpload
  currentUrl={string | null}           // Current avatar URL
  onUpload={(file: File) => Promise}   // Upload handler function
  uploading={boolean}                  // Loading state
  theme="light" | "dark"               // Default: "dark"
  size="sm" | "md" | "lg"             // Default: "md"
  fallbackInitials="AB"               // Fallback text
  className=""                        // Optional additional classes
/>
```

**Features**:
- Built-in file validation (type, size)
- Automatic compression with WebP/JPEG fallback
- Error handling with graceful fallbacks
- Loading states
- Responsive sizing

---

### **Utility Components**

#### **LoadingSpinner** (`/SmallComponents/LoadingSpinner.tsx`)
**Purpose**: Consistent loading indicator
```tsx
<LoadingSpinner 
  size="xs" | "sm" | "md" | "lg" | "xl"  // Default: "md"
  className=""                          // Optional additional classes
/>
```

---

#### **ErrorState** (`/SmallComponents/ErrorState.tsx`)
**Purpose**: Consistent error display with retry functionality

---

#### **AnimatedGradientBackground** (`/SmallComponents/AnimatedGradientBackground.tsx`)
**Purpose**: Animated background for auth pages and special sections

---

### **Navigation Components**

#### **NavBar** (`/Components/nav.tsx`)
**Purpose**: Main navigation with responsive mobile menu and user authentication
```tsx
// Links can be either navigation links or modal triggers
const links = [
  { text: "Search", href: "/search" },  // Navigation link
  { text: "Contact" }                    // Modal trigger
];
```

**Features**:
- Responsive mobile hamburger menu
- Mixed navigation (links + modal triggers)
- User authentication integration
- Automatic mobile menu collapse on navigation

---

## 🎨 Styling Standards

### **Color System**
```css
/* Custom Theme Colors (Always use these first) */
--po1: #ea580c    /* Primary Orange */
--py1: #f59e0b    /* Primary Yellow */  
--pr1: #dc2626    /* Primary Red */
--n1: #1c1917     /* Neutral Dark */
--n2: #fff9ee     /* Neutral Light */
--n3: #f5f5f4     /* Neutral Mid */
```

**Color Usage Priority**:
1. **Custom theme colors first** - Use po1, py1, pr1, n1, n2, n3
2. **Tailwind colors second** - Only when custom colors don't exist for that family
3. **Never use hex codes** - Always use named color classes

### **Typography**
- **Sans**: Montserrat (primary)
- **Serif**: Playfair (accent)
- **Mono**: Allerta (special use)

### **Responsive Breakpoints**
```css
xs: 460px     /* Custom breakpoint */
sm: 640px
md: 768px
lg: 1024px
xl: 1280px
2xl: 1536px
```

### **Spacing & Sizing**
- **Consistent padding**: Use CardWrapper padding variants
- **Border radius**: Default to `rounded-xl` (12px) or `rounded-2xl` (16px)
- **Shadows**: `shadow-lg` for cards, `shadow-xl` for elevated states

### **Class Naming Convention**
- **PascalCase prefixes**: Start every className with descriptive PascalCase
- **Examples**: `"ProfileCard bg-white"`, `"SearchButton text-po1"`, `"RestaurantSection p-6"`

### **Focus & Accessibility**
- **Focus rings**: `focus:ring-2 focus:ring-po1 focus:outline-none`
- **Focus offsets**: Dark theme uses `focus:ring-offset-stone-900`, light uses `focus:ring-offset-white`
- **Skip links**: Always include for keyboard navigation
- **ARIA labels**: Built into reusable components

## 🛠️ Development Guidelines

### **Component Creation Standards**

1. **Single Responsibility**: Each component should have one clear purpose
2. **Theme Support**: Always include `theme="light" | "dark"` prop
3. **TypeScript**: Full type safety with proper interfaces
4. **Accessibility**: Built-in ARIA labels and keyboard navigation
5. **Consistent APIs**: Follow established patterns for props and naming

### **New Component Checklist**
When creating new reusable components:
- [ ] Add TypeScript interface with proper prop types
- [ ] Include theme support (light/dark variants)
- [ ] Add accessibility features (ARIA, focus management)
- [ ] Use existing color system and spacing
- [ ] Include size variants if applicable
- [ ] Add loading/error states if interactive
- [ ] **Update this STYLEGUIDE.md file**
- [ ] Add usage example to styleguide

### **Component Organization**
```
src/app/Components/
├── SmallComponents/     # Reusable UI elements
├── Layout/             # Layout and container components  
├── ErrorBoundary/      # Error handling components
├── modals/            # Modal components
├── hamburgerMenu/     # Navigation components
└── [feature]/         # Feature-specific components
```

### **Props Patterns**

#### **Standard Props Pattern**
```tsx
interface ComponentProps extends HTMLAttributes<HTMLDivElement> {
  // Component-specific props
  variant?: 'default' | 'special';
  size?: 'sm' | 'md' | 'lg';
  theme?: 'light' | 'dark';
  
  // Content
  children?: ReactNode;
  
  // Optional styling
  className?: string;
}
```

#### **Form Component Pattern**
```tsx
interface FormComponentProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  icon?: LucideIcon;
  theme?: 'light' | 'dark';
  helpText?: string;
  error?: string;
}
```

## 📋 Usage Examples

### **Profile Form Pattern** (Dark Theme)
```tsx
<FormSection title="Personal Information" icon={User2} theme="dark">
  <FormField
    label="Full Name"
    icon={User2}
    value={fullName}
    onChange={setFullName}
    theme="dark"
  />
  <FormField
    label="Location"
    icon={MapPin}
    value={location}
    onChange={setLocation}
    helpText="Help us recommend nearby happy hours"
    theme="dark"
  />
</FormSection>

<div className="flex gap-4">
  <ActionButton variant="primary" theme="dark" fullWidth>
    Save Changes
  </ActionButton>
  <ActionButton variant="secondary" theme="dark" fullWidth>
    Cancel
  </ActionButton>
</div>
```

### **Light Theme Form Pattern**
```tsx
<CardWrapper variant="default" className="max-w-md mx-auto">
  <FormSection title="Contact Us" theme="light">
    <FormField
      label="Email"
      type="email"
      icon={Mail}
      theme="light"
      required
    />
    <FormField
      label="Message"
      as="textarea"
      theme="light"
      rows={4}
    />
    <ActionButton variant="primary" theme="light" fullWidth>
      Send Message
    </ActionButton>
  </FormSection>
</CardWrapper>
```

## 🔄 Maintenance Notes

### **Regular Updates**
- Update this file whenever new components are created
- Document any new patterns or conventions
- Keep examples current with actual usage
- Review and refactor components quarterly for consistency

### **Performance Considerations**
- Use React.memo for expensive components
- Implement useMemo/useCallback for complex calculations
- Monitor bundle size impact of new components
- Prefer CSS-in-Tailwind over styled-components for better tree-shaking

---

> **🔮 Future Enhancements**
> - Add Storybook documentation
> - Create component playground
> - Add automated visual regression testing
> - Implement design tokens system
> - Create Figma design system integration