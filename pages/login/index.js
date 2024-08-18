import React, { useState } from "react";
import { firestore } from "@/firebase";
import { useRouter } from "next/router";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import Cookies from "js-cookie";

import {
  collection,
  getDocs,
  query,
  deleteDoc,
  doc,
  getDoc,
  setDoc,
} from "firebase/firestore";

import {
  Button,
  Box,
  Stack,
  TextField,
  Fab,
  Typography,
  Modal,
} from "@mui/material";
import Divider from "@mui/material/Divider";

function LoginPage() {
  const router = useRouter();

  const [open, setOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMeessage, setErrorMessage] = useState("");
  const [rePassword, setRePassword] = useState("");
  const [username, setUsername] = useState("");
  const [fname, setFname] = useState("");
  const [lname, setLname] = useState("");
  const [validSignUp, setValidSignUp] = useState(false);

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

        const user_info = {
          username: user.data().username,
          fname: user.data().fname,
          lname: user.data().lname,
        };

        Cookies.set("user", JSON.stringify(user_info), { expires: 1 });

        // print the cookie
        console.log(Cookies.get("user"));
        // redirect to home page
        router.push("/");
      } else {
        console.log("Incorrect password");
        setErrorMessage("Incorrect password. Please try again");
      }
    } else {
      console.log("User does not exist");
      setErrorMessage("User does not exist. Please sign up");
    }
  };

  const handleSignUp = async () => {
    // query firestore for user with email
    const userRef = query(doc(firestore, "users", email));

    // check if user exists
    const user = await getDoc(userRef);
    if (user.exists()) {
      handleClose();
      console.log("User already exists");
      setErrorMessage("User already exists. Please login");
    } else {
      // create user
      await setDoc(doc(firestore, "users", email), {
        password,
        username,
        fname,
        lname,
      });

      console.log("User created");
      setErrorMessage("User created! Please login");
      handleClose();
    }
  };

  const handleRePasswordChange = async (e) => {
    setRePassword(e.target.value);
    validateSignUp(password, e.target.value, email, username, fname, lname);
  };

  const validateSignUp = (
    password,
    confirmPassword,
    email,
    username,
    fname,
    lname
  ) => {
    setValidSignUp(password === confirmPassword 
                    && password !== ""
                    && confirmPassword !== ""
                    && email !== ""
                    && username !== ""
                    && fname !== ""
                    && lname !== "");
  };

  const handleUsernameChange = (e) => {
    setUsername(e.target.value);
    validateSignUp(password, rePassword, email, e.target.value, fname, lname);
  };

  const handleFnameChange = (e) => {
    setFname(e.target.value);
    validateSignUp(password, rePassword, email, username, e.target.value, lname);
  };

  const handleLnameChange = (e) => {
    setLname(e.target.value);
    validateSignUp(password, rePassword, email, username, fname, e.target.value);
  };

  const handleClose = () => {
    setOpen(false);

  };

  const handleOpen = () => {
    setOpen(true);
  };

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
    validateSignUp(password, rePassword, e.target.value, username, fname, lname);
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
    validateSignUp(e.target.value, rePassword, email, username, fname, lname);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Email:", email);
    console.log("Password:", password);
    await login();

    setEmail("");
    setPassword("");
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
      <Modal 
      open={open} 
      onClose={handleClose} 
      >
        <Box
          position="absolute"
          top="50%"
          left="50%"
          textTransform="translate(-50%, -50%)"
          width={400}
          height={700}
          bgcolor={"white"}
          border="2px solid gray"
          boxShadow={24}
          p={4}
          display={"flex"}
          flexDirection={"column"}
          gap={3}
          justifyContent={'space-around'}
          sx={{
            transform: "translate(-50%, -50%)",
            borderRadius: "15px",
          }}
        >
          <Typography variant="h4" >
            Sign Up Form
          </Typography>
          <TextField
            type={"text"}
            label="username"
            value={username}
            onChange={handleUsernameChange}
            InputProps={{
              sx: {
                borderRadius: "20px",
              },
            }}
          />
          <TextField
            type={"text"}
            label="first name"
            value={fname}
            onChange={handleFnameChange}
            InputProps={{
              sx: {
                borderRadius: "20px",
              },
            }}
          />
          <TextField
            type={"text"}
            label="last name"
            value={lname}
            onChange={handleLnameChange}
            InputProps={{
              sx: {
                borderRadius: "20px",
              },
            }}
          />
          <TextField
            type={"email"}
            label="email address"
            value={email}
            onChange={handleEmailChange}
            InputProps={{
              sx: {
                borderRadius: "20px",
              },
            }}
          />
          <TextField
            type={"password"}
            label="password"
            value={password}
            onChange={handlePasswordChange}
            InputProps={{
              sx: {
                borderRadius: "20px",
              },
            }}
          />
          <TextField
            type={"password"}
            label="re-enter password"
            value={rePassword}
            onChange={handleRePasswordChange}
            InputProps={{
              sx: {
                borderRadius: "20px",
              },
            }}
          />
          <Button
            disabled={!validSignUp}
            variant="contained"
            onClick={handleSignUp}
            sx={{
              width: "100%",
              backgroundColor: "primary.main",
              outline: "none",
              boxShadow: "none",
              justifyContent: "center",
            }}
          >
            Sign Up
          </Button>
        </Box>
      </Modal>

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
          width={"100%"}
          p={2}
        >
          <TextField
            type="email"
            label="email"
            value={email}
            onChange={handleEmailChange}
            InputProps={{
              sx: {
                borderRadius: "20px",
              },
            }}
          />
          <TextField
            type={"password"}
            label="password"
            value={password}
            onChange={handlePasswordChange}
            InputProps={{
              sx: {
                borderRadius: "20px",
              },
            }}
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
            onClick={handleSubmit}
          >
            <Typography
              variant="p"
              color={"#2196f3"}
              textTransform={"lowercase"}
            >
              Login
            </Typography>
          </Fab>
        </Stack>

        <Divider>
          <Typography color={"lightgrey"}> OR </Typography>
        </Divider>

        <Stack
          spacing={2}
          alignContent={"center"}
          justifyContent={"space-between"}
          flexDirection={"column"}
          height={"100%"}
          display={"flex"}
          p={2}
        >
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
            onClick={handleOpen}
          >
            <Typography
              variant="p"
              color={"#2196f3"}
              textTransform={"lowercase"}
            >
              Sign Up
            </Typography>
          </Fab>

          <Typography width="100%" color={"red"} p={3} textAlign={"center"}>
            {" "}
            {errorMeessage}{" "}
          </Typography>
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
