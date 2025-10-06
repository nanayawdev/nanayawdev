# ESLint Error Fixing Guide

This guide helps you fix common ESLint errors in your React/Next.js project.

## Common ESLint Errors and Solutions

### 1. Unescaped Entities (`react/no-unescaped-entities`)

**Error:** `'` can be escaped with `&apos;`, `&lsquo;`, `&#39;`, `&rsquo;`.

**Problem:** Apostrophes and quotes in JSX text content need to be escaped.

**Solutions:**

#### Option 1: Use HTML Entities (Recommended)
```jsx
// ❌ Wrong
<p>We're committed to helping African brands reach global audiences.</p>
<p>Let's discuss how we can help your brand go global.</p>

// ✅ Correct
<p>We&apos;re committed to helping African brands reach global audiences.</p>
<p>Let&apos;s discuss how we can help your brand go global.</p>
```

#### Option 2: Use Template Literals
```jsx
// ✅ Correct
<p>{`We're committed to helping African brands reach global audiences.`}</p>
<p>{`Let's discuss how we can help your brand go global.`}</p>
```

#### Option 3: Use Different Quote Types
```jsx
// ✅ Correct
<p>We&apos;re committed to helping African brands reach global audiences.</p>
<p>Let&apos;s discuss how we can help your brand go global.</p>
```

### 2. Common HTML Entities

| Character | Entity Name | Entity Number | Description |
|-----------|-------------|---------------|-------------|
| `'` | `&apos;` | `&#39;` | Apostrophe |
| `"` | `&quot;` | `&#34;` | Double quote |
| `&` | `&amp;` | `&#38;` | Ampersand |
| `<` | `&lt;` | `&#60;` | Less than |
| `>` | `&gt;` | `&#62;` | Greater than |
| ` ` | `&nbsp;` | `&#160;` | Non-breaking space |

### 3. Other Common ESLint Errors

#### Missing Dependencies in useEffect
```jsx
// ❌ Wrong
useEffect(() => {
  fetchData();
}, []); // Missing dependency

// ✅ Correct
useEffect(() => {
  fetchData();
}, [fetchData]); // Include all dependencies
```

#### Unused Variables
```jsx
// ❌ Wrong
const unusedVariable = 'hello';
const Component = () => <div>Hello</div>;

// ✅ Correct
const Component = () => <div>Hello</div>;
// Remove unused variables or prefix with underscore
```

#### Missing Key Props
```jsx
// ❌ Wrong
{items.map(item => <div>{item.name}</div>)}

// ✅ Correct
{items.map(item => <div key={item.id}>{item.name}</div>)}
```

## Quick Fix Commands

### Fix All Auto-fixable Issues
```bash
npm run lint -- --fix
# or
yarn lint --fix
```

### Check Specific Files
```bash
npm run lint src/app/about/page.tsx
npm run lint src/app/contact/page.tsx
```

### Disable Specific Rules (Use Sparingly)
```jsx
// Disable for entire file
/* eslint-disable react/no-unescaped-entities */

// Disable for specific line
<p>We're committed to helping African brands reach global audiences.</p> {/* eslint-disable-line react/no-unescaped-entities */}

// Disable for next line
{/* eslint-disable-next-line react/no-unescaped-entities */}
<p>We're committed to helping African brands reach global audiences.</p>
```

## Best Practices

### 1. Always Escape Special Characters
- Use `&apos;` for apostrophes
- Use `&quot;` for quotes
- Use `&amp;` for ampersands

### 2. Use Template Literals for Complex Strings
```jsx
// For strings with many special characters
<p>{`We're "committed" to helping African brands & startups reach global audiences.`}</p>
```

### 3. Keep ESLint Rules Enabled
- Don't disable rules unless absolutely necessary
- Fix the root cause instead of suppressing warnings
- Use specific line/block disabling over file-wide disabling

### 4. Regular Linting
- Run `npm run lint` before committing
- Set up pre-commit hooks to catch errors early
- Use your IDE's ESLint integration for real-time feedback

## IDE Integration

### VS Code
1. Install ESLint extension
2. Enable "Format on Save"
3. Enable "Fix on Save"

### Settings (settings.json)
```json
{
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": true
  },
  "eslint.validate": [
    "javascript",
    "javascriptreact",
    "typescript",
    "typescriptreact"
  ]
}
```

## Project-Specific Configuration

Your project uses these ESLint rules:
- `react/no-unescaped-entities` - Prevents unescaped quotes and apostrophes
- `react-hooks/exhaustive-deps` - Ensures useEffect dependencies are complete
- `@typescript-eslint/no-unused-vars` - Prevents unused variables

## Automated Fixing Script

Create a script to fix common issues:

```json
// package.json
{
  "scripts": {
    "lint:fix": "eslint . --ext .js,.jsx,.ts,.tsx --fix",
    "lint:check": "eslint . --ext .js,.jsx,.ts,.tsx"
  }
}
```

## Summary

1. **Always escape special characters** in JSX text content
2. **Use HTML entities** like `&apos;` for apostrophes
3. **Run linting regularly** to catch issues early
4. **Fix root causes** instead of suppressing warnings
5. **Use IDE integration** for real-time feedback

Remember: Clean code is maintainable code! 🚀
