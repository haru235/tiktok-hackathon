import React, { useState } from "react";
import { firestore } from "@/firebase";

import {
  collection,
  getDocs,
  query,
  deleteDoc,
  doc,
  getDoc,
  setDoc,
} from "firebase/firestore";

function LoginPage() {
  // TODO: Add SDKs for Firebase products that you want to use
  // https://firebase.google.com/docs/web/setup#available-libraries

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  // create a firebase
  const login = async () => {
    // query firestore for user with email
    const userRef = query(doc(firestore, "users", email));

    // check if user exists
    const user = await getDoc(userRef);
    if (user.exists()) {
      // check if password is correct
      const { password: correctPassword } = user.data();
      if (password === correctPassword) {
        // login user
        console.log("Logged in");
      } else {
        console.log("Incorrect password");
      }
    } else {
      console.log("User does not exist");
    }
  };

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
  };

  const handleShowPasswordChange = () => {
    setShowPassword(!showPassword);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Email:", email);
    console.log("Password:", password);
    await login();

    setEmail("");
    setPassword("");
    setShowPassword(false);
  };

  return (
    <div>
      <h1>Login Page</h1>
      <form onSubmit={handleSubmit}>
        <div style={{ display: "grid", gridTemplateRows: "auto" }}>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={handleEmailChange}
          />
          <input
            type={showPassword ? "text" : "password"}
            placeholder="Password"
            value={password}
            onChange={handlePasswordChange}
          />
          <label>
            <input
              type="checkbox"
              checked={showPassword}
              onChange={handleShowPasswordChange}
            />
            Show Password
          </label>
          <button type="submit">Submit</button>
        </div>
      </form>
    </div>
  );
}

export default LoginPage;
