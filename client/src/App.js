import React from "react";
import {
  BrowserRouter as Router,
  Route,
  Redirect,
  Switch,
} from "react-router-dom";

// Main UI
import Toolbar from "./components/UIElements/toolbar/Toolbar";
// Auth Routes
import AddItem from "./components/Pages/AddItem";
import AddInventory from "./components/Pages/AddInventory";
import Dashboard from "./components/Pages/Dashboard";
// Unauth Routes
import Home from "./components/Pages/Home";
import Contact from "./components/Pages/Contact";
import About from "./components/Pages/About";
import Login from "./components/Pages/Login";
// Context
import { AuthContext } from "./components/Functions/auth-context";
import { useAuth } from "./components/Hooks/auth-hook";
// Styling
import "./css/App.css";

const App = () => {
  // Initial login states
  const { token, login, logout, userId, name, image } = useAuth();
  // Default toolbar states
  let className = `toolbar-company`;
  let avatar = `./logo1.png`;

  let routes;
  if (token) {
    className = `toolbar-avatar`;
    avatar = `http://localhost:5000/${image}`;
    routes = (
      <Switch>
        <Route path="/" exact>
          <Dashboard />
        </Route>
        <Route path="/inventories/:userId/add" exact>
          <AddInventory />
        </Route>
        <Route path="/items/:inventoryId/add" exact>
          <AddItem />
        </Route>
        <Redirect to="/" exact />
      </Switch>
    );
  } else {
    routes = (
      <Switch>
        <Route path="/" exact>
          <Home />
        </Route>
        <Route path="/about">
          <About />
        </Route>
        <Route path="/contact">
          <Contact />
        </Route>
        <Route path="/login">
          <Login />
        </Route>
        <Redirect to="/login" />
      </Switch>
    );
  }
  // Returns
  return (
    <AuthContext.Provider
      value={{
        isLoggedIn: !!token,
        token: token,
        userId: userId,
        login: login,
        logout: logout,
      }}
    >
      <Router>
        <Toolbar name={name} image={avatar} className={className} />
        <main>{routes}</main>
      </Router>
    </AuthContext.Provider>
  );
};

export default App;
