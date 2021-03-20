// Module imports
import React from "react";
import Axios from "axios";
import { useParams, useHistory } from "react-router-dom";
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

const AddItem = (props) => {
  // Initial states
  const { token } = useAuth();
  const invId = useParams();
  const history = useHistory();
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
      category: {
        value: "",
        isValid: false,
      },
      dosage: {
        value: "",
        isValid: false,
      },
      quantity: {
        value: "",
        isValid: false,
      },
      preparation: {
        value: "",
        isValid: false,
      },
      brand: {
        value: "",
        isValid: false,
      },
    },
    false
  );

  const itemSubmitHandler = (event) => {
    event.preventDefault();
    Axios.post(
      `http://localhost:5000/api/items/`,
      {
        name: formState.inputs.name.value,
        description: formState.inputs.description.value,
        category: formState.inputs.category.value,
        dosage: formState.inputs.dosage.value,
        quantity: formState.inputs.quantity.value,
      },
      { headers: { Authorization: `Bearer ${token}` } }
    ).catch((err) => {
      console.log(err);
    });
    history.push(`/inventory/${invId}`);
  };

  // Returns
  return (
    <form className="add-form" onSubmit={itemSubmitHandler}>
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
      <Input
        id="category"
        element="textarea"
        label="Category"
        validators={[VALIDATOR_MINLENGTH(5)]}
        errorText="Please enter a valid category (at least 5 characters)."
        onInput={inputHandler}
      />
      <Input
        id="dosage"
        element="input"
        type="text"
        label="Dosage"
        validators={[VALIDATOR_REQUIRE()]}
        errorText="Please enter a number."
        onInput={inputHandler}
      />
      <Input
        id="quantity"
        element="input"
        type="text"
        label="Quantity"
        validators={[VALIDATOR_REQUIRE()]}
        errorText="Please enter a number."
        onInput={inputHandler}
      />
      <Button type="submit" disabled={!formState.isValid}>
        ADD ITEM
      </Button>
    </form>
  );
};

export default AddItem;
