import React, { useContext } from "react";

import { NavLink } from "react-router-dom";
import { AuthContext } from "../../Functions/auth-context";
import "../../../css/NavLinks.css";

const NavLinks = (props) => {
  // Initial state
  const auth = useContext(AuthContext);

  // Returns
  return (
    <ul className="nav-links">
      <li>
        <NavLink to="/" exact>
          HOME
        </NavLink>
      </li>
      {auth.isLoggedIn && (
        <React.Fragment>
          <li>
            <NavLink to="/u1/advanced">ADVANCED</NavLink>
          </li>
          <li>
            <NavLink to="/u1/overview">OVERVIEW</NavLink>
          </li>

          <li>
            <NavLink to="/u1/settings">SETTINGS</NavLink>
          </li>
          <li>
            <button onClick={auth.logout}>LOGOUT</button>
          </li>
        </React.Fragment>
      )}
      {!auth.isLoggedIn && (
        <React.Fragment>
          <li>
            <NavLink to="/about">ABOUT</NavLink>
          </li>

          <li>
            <NavLink to="/contact">CONTACT</NavLink>
          </li>
          <li>
            <NavLink to="/login">LOGIN</NavLink>
          </li>
        </React.Fragment>
      )}
    </ul>
  );
};

export default NavLinks;
