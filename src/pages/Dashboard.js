import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { getProducts } from '../features/products/productsSlice';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import toast from 'react-hot-toast';
import { Bars } from 'react-loader-spinner';

function Dashboard() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { user } = useSelector((state) => state.auth);
  const { products, isLoading, isError, message } = useSelector((state) => state.products);

  useEffect(() => {
    if (isError) {
      console.error(message);
      toast.error(message)
    }

    if (!user) {
      navigate('/login');
      return;
    }

    dispatch(getProducts());
  }, [user, navigate, isError, message, dispatch]);

  // Prepare data for the chart
  const chartData = products.slice(0, 10).map(product => ({
    name: product.title.substring(0, 10) + '...',
    price: product.price,
    stock: product.stock,
  }));

  return (
    <div className="dashboard-container">
      <h1>Dashboard</h1>
      <div className="welcome-section">
        <h2>Welcome, {user?.firstName || 'User'}</h2>
        <p>Here's your CRM overview</p>
      </div>

      <div className="stats-cards">
        <div className="stat-card">
          <h3>Total Products</h3>
          <p>{products.length }</p>
        </div>
        <div className="stat-card">
          <h3>Total Value</h3>
          <p>${products.reduce((acc, product) => acc + product.price, 0).toFixed(2) }</p>
        </div>
        <div className="stat-card">
          <h3>Low Stock</h3>
          <p>{products.filter(product => product.stock < 10).length}</p>
        </div>
      </div>

      <div className="chart-container">
        <h3>Product Price vs Stock</h3>
        {isLoading ? (
         <div className='chart-loader'>
           <div ><Bars
          height="80"
          width="80"
          color="#4fa94d"
          ariaLabel="bars-loading"
          wrapperStyle={{}}
          wrapperClass=""
          visible={true}
          />
          <p>Loading....</p>
          </div>
         </div>
        ) : (
          <ResponsiveContainer width="100%" height={300}>
            <BarChart
              data={chartData}
              margin={{
                top: 5,
                right: 30,
                left: 20,
                bottom: 5,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="price" fill="#8884d8" name="Price ($)" />
              <Bar dataKey="stock" fill="#82ca9d" name="Stock" />
            </BarChart>
          </ResponsiveContainer>
        )}
      </div>

      <div className="action-buttons">
        <button className="btn btn-primary" onClick={() => navigate('/products')}>
          Manage Products
        </button>
      </div>
    </div>
  );
}

export default Dashboard; 