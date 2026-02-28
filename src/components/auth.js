"use client"

import {Auth,provider} from "../config/firebase"
import { createUserWithEmailAndPassword,signInWithPopup,signOut} from "firebase/auth"
import { useState } from "react";
export default function AuthComponent() {

    let [email, setEmail] = useState("");
    let [password, setPassword] = useState("");

    //Auth.currentUser will be null if no user is logged in, otherwise it will contain the user object


    async function handleLogin() {
        try {
            const userCredential = await createUserWithEmailAndPassword(Auth, email, password);
            console.log("User created:", userCredential.user);
        } catch (error) {
            console.error("Error creating user:", error);
        }
    }

    async function handleGoogleLogin() {
        try {
            const userCredential = await signInWithPopup(Auth, provider);
            console.log("User signed in with Google:", userCredential.user);
        } catch (error) {
            console.error("Error signing in with Google:", error);
        }
    }


  return (
    <>
    <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
    <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
    <button onClick={handleLogin}>Login</button>
    <button onClick={() =>  signOut(Auth)}>Logout</button>
    <button onClick={handleGoogleLogin}>Login with Google</button>
    </>
  );
}