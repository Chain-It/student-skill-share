

# Fix: Textarea Placeholder Text Truncation in Portfolio Dialog

## Problem

In the "Add Portfolio Item" dialog, the description textarea placeholder text "Brief description of the work..." is being truncated with an ellipsis ("Brief description of the v...") on mobile and narrow desktop views.

## Root Cause

The default browser behavior for `<textarea>` placeholder text is to display it on a single line. When the textarea width is constrained (due to the modal width on smaller screens), the placeholder text gets truncated with an ellipsis instead of wrapping to multiple lines.

This is a CSS limitation - textarea placeholders don't naturally wrap like regular text content does.

## Solution

There are two approaches to fix this:

### Option A: Shorten the Placeholder Text (Recommended)
Change the placeholder to a shorter, more concise message that fits on narrow screens:
- **Current**: "Brief description of the work..."
- **Updated**: "Describe your work..."

This is cleaner and provides the same guidance without truncation issues.

### Option B: CSS Fix for Placeholder Wrapping
Add `whitespace-pre-wrap` and `word-break` CSS properties to allow placeholder text to wrap. However, browser support for placeholder text wrapping is inconsistent.

## Recommended Change

**File: `src/components/profile/PortfolioSection.tsx` - Line 136**

| Current | Updated |
|---------|---------|
| `placeholder="Brief description of the work..."` | `placeholder="Describe your work..."` |

## Why This Works

- "Describe your work..." is 18 characters vs 31 characters
- Fits comfortably within the narrowest mobile modal width
- Maintains clear guidance for the user
- No CSS hacks or browser compatibility concerns

## Impact

- Portfolio modal description field will display the full placeholder text on all screen sizes
- No functional changes - purely a UX improvement
- Single line change in one file

