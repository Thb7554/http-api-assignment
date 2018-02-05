// function to send a json object
const respondJSON = (request, response, status, object, acceptedTypes) => {
  let type;
  if (!acceptedTypes || !acceptedTypes[0]) {
    type = 'application/json';
  } else {
    const someIndex = 0;
    type = acceptedTypes[someIndex];
  }
  // set status code and content type (application/json)
  response.writeHead(status, { 'Content-Type': type });
  // stringify the object (so it doesn't use references/pointers/etc)
  // but is instead a flat string object.
  // Then write it to the response.

  if (type === 'text/xml') {
    let responseXML = '<response>';

    if (object.message) {
      responseXML = `${responseXML} <message>${object.message}</message>`;
    }
    if (object.id) {
      responseXML = `${responseXML} <id>${object.id}</id>`;
    }
    responseXML = `${responseXML} </response>`;
    response.write(responseXML);
    response.end();
    return;
  }

  response.write(JSON.stringify(object));
  // Send the response to the client
  response.end();
};

// function to show a success status code
const success = (request, response, params, acceptedTypes) => {
  // message to send
  const responseJSON = {
    message: 'This is a successful response',
  };

  // send our json with a success status code
  respondJSON(request, response, 200, responseJSON, acceptedTypes);
};

// function to show a bad request without the correct parameters
const badRequest = (request, response, params, acceptedTypes) => {
  // message to send
  const responseJSON = {
    message: 'This request has the required parameters',
  };

  // if the request does not contain a valid=true query parameter
  if (!params.valid || params.valid !== 'true') {
    // set our error message
    responseJSON.message = 'Missing valid query parameter set to true';
    // give the error a consistent id
    responseJSON.id = 'badRequest';
    // return our json with a 400 bad request code
    return respondJSON(request, response, 400, responseJSON, acceptedTypes);
  }

  // if the parameter is here, send json with a success status code
  return respondJSON(request, response, 200, responseJSON, acceptedTypes);
};

const unauthorized = (request, response, params, acceptedTypes) => {
  // message to send
  const responseJSON = {
    message: 'This request has the required authorization',
  };

  // if the request does not contain a loggedIn=yes query parameter
  if (!params.loggedIn || params.loggedIn !== 'yes') {
    // set our error message
    responseJSON.message = 'Missing loggedIn query parameter set to yes';
    // give the error a consistent id
    responseJSON.id = 'unauthorized';
    // return our json with a 401 bad request code
    return respondJSON(request, response, 401, responseJSON, acceptedTypes);
  }

  // if the parameter is here, send json with a success status code
  return respondJSON(request, response, 200, responseJSON, acceptedTypes);
};

const forbidden = (request, response, params, acceptedTypes) => {
  // message to send
  const responseJSON = {
    message: 'This request has the required authorization',
  };

  // if the request does not contain a valid=true query parameter
  if (!params.valid || params.valid !== 'true') {
    // set our error message
    responseJSON.message = 'You do not have access to this content.';
    // give the error a consistent id
    responseJSON.id = 'forbidden';
    // return our json with a 401 bad request code
    return respondJSON(request, response, 403, responseJSON, acceptedTypes);
  }

  // if the parameter is here, send json with a success status code
  return respondJSON(request, response, 200, responseJSON, acceptedTypes);
};

const internal = (request, response, params, acceptedTypes) => {
  // message to send
  const responseJSON = {
    message: 'Internal Server Error. Something went wrong.',
    id: 'forbidden',
  };
  return respondJSON(request, response, 500, responseJSON, acceptedTypes);
};

const notImplemented = (request, response, params, acceptedTypes) => {
  // message to send
  const responseJSON = {
    message: 'A get request for this page has not been implement yet. Check again later for updated content.',
    id: 'notImplemented',
  };
  return respondJSON(request, response, 501, responseJSON, acceptedTypes);
};

// function to show not found error
const notFound = (request, response, params, acceptedTypes) => {
  // error message with a description and consistent error id
  const responseJSON = {
    message: 'The page you are looking for was not found.',
    id: 'notFound',
  };

  // return our json with a 404 not found error code
  respondJSON(request, response, 404, responseJSON, acceptedTypes);
};

// exports to set functions to public.
// In this syntax, you can do getIndex:getIndex, but if they
// are the same name, you can short handle to just getIndex,
module.exports = {
  success,
  badRequest,
  unauthorized,
  forbidden,
  internal,
  notImplemented,
  notFound,
};
