const constants = require('../constants.js').constants;

/**
 * Sends a POST request to a specified URL with the provided body data.
 *
 * @param {Object} options - The options for the request.
 * @param {Object} options.bodyData - The data to be sent as the body of the POST request.
 * @param {boolean} [options.logOnSuccess=false] - If true, the response will be logged to the console if the request is successful.
 * @param {boolean} [options.returnResponse=false] - If true, the response will be returned by the function if the request is successful.
 * @returns {Promise<Object|null>} The response from the server if the request is successful and returnResponse is true, or null otherwise.
 */
async function sendPostRequestAsync({
    bodyData,
    API_KEY,
    logOnSuccess = false,
    returnResponse = false
}) {
    let headersEnv = {
        'XXX-API-KEY': API_KEY
    };

    const res = await fetch(constants.DQL_URL, {
        method: 'POST',
        headers: headersEnv,
        body: JSON.stringify(bodyData)
    });

    if (res.ok) {
        if (logOnSuccess) {
            console.log(await res.json());
        }
        if (returnResponse) {
            return await res.json();
        }
    } else {
        console.log(res.statusText);
        console.error("Failed to send request, response status: " + res.status);
    }
    return null;
}

module.exports = {
    sendPostRequestAsync
}