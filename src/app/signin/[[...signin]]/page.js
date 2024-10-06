import { SignIn } from "@clerk/nextjs";
import React from "react";
import "./sign.css";
import Header from "../../../componets/header/header.js";
import Footer from "../../../componets/header/footer.js";

export default function Signin() {
  return (
    <>
      <Header />
      <div className="sign-in-container">
        <SignIn />
      </div>
      <Footer />
    </>
  );
}
