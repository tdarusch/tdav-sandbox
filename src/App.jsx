import { Box, CssBaseline, Typography } from "@mui/material";
import Navigation from "./components/Navigation/Navigation";
import { Route, Routes } from "react-router";
import "./App.css";
import Home from "./components/Home/Home";
import Contact from "./components/Contact/Contact";

const App = () => {

  return (
    <>
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
