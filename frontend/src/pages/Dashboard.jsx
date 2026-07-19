import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import "../App.css";

function Dashboard() {
  const [vehicles, setVehicles] = useState([]);
  const [search, setSearch] = useState("");
  const navigate = useNavigate();


  
  const [make, setMake] = useState("");
  const [model, setModel] = useState("");
  const [category, setCategory] = useState("");
  const [price, setPrice] = useState("");
  const [quantity, setQuantity] = useState("");
  const [editId, setEditId] = useState(null);
  

  const handleLogout = () => {
  localStorage.removeItem("token");
  navigate("/");
  };

  useEffect(() => {
    fetchVehicles();
  }, []);

  const fetchVehicles = async () => {
    try {
      const token = localStorage.getItem("token");

      const res = await api.get("/vehicles", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setVehicles(res.data);
    } catch (err) {
      console.log(err);
      alert("Failed to load vehicles");
    }
  };

  const handleSearch = async () => {
    try {
      const token = localStorage.getItem("token");

      const res = await api.get(
        `/vehicles/search?search=${search}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setVehicles(res.data);
    } catch (err) {
      console.log(err);
      alert("Search Failed");
    }
  };

  const handleEdit = (vehicle) => {
  setEditId(vehicle.id);
  setMake(vehicle.make);
  setModel(vehicle.model);
  setCategory(vehicle.category);
  setPrice(vehicle.price);
  setQuantity(vehicle.quantity);
};

  const handlePurchase = async (id) => {
    try {
      const token = localStorage.getItem("token");

      await api.post(
        `/vehicles/${id}/purchase`,
        {
          quantity: 1,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      alert("Vehicle Purchased Successfully");
      fetchVehicles();
    } catch (err) {
      alert("Purchase Failed");
      console.log(err);
    }
  };

  const handleRestock = async (id) => {
  try {
    const token = localStorage.getItem("token");

    await api.post(
      `/vehicles/${id}/restock`,
      { quantity: 1 },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    alert("Vehicle Restocked Successfully");
    fetchVehicles();
  } catch (err) {
    console.log(err);
    alert("Restock Failed");
  }
};

  const handleAddVehicle = async () => {
    if (!make || !model || !category || !price || !quantity) {
  alert("Please fill all fields");
  return;
}

if (Number(price) <= 0 || Number(quantity) < 0) {
  alert("Enter valid price and quantity");
  return;
}
    try {
      const token = localStorage.getItem("token");

      await api.post(
        "/vehicles",
        {
          make,
          model,
          category,
          price,
          quantity,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      alert("Vehicle Added Successfully!");

      setMake("");
      setModel("");
      setCategory("");
      setPrice("");
      setQuantity("");

      fetchVehicles();
    } catch (err) {
      console.log(err);
      alert("Failed to Add Vehicle");
    }
  };

  const handleDelete = async (id) => {
  try {
    const token = localStorage.getItem("token");

    await api.delete(`/vehicles/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    alert("Vehicle Deleted Successfully");
    fetchVehicles();
  } catch (err) {
    console.log(err);
    alert("Delete Failed");
  }
};

const handleUpdate = async () => {
  if (!make || !model || !category || !price || !quantity) {
  alert("Please fill all fields");
  return;
}

if (Number(price) <= 0 || Number(quantity) < 0) {
  alert("Enter valid price and quantity");
  return;
}
  try {
    const token = localStorage.getItem("token");

    await api.put(
      `/vehicles/${editId}`,
      {
        make,
        model,
        category,
        price,
        quantity,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    alert("Vehicle Updated Successfully!");

    setEditId(null);
    setMake("");
    setModel("");
    setCategory("");
    setPrice("");
    setQuantity("");

    fetchVehicles();
  } catch (err) {
    console.log(err);
    alert("Update Failed");
  }
};

  return (
    <div className="dashboard" >
     <div className="header">
  <h1>🚗 Car Dealership Dashboard</h1>

  <button
    className="logoutBtn"
    onClick={handleLogout}
  >
    Logout
  </button>
</div>
      <div className="card">
        <input
          type="text"
          placeholder="Make"
          value={make}
          onChange={(e) => setMake(e.target.value)}
        />

        <input
          type="text"
          placeholder="Model"
          value={model}
          onChange={(e) => setModel(e.target.value)}
        />

        <input
          type="text"
          placeholder="Category"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
        />

        <input
          type="number"
          placeholder="Price"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
        />

        <input
          type="number"
          placeholder="Quantity"
          value={quantity}
          onChange={(e) => setQuantity(e.target.value)}
        />
{editId ? (
  <button  className="addBtn" onClick={handleUpdate}>
    Update Vehicle
  </button>
) : (
  <button className="addBtn" onClick={handleAddVehicle}>
    Add Vehicle
  </button>
)}      </div>

      <div className="card">
        <input
          type="text"
          placeholder="Search by Make, Model or Category"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{
            padding: "10px",
            width: "250px",
            marginRight: "10px",
          }}
        />

        <button  className="searchBtn" onClick={handleSearch}>
          Search
        </button>

        <button
          className="showBtn"
          onClick={fetchVehicles}
          style={{ marginLeft: "10px" }}
        >
          Show All
        </button>
      </div>

      <table
        border="1"
        cellPadding="10"
        style={{ width: "100%", marginTop: "20px" }}
      >
        <thead>
          <tr>
            <th>Make</th>
            <th>Model</th>
            <th>Category</th>
            <th>Price</th>
            <th>Quantity</th>
            <th>Action</th>
          </tr>
        </thead>

        <tbody>
          {vehicles.map((vehicle) => (
            <tr key={vehicle.id}>
              <td>{vehicle.make}</td>
              <td>{vehicle.model}</td>
              <td>{vehicle.category}</td>
              <td>₹{vehicle.price}</td>
              <td>{vehicle.quantity}</td>
              <td>
  <button className="purchaseBtn"
  disabled={vehicle.quantity === 0} onClick={() => handlePurchase(vehicle.id)}>
    Purchase
  </button>

  <button  className="restockBtn"
  onClick={() => handleRestock(vehicle.id)}
  style={{ marginLeft: "10px" }}
>
  Restock
</button>

  <button
    className="deleteBtn"
    onClick={() => handleDelete(vehicle.id)}
    style={{ marginLeft: "10px" }}
  >
    Delete
  </button>

  <button
    className="editBtn"
    onClick={() => handleEdit(vehicle)}
    style={{ marginLeft: "10px" }}
  >
    Edit
  </button>
</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default Dashboard;