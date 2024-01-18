# Firebase Kill Switch

This extension acts as a safeguard against unexpected bills by removing your billing account from the associated project when you exceed that project's budget. Some manual configuration is needed in order for the extension to work.

# Pre-Install

1. Create a [new Pub/Sub Topic](https://console.cloud.google.com/cloudpubsub/) and make note of the name you give it.

2. Set up budget alerts.

   - Visit [Google Cloud Billing](https://console.cloud.google.com/billing) and select the billing account for the corresponding project.
   - Navigate to the **Budgets And Alerts** page on the left sidebar, then select the project you are installing the extension on.
   - Configure budget name and amount, if you haven't already.
   - Select the **Connect a Pub/Sub topic to this budget** checkbox at the bottom of the page and locate the Pub/Sub topic you created earlier (you may have to select your project again using the **Select Project** button)
   - Before saving, make note of your project name (this should be visible in the newly selected Pub/Sub Topic as projects/PROJECT_NAME/topics/TOPIC_NAME).

# Install

3. Install this extension.

   - To install this extension, clone this repo locally.
   - Navigate to the project you want to install the extension on.
   - If you haven't already, run `firebase init` to initialize your extensions codebase.
   - Run `firebase ext:install /path/to/your/clone/of/this/repo`
     - When prompted for your Topic Name and Project Name, enter the values you made note of earlier. Be sure you are entering the proper values, otherwise this extension will not work.
   - Once completed, deploy to your project by running `firebase deploy --only extensions`.
   - Once deployment is complete, follow the postinstall instructions (listed below).

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

<!-- We recommend keeping the following section to explain how billing for Firebase Extensions works -->

# Billing

This extension uses other Firebase or Google Cloud Platform services which may have associated charges:

<!-- List all products the extension interacts with -->

- Cloud Functions

When you use Firebase Extensions, you're only charged for the underlying resources that you use. A paid-tier billing plan is only required if the extension uses a service that requires a paid-tier plan, for example calling to a Google Cloud Platform API or making outbound network requests to non-Google services. All Firebase services offer a free tier of usage. [Learn more about Firebase billing.](https://firebase.google.com/pricing)
