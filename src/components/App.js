import { useState } from "react";

export default function App() {
  const [items, setItems] = useState(function () {
    return JSON.parse(localStorage.getItem("items")) || [];
  });

  function handleToggle(id) {
    setItems((items) =>
      items.map((item) =>
        item.id === id ? { ...item, packed: !item.packed } : item
      )
    );
  }

  function handleAddItem(newItem) {
    setItems([...items, newItem]);
    localStorage.setItem("items", JSON.stringify([...items, newItem]));
  }

  function handleClearItem(id) {
    setItems((items) => {
      const filteredItems = items.filter((item) => item.id !== id);
      localStorage.setItem("items", JSON.stringify(filteredItems));
      return filteredItems;
    });
  }

  function handleClearAll() {
    if (items.length > 0) {
      const confirmed = window.confirm(
        "are you sure you want do delete all data"
      );
      if (confirmed) {
        setItems([]);
        localStorage.setItem("items", JSON.stringify([]));
      } else {
        return;
      }
    }
  }

  return (
    <div className="App">
      <h1> 🌴 FAR AWAY 🎒</h1>
      <Form onAddItem={handleAddItem} />
      <Outputs
        handleToggle={handleToggle}
        items={items}
        handleClearItem={handleClearItem}
        handleClearAll={handleClearAll}
      />
      <States items={items} />
    </div>
  );
}

function Form({ onAddItem }) {
  const [description, setDescription] = useState("");
  const [quantity, setQuantity] = useState(1);
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!description) return;
    const newItem = { description, quantity, packed: true, id: Date.now() };
    onAddItem(newItem);

    console.log(newItem);
    setDescription(""); //clrear input from the data
    setQuantity(1); //make the initial value
  };

  return (
    <form className="add-form" onSubmit={handleSubmit}>
      <h3>what do you need for your 😍 trip</h3>
      <select value={quantity} onChange={(e) => setQuantity(e.target.value)}>
        {Array.from({ length: 20 }, (_, i) => i + 1).map((ele) => (
          <option value={ele} key={ele}>
            {ele}
          </option>
        ))}
      </select>
      <input
        type="text"
        placeholder="...item"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      />
      <button onClick={() => onAddItem}>Add</button>
    </form>
  );
}

function Outputs({ items, handleClearItem, handleClearAll, handleToggle }) {
  const [sortedBy, setSortedBy] = useState("input");

  let sortedItems;

  if (sortedBy === "input") {
    sortedItems = items;
  }

  if (sortedBy === "description") {
    sortedItems = items.sort((a, b) =>
      a.description.localeCompare(b.description)
    );
  }
  if (sortedBy === "packed") {
    sortedItems = items.sort((a, b) => a.packed - b.packed);
  }

  return (
    <div className="list">
      <ul>
        {sortedItems.map((item) => (
          <li key={item.id}>
            <input type="checkbox" onChange={() => handleToggle(item.id)} />
            <span className={`${item.packed ? "" : "toggle"}`}>
              {item.quantity} {item.description}
            </span>
            <button onClick={() => handleClearItem(item.id)}>❌</button>
          </li>
        ))}
      </ul>
      <div className="sorting">
        <select value={sortedBy} onChange={(e) => setSortedBy(e.target.value)}>
          <option value="input">sort by input order</option>
          <option value="description">sort by description</option>
          <option value="packed">sort by packed status</option>
        </select>
        <button onClick={handleClearAll}>clear list</button>
      </div>
    </div>
  );
}

function States({ items }) {
  let numItems = items.length;
  let packedItems = items.filter((item) => {
    return !item.packed;
  }).length;
  let percentPacked = Math.round((packedItems / numItems) * 100);

  if (!items.length)
    return (
      <div className="stats">
        start adding some items to your packing list 🚀
      </div>
    );
  return (
    <div className="stats">
      <span>
        {percentPacked === 100 ? (
          <em>you got every thing! ready to go ✈</em>
        ) : (
          <em>
            you have {numItems} items on your list, and you already packed{" "}
            {packedItems ? packedItems : ""} {percentPacked}%
          </em>
        )}
      </span>
    </div>
  );
}
