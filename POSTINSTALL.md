# Post-Install

4. Update Service Account Permissions

   - Navigate to your project's [Cloud Functions Directory](https://console.cloud.google.com/projectselector2/functions/).
   - Click on the newly created extension function (ext-firebase-killswitch-monitorBilling) and navigate to the **Details** tab.
   - Under **General Information**, you should see a Service Account field (an email address). Copy the email value.
   - Return to [Google Cloud Billing](https://console.cloud.google.com/billing), reselect the appropriate billing account, then navigate to the **Account management** tab on the left sidebar.
   - Click the **Add Principal** button, and paste the service account email address into the New Principals input field.
   - Under Assign Roles, select the **Billing Account Administrator** from the dropdown and save the new principal.

5. Ready for testing/deployment!

   If you've followed the steps above, you should be fully set up. If you want to test that the extension works:

   - Locate your [Pub/Sub Topic](https://console.cloud.google.com/cloudpubsub/), then navigate to the **Messages** panel.
   - Click the **Publish Message** button, and paste the following into the **Message body** field:

   ```json
   {
     "budgetDisplayName": "name-of-budget",
     "alertThresholdExceeded": 1.0,
     "costAmount": 100.01,
     "costIntervalStart": "2019-01-01T00:00:00Z",
     "budgetAmount": 100.0,
     "budgetAmountType": "SPECIFIED_AMOUNT",
     "currencyCode": "USD"
   }
   ```

   - After sending the message, your billing account should be removed from your project shortly. You will likely receive an email informing you your project has been downgraded to the Spark Plan.
