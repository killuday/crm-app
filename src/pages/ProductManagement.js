import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import {
  getProducts,
  createProduct,
  updateProduct,
  deleteProduct,
  reset,
} from "../features/products/productsSlice";
import toast from "react-hot-toast";
import { Blocks } from "react-loader-spinner";
import Popup from "reactjs-popup";

function ProductManagement() {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    price: "",
    stock: "",
    category: "",
  });

  const [isEditing, setIsEditing] = useState(false);
  const [currentId, setCurrentId] = useState(null);

  const { title, description, price, stock, category } = formData;
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { user } = useSelector((state) => state.auth);
  const { products, isLoading, isError, message } = useSelector(
    (state) => state.products
  );

  useEffect(() => {
    if (isError) {
      console.error(message);
    }

    if (!user) {
      navigate("/login");
      return;
    }

    dispatch(getProducts());

    return () => {
      dispatch(reset());
    };
  }, [user, navigate, isError, message, dispatch]);

  const onChange = (e) => {
    const value =
      e.target.type === "number" ? parseFloat(e.target.value) : e.target.value;

    setFormData((prevState) => ({
      ...prevState,
      [e.target.name]: value,
    }));
  };

  const onSubmit = (e) => {
    e.preventDefault();

    const productData = {
      title,
      description,
      price: parseFloat(price),
      stock: parseInt(stock, 10),
      category,
    };

    if (isEditing) {
      dispatch(updateProduct({ id: currentId, productData }));
      toast.success("Product updated successfully");
    } else {
      dispatch(createProduct(productData));
      toast.success("Product created successfully");
    }

    resetForm();
  };

  const resetForm = () => {
    setFormData({
      title: "",
      description: "",
      price: "",
      stock: "",
      category: "",
    });
    setIsEditing(false);
    setCurrentId(null);
  };

  const editProduct = (product) => {
    window.scrollTo(0, 0);
    setIsEditing(true);
    setCurrentId(product.id);
    setFormData({
      title: product.title,
      description: product.description,
      price: product.price,
      stock: product.stock,
      category: product.category,
    });
  };

  const handleDelete = (close, id) => {
    dispatch(deleteProduct(id));
    toast.success("Product deleted successfully");
    close(); // close the popup after delete
  };

  if (isLoading) {
    return (
      <div className="products-loader">
        <Blocks
          height="200"
          width="200"
          color="#4fa94d"
          ariaLabel="blocks-loading"
          wrapperStyle={{}}
          wrapperClass="blocks-wrapper"
          visible={true}
        />
      </div>
    );
  }

  return (
    <div className="product-management-container">
      <h1>Product Management</h1>

      <div className="product-form-container">
        <h2>{isEditing ? "Edit Product" : "Add New Product"}</h2>
        <form onSubmit={onSubmit}>
          <div className="form-group">
            <label htmlFor="title">Title</label>
            <input
              type="text"
              className="form-control"
              id="title"
              name="title"
              value={title}
              onChange={onChange}
              placeholder="Product title"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="description">Description</label>
            <textarea
              className="form-control"
              id="description"
              name="description"
              value={description}
              onChange={onChange}
              placeholder="Product description"
              required
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="price">Price</label>
              <input
                type="number"
                step="0.01"
                className="form-control"
                id="price"
                name="price"
                value={price}
                onChange={onChange}
                placeholder="Price"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="stock">Stock</label>
              <input
                type="number"
                className="form-control"
                id="stock"
                name="stock"
                value={stock}
                onChange={onChange}
                placeholder="Stock quantity"
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="category">Category</label>
            <input
              type="text"
              className="form-control"
              id="category"
              name="category"
              value={category}
              onChange={onChange}
              placeholder="Product category"
              required
            />
          </div>

          <div className="form-actions">
            <button type="submit" className="btn btn-primary">
              {isEditing ? "Update Product" : "Add Product"}
            </button>
            {isEditing && (
              <button
                type="button"
                className="btn btn-secondary"
                onClick={resetForm}
              >
                Cancel
              </button>
            )}
          </div>
        </form>
      </div>

      <div className="products-list-container">
        <h2>Products List</h2>
        <div className="products-table">
          <table>
            <thead>
              <tr>
                <th>Title</th>
                <th>Category</th>
                <th>Price</th>
                <th>Stock</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {products.length > 0 ? (
                products.map((product) => (
                  <tr key={product.id}>
                    <td>{product.title}</td>
                    <td>{product.category}</td>
                    <td>${product.price.toFixed(2)}</td>
                    <td>{product.stock}</td>
                    <td>
                      <div className="btn-gp">

                      <button
                        onClick={() => editProduct(product)}
                        className="btn btn-sm btn-primary"
                      >
                        Edit
                      </button>
                      {/* <button 
                          onClick={() => onDelete(product.id)} 
                          className="btn btn-sm btn-danger"
                        >
                          Delete
                        </button> */}
                      <Popup
                        trigger={
                          <button className="btn btn-sm btn-danger">
                            Delete
                          </button>
                        }
                        modal
                        nested
                      >
                        {(close) => (
                          <div >
                            <h3 >
                              Confirm Delete
                            </h3>
                            <p >
                              Are you sure you want to delete this product?
                            </p>
                            <div className="popup-buttons">
                              <button
                                className="btn btn-secondary"
                                onClick={close}
                              >
                                Cancel
                              </button>
                              <button
                                className="btn btn-danger"
                                onClick={() => handleDelete(close, product.id)}
                              >
                                Yes, Delete
                              </button>
                            </div>
                          </div>
                        )}
                      </Popup>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5">No products found</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="back-button">
          <button
            onClick={() => navigate("/dashboard")}
            className="btn btn-secondary"
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    </div>
  );
}

export default ProductManagement;
