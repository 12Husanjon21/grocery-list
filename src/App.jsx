import Header from "./components/Header";
import SearchItem from "./components/SearchItem";
import AddItem from "./components/AddItem";
import Footer from "./components/Footer";
import Content from "./components/Content";
import { useEffect, useState } from "react";

function App() {
  const api_url = "https://json-server-api-lycv.onrender.com";
  const [items, setItems] = useState([]);
  const [newItem, setNewItem] = useState("");
  const [search, setSearch] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [fetchError, setFetchError] = useState(null);

  useEffect(() => {
    async function fetchItems() {
      setIsLoading(true);
      try {
        const response = await fetch(`${api_url}/items`);
        if (!response.ok) {
          const errorText = await response.text();
          throw new Error(`Network error was not ok: ${errorText}`);
        }
        const newItems = await response.json();

        setItems(newItems);
      } catch (error) {
        console.error("Error fetching items", error.message);
        setFetchError(error.message);
      } finally {
        setIsLoading(false);
      }
    }
    setTimeout(() => {
      fetchItems();
    }, 1000);
  }, [])

  async function addItem() {
    const id = String(Date.now());

    const item = {
      id, 
      item: newItem,
      checked: false,
    };

    try {
      const response = await fetch(`${api_url}/items`, {
        method: "POST",
        headers: {
          "Content-Type": "Application/json",
        },
        body: JSON.stringify(item)
      })
      if(!response.ok) {
        const errorText = await response.text();
        throw new Error(`Network was not ok ${errorText}`);
      }  

       const newItems = [ ...items, item];
       setItems(newItems);
       setNewItem(""); // Inputni tozalash uchun
    } catch (error) {
      console.error("Error creating new item", error.message)
    }
  }

  function handleSubmit(e) {
    e.preventDefault();
    addItem();
  }

  const handleCheck = async (id) => {
    try {
      const updatedItem = items.find((item) => item.id === id);
      const response = await fetch(`${api_url}/items/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({  checked: !updatedItem.checked}),
      });
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Network was not ok ${errorText}`);
      }
      const updatedItems = items.map((item) =>
        item.id === id ? { ...item, checked: !item.checked } : item
      );
      setItems(updatedItems);
    } catch (error) {
      console.error("Error updating item", error.message);
    }
  };

  const handleDelete = async (id) => {
    const filteredItems = items.filter((item) => item.id !== id);
    
    try {
      const response = await fetch(`${api_url}/items/${id}`, {
        method: "DELETE",
      });
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Network was not ok ${errorText}`);
      }
    } catch (error) {
      console.error("Error deleting item", error.message);
    }
    setItems(filteredItems);
  };

  return (
    <div className='App'>
      <Header title='Grocery List' />
      <AddItem 
        newItem={newItem} 
        setNewItem={setNewItem} 
        handleSubmit={handleSubmit}
      />
      <SearchItem search={search} setSearch={setSearch}/>
      <main>
        {fetchError && <p style={{color: 'red'}}>{fetchError}</p>}
        {isLoading && <p>Loading...</p>}
        {!isLoading && !fetchError && <Content
         items={items.filter((item) => item.item.toLowerCase().includes(search.toLowerCase()))}
         handleCheck={handleCheck}
         handleDelete={handleDelete}
        />}
      </main>
      <Footer />
    </div>
  );
}

export default App;




// App.jsx
// import React, { useState } from 'react';
// import MyInput from './MyInput';

// const App = () => {
//   const [text, setText] = useState('');

//   return (
//     <div>
//       <h1>Text: {text}</h1>
//       <MyInput text={text} setText={setText} />
//     </div>
//   );
// };

// export default App;

// // MyInput.jsx
// import React from 'react';

// const MyInput = ({ text, setText }) => {
//   const handleChange = (e) => {
//     setText(e.target.value);
//   };

//   return (
//     <div>
//       <input type="text" value={text} onChange={handleChange} />
//     </div>
//   );
// };

// export default MyInput;
