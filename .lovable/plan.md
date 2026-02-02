

# Fix: Portfolio Dialog Select Dropdown Not Clickable

## Problem Identified

The "Add Work" dialog's file type dropdown (Image/PDF/External Link) is visible but **not clickable** due to a `pointer-events` conflict between Radix UI's Dialog and Select components.

### Root Cause

When a Radix UI Dialog is open, it:
1. Sets `pointer-events: none` on the `<body>` to prevent background interactions
2. Creates a focus trap within the modal

The Select component portals its dropdown to the document root (outside the Dialog's DOM tree). Because of this, clicks on the dropdown items are blocked by the `pointer-events: none` inherited from the body, or intercepted by the Dialog's overlay.

This is a **known Radix UI issue** documented in their GitHub issues (#3404).

---

## Solution

Add `pointer-events-auto` to the `SelectContent` component to explicitly re-enable click interactions, regardless of any inherited `pointer-events: none` from parent elements.

Additionally, add `onInteractOutside` handler to the DialogContent to prevent the dialog from closing when interacting with portaled select dropdowns.

---

## Changes Required

### File 1: `src/components/ui/select.tsx`

Add `pointer-events-auto` class to SelectContent (line 69):

| Current | Updated |
|---------|---------|
| `"relative z-[200] max-h-96..."` | `"pointer-events-auto relative z-[200] max-h-96..."` |

### File 2: `src/components/profile/PortfolioSection.tsx`

Add `onInteractOutside` handler to prevent dialog closing when clicking Select dropdown:

```tsx
<DialogContent 
  onInteractOutside={(e) => {
    // Prevent dialog from closing when interacting with portaled select
    const target = e.target as HTMLElement;
    if (target.closest('[data-radix-select-content]')) {
      e.preventDefault();
    }
  }}
>
```

---

## Why These Fixes Work

1. **`pointer-events-auto`**: Forces the Select dropdown to accept pointer events even when the body has `pointer-events: none` set by the Dialog's modal behavior.

2. **`onInteractOutside` handler**: Prevents the Dialog from treating clicks on the portaled Select dropdown as "outside" clicks that should close the dialog.

---

## Impact

- Fixes the Select dropdown in the "Add Work" portfolio dialog
- Also fixes any other Select/Popover components used inside Dialogs throughout the app
- No visual changes - purely a behavioral fix

---

## Files Summary

| File | Change |
|------|--------|
| `src/components/ui/select.tsx` | Add `pointer-events-auto` to SelectContent |
| `src/components/profile/PortfolioSection.tsx` | Add `onInteractOutside` handler to DialogContent |

