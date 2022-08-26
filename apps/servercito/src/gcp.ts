// [START functions_start_instance_pubsub]
// [START functions_stop_instance_pubsub]
import compute from "@google-cloud/compute";

const options = {
  keyFilename: './my_credentials.json',
};

const instancesClient = new compute.InstancesClient(options);
const operationsClient = new compute.ZoneOperationsClient(options);

async function waitForOperation(projectId, operation) {
  while (operation.status !== 'DONE') {
    [operation] = await operationsClient.wait({
      operation: operation.name,
      project: projectId,
      zone: operation.zone.split('/').pop(),
    });
    console.log(`operation type: ${operation.operationType}`)
    console.log(`operation startTime: ${operation.startTime}`)
    console.log(`operation endTime: ${operation.endTime}`)
  }
}

// [END functions_stop_instance_pubsub]

/**
 * Starts Compute Engine instances.
 *
 * Expects a PubSub message with JSON-formatted event data containing the
 * following attributes:
 *  zone - the GCP zone the instances are located in.
 *  label - the label of instances to start.
 *
 * @param {!object} event Cloud Function PubSub message event.
 * @param {!object} callback Cloud Function PubSub callback indicating
 *  completion.
 */
 export const startInstancePubSub = async (event, callback) => {
  try {
    const project = await instancesClient.getProjectId();
    const payload = _validatePayload(event);
    const options = {
      filter: `labels.${payload.label}`,
      project,
      zone: payload.zone,
    };

    const [instances] = await instancesClient.list(options);
    await Promise.all(
      instances.map(async instance => {
        const [response] = await instancesClient.start({
          project,
          zone: payload.zone,
          instance: instance.name,
        });

        return waitForOperation(project, response.latestResponse);
      })
    );

    // Operation complete. Instance successfully started.
    const message = 'Successfully started instance(s)';
    console.log(message);
    callback(null, message);
  } catch (err) {
    console.log(err);
    callback(err);
  }
};
// [END functions_start_instance_pubsub]
// [START functions_stop_instance_pubsub]

/**
 * Stops Compute Engine instances.
 *
 * Expects a PubSub message with JSON-formatted event data containing the
 * following attributes:
 *  zone - the GCP zone the instances are located in.
 *  label - the label of instances to stop.
 *
 * @param {!object} event Cloud Function PubSub message event.
 * @param {!object} callback Cloud Function PubSub callback indicating completion.
 */
export const stopInstancePubSub = async (event, callback) => {
  try {
    const project = await instancesClient.getProjectId();
    const payload = _validatePayload(event);
    const options = {
      filter: `labels.${payload.label}`,
      project,
      zone: payload.zone,
    };

    const [instances] = await instancesClient.list(options);

    await Promise.all(
      instances.map(async instance => {
        const [response] = await instancesClient.stop({
          project,
          zone: payload.zone,
          instance: instance.name,
        });

        return waitForOperation(project, response.latestResponse);
      })
    );

    // Operation complete. Instance successfully stopped.
    const message = 'Successfully stopped instance(s)';
    console.log(message);
    callback(null, message);
  } catch (err) {
    console.log(err);
    callback(err);
  }
};
// [START functions_start_instance_pubsub]

/**
 * Validates that a request payload contains the expected fields.
 *
 * @param {!object} payload the request payload to validate.
 * @return {!object} the payload object.
 */
const _validatePayload = event => {
  let payload;
  try {
    payload = JSON.parse(Buffer.from(event.data, 'base64').toString());
  } catch (err) {
    throw new Error('Invalid Pub/Sub message: ' + err);
  }
  if (!payload.zone) {
    throw new Error("Attribute 'zone' missing from payload");
  } else if (!payload.label) {
    throw new Error("Attribute 'label' missing from payload");
  }
  return payload;
};
// [END functions_start_instance_pubsub]
// [END functions_stop_instance_pubsub]
