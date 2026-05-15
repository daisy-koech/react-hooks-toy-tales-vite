import React, { useState, useEffect } from "react";

import Header from "./Header";
import ToyForm from "./ToyForm";
import ToyContainer from "./ToyContainer";

const url = "http://localhost:3001/toys";

function App() {
  const [showForm, setShowForm] = useState(false);
  const [toys, setToys] = useState([]);

  //GET
  useEffect(() => {
    fetch(url)
    .then((response) => {
      if(!response.ok) {
        throw new Error(`HTTP error: ${response.status}`)
      }
      return response.json();
    })
    .then(data => setToys(data))
  }, [])

  function handleClick() {
    setShowForm((showForm) => !showForm);
  }

  //DELETE
  function handleDelete(id) {
    fetch(`${url}/${id}`,{
      method: "DELETE",
    })
    .then(() => {
      setToys((prev) => prev.filter((toy) => toy.id !== id))
    })
  }

//PATCH
  function handleLikeToy(toy) {
    fetch(`${url}/${toy.id}`, {
      method: "PATCH",
      headers: {"Content-Type": "application/json"},
      body: JSON.stringify({likes: toy.likes + 1}),
    })
    .then((response) => response.json())
    .then((updatedToy) => {
      setToys((prev) => prev.map((toy) => toy.id === updatedToy.id ? updatedToy : toy))
    })
  }

  //POST
  function addToy(newToy) {
    fetch(url, {
      method: "POST",
      headers: {"Content-Type": "application/json"},
      body: JSON.stringify(newToy),
    })
    .then((response) => {
      if(!response.ok) {
        throw new Error(`HTTP error: ${response.status}`)
      }
      return response.json();
    })
    .then((newToy) => {
      setToys((prev) => [...prev, newToy])
    })
    .catch(error => console.error("Error fetching data:", error))
  }

  return (
    <>
      <Header />
      {showForm ? <ToyForm addToy={addToy} /> : null}
      <div className="buttonContainer">
        <button onClick={handleClick}>Add a Toy</button>
      </div>
      <ToyContainer toys={toys} onDelete={handleDelete} onLike={handleLikeToy}/>
    </>
  );
}

export default App;