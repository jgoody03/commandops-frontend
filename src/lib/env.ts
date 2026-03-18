const requiredEnv = {
  VITE_FIREBASE_API_KEY: import.meta.env.VITE_FIREBASE_API_KEY,
  VITE_FIREBASE_AUTH_DOMAIN: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  VITE_FIREBASE_PROJECT_ID: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  VITE_FIREBASE_STORAGE_BUCKET: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  VITE_FIREBASE_MESSAGING_SENDER_ID:
    import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  VITE_FIREBASE_APP_ID: import.meta.env.VITE_FIREBASE_APP_ID,
  VITE_FIREBASE_FUNCTIONS_REGION:
    import.meta.env.VITE_FIREBASE_FUNCTIONS_REGION || "us-central1",
};

for (const [key, value] of Object.entries(requiredEnv)) {
  if (!value) {
    throw new Error(`Missing required environment variable: ${key}`);
  }
}

export const env = {
  firebaseApiKey: requiredEnv.VITE_FIREBASE_API_KEY,
  firebaseAuthDomain: requiredEnv.VITE_FIREBASE_AUTH_DOMAIN,
  firebaseProjectId: requiredEnv.VITE_FIREBASE_PROJECT_ID,
  firebaseStorageBucket: requiredEnv.VITE_FIREBASE_STORAGE_BUCKET,
  firebaseMessagingSenderId: requiredEnv.VITE_FIREBASE_MESSAGING_SENDER_ID,
  firebaseAppId: requiredEnv.VITE_FIREBASE_APP_ID,
  firebaseFunctionsRegion: requiredEnv.VITE_FIREBASE_FUNCTIONS_REGION,
};