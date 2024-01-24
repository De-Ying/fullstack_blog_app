import { initializeApp } from "firebase/app";
import { GoogleAuthProvider, getAuth, signInWithPopup } from "firebase/auth";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_GOOGLE_API_KEY,
  authDomain: import.meta.env.VITE_GOOGLE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_GOOGLE_PROJECT_ID,
  storageBucket: "fullstack-blog-app-57353.appspot.com",
  messagingSenderId: "642982290376",
  appId: "1:642982290376:web:64e582d94a58a4871796fd",
};

const app = initializeApp(firebaseConfig);

// Google Auth

const provider = new GoogleAuthProvider();

const auth = getAuth();

export const authWithGoogle = async () => {
  try {
    const result = await signInWithPopup(auth, provider);
    const user = result.user;
    console.log("Google authentication successful:", user);
    return user;
  } catch (err) {
    console.error("Error during Google authentication:", err.code, err.message);
    // Xử lý lỗi cụ thể nếu cần thiết
    return null;
  }
};
