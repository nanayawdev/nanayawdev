# Design System Reference

This document captures the complete design language of the Sales Girl web app. Use it as a base when scaffolding a new app with the same stack (Next.js 15 App Router, Tailwind v4, shadcn/ui, Radix UI, HugeIcons, CVA).

---

## Stack

| Layer | Library |
|---|---|
| Framework | Next.js 15 App Router |
| Styling | Tailwind CSS v4 (`@import "tailwindcss"`) |
| Component primitives | Radix UI (via `radix-ui` package) |
| Component variants | `class-variance-authority` (CVA) |
| Icons | `@hugeicons/react` + `@hugeicons/core-free-icons` |
| Fonts | Circular Std (local, `--font-sans`) |
| Toast | `sonner` |
| Animation | `tw-animate-css` |
| Utility | `clsx` + `tailwind-merge` → `cn()` |

---

## Color System (CSS Variables)

All colors use `oklch()`. The `@theme inline` block maps them to Tailwind utility classes.

### Light Mode (`:root`)

```css
--background:          oklch(1 0 0);           /* white */
--foreground:          oklch(0.145 0 0);        /* near-black */
--card:                oklch(1 0 0);
--card-foreground:     oklch(0.145 0 0);
--popover:             oklch(1 0 0);
--popover-foreground:  oklch(0.145 0 0);

--primary:             oklch(0.826 0.113 161);  /* green */
--primary-foreground:  oklch(0.27 0.09 155);   /* dark green text */

--secondary:           oklch(0.97 0 0);
--secondary-foreground: oklch(0.205 0 0);

--muted:               oklch(0.97 0 0);
--muted-foreground:    oklch(0.556 0 0);

--accent:              oklch(0.97 0 0);
--accent-foreground:   oklch(0.205 0 0);

--destructive:         oklch(0.577 0.245 27.325); /* red */
--destructive-foreground: oklch(1 0 0);

--border:              oklch(0.922 0 0);
--input:               oklch(0.922 0 0);
--ring:                oklch(0.469 0.124 155);

--sidebar:             oklch(0.985 0 0);
--sidebar-foreground:  oklch(0.145 0 0);
--sidebar-primary:     oklch(0.826 0.113 161);
--sidebar-primary-foreground: oklch(0.27 0.09 155);
--sidebar-accent:      oklch(0.97 0 0);
--sidebar-border:      oklch(0.922 0 0);
--sidebar-ring:        oklch(0.708 0 0);

--chart-1 … --chart-5: /* green → teal → blue → yellow → amber */
```

### Dark Mode (`.dark`)

```css
--background:  #131313;
--foreground:  oklch(0.985 0 0);
--card:        #161616;
--popover:     #161616;
--secondary:   #1d1d1d;
--muted:       #1d1d1d;
--accent:      #1d1d1d;
--sidebar:     #161616;
--sidebar-accent: #1d1d1d;
--primary:     oklch(0.469 0.124 155);   /* darker green for dark bg */
--border:      oklch(0.269 0 0);
--ring:        oklch(0.826 0.113 161);
```

### Brand Green (hardcoded)

Used in `brand` button/badge variants and marketing components:

```
Light: bg #72e3ad, border #4dc990, text black
Dark:  bg #097c4f, border #1a9e67, text white
Hover light: #5dd99a
Hover dark:  #0a8f5c
```

---

## Border Radius

```css
--radius: 0.625rem;          /* base — applied to cards, inputs, dialogs */
--radius-sm: calc(var(--radius) - 4px);
--radius-md: calc(var(--radius) - 2px);
--radius-lg: var(--radius);
--radius-xl: calc(var(--radius) + 4px);  /* dialogs, popovers */
```

Shorthand patterns actually used in components:
- `rounded-lg` — inputs, standard buttons
- `rounded-xl` — cards, dialog content
- `rounded-2xl` — empty states, some panels
- `rounded-3xl` — `SurfacePanel`
- `rounded-full` — pills, avatar, icon buttons in header
- `rounded-[var(--radius)]` — metric cards

---

## Typography

**Font:** Circular Std (Book weight), loaded as `--font-sans`, applied via `className="font-sans antialiased"` on `<html>`.

### Scale in Use

| Usage | Class |
|---|---|
| Page title | `text-3xl font-semibold tracking-heading sm:text-4xl lg:text-[3rem] lg:tracking-display` |
| Metric value | `text-[3rem] font-semibold leading-none tracking-display` |
| Card title | `text-base font-medium` (uses `font-heading`) |
| Body | `text-sm` |
| Muted body | `text-sm text-muted-foreground` |
| Label / eyebrow | `text-xs font-medium uppercase tracking-[0.18em–0.22em] text-[#666666]` |
| Badge / pill | `text-xs font-medium` |
| Table cell | `text-sm` |

---

## Dashboard Shell, Sidebar & Header — How They Fit Together

This is the core visual system of the app. Three surfaces — the **sidebar**, the **header bar**, and the **main content area** — are designed to feel like one unified frame rather than separate boxes.

---

### The Visual Contract

```
┌─────────────────────────────────────────────────────────────────┐
│  SidebarProvider  (bg: radial-gradient muted → transparent)     │
│                                                                  │
│  ┌──────────────┐  ┌───────────────────────────────────────┐    │
│  │   Sidebar    │  │  SidebarInset                         │    │
│  │              │  │  bg-background/95                     │    │
│  │  bg-sidebar  │  │  border border-border/60  shadow-sm   │    │
│  │  (#161616 dk)│  │  rounded-xl  (inset variant, md+)    │    │
│  │              │  │                                       │    │
│  │  ┌────────┐  │  │  ┌─────────────────────────────────┐ │    │
│  │  │ Header │  │  │  │  Header bar  h-16               │ │    │
│  │  │  h-16  │  │  │  │  border-b border-border/40      │ │    │
│  │  │ border-│  │  │  │  px-4                           │ │    │
│  │  │  b     │  │  │  │  [toggle][breadcrumb/switcher]  │ │    │
│  │  └────────┘  │  │  │  [notif][help][tips][avatar]    │ │    │
│  │              │  │  └─────────────────────────────────┘ │    │
│  │  Nav groups  │  │                                       │    │
│  │  (scrollable)│  │  <main>  p-4 md:p-6  overflow-y-auto │    │
│  │              │  │    page content                      │    │
│  │              │  │  </main>                              │    │
│  └──────────────┘  └───────────────────────────────────────┘    │
└─────────────────────────────────────────────────────────────────┘
```

---

### Why It Looks Seamless

**1. Shared header height**

Both the `SidebarHeader` and the dashboard `<header>` bar are exactly `h-16`. Their `border-b border-border/40` lines up pixel-perfect across the sidebar/content boundary, creating one continuous horizontal rule across the full viewport width.

**2. Inset variant lifts the content panel**

The sidebar uses `variant="inset"`. On `md+` screens, `SidebarInset` gets:
```
m-2 ml-0 rounded-xl shadow-sm
```
This gives the main content area a slightly floating, card-like appearance sitting on top of the sidebar's background. The sidebar background (`--sidebar`) becomes the outer canvas; the content panel (`bg-background/95`) sits inset within it.

**3. The outer background gradient**

`SidebarProvider` carries:
```css
bg-[radial-gradient(circle_at_top,_hsl(var(--muted))_0%,_transparent_55%),_hsl(var(--background))]
```
A soft radial gradient from muted at the top-center fading to the base background color. Since the sidebar fills the left of this canvas and the inset panel sits inside it, the gradient subtly bleeds through both surfaces, tying them together with ambient light rather than a hard edge.

**4. Token harmony — sidebar vs. background**

| Surface | Light | Dark |
|---|---|---|
| Outer canvas / sidebar | `--sidebar: oklch(0.985 0 0)` (near-white) | `#161616` |
| Inset content panel | `--background: oklch(1 0 0)` (white) + `bg-background/95` | `#131313` |
| Card inside panel | `--card: oklch(1 0 0)` | `#161616` |

In light mode, sidebar is slightly off-white and the content panel is pure white — a 1.5% luminance step, subtle but enough to read the boundary. In dark mode, the sidebar is darker (`#161616`) than the panel (`#131313`) — same principle, inverted direction.

**5. Border as the boundary marker**

The `SidebarInset` gets `border border-border/60` — a very translucent border (60% opacity) around the whole content panel. Combined with `shadow-sm`, this creates a gentle separation from the sidebar without a heavy dividing line.

---

### Sidebar Anatomy

```
<Sidebar collapsible="icon" variant="inset">
  <SidebarHeader>          ← h-16, border-b border-border/40
    Logo/Avatar + Tenant name + Branch name
  </SidebarHeader>

  <SidebarContent>         ← scrollable, no-scrollbar
    <SidebarGroup>         ← py-2, repeated per group
      <SidebarGroupLabel>  ← 10px, font-bold, uppercase, tracking-widest
                              fades out + collapses when icon-only
      <SidebarMenu gap-1>
        <SidebarMenuItem>
          <SidebarMenuButton isActive tooltip="Label">
            <HugeiconsIcon />
            <span>Label</span>
          </SidebarMenuButton>
        </SidebarMenuItem>
      </SidebarMenu>
    </SidebarGroup>
  </SidebarContent>

  <SidebarRail />          ← 4px drag handle to resize
</Sidebar>
```

**Nav groups:** Main / Sales / Management / Admin — permission-gated and module-gated, so empty groups are hidden entirely.

**Active item:**
```
bg-secondary text-foreground shadow-sm
icon strokeWidth: 2    (heavier when active)
```

**Inactive item:**
```
text-muted-foreground hover:bg-secondary/50 hover:text-foreground
icon strokeWidth: 1.5  (lighter when inactive)
```

**Collapsed (icon-only) state:**
- All `SidebarGroupLabel` elements collapse via `-mt-8 opacity-0 transition`
- Menu buttons shrink to `size-8 p-2` (icon-square)
- Labels are hidden; a `<Tooltip side="right">` appears on hover as a replacement
- Width: `3rem` (`--sidebar-width-icon`)

**Hover-expand mode:**
- Sidebar starts collapsed to icon rail
- `onMouseEnter` → `setOpen(true)`, `onMouseLeave` → `setOpen(false)`
- Mode persisted in `localStorage` as `sidebar-mode`

**Mobile:**
- Sidebar renders as a `<Sheet side="left">` overlay (drawer), not inline
- Width: `18rem` (`--sidebar-width-mobile`)
- Opened via the `SidebarModeControl` toggle button in the header

**Sidebar header — workspace identity:**
```
size-8 rounded-full bg-primary   ← tenant logo or first-letter monogram
text-sm font-medium truncate      ← tenant name (hidden when collapsed)
text-xs text-muted-foreground     ← branch name (hidden when collapsed)
```

---

### Header Bar Anatomy

```
<header class="flex h-16 shrink-0 items-center gap-2 border-b border-border/40 px-4">

  ← left side
  <SidebarModeControl />    icon-sm ghost button, -ml-1
  <ScopeSwitcher />         branch badge + dropdown

  ← right side (ml-auto)
  <NotificationDropdown />  permission-gated
  <HelpButton />            size-8 rounded-full border border-border/60 bg-muted/40
  <TipsButton />            same style
  <UserDropdown />
</header>
```

**Left cluster — navigation controls:**

`SidebarModeControl` is a ghost `icon-sm` button that opens a dropdown on desktop with three options: Expanded / Collapsed / Expand on hover. On mobile it just opens the sheet drawer.

`ScopeSwitcher` sits immediately right of it — a pill badge showing the active branch name. Clicking opens a dropdown of all branches the user belongs to. The active branch is highlighted with `bg-muted/60` and a `brand` badge. Switching on the POS page shows a confirmation modal warning about cart state.

**Right cluster — ambient actions:**

Help and Tips buttons share the same shape: `size-8 rounded-full border border-border/60 bg-muted/40 text-muted-foreground hover:bg-muted hover:text-foreground`. This makes them read as secondary ambient controls — present but not demanding attention — visually distinct from the primary action buttons that appear inside page content.

`UserDropdown` handles profile, settings, and logout.

**Alignment with sidebar header:**

The sidebar header is also `h-16` with `border-b border-border/40`. Since both share the exact height and border style, they align into a single horizontal strip across the top of the viewport — the sidebar's left section and the content panel's right section feel like one topbar.

---

### Collapse Transition

Width transition is `duration-200 ease-linear` on the sidebar gap div. The content panel (`SidebarInset`) shifts left automatically as a flex sibling — no JS needed for the reflow. The gap div is what creates the space; the container is `position: fixed`, so the content panel always occupies the remaining width.

---

### Responsive Behaviour Summary

| Breakpoint | Sidebar | Content panel |
|---|---|---|
| `< md` | Sheet (drawer, off-canvas) | Full width, no rounding |
| `md+` | Inline, collapsible to icon rail | Inset: `m-2 ml-0 rounded-xl shadow-sm` |
| Collapsed | `3rem` icon rail | Shifts right by `3rem` + inset padding |
| Expanded | `16rem` | Shifts right by `16rem` + inset padding |

---

## Layout & Shell

### Root Layout

```
<html class="h-full antialiased font-sans">
  <body class="min-h-full flex flex-col">
    <ThemeProvider>
      <QueryProvider>
        <ScopeProvider>
          <TooltipProvider>
            {children}
          </TooltipProvider>
        </ScopeProvider>
      </QueryProvider>
    </ThemeProvider>
    <Toaster />
  </body>
</html>
```

### Dashboard Shell (`DashboardShell`)

```
<SidebarProvider class="h-svh overflow-hidden bg-[radial-gradient(circle_at_top,_hsl(var(--muted))_0%,_transparent_55%),_hsl(var(--background))]">
  <AppSidebar />
  <SidebarInset class="flex flex-col min-h-0 overflow-hidden border border-border/60 bg-background/95 shadow-sm">
    <AnnouncementBanner />
    <TrialBanner />
    <SubscriptionBanner />

    <header class="flex h-16 shrink-0 items-center gap-2 border-b border-border/40 px-4">
      [SidebarModeControl] [ScopeSwitcher]    ← left
      [Notifications] [Help] [Tips] [User]    ← right (ml-auto)
    </header>

    <main class="flex-1 overflow-y-auto p-4 md:p-6 no-scrollbar">
      {children}
    </main>
  </SidebarInset>

  <HelpPanel />
  <TipsPanel />
  <WelcomeModal />
</SidebarProvider>
```

**Key measurements:**
- Header height: `h-16` (64px)
- Sidebar width: `16rem` (expanded), `3rem` (collapsed icon-only)
- Sidebar mobile width: `18rem`
- Main padding: `p-4` (mobile) → `p-6` (md+)
- Sidebar keyboard shortcut: `Cmd/Ctrl + B`

### Sidebar Modes
Three modes stored in `localStorage`:
- `expanded` — full sidebar visible
- `collapsed` — icon-only rail
- `hover` — icon rail that expands on hover

---

## Component Patterns

### Button

Variants: `default` | `outline` | `secondary` | `ghost` | `destructive` | `link` | `brand`

Sizes: `xs` | `sm` | `default` | `lg` | `icon-xs` | `icon-sm` | `icon` | `icon-lg`

```tsx
<Button variant="default" size="default">Save</Button>
<Button variant="outline" size="sm">Cancel</Button>
<Button variant="destructive">Delete</Button>
<Button variant="brand">Get Started</Button>
<Button variant="ghost" size="icon-sm"><Icon /></Button>
```

Base classes: `inline-flex shrink-0 items-center justify-center rounded-lg border border-transparent text-sm font-medium whitespace-nowrap transition-all outline-none`

Focus ring: `focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50`

Invalid state: `aria-invalid:border-destructive aria-invalid:ring-3 aria-invalid:ring-destructive/20`

---

### Badge

Variants: `default` | `secondary` | `destructive` | `outline` | `ghost` | `link` | `success` | `brand`

```tsx
<Badge variant="success">Active</Badge>
<Badge variant="destructive">Expired</Badge>
<Badge variant="brand">Pro</Badge>
```

Base: `inline-flex h-5 items-center gap-1 rounded-4xl px-2 py-0.5 text-xs font-medium`

---

### StatusPill

Semantic status indicator with auto-inferred tone from value text.

```tsx
<StatusPill>paid</StatusPill>           // → success (emerald)
<StatusPill>pending</StatusPill>        // → warning (amber)
<StatusPill>cancelled</StatusPill>      // → danger (red)
<StatusPill tone="info">Submitted</StatusPill>
<StatusPill tone="brand" icon={false}>Custom</StatusPill>
```

Tones:
```
success  → bg-emerald-50  text-emerald-700
warning  → bg-amber-50    text-amber-700
danger   → bg-red-50      text-red-600
info     → bg-[#ebf5ff]   text-[#0068d6]
neutral  → bg-[#fafafa]   text-[#4d4d4d]
brand    → bg-primary/10  text-primary
```

Shape: `h-6 rounded-full px-2.5 text-xs font-medium`

Auto-icon: CheckmarkCircle (success), CancelCircle (danger), Clock (others). Pass `icon={false}` to suppress.

---

### Card

```tsx
<Card size="default | sm">
  <CardHeader>
    <CardTitle>Title</CardTitle>
    <CardDescription>Subtitle</CardDescription>
    <CardAction><Button /></CardAction>
  </CardHeader>
  <CardContent>…</CardContent>
  <CardFooter>…</CardFooter>
</Card>
```

- Shape: `rounded-xl bg-card ring-1 ring-foreground/10`
- Footer: `border-t bg-muted/50 rounded-b-xl`
- Padding: `py-4 px-4` (default), `py-3 px-3` (sm)

---

### MetricCard

Dashboard KPI tile.

```tsx
<MetricCard
  label="Total Revenue"
  value="GHS 4,200"
  caption="+12% this week"
  icon={SomeIcon}
  tone="bg-emerald-50 text-emerald-600"
/>
```

Shape: `rounded-[var(--radius)] bg-card p-5 shadow-card`
Label: `text-xs font-medium uppercase tracking-[0.18em] text-[#666666]`
Value: `text-[3rem] font-semibold leading-none tracking-display`

---

### SurfacePanel

Section wrapper — a heavier card alternative.

```tsx
<SurfacePanel>
  …content…
</SurfacePanel>
```

Shape: `rounded-3xl border border-border bg-card p-5 md:p-6 shadow-sm`

---

### PageHeader

Top-of-page header with optional eyebrow, actions slot.

```tsx
<PageHeader
  eyebrow="Overview"
  title="Dashboard"
  description="Your restaurant at a glance."
  actions={<Button>Export</Button>}
/>
```

Layout: `flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between`
Title: `text-3xl font-semibold tracking-heading sm:text-4xl lg:text-[3rem] lg:tracking-display`
Eyebrow: `text-xs font-medium uppercase tracking-[0.22em] text-[#666666]`
Actions: full-width on mobile, auto-width stacked row on sm+, right-aligned on lg+

---

### EmptyState

```tsx
<EmptyState
  title="No orders yet"
  description="Orders will appear here once customers place them."
  icon={OrdersIcon}
  action={<Button size="sm">Create order</Button>}
/>
```

Shape: `border border-dashed border-border bg-background px-4 py-8 text-center rounded-2xl`
Icon container: `size-10 rounded-2xl bg-muted text-muted-foreground`

---

### LoadingState

```tsx
<LoadingState message="Fetching orders…" />
```

Layout: `flex flex-col items-center justify-center p-12 gap-4`
Uses `<Spinner>` (HugeIcons `Loading03Icon` + `animate-spin`)

---

### ActionMenu

Overflow `...` menu — wraps DropdownMenu.

```tsx
<ActionMenu
  items={[
    { label: 'Edit', onClick: () => {} },
    { label: 'Delete', onClick: () => {}, tone: 'danger' },
  ]}
/>
```

Trigger: `size-9 rounded-full text-muted-foreground hover:bg-muted`
Danger item: `text-destructive focus:bg-destructive/10`

---

### Dialog (Modal)

```tsx
<Dialog open={open} onOpenChange={setOpen}>
  <DialogContent>
    <DialogHeader>
      <DialogTitle>Confirm action</DialogTitle>
      <DialogDescription>This cannot be undone.</DialogDescription>
    </DialogHeader>
    …body…
    <DialogFooter showCloseButton>
      <Button onClick={handleConfirm}>Confirm</Button>
    </DialogFooter>
  </DialogContent>
</Dialog>
```

Content: `rounded-xl bg-popover p-4 ring-1 ring-foreground/10 max-w-sm`
Overlay: `bg-black/10 backdrop-blur-xs`
Close button: top-right ghost icon-sm, `bg-foreground text-background`
Footer: `-mx-4 -mb-4 border-t bg-muted/50 rounded-b-xl p-4`
Animation: `zoom-in-95` enter / `zoom-out-95` exit

---

### Sheet (Drawer)

Side-panel for detail views or forms. Same overlay as Dialog.

```tsx
<Sheet open={open} onOpenChange={setOpen}>
  <SheetContent side="right">
    <SheetHeader>
      <SheetTitle>Edit item</SheetTitle>
    </SheetHeader>
    …
  </SheetContent>
</Sheet>
```

Width: `w-3/4 sm:max-w-sm`
Animation: slides in from chosen side

---

### Input

```tsx
<Input placeholder="Search…" />
<Input type="email" aria-invalid />
```

Shape: `h-10 w-full rounded-lg border border-input bg-transparent px-3 text-sm`
Focus: `focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50`
Dark: `dark:bg-input/30`
Invalid: `aria-invalid:border-destructive aria-invalid:ring-destructive/20`

---

### Select

```tsx
<Select>
  <SelectTrigger size="default | sm">
    <SelectValue placeholder="Choose…" />
  </SelectTrigger>
  <SelectContent>
    <SelectItem value="a">Option A</SelectItem>
  </SelectContent>
</Select>
```

Trigger: `h-8 rounded-lg border border-input text-sm`
Icon: `UnfoldMoreIcon` from HugeIcons

---

### Tabs

Two variants: `default` (pill/bg) and `line` (underline).

```tsx
<Tabs defaultValue="overview">
  <TabsList variant="default | line">
    <TabsTrigger value="overview">Overview</TabsTrigger>
    <TabsTrigger value="orders">Orders</TabsTrigger>
  </TabsList>
  <TabsContent value="overview">…</TabsContent>
</Tabs>
```

List: `h-8 rounded-lg p-[3px] bg-muted` (default) / `bg-transparent gap-1` (line)
Active trigger: `bg-background text-foreground shadow-sm` (default) / underline bar (line)

---

### Table

```tsx
<Table>
  <TableHeader>
    <TableRow>
      <TableHead>Name</TableHead>
    </TableRow>
  </TableHeader>
  <TableBody>
    <TableRow>
      <TableCell>Value</TableCell>
    </TableRow>
  </TableBody>
</Table>
```

- Row hover: `hover:bg-muted/50`
- Row selected: `data-[state=selected]:bg-muted`
- Header: `[&_tr]:border-b`
- Header cell: `h-10 text-left text-xs font-medium text-muted-foreground`
- Body cell: `p-3 align-middle`
- Wrapped in `overflow-x-auto` container

---

## Icon Usage

All icons from `@hugeicons/react` and `@hugeicons/core-free-icons`.

```tsx
import { HugeiconsIcon } from '@hugeicons/react'
import { SomeIcon } from '@hugeicons/core-free-icons'

<HugeiconsIcon icon={SomeIcon} size={16} strokeWidth={1.5} className="text-current" />
```

Common sizes: `12` (inline), `14` (small controls), `15–16` (nav/header), `18–20` (feature icons), `24` (large)
Default stroke: `2`, reduced to `1.5` for nav/ambient icons

---

## Feedback & State Patterns

### Toast (Sonner)

```tsx
import { toast } from 'sonner'

toast.success('Saved successfully')
toast.error('Something went wrong')
toast.loading('Processing…')
```

`<Toaster />` placed at root layout, outside providers.

### Spinner

```tsx
<Spinner size="sm | default | lg | xl" />
```

Sizes: `size-3` / `size-4` / `size-6` / `size-8`

### Loading page pattern

```tsx
<LoadingState message="Loading orders…" className="min-h-64" />
```

### Error / empty pattern

```tsx
<EmptyState
  title="No data found"
  description="Try adjusting your filters."
  icon={FilterIcon}
  action={<Button size="sm" variant="outline">Clear filters</Button>}
/>
```

---

## Spacing & Density

| Context | Padding |
|---|---|
| Main content area | `p-4 md:p-6` |
| Card default | `py-4 px-4` |
| Card sm | `py-3 px-3` |
| SurfacePanel | `p-5 md:p-6` |
| MetricCard | `p-5` |
| Dialog | `p-4` |
| Table cell | `p-3` |
| Header bar | `h-16 px-4` |

Gaps follow multiples of 4px (`gap-1` = 4px, `gap-2` = 8px, etc.).

---

## Theme & Dark Mode

`ThemeProvider` wraps the app and applies `.dark` class on `<html>`. Toggle via `ThemeSwitcher` component.

Background gradient on dashboard:
```css
radial-gradient(circle at top, hsl(var(--muted)) 0%, transparent 55%), hsl(var(--background))
```

The `SidebarInset` has a subtle `bg-background/95` and `border border-border/60` to visually separate it from the sidebar.

---

## Utility Patterns

### `cn()` helper

```ts
import { cn } from '@/lib/utils'
// clsx + tailwind-merge
cn('base-class', condition && 'conditional-class', className)
```

### `data-slot` pattern

All compound components set `data-slot="component-name"` for CSS parent-child targeting:
```css
has-data-[slot=card-footer]:pb-0
```

### `data-variant` / `data-size`

Set alongside `className` for non-CVA targeting and analytics:
```tsx
data-variant={variant}
data-size={size}
```

### Scroll

Scrollable regions use `.no-scrollbar`:
```css
.no-scrollbar { scrollbar-width: none; }
.no-scrollbar::-webkit-scrollbar { display: none; }
```

---

## Tour / Onboarding

Uses `driver.js`. Popover styles are scoped under `.driver-popover` and themed to match the app:
- `bg: var(--card)`, `border: var(--border)`, `border-radius: var(--radius-xl)`
- Next button uses `var(--primary)` background
- Font matches `var(--font-sans)`

Target elements use `data-tour="step-name"` attributes.

---

## Page Structure Template

A typical dashboard page follows this structure:

```tsx
export default function SomePage() {
  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Section"
        title="Page Title"
        description="Brief description."
        actions={<Button size="sm">Primary Action</Button>}
      />

      {/* KPI row */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <MetricCard label="Revenue" value="GHS 1,200" icon={MoneyIcon} />
        …
      </div>

      {/* Main content */}
      <SurfacePanel>
        <Tabs defaultValue="all">
          <div className="flex items-center justify-between gap-4 mb-4">
            <TabsList>
              <TabsTrigger value="all">All</TabsTrigger>
            </TabsList>
            <Input placeholder="Search…" className="w-48" />
          </div>
          <TabsContent value="all">
            <Table>…</Table>
          </TabsContent>
        </Tabs>
      </SurfacePanel>
    </div>
  )
}
```

---

## Modal Template

```tsx
'use client'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'

export function SomeModal({ open, onOpenChange }: { open: boolean; onOpenChange: (v: boolean) => void }) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Modal Title</DialogTitle>
          <DialogDescription>Supporting text here.</DialogDescription>
        </DialogHeader>

        {/* form fields */}

        <DialogFooter showCloseButton>
          <Button onClick={handleSubmit}>Confirm</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
```

---

## Key `globals.css` Imports

```css
@import "tailwindcss";
@import "tw-animate-css";
@import "shadcn/tailwind.css";
@import "driver.js/dist/driver.css";

@custom-variant dark (&:is(.dark *));
```

Base layer resets:
```css
* { @apply border-border outline-ring/50; }
html { scroll-behavior: smooth; }
body { @apply bg-background text-foreground; }
```
