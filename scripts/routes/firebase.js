var admin = require("firebase-admin");

// Fetch the service account key JSON file contents
var serviceAccount = require("../serviceAccountKey.json");

// Initialize the app with a custom auth variable, limiting the server's access
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://imobsters-8ede2.firebaseio.com",
//   databaseAuthVariableOverride: {
//     uid: "my-service-worker"
//   }
});

// The app only has access as defined in the Security Rules
var db = admin.database();
module.exports.db = db;
