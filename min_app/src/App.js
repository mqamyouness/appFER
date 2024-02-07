import React, { useState, useEffect } from 'react';
import './App.css'; 

const ProductList = () => {
  const [products, setProducts] = useState([]);
  const [updatedProduct, setUpdatedProduct] = useState({id: 0, name: '', details: '', price: 0, image: '',});
  useEffect(() => {
    getAllProducts();
  }, []);

  const getAllProducts = async () => {
    try {
      const response = await fetch('http://localhost:8000/api/products');
      const data = await response.json();
      setProducts(data);
    } catch (error) {
      console.error('Error fetching products:', error);
    }
  };
  const handleAddProduct = async () => {
      try {
        const name = document.querySelector('input[name="name"]');
        const details = document.querySelector('input[name="details"]');
        const image = document.querySelector('input[name="image"]');
        const price = document.querySelector('input[name="price"]');
        const response = await fetch('http://127.0.0.1:8000/api/products', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            name: name.value,
            details : details.value, 
            price: price.value,
            image: image.value
          }),
        });

        if (response.ok) {
          getAllProducts();
          const createdProduct = await response.json();
          setProducts((prevProducts) => [...prevProducts, createdProduct]);
          name.value ="";
          details.value =""; 
          price.value = "";
          image.value = "";
        } else {
          console.error('Failed to add product');
        }
      } catch (error) {
        console.error('Error adding product:', error);
      }
  };

  const handleDeleteProduct = async (productId) => {
    try {
      const response = await fetch(`http://127.0.0.1:8000/api/products/${productId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        getAllProducts();
      } else {
        console.error('Failed to delete product:', response.statusText);
      }
    } catch (error) {
      console.error('Error deleting product:', error);
    }
  };

  const handleEditProduct = (product) => {
    setUpdatedProduct(product);
  };
  
  const handleUpdateProduct = async () => {
    try {
      const response = await fetch(`http://127.0.0.1:8000/api/products/${updatedProduct.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedProduct),
      });

      if (response.ok) {
        getAllProducts();
        setUpdatedProduct({
          id: 0,
          name: '',
          details: '',
          price: 0,
          image: '',
        });
      } else {
        console.error('Failed to update product');
      }
    } catch (error) {
      console.error('Error updating product:', error);
    }
  };
  const [isAddProductVisible, setIsAddProductVisible] = useState(false);

  const handleAddProductModel = () => {
    setIsAddProductVisible(!isAddProductVisible);
  };
  return (
    <div>
      <header className="app-header">
        <h1 className="app-title">Product</h1>
        <button className="add-button" onClick={handleAddProductModel}>Ajouter</button>
      </header>
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Details</th>
            <th>Image</th>
            <th>Price</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {products.map((product) => (
            <tr key={product.id}>
              <td>{product.id}</td>
              <td>{product.name}</td>
              <td>{product.details}</td>
              <td>{product.image}</td>
              <td>${product.price}</td>
              <td>
                <button className="btn" onClick={() => handleDeleteProduct(product.id)} >Supprimer</button>
                <button className="btn" onClick={() => handleEditProduct(product)} >Modifier</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {isAddProductVisible && (
      <div className="add-product-container">
        <h2>Add New Product</h2>
        <div>
          <label>Name:</label>
          <input type="text" name="name"   />          
        </div>
        <div>
          <label>Details:</label>
          <input type="text" name="details"   />          
        </div>
        <div>
          <label>Image:</label>
          <input type="text" name="image"   />        
        </div>
        <div>
          <label>Price:</label>
          <input type="number" name="price"   />          
        </div>
        <button onClick={handleAddProduct}>Add Product</button>
      </div>)}
      {updatedProduct.id ? (
      <div className="add-product-container">
        <h2>Update Product</h2>
        <div>
          <label>Name:</label>
          <input
            type="text"
            name="name"
            value={updatedProduct.id ? updatedProduct.name : ""}
            onChange={(e) => setUpdatedProduct((prevProduct) => ({ ...prevProduct, name: e.target.value }))}
          />
        </div>
        <div>
          <label>Details:</label>
          <input
            type="text"
            name="details"
            value={updatedProduct.id ? updatedProduct.details : ""}
            onChange={(e) => setUpdatedProduct((prevProduct) => ({ ...prevProduct, details: e.target.value }))}
          /> 
        </div>
        <div>
          <label>Image:</label>
          <input
            type="text"
            name="image"
            value={updatedProduct.id ? updatedProduct.image : ""}
            onChange={(e) => setUpdatedProduct((prevProduct) => ({ ...prevProduct, image: e.target.value }))}
          />
        </div>
        <div>
          <label>Price:</label>
          <input
            type="number"
            name="price"
            value={updatedProduct.id ? updatedProduct.price : ""}
            onChange={(e) => setUpdatedProduct((prevProduct) => ({ ...prevProduct, price: e.target.value }))}
          />          
        </div>
        <button onClick={handleUpdateProduct}>Update Product</button>
      </div>
      ): ("")}
    </div>
  );
};

export default ProductList;