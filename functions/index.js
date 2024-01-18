const { CloudBillingClient } = require('@google-cloud/billing');
const { InstancesClient } = require('@google-cloud/compute');

const PROJECT_ID = process.env.PROJECT_ID;
const PROJECT_NAME = `projects/${PROJECT_ID}`;
const billing = new CloudBillingClient();

exports.monitorBilling = async pubsubEvent => {
  console.log('PubSub event:', pubsubEvent);
  const pubsubData = JSON.parse(
    Buffer.from(pubsubEvent.data, 'base64').toString()
  );
  if (pubsubData.costAmount <= pubsubData.budgetAmount) {
    console.log("cost amount is literally less than budget amount omg")
    return `No action necessary. (Current cost: ${pubsubData.costAmount})`;
  }

  if (!PROJECT_ID) {
    return 'No project specified';
  }

  const billingEnabled = await _isBillingEnabled(PROJECT_NAME);
  if (billingEnabled) {
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
    console.log(
      'Unable to determine if billing is enabled on specified project, assuming billing is enabled'
    );
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