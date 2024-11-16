import { CssBaseline, Typography } from "@mui/material";
import Navigation from "./components/Navigation/Navigation";
import { Route, Routes } from "react-router";
import "./App.css";
import Home from "./components/Home/Home";
import Contact from "./components/Contact/Contact";

import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';

const App = () => {
  return (
    <>
      <CssBaseline />
      <Routes>
        <Route path='/' element={<Navigation />}>
          <Route path='' element={<Home />} />
          <Route path='contact' element={<Contact />} />
        </Route>
      </Routes>
    </>
  )
}

export default App
