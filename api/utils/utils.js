const base64 = require("base-64");

function decodeCredentials(auth_header) {
  const encodedToken = auth_header.split(" ")[1];
  const decodedCredentials = base64.decode(encodedToken).split(":");
  const decodedUsername = decodedCredentials[0];
  const decodedPassword = decodedCredentials[1];
  return {
    decodedUsername,
    decodedPassword,
  };
}

module.exports = {
  decodeCredentials,
};
