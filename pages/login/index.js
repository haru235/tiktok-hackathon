import React, { useState } from "react";
import { firestore } from "@/firebase";
import { useRouter } from "next/router";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";

import {
  collection,
  getDocs,
  query,
  deleteDoc,
  doc,
  getDoc,
  setDoc,
} from "firebase/firestore";

import { Button, Box, Stack, TextField, Fab, Typography } from "@mui/material";

function LoginPage() {
  const router = useRouter();

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

  const handleBack = () => {
    router.push("/");
  };

  return (
    <Box
      width="100vw"
      height="100vh"
      display="flex"
      justifyContent="center"
      alignItems="center"
    >
      <Stack
        direction="column"
        width={"400px"}
        height={"600px"}
        border={"1px solid gray"}
        boxShadow={"rgba(0, 0, 0, 0.35) 0px 5px 15px;"}
        borderRadius={"15px"}
        display={"flex"}
        p={1}
        spacing={2}
      >
        <Fab
          size="small"
          aria-label="add"
          sx={{
            width: "fit-content",
            backgroundColor: "background.default",
            outline: "none",
            boxShadow: "none",
            justifyContent: "flex-start",
          }}
          variant="extended"
          onClick={handleBack}
        >
          <ArrowBackIcon /> &nbsp; Back &nbsp;
        </Fab>

        <Stack
          spacing={2}
          alignContent={"center"}
          justifyContent={"center"}
          display={"flex"}
          p={2}
        >
          <TextField
            type="email"
            label="email"
            value={email}
            onChange={handleEmailChange}
            InputProps = {{
              sx:{
              borderRadius: "20px",
            }}}
          />
          <TextField
            type={showPassword ? "text" : "password"}
            label="password"
            value={password}
            onChange={handlePasswordChange}
            InputProps = {{
              sx:{
              borderRadius: "20px",
            }}}
          />
          <Fab
            size="small"
            aria-label="add"
            sx={{
              width: "100%",
              backgroundColor: "background.default",
              outline: "none",
              boxShadow: "none",
              justifyContent: "center",
            }}
            variant="extended"
            onClick={handleBack}
          >
            <Typography variant="p" color={"blue"} textTransform={'lowercase'}>
              Login
            </Typography>
          </Fab>
        </Stack>
      </Stack>
    </Box>
  );
  // return (
  //   <div>
  //     <h1>Login Page</h1>
  //     <form onSubmit={handleSubmit}>
  //       <div style={{ display: "grid", gridTemplateRows: "auto" }}>
  //         <input
  //           type="email"
  //           placeholder="Email"
  //           value={email}
  //           onChange={handleEmailChange}
  //         />
  //         <input
  //           type={showPassword ? "text" : "password"}
  //           placeholder="Password"
  //           value={password}
  //           onChange={handlePasswordChange}
  //         />
  //         <label>
  //           <input
  //             type="checkbox"
  //             checked={showPassword}
  //             onChange={handleShowPasswordChange}
  //           />
  //           Show Password
  //         </label>
  //         <button type="submit">Submit</button>
  //       </div>
  //     </form>
  //   </div>
  // );
}

export default LoginPage;
