const MESSAGES = Object.freeze({
  200: "Success",
  204: "",
  201: "Success. User Authenticated",
  400: "Bad Request. Invalid Inputs",
  VALIDATION_ERROR: "Validation Error. Input Violation",
  RESTRICTED_INPUTS: "Bad Request. Cannot update the given inputs",
  401: "Unauthorized Request",
  403: "Forbidden",
  404: "Not Found",
});

module.exports = MESSAGES;
