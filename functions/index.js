const { CloudBillingClient } = require('@google-cloud/billing');
const { InstancesClient } = require('@google-cloud/compute');
const p = require('proxyquire');

const PROJECT_ID = process.env.PROJECT_ID;
const PROJECT_NAME = `projects/${PROJECT_ID}`;
const billing = new CloudBillingClient();

exports.monitorBilling = async pubsubEvent => {
  const pubsubData = JSON.parse(
    Buffer.from(pubsubEvent.data, 'base64').toString()
  );
  if (pubsubData.costAmount <= pubsubData.budgetAmount) {
    console.log(`No action necessary. ${pubsubData.costAmount / pubsubData.budgetAmount * 100}% of the budget has been used.`)
    return `No action necessary. (Current cost: ${pubsubData.costAmount})`;
  }

  if (!PROJECT_ID) {
    return 'No project specified';
  }

  const billingEnabled = await _isBillingEnabled(PROJECT_NAME);
  if (billingEnabled) {
    console.log(`Disabling billing. $${pubsubData.costAmount - pubsubData.budgetAmount} over $${pubsubData.budgetAmount} budget.`);
    return _disableBillingForProject(PROJECT_NAME);
  } else {
    return 'Billing already disabled';
  }
};

const _isBillingEnabled = async projectName => {
  try {
    const [res] = await billing.getProjectBillingInfo({ name: projectName });
    return res.billingEnabled;
  } catch (e) {
    return true;
  }
};

const _disableBillingForProject = async projectName => {
  const [res] = await billing.updateProjectBillingInfo({
    name: projectName,
    resource: { billingAccountName: '' }, // Disable billing
  });
  return `Billing disabled: ${JSON.stringify(res)}`;
};