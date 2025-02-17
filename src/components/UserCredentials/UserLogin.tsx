/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { auth, firestore } from "../../../firebaseConfig/firebase";
import React, { useState, useRef } from "react";
import {
  signInWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
} from "firebase/auth";
import { collection, getDocs, query, where } from "firebase/firestore";
import Swal from "sweetalert2";
import ReCAPTCHA from "react-google-recaptcha";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";
import { useRouter } from "next/navigation";

const UserLogin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const recaptchaRef = useRef<ReCAPTCHA>(null);
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const provider = new GoogleAuthProvider();

  const checkUserCollection = async (userId: string) => {
    // Check Companies collection first
    const companiesQuery = query(
      collection(firestore, "Companies"),
      where("firebase_id", "==", userId)
    );
    const companiesSnapshot = await getDocs(companiesQuery);

    if (!companiesSnapshot.empty) {
      return "Companies";
    }

    // If not found in Companies, check Candidates collection
    const candidatesQuery = query(
      collection(firestore, "Candidates"),
      where("firebase_id", "==", userId)
    );
    const candidatesSnapshot = await getDocs(candidatesQuery);

    if (!candidatesSnapshot.empty) {
      return "Candidates";
    }

    return null; // User not found in either collection
  };

  const loginWithGoogle = async () => {
    try {
      const result = await signInWithPopup(auth, provider);
      const credential = GoogleAuthProvider.credentialFromResult(result);
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const token = credential?.accessToken;
      const user = result.user;

      const userRole = await checkUserCollection(user.uid);
      if (!userRole) {
        throw new Error("User profile not found");
      }
      router.push(`/${userRole}Profile`);
    } catch (error) {
      console.error("Google sign-in error:", error);
      Swal.fire("Error", "Google sign-in failed. Please try again.", "error");
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    const recaptchaValue = recaptchaRef.current?.getValue();
    if (!recaptchaValue) {
      Swal.fire("Error", "Please complete the recaptcha", "error");
      return;
    }

    setLoading(true);

    try {
      if (!email.trim() || !password.trim()) {
        Swal.fire("Error", "Please fill in all fields", "error");
        return;
      }

      const emailRegexChecker = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegexChecker.test(email)) {
        Swal.fire("Error", "Please enter a valid email", "error");
        setLoading(false);
        return;
      }

      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );
      const { user } = userCredential;

      // Determine which collection the user belongs to
      const userRole = await checkUserCollection(user.uid);

      if (!userRole) {
        throw new Error("User profile not found");
      }

      // Navigate to the appropriate profile page
      router.push(`/${userRole}Profile`);

      setEmail("");
      setPassword("");
    } catch (error: any) {
      console.error("Sign In error:", error);

      let errorMessage = "An unexpected error occurred. Please try again.";

      if (error.code === "auth/user-not-found") {
        errorMessage = "No user found with this email. Please register first.";
      } else if (error.code === "auth/wrong-password") {
        errorMessage = "Incorrect password. Please try again.";
      } else if (error.code === "auth/invalid-email") {
        errorMessage = "The email address is invalid.";
      } else if (error.message === "User profile not found") {
        errorMessage = "User profile not found. Please contact support.";
      }

      Swal.fire("Sign In Failed", errorMessage, "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="d-flex justify-content-center align-items-center py-5"
      style={{ backgroundColor: "#000" }}
    >
      <div
        className="card bg-black text-white border"
        style={{
          borderRadius: "1rem",
          boxShadow: "0 4px 6px rgba(0, 0, 0, 0.5)",
          width: "100%",
          maxWidth: "500px",
        }}
      >
        <div className="card-body">
          <h2 className="card-title text-center mb-3">Log In</h2>
          <p className="text-center mb-5">Enter your information to sign in.</p>

          <form onSubmit={handleLogin}>
            <div className="mb-3">
              <label className="form-label" htmlFor="email">
                Email Address
              </label>
              <input
                type="email"
                id="email"
                className="form-control"
                style={{
                  backgroundColor: "#000",
                  color: "#fff",
                  border: "1px solid #444",
                  borderRadius: "0.5rem",
                  padding: "0.75rem",
                }}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                required
              />
            </div>

            <div className="mb-5" style={{ position: "relative" }}>
              <label className="form-label" htmlFor="password">
                Password
              </label>
              <input
                type={showPassword ? "text" : "password"}
                id="password"
                className="form-control"
                style={{
                  backgroundColor: "#000",
                  color: "#fff",
                  border: "1px solid #444",
                  borderRadius: "0.5rem",
                  padding: "0.75rem",
                }}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                required
              />
              <span
                onClick={() => setShowPassword(!showPassword)}
                style={{
                  position: "absolute",
                  right: "10px",
                  top: "50%",
                  transform: "translateY(-50%)",
                  cursor: "pointer",
                  color: "#fff",
                  padding: "0.30rem",
                }}
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </span>

              <div className="d-flex justify-content-start mt-2">
                <a
                  href="/forgot-password"
                  className="text-primary"
                  style={{ fontSize: "0.9rem", textDecoration: "none" }}
                >
                  Forgot password?
                </a>
              </div>
            </div>

            <div className="mb-4 d-flex justify-content-center">
              <ReCAPTCHA
                ref={recaptchaRef}
                sitekey={process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY || ""}
                theme="dark"
              />
            </div>

            <div className="d-grid gap-2">
              <button
                type="submit"
                className="btn btn-primary"
                style={{
                  borderRadius: "20px",
                  padding: "10px",
                }}
                disabled={loading}
              >
                {loading ? "Logging in..." : "Log In"}
              </button>
            </div>
          </form>

          <div className="d-flex align-items-center my-3">
            <hr className="flex-grow-1" style={{ borderColor: "#888" }} />
            <span className="mx-2">OR</span>
            <hr className="flex-grow-1" style={{ borderColor: "#888" }} />
          </div>

          <div className="d-grid gap-2">
            <button
              type="button"
              onClick={loginWithGoogle}
              className="btn btn-dark"
              style={{
                borderRadius: "20px",
                padding: "10px",
              }}
            >
              <FcGoogle size={24} /> Sign In with Google
            </button>
          </div>

          <p className="text-center mt-3">
            Don&apos;t have an account? <a href="Register">Sign Up</a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default UserLogin;
