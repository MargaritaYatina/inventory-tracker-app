// Module imports
import React from "react";
import Axios from "axios";
import { useHistory } from "react-router-dom";
// Local imports
import Input from "../UIElements/FormElements/Input";
import Button from "../UIElements/FormElements/Button";
import {
  VALIDATOR_REQUIRE,
  VALIDATOR_MINLENGTH,
} from "../Functions/validators";
import { useAuth } from "../Hooks/auth-hook";
import { useForm } from "../Hooks/form-hook";
// Styling
import "../../css/AddForm.css";

const AddInventory = (props) => {
  // Initial states
  const { token } = useAuth();
  const [formState, inputHandler] = useForm(
    {
      name: {
        value: "",
        isValid: false,
      },
      description: {
        value: "",
        isValid: false,
      },
    },
    false
  );

  const history = useHistory();

  // Takes the item and updates an individual attribute
  const inventorySubmitHandler = (event) => {
    event.preventDefault();
    Axios.post(
      `http://localhost:5000/api/inventories/`,
      {
        name: formState.inputs.name.value,
        description: formState.inputs.description.value,
      },
      { headers: { Authorization: `Bearer ${token}` } }
    ).catch((err) => {
      console.log(err);
    });
    history.push("/");
  };

  // Returns
  return (
    <form className="add-form" onSubmit={inventorySubmitHandler}>
      <Input
        id="name"
        element="input"
        type="text"
        label="Name"
        validators={[VALIDATOR_REQUIRE()]}
        errorText="Please enter a valid name."
        onInput={inputHandler}
      />
      <Input
        id="description"
        element="textarea"
        label="Description"
        validators={[VALIDATOR_MINLENGTH(5)]}
        errorText="Please enter a valid description (at least 5 characters)."
        onInput={inputHandler}
      />
      <Button type="submit" disabled={!formState.isValid}>
        ADD INVENTORY
      </Button>
    </form>
  );
};

export default AddInventory;
