import React from "react";
import InventoryCard from "../UIElements/InventoryCard";

const InventoryList = (props) => {
  let count = 0;

  return props.inventory.map((card) => (
    <InventoryCard
      label="Container"
      id={card.id}
      key={card.id}
      index={count++}
      item={card}
      switch={props.switch}
    />
  ));
};

export default InventoryList;
