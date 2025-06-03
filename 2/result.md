{
"Title": "Logout Button Unresponsive on Safari Browser",
"Description": "The logout functionality is currently not working when accessed via the Safari browser. Users report that clicking the logout button elicits no response, and they remain logged into their session.",
"Steps to Reproduce": "1. Launch the application using the Safari web browser.\n2. Authenticate and log in to an active user account.\n3. Navigate to and click the designated 'Logout' button.",
"Expected vs Actual Behavior": "**Expected Behavior:**\nUpon clicking the 'Logout' button, the user's session should be terminated, and they should be redirected to the login screen or the application's home page (as per defined logout flow).\n\n**Actual Behavior:**\nClicking the 'Logout' button has no effect. The button appears to be unresponsive. The user remains logged in, and the current page does not change or indicate any action has been taken.",
"Environment (if known)": "- Browser: Safari (Specific version not confirmed by reporter, observed on Safari generally)\n- Operating System: Any OS running Safari (e.g., macOS, iOS)\n- Potentially relevant: The issue description implies no visual feedback or errors. Further investigation should check browser console logs and network requests on Safari during the logout attempt.",
"Severity or Impact": "High. This bug prevents users from securely logging out of their accounts, which is a critical security function, especially on shared or public devices. It negatively impacts user trust and core application usability."
}
