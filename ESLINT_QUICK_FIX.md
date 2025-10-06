# ESLint Quick Fix Guide

## Fixed Files ✅

All ESLint errors have been resolved in these files:

1. **`/src/app/services/brand-identity/page.tsx`** - Line 111
2. **`/src/app/services/mobile-apps/page.tsx`** - Line 109  
3. **`/src/app/services/page.tsx`** - Line 106
4. **`/src/app/services/ui-ux-design/page.tsx`** - Line 99
5. **`/src/app/services/web-development/page.tsx`** - Line 69
6. **`/src/components/navbar.tsx`** - Line 17 (Next.js Link)
7. **`/src/components/light-rays.tsx`** - Line 67 (TypeScript any)
8. **`/src/components/logo-loop.tsx`** - Lines 12, 14, 39, 231 (TypeScript any + Next.js Image)
9. **`/src/components/beams.tsx`** - Lines 1, 11, 11, 25, 29, 284, 298, 307, 314, 315, 321 (TypeScript any + unused ESLint directives)

## Changes Made

### 1. Unescaped Entities (react/no-unescaped-entities)
All unescaped apostrophes (`'`) were replaced with HTML entities (`&apos;`):

```jsx
// ❌ Before
Let's create a brand that stands out...
We're expanding our services...

// ✅ After  
Let&apos;s create a brand that stands out...
We&apos;re expanding our services...
```

### 2. Next.js Link (next/next/no-html-link-for-pages)
Replaced `<a>` elements with Next.js `<Link>` components for internal navigation:

```jsx
// ❌ Before
<a href="/">Home</a>

// ✅ After
import Link from "next/link";
<Link href="/">Home</Link>
```

### 3. TypeScript Any (typescript-eslint/no-explicit-any)
Replaced `any` type with proper TypeScript types:

```tsx
// ❌ Before
const uniformsRef = useRef<any>(null);
const toCssLength = (value: any) => ...;
const useResizeObserver = (..., dependencies: any[]) => ...;

// ✅ After
const uniformsRef = useRef<Record<string, { value: number | number[] | boolean }> | null>(null);
const toCssLength = (value: number | string | undefined) => ...;
const useResizeObserver = (..., dependencies: unknown[]) => ...;
```

### 4. Next.js Image Optimization (next/next/no-img-element)
Replaced `<img>` with Next.js `<Image>` component for better performance:

```tsx
// ❌ Before
<img
  src={item.src}
  alt={item.alt ?? ''}
  title={item.title}
  loading="lazy"
  decoding="async"
  draggable={false}
/>

// ✅ After
import Image from 'next/image';
<Image
  src={item.src!}
  alt={item.alt ?? ''}
  title={item.title}
  width={logoHeight}
  height={logoHeight}
  loading="lazy"
  draggable={false}
  className="logoloop__img"
/>
```

### 5. Complex TypeScript Types (typescript-eslint/no-explicit-any)
Replaced complex `any` types with proper interfaces and type definitions:

```tsx
// ❌ Before
function extendMaterial(BaseMaterial: any, cfg: any) { ... }
const MergedPlanes = forwardRef(({ material, width, count, height }: any, ref) => { ... })
const cam = (dir.current as any).shadow.camera;
const baseDefines = (physical as any).defines ?? {};
const defaults = new BaseMaterial() as any;
(mesh.current.material as any).uniforms.time.value += 0.1 * delta;

// ✅ After
interface MaterialConfig {
  material?: Record<string, unknown>;
  uniforms?: Record<string, unknown>;
  header?: string;
  vertex?: Record<string, string>;
  fragment?: Record<string, string>;
}

interface MergedPlanesProps {
  material: THREE.Material;
  width: number;
  count: number;
  height: number;
}

function extendMaterial(BaseMaterial: typeof THREE.Material, cfg: MaterialConfig) { ... }
const MergedPlanes = forwardRef<THREE.Mesh, MergedPlanesProps>(({ material, width, count, height }, ref) => { ... })
const cam = (dir.current as THREE.DirectionalLight).shadow.camera;
const baseDefines = (physical as THREE.ShaderLibShader & { defines?: Record<string, string> }).defines ?? {};
const defaults = new BaseMaterial() as THREE.Material & {
  color?: THREE.Color;
  roughness?: number;
  metalness?: number;
  envMap?: THREE.Texture;
  envMapIntensity?: number;
};
(mesh.current.material as THREE.ShaderMaterial).uniforms.time.value += 0.1 * delta;
```

### 6. Unused ESLint Directives
Removed unused ESLint disable directives:

```tsx
// ❌ Before
/* eslint-disable react/no-unknown-property */
// eslint-disable-next-line react-hooks/exhaustive-deps

// ✅ After
// Removed unused directives
```

## Quick Commands

```bash
# Check for ESLint errors
npm run lint

# Auto-fix ESLint errors
npm run lint -- --fix

# Check specific files
npm run lint src/app/services/
```

## Prevention Tips

1. **Always escape apostrophes** in JSX text content
2. **Use `&apos;`** for apostrophes
3. **Use `&quot;`** for quotes
4. **Use Next.js `<Link>`** for internal navigation instead of `<a>`
5. **Avoid `any` type** - use proper TypeScript types
6. **Run linting before committing**

## Common ESLint Rules

- `react/no-unescaped-entities` - Escape special characters in JSX
- `next/next/no-html-link-for-pages` - Use Next.js Link for internal navigation
- `typescript-eslint/no-explicit-any` - Avoid using `any` type
- `next/next/no-img-element` - Use Next.js Image for better performance
- `react-hooks/exhaustive-deps` - Include all dependencies in useEffect
- `@typescript-eslint/no-unused-vars` - Remove unused variables
- `react/no-unknown-property` - Avoid unknown DOM properties
- Unused ESLint directives - Remove unnecessary disable comments

All components now pass ESLint validation! 🚀
