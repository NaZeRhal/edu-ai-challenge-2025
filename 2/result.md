## Title

Logout Button Unresponsive on Safari Browser

## Description

The logout button functionality is not working as expected when using the Safari browser. Clicking the logout button does not initiate the logout process, and the user remains logged in.

## Steps to Reproduce

1. Log in to the application using the Safari browser.
2. Navigate to any page where the logout button is visible.
3. Click on the logout button.

## Expected vs Actual Behavior

**Expected Behavior:**
Upon clicking the logout button, the user should be logged out of the application and redirected to the login page or homepage, as per the defined logout behavior.

**Actual Behavior:**
Upon clicking the logout button on Safari, there is no response or action. The user remains logged in to their current session.

## Environment (if known)

**Browser:** Safari (specific version if known, otherwise state "all versions" or "latest version")
**Operating System:** (e.g., macOS, iOS - if known)

## Severity or Impact

**Severity:** High/Critical (This depends on the application's nature. If security or user privacy is a major concern, it's high/critical. If it's a minor inconvenience with workarounds, it could be medium.)

**Impact:** Prevents users on Safari from securely logging out of their accounts, potentially leading to unauthorized access if the session is not otherwise terminated (e.g., browser closure, timeout). Users may be unable to switch accounts easily.
