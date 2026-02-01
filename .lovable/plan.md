
# Change: Education Year to Current Academic Level

## Overview

Replace the "Graduation Year" field with a "Current Level" dropdown that better represents where a student currently stands in their academic journey. This is more relevant for a campus-focused platform like CampusGigs.

---

## What Changes

### Before
- Free-form number input for "Graduation Year" (e.g., 2024, 2025)
- Displayed as "Class of 2024" on public profile

### After
- Dropdown selection for "Current Level"
- Options: 100 Level, 200 Level, 300 Level, 400 Level, 500 Level, Graduate, Alumni
- Displayed as "100 Level" or "Graduate" on public profile

---

## Changes Required

### 1. Add Level Options to Constants
Add a new constant array in `src/lib/skills-constants.ts`:

```typescript
export const STUDENT_LEVEL_OPTIONS = [
  '100 Level',
  '200 Level', 
  '300 Level',
  '400 Level',
  '500 Level',
  '600 Level',
  'Graduate Student',
  'Alumni',
] as const;
```

### 2. Update Profile Edit Page
In `src/pages/Profile.tsx`:
- Change the "Graduation Year" label to "Current Level"
- Replace the number input with a Select dropdown
- Use the new `STUDENT_LEVEL_OPTIONS` for choices

### 3. Update Database Field Usage
The existing `education_year` column (INTEGER) will now store a level code:
- Keep as INTEGER for simplicity (100, 200, 300, 400, 500, 600, 0 for Graduate, -1 for Alumni)
- Or change to store as TEXT (the full level string like "300 Level")

**Recommended**: Store as TEXT for clarity and easier display

### 4. Update Education Display Component
In `src/components/profile/EducationSection.tsx`:
- Change "Class of {year}" to just display the level directly (e.g., "300 Level")

### 5. Update Type Definitions
In `src/lib/profile-types.ts`:
- Change `education_year: number | null` to `education_level: string | null`
- This is a naming change for clarity

---

## Files to Modify

| File | Changes |
|------|--------|
| `src/lib/skills-constants.ts` | Add `STUDENT_LEVEL_OPTIONS` array |
| `src/pages/Profile.tsx` | Replace year input with level dropdown |
| `src/components/profile/EducationSection.tsx` | Update display from "Class of X" to show level |
| `src/lib/profile-types.ts` | Rename `education_year` to `education_level` (optional) |
| `src/hooks/useUpdateProfile.ts` | Support the new field format |
| `src/pages/FreelancerProfile.tsx` | Pass updated prop name if changed |

---

## Database Consideration

Two options:

**Option A: Reuse existing `education_year` column**
- Store level as text (e.g., "300 Level") directly
- The column is INTEGER but we can create a new TEXT column or alter it
- Simpler: just store the display value

**Option B: Create migration to rename column**
- Rename `education_year` to `education_level`
- Change type from INTEGER to TEXT
- More semantic but requires migration

**Recommended**: Option A - reuse existing column with string values. The column name in the database doesn't need to change since the UI abstracts it anyway.

---

## Updated UI Preview

### Profile Edit Page (Skills Tab)

```text
Education
─────────────────────────────
Program of Study
[Computer Science        ]

Institution  
[University of Lagos     ]

Current Level
[▼ 300 Level            ]
   ├─ 100 Level
   ├─ 200 Level
   ├─ 300 Level  ✓
   ├─ 400 Level
   ├─ 500 Level
   ├─ 600 Level
   ├─ Graduate Student
   └─ Alumni
```

### Public Profile Display

```text
📚 Education & Certifications
─────────────────────────────
🎓 Computer Science
   University of Lagos
   300 Level
```

---

## Notes

- Keeps backward compatibility - existing profiles with year values will still display (can show "Class of X" if a 4-digit year is detected)
- The dropdown makes data entry faster and more consistent
- Nigerian universities typically have 100-600 level system depending on the program
- "Graduate Student" covers Masters/PhD students
- "Alumni" covers graduated users still offering services
