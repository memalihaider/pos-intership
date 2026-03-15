"use client";
import Link from "next/link";
import { useState } from "react";
import { Auth,db } from "../config/firebase";
import { createUserWithEmailAndPassword,sendEmailVerification} from "firebase/auth";
import { setDoc,collection,doc } from "firebase/firestore";
import { useRouter } from "next/navigation";
import "./styling/customerSignup.css";

export function CustomerSignup() {
  let [data, setData] = useState({ email: "", password: "", confirmPassword: "" });
  let [loading, setLoading] = useState(false);
  let [error, setError] = useState("");
  const router = useRouter();

  function handleOnchange(event) {
    setData({ ...data, [event.target.name]: event.target.value });
    setError("");
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setLoading(true);
    setError("");

    // console.log("Form submitted with data:", data);

    try {
      if (data.password !== data.confirmPassword) {
        setError("Passwords do not match!");
        setLoading(false);
        return;
      }

      if (data.password.length < 6) {
        setError("Password should be at least 6 characters long!");
        setLoading(false);
        return;
      }

      let userCredential = await createUserWithEmailAndPassword(Auth, data.email, data.password)
      const user  = userCredential.user;
      console.log(user)
      await sendEmailVerification(user)
      
      await setDoc(doc(db,"users",userCredential.user.uid),{
      email:data.email,
      role:"customer"
      })
      // console.log("User created:", userCredential.user);
      
      // Reset form
      setData({ email: "", password: "", confirmPassword: "" });
      
      // Show success message and redirect
      router.push("/userDashBoard");
      
    } catch (error) {
      console.error("Error creating user:", error);
      
      // Handle specific Firebase errors
      switch (error.code) {
        case 'auth/email-already-in-use':
          setError("Email already in use. Please try logging in.");
          break;
        case 'auth/invalid-email':
          setError("Invalid email address format.");
          break;
        case 'auth/weak-password':
          setError("Password is too weak. Please use a stronger password.");
          break;
        default:
          setError("Failed to create account. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  }

  // Password strength indicator
  const getPasswordStrength = () => {
    const password = data.password;
    if (!password) return null;
    
    let strength = 0;
    if (password.length >= 8) strength++;
    if (password.match(/[a-z]/) && password.match(/[A-Z]/)) strength++;
    if (password.match(/[0-9]/)) strength++;
    if (password.match(/[^a-zA-Z0-9]/)) strength++;
    
    return strength;
  };

  const passwordStrength = getPasswordStrength();

  return (
    <div className="signup-wrapper">
      <div className="signup-card">
        <h1 className="signup-title">Create Customer Account</h1>
        <p className="signup-subtitle">Register to access the POS system</p>

        {error && <div className="error-message">{error}</div>}

        <form onSubmit={handleSubmit} className="signup-form">
          <input
            type="email"
            placeholder="Email address"
            value={data.email}
            name="email"
            onChange={handleOnchange}
            required
          />

          <input
            type="password"
            placeholder="Password"
            value={data.password}
            name="password"
            onChange={handleOnchange}
            required
          />

          {/* Password strength indicator */}
          {data.password && (
            <div className="password-strength">
              <span>Password strength:</span>
              <div className="strength-bar">
                <div 
                  className={`strength-bar-fill ${
                    passwordStrength === 1 ? 'weak' : 
                    passwordStrength === 2 ? 'medium' : 
                    passwordStrength >= 3 ? 'strong' : ''
                  }`}
                  style={{ width: `${(passwordStrength / 4) * 100}%` }}
                ></div>
              </div>
            </div>
          )}

          <input
            type="password"
            placeholder="Confirm password"
            value={data.confirmPassword}
            name="confirmPassword"
            onChange={handleOnchange}
            required
          />

          <button type="submit" className={loading ? "loading" : ""}>
            {loading ? "Creating Account..." : "Sign Up"}
          </button>
        </form>

        <div className="divider">
          <span>Already have an account?</span>
        </div>

        <div className="nav-links">
          <Link href="/login/customer" className="nav-link-item">
            <div className="nav-link-content">
              <span className="nav-link-label">Customer Login</span>
              <span className="nav-link-description">Sign in to your account</span>
            </div>
            {/* <span className="nav-link-arrow">→</span> */}
          </Link>

          <Link href="/login/staff" className="nav-link-item">
            <div className="nav-link-content">
              <span className="nav-link-label">Staff Login</span>
              <span className="nav-link-description">Access staff portal</span>
            </div>
            {/* <span className="nav-link-arrow">→</span> */}
          </Link>

          <Link href="/login/admin" className="nav-link-item">
            <div className="nav-link-content">
              <span className="nav-link-label">Admin Login</span>
              <span className="nav-link-description">Administrator access</span>
            </div>
            {/* <span className="nav-link-arrow">→</span> */}
          </Link>
        </div>

        {/* <div className="signup-prompt">
          <p>Need help?</p>
          <Link href="/contact-support" className="signup-link">
            Contact Support
          </Link>
        </div> */}
      </div>
    </div>
  );
}