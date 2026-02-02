

# Fix: Portfolio Dialog Cut Off / Positioned to the Side

## Problem Confirmed

The "Add Portfolio Item" dialog is being rendered off to the right side of the viewport on both desktop and mobile. Looking at the current `dialog.tsx` file, the width constraint fix was NOT applied - it still shows `w-full max-w-lg` without the viewport margin constraint.

## Root Cause

The `DialogContent` component uses:
```tsx
"fixed left-[50%] top-[50%] z-50 grid w-full max-w-lg translate-x-[-50%] translate-y-[-50%]..."
```

With `w-full`, on smaller viewports or certain scroll states, the dialog can extend past the viewport edge because there's no explicit margin to keep it bounded.

## Solution

Update the width class from `w-full` to `w-[calc(100%-2rem)]` which:
- Subtracts 32px (16px on each side) from the full width
- Ensures the dialog never touches the viewport edges
- Still respects `max-w-lg` (512px) on larger screens

## File to Change

**`src/components/ui/dialog.tsx` - Line 39**

### Current Code:
```tsx
"fixed left-[50%] top-[50%] z-50 grid w-full max-w-lg translate-x-[-50%] translate-y-[-50%] gap-4 border bg-background p-6 shadow-lg..."
```

### Updated Code:
```tsx
"fixed left-[50%] top-[50%] z-50 grid w-[calc(100%-2rem)] max-w-lg translate-x-[-50%] translate-y-[-50%] gap-4 border bg-background p-6 shadow-lg..."
```

## Technical Details

| Property | Before | After |
|----------|--------|-------|
| Width | `w-full` (100% viewport) | `w-[calc(100%-2rem)]` (100% minus 32px) |
| Max Width | `max-w-lg` (512px) | `max-w-lg` (512px) - unchanged |
| Centering | `left-[50%] translate-x-[-50%]` | Same - unchanged |

## Impact

- All dialogs in the application will now have proper margins on mobile and desktop
- The dialog will always stay within the visible viewport
- No functional changes - purely a visual positioning fix

