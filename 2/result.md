## Title

Logout Button Unresponsive on Safari 17.4.1 (macOS Sonoma) - Dashboard

## Description

The logout button located in the user profile dropdown menu on the Dashboard is unresponsive when using Safari 17.4.1 on macOS Sonoma 14.4.1. Clicking the logout button does not terminate the user session.

## Steps to Reproduce

1. Open Safari browser (version 17.4.1) on macOS Sonoma (version 14.4.1).
2. Navigate to the Dashboard login page (e.g., `https://testsite.com/login`).
3. Successfully log in with valid user credentials.
4. Once on the main dashboard, click on the user profile avatar or name, typically located in the top-right corner of the main navigation bar, to open the profile dropdown menu.
5. Click on the "Logout" button within the dropdown menu.

## Expected vs Actual Behavior

**Expected Behavior:**
Upon clicking the "Logout" button, the user's session should be terminated. The user should be redirected to the login page (`https://testsite.com/login`) or the application's designated logged-out landing page, and all session cookies related to authentication should be cleared.

**Actual Behavior:**
Upon clicking the "Logout" button in Safari 17.4.1, there is no visible response or change in the application state. The user remains logged in, and the current page does not change. No network requests related to logout are initiated (verified via browser developer tools, if applicable).

## Environment

**Application:** Dashboard
**URL:** `https://testsite.com` (specifically the logout functionality accessed via the user profile dropdown)
**Browser:** Safari Version 17.4.1
**Operating System:** macOS Sonoma 14.4.1
**User Role (if relevant):** Tested with standard user role.

## Severity or Impact

**Severity:** High

**Impact:**
This bug poses a significant security risk, especially if users are accessing the Dashboard on shared or public computers. Failure to logout means user sessions can remain active, potentially exposing sensitive account information and functionalities to unauthorized individuals. It also degrades the user experience as users cannot securely end their sessions or switch between different accounts easily on the Safari browser. This issue could lead to a breach of user data privacy and a loss of trust in the application's security.
