# Theme Rules for Devs & Creatives

## 🎨 Light & Dark Theme Guidelines

### **Core Theme Colors**
All components must use these semantic color tokens that automatically adapt to light/dark themes:

#### **Primary Colors**
- `text-foreground` - Main text color (dark in light mode, light in dark mode)
- `text-muted-foreground` - Secondary/subtle text
- `bg-background` - Main background color
- `bg-card` - Card/container backgrounds
- `bg-muted` - Subtle background sections

#### **Accent Colors**
- `bg-primary` - Primary brand color
- `text-primary-foreground` - Text on primary background
- `bg-secondary` - Secondary background
- `text-secondary-foreground` - Text on secondary background

#### **Interactive Colors**
- `border` - Default borders
- `bg-accent` - Hover/focus states
- `text-accent-foreground` - Text on accent backgrounds

### **Component Theme Rules**

#### **1. Text Colors**
```tsx
// ✅ Correct
<h1 className="text-foreground">Title</h1>
<p className="text-muted-foreground">Subtitle</p>

// ❌ Wrong - Hard-coded colors
<h1 className="text-black dark:text-white">Title</h1>
```

#### **2. Background Colors**
```tsx
// ✅ Correct
<section className="bg-background">
<div className="bg-card p-6 rounded-lg border">

// ❌ Wrong - Hard-coded backgrounds
<section className="bg-white dark:bg-gray-900">
```

#### **3. Section Alternation**
```tsx
// ✅ Correct - Alternate backgrounds for visual separation
<section className="py-16">                    // Default background
<section className="py-16 bg-muted/30">       // Subtle background
<section className="py-16 bg-primary">         // Brand color background
```

#### **4. Cards & Containers**
```tsx
// ✅ Correct
<div className="bg-card p-6 rounded-lg border">
  <h3 className="text-foreground">Title</h3>
  <p className="text-muted-foreground">Content</p>
</div>
```

#### **5. Interactive Elements**
```tsx
// ✅ Correct
<button className="bg-primary text-primary-foreground hover:bg-primary/90">
<span className="px-3 py-1 bg-muted rounded-full text-muted-foreground">
```

### **Component-Specific Rules**

#### **Hero Section**
- Use `text-foreground` for main title
- Use `text-muted-foreground` for subtitles and taglines
- Tagline badges: `bg-muted text-muted-foreground`

#### **Service Cards**
- Card background: `bg-card`
- Card border: `border`
- Titles: `text-foreground`
- Content: `text-muted-foreground`

#### **CTA Sections**
- Primary CTA: `bg-primary text-primary-foreground`
- Secondary sections: `bg-muted/30`

#### **FAQ & Content Sections**
- Default background: `bg-background`
- Alternating sections: `bg-muted/30`

### **Testing Theme Compliance**

#### **Checklist for Each Component:**
- [ ] No hard-coded colors (black, white, gray-900, etc.)
- [ ] Uses semantic color tokens
- [ ] Text is readable in both themes
- [ ] Backgrounds provide proper contrast
- [ ] Interactive elements have proper hover states
- [ ] Borders are visible in both themes

#### **Theme Testing:**
1. Switch between light/dark mode
2. Verify all text is readable
3. Check background contrast
4. Test interactive elements
5. Ensure visual hierarchy is maintained

### **Common Mistakes to Avoid**

❌ **Hard-coded colors:**
```tsx
className="text-black dark:text-white"
className="bg-white dark:bg-gray-900"
```

✅ **Semantic tokens:**
```tsx
className="text-foreground"
className="bg-background"
```

❌ **Missing contrast:**
```tsx
className="text-gray-500 bg-gray-500" // Poor contrast
```

✅ **Proper contrast:**
```tsx
className="text-muted-foreground bg-muted" // Good contrast
```

### **Implementation Notes**

- All components inherit theme from `ThemeProvider`
- Colors automatically switch based on `class="dark"` on `<html>`
- Use Tailwind's semantic color system
- Test in both light and dark modes
- Maintain visual hierarchy across themes
