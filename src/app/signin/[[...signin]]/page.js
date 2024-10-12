import { SignIn } from "@clerk/nextjs";
import React from "react";
import "./sign.css";
import Header from "../../../componets/header/header.js";
import Footer from "../../../componets/footer/footer.js";

export default function Signin() {
  return (
    <>
      <div className="sign-in-container">
        <SignIn />
      </div>
    </>
  );
}
