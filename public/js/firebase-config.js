// Firebase Configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCPypWGpYGGN9_dWrKX1D6IABobKJeZ8RM",
  authDomain: "no-waste-tracker-f05be.firebaseapp.com",
  projectId: "no-waste-tracker-f05be",
  storageBucket: "no-waste-tracker-f05be.firebasestorage.app",
  messagingSenderId: "466422657232",
  appId: "1:466422657232:web:13d8df0d1cd30da4d06ed5"
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
