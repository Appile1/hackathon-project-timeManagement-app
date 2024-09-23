import { SignUp } from "@clerk/nextjs";
import React from "react";

import "./sign.css";
export default function Signin() {
  return (
    <div className="sign-in-container">
      <SignUp />
    </div>
  );
}
