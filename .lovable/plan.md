
# Email Verification & Password Reset Implementation Plan

## Overview

This plan adds two security features to CampusGigs:
1. **Email Verification Requirement** - Users must verify their email before accessing protected pages (Dashboard, Profile, Create Gig)
2. **Forgot Password Flow** - Users can reset their password via email

---

## Feature 1: Email Verification Requirement

### How It Works
When users sign up with email/password, they'll receive a verification email. Until they click the link, they'll see an "Email Verification Required" page instead of the Dashboard.

### Changes Required

**1. Create Email Verification Page**
- New page: `src/pages/VerifyEmail.tsx`
- Shows a friendly message explaining that verification is needed
- Includes a "Resend verification email" button
- Displays the email address where the verification was sent

**2. Update Authentication Hook**
- Add `isEmailVerified` helper to check `user.email_confirmed_at`
- Add `resendVerificationEmail` function using Supabase's `resend` method

**3. Update Protected Routes**
- Modify Dashboard, Profile, and CreateGig pages to check email verification status
- Redirect unverified users to the verification page

**4. Handle Post-Verification Redirect**
- When users click the verification link in their email, they land back on the app
- Detect the `email_verified` event and show a success message

---

## Feature 2: Forgot Password Flow

### How It Works
1. User clicks "Forgot password?" on the login page
2. User enters their email on a dedicated reset page
3. Backend sends a password reset email with a secure link
4. User clicks link, lands on a "Set New Password" page
5. User enters new password and gains access

### Changes Required

**1. Create Forgot Password Page**
- New page: `src/pages/ForgotPassword.tsx`
- Simple form with email input
- Uses Supabase's built-in `resetPasswordForEmail` method
- Shows confirmation message after sending

**2. Create Reset Password Page**
- New page: `src/pages/ResetPassword.tsx`
- Captures token from URL
- Two password fields (new password + confirm)
- Uses Supabase's `updateUser` to set new password

**3. Update Login Page**
- Add "Forgot password?" link below the password field
- Link navigates to `/forgot-password`

**4. Update Authentication Hook**
- Add `resetPassword(email)` function
- Add `updatePassword(newPassword)` function

**5. Add Routes**
- `/forgot-password` → ForgotPassword page
- `/reset-password` → ResetPassword page
- `/verify-email` → VerifyEmail page

---

## Technical Details

### Files to Create
| File | Purpose |
|------|---------|
| `src/pages/VerifyEmail.tsx` | Email verification required page |
| `src/pages/ForgotPassword.tsx` | Request password reset form |
| `src/pages/ResetPassword.tsx` | Set new password form |

### Files to Modify
| File | Changes |
|------|---------|
| `src/hooks/useAuth.tsx` | Add `isEmailVerified`, `resendVerificationEmail`, `resetPassword`, `updatePassword` |
| `src/pages/Dashboard.tsx` | Add email verification check |
| `src/pages/Profile.tsx` | Add email verification check |
| `src/pages/CreateGig.tsx` | Add email verification check |
| `src/pages/Login.tsx` | Add "Forgot password?" link |
| `src/App.tsx` | Add new routes |

### Authentication Methods (Supabase)

```text
Password Reset Flow:
┌─────────────┐    ┌──────────────────┐    ┌────────────────┐
│ Forgot      │───▶│ resetPassword    │───▶│ Email with     │
│ Password    │    │ ForEmail()       │    │ magic link     │
└─────────────┘    └──────────────────┘    └────────────────┘
                                                   │
                                                   ▼
┌─────────────┐    ┌──────────────────┐    ┌────────────────┐
│ Dashboard   │◀───│ updateUser()     │◀───│ Reset Password │
│ Access      │    │ {password: new}  │    │ Page           │
└─────────────┘    └──────────────────┘    └────────────────┘
```

### Email Verification Check Logic

```text
User tries to access protected page
           │
           ▼
    Is user logged in?
     │           │
    No          Yes
     │           │
     ▼           ▼
  Redirect    Is email verified?
  to Login     │           │
              No          Yes
               │           │
               ▼           ▼
          Redirect      Show
          to Verify     Page
          Email
```

---

## User Experience

### Sign Up Flow (After Implementation)
1. User fills out signup form
2. Account is created, user sees "Check your email to verify" message
3. User clicks link in email
4. User is redirected to Dashboard with success toast

### Password Reset Flow
1. User clicks "Forgot password?" on login page
2. User enters email, clicks "Send Reset Link"
3. User receives email with secure link
4. User clicks link, enters new password
5. User is logged in and redirected to Dashboard

---

## Notes

- OAuth users (Google/Apple) automatically have verified emails
- The verification and reset emails use Supabase's built-in email templates
- No edge function or external email service (like Resend) is needed since we're using Supabase's native auth email features
