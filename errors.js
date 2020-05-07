
// ERROR CODE DEFINITIONS

const errors = {
  GENERIC_ERROR: "GENERIC_ERROR",

  // Thrown when an endpoint requires a field but is not provided in the request.
  MISSING_FIELD: "MISSING_FIELD",
  // Thrown when a value is provided but is in an invalid type or format.
  INVALID_VALUE: "INVALID_VALUE",

  // Thrown when a protected endpoint receives a request without a valid session.
  UNAUTHORIZED: "UNAUTHORIZED",
  // Thrown when a banned user attempts to log in.
  FORBIDDEN: "FORBIDDEN",

  // Thrown when the resource to be operated upon or searched is not present.
  NOT_FOUND: "NOT_FOUND",

  create: function(type, message, details) {
    if (details)  return { type: type || this.GENERIC_ERROR, message: message || "No message provided", details: details };
    else          return { type: type || this.GENERIC_ERROR, message: message || "No message provided" };
  },
  generic: function(message, details) {
    return this.create(this.GENERIC_ERROR, message, details);
  },
  missingField: function(field, message, details) {
    if (!details) details = {};
    details.field = field;
    
    return this.create(this.MISSING_FIELD, message, details);
  },
  invalidValue: function(field, message, details) {
    if (!details) details = {};
    details.field = field;
    
    return this.create(this.INVALID_VALUE, message, details);
  },
  unauthorized: function(message, details) {
    return this.create(this.UNAUTHORIZED, message || "Not logged in.", details);
  },
  forbidden: function(message, details) {
    return this.create(this.FORBIDDEN, message || "User is banned.", details);
  },
  notFound: function(message, details) {
    return this.create(this.NOT_FOUND, message || "Resource not found.", details);
  }
};

module.exports = errors;
