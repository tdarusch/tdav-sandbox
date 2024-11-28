import { jwtDecode } from "jwt-decode";
import { createContext, useContext, useState } from "react";

const UserContext = createContext();

export const useCurrentUser = () => useContext(UserContext);

export const UserProvider = ({ children }) => {
  let hasJwtToken = false;
  let hasAdminRole = false;

  if (localStorage.getItem("jwtToken")) {
    hasJwtToken = true;
    try {
      const decoded = jwtDecode(localStorage.getItem("jwtToken"));
      hasAdminRole = decoded?.roles?.includes('ROLE_ADMIN');
    } catch (error) {
      console.error('Invalid JWT token.', error);
      hasJwtToken = false;
      hasAdminRole = false;
    }
  }

  const [isLoggedIn, setIsLoggedIn] = useState(hasJwtToken);
  const [isAdmin, setIsAdmin] = useState(hasAdminRole);

  const setAdmin = (admin) => setIsAdmin(admin);
  const logIn = () => setIsLoggedIn(true);
  const logOut = () =>  {
    setIsAdmin(false);
    setIsLoggedIn(false);
  }

  return (
    <UserContext.Provider value={{ isAdmin, isLoggedIn, setAdmin, logIn, logOut }}>
      {children}
    </UserContext.Provider>
  )
};