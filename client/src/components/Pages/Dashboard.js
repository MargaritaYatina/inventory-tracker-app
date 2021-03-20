// Module imports
import React, { useState } from "react";
// Local imports
import InventoryDisplay from "./InventoryDisplay";
import Button from "../UIElements/FormElements/Button";
import { useAuth } from "../Hooks/auth-hook";
// Styling
import "../../css/Dashboard.css";

const Dashboard = (props) => {
  // Initial state
  const { userId } = useAuth();
  const [query, setQuery] = useState("");
  const [target, setTarget] = useState("");
  const [itemView, setItemView] = useState(false);
  const inputText = React.createRef();

  // Changes the query, which is passed to inventory display.
  const handleSearch = (e) => {
    e.preventDefault();
    setQuery(inputText.current.value);
  };

  const switchModeHandler = (targetId) => {
    setTarget(targetId);
    if (itemView) setItemView(false);
    else setItemView(true);
  };

  let searchUrl;
  // A tad confusing but one of 4 possibilities.
  // A: default view inside of a container.
  // B: searching for an item inside of a container.
  // C: default view of all containers.
  // D: searching for a specific container.
  if (itemView) {
    searchUrl = query === "" ? `items/inventory/${target}` : `items/${query}`;
  } else {
    searchUrl =
      query === "" ? `inventories/user/${userId}` : `inventories/${query}`;
  }

  // Returns
  return (
    <div className="dash-container">
      <div className="dash-header">
        <h2>
          {itemView && <b>Item View</b>}
          {!itemView && <b>Inventory View</b>}
        </h2>
        <div style={{ flex: 1 }}></div>
        <div className="dash-tools">
          {itemView && <Button to={`/items/${target}/add`}>Add Item</Button>}
          {!itemView && (
            <Button to={`/inventories/${userId}/add`}>Add Inventory</Button>
          )}
          <form onSubmit={(e) => handleSearch(e)}>
            <input
              type="text"
              ref={inputText}
              placeholder="Enter keywords..."
            />
            <input type="submit" value="Submit" />
          </form>
        </div>
      </div>
      <div className="dash-body">
        <InventoryDisplay query={searchUrl} switch={switchModeHandler} />
      </div>
    </div>
  );
};

export default Dashboard;
