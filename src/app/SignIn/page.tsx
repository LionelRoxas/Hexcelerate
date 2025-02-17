"use client";

import React from "react";
import { ArrowLeft } from "lucide-react";
import "bootstrap/dist/css/bootstrap.min.css";
import Link from "next/link";
import UserLogin from "../../components/UserCredentials/UserLogin";

export default function SignIn() {
  return (
    <div
      className="min-vh-100 d-flex justify-content-center align-items-start py-5"
      style={{ backgroundColor: "#000" }}
    >
      <div className="container">
        <Link
          href="/HomePage"
          className="text-white flex items-center"
          style={{ display: "flex", alignItems: "center" }}
        >
          <ArrowLeft size={20} className="me-2" />
        </Link>

        <div className="row justify-content-center">
          <UserLogin />
        </div>
      </div>
    </div>
  );
}
