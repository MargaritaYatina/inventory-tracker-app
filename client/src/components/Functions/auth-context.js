import { createContext } from "react";

export const AuthContext = createContext({
  isLoggedIn: false,
  userId: null,
  image: `./memeguy.png`,
  token: null,
  login: () => {},
  logout: () => {},
});
