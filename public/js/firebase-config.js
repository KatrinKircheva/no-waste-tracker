// Firebase Configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDrQ9cBzb0aC4pxJ8yK23vxLp-DdbvmtsU",
  authDomain: "no-waste-tracker.firebaseapp.com",
  databaseURL: "https://no-waste-tracker-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "no-waste-tracker",
  storageBucket: "no-waste-tracker.firebasestorage.app",
  messagingSenderId: "786373283923",
  appId: "1:786373283923:web:644bc4b586ba0fa51f36a6",
  measurementId: "G-FWJ46PLHY1"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();

// Demo user ID for hackathon purposes
const DEMO_USER_ID = "demo_user_hackathon";

// Helper function to get current user ID
function getCurrentUserId() {
  // For demo purposes, return demo user ID
  // In real app, this would be: firebase.auth().currentUser.uid
  return DEMO_USER_ID;
}

// Export for use in other files
window.firebaseConfig = {
  db,
  getCurrentUserId,
  DEMO_USER_ID
};
