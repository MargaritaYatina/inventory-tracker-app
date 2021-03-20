// Module imports
import React, { useContext } from "react";
//Local imports
import NavLinks from "./NavLinks";
import { AuthContext } from "../../Functions/auth-context";
// Styling
import "../../../css/Toolbar.css";

const Toolbar = (props) => {
  // Initial states
  const { isLoggedIn } = useContext(AuthContext);

  // Returns
  return (
    <div className="toolbar-container">
      <div className="toolbar-info">
        <img className={props.className} src={props.image} alt="Profile" />
        {isLoggedIn && (
          <div className="toolbar-name">
            <h2>{props.name}'s Inventory</h2>
          </div>
        )}
      </div>
      <div style={{ flex: 1 }} />
      <NavLinks />
    </div>
  );
};

export default Toolbar;
