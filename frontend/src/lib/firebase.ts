import { initializeApp } from 'firebase/app'
import { getAuth } from 'firebase/auth'

const firebaseConfig = {
  apiKey: "AIzaSyBNu3xOh2fR-A9ZnVHF-SZWAdB1GVujAJs",
  authDomain: "ai-finance-advisor-e185d.firebaseapp.com",
  projectId: "ai-finance-advisor-e185d",
  storageBucket: "ai-finance-advisor-e185d.firebasestorage.app",
  messagingSenderId: "191016073488",
  appId: "1:191016073488:web:2ed99c1da4a6a01de20d95",
  measurementId: "G-B1BF5V5CKT"
}

const app = initializeApp(firebaseConfig)
export const auth = getAuth(app)
