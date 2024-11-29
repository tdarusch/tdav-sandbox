import { lazy } from "react";
import { CssBaseline, Typography } from "@mui/material";
import Navigation from "./components/Navigation/Navigation";
import { Route, Routes } from "react-router";
import { Secure } from "./components/SecureRoute/SecureRoute";
import "./App.css";

import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';

import Home from "./components/Home/Home";
import Contact from "./components/Contact/Contact";
import Messages from "./components/Messages/Messages";
import LoginHandler from "./components/LoginHandler/LoginHandler";
import Resume from "./components/Resume/Resume";
import UnknownRoute from "./components/UnknownRoute/UnknownRoute";

const App = () => {
  return (
    <>
      <CssBaseline />
      <Routes>
        <Route path='/' element={<Navigation />}>
          <Route path='' element={<Home />} />
          <Route path='resume' element={<Resume />} />
          <Route path='contact' element={<Contact />} />
          <Route path='messages' element={Secure(<Messages />)} />
          <Route path='oauth/callback' element={<LoginHandler />} />
          <Route path='*' element={<UnknownRoute />} />
        </Route>
      </Routes>
    </>
  )
}

export default App
