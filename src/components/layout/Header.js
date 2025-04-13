import { Link, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { logout, reset } from "../../features/auth/authSlice";
import Popup from "reactjs-popup";

function Header() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);

  const onLogout = () => {
    dispatch(logout());
    dispatch(reset());
    navigate("/login");
  };

  return (
    <header className="header">
      <div className="logo">
        <Link to="/">CRM App</Link>
      </div>
      <ul>
        {user ? (
          <>
            <li>
              <Link to="/dashboard">Dashboard</Link>
            </li>
            <li>
              <Link to="/products">Products</Link>
            </li>
            <li>
              <Popup
                trigger={<button className="btn btn-logout">Logout</button>}
                modal
                nested
                contentStyle={{
                  padding: 0,
                  border: "none",
                  background: "transparent",
                }}
              >
                {(close) => (
                  <div>
                    <div className="popup-content">
                      <h4>Confirm Logout</h4>
                      <p>Are you sure you want to log out?</p>
                      <div className="popup-buttons">
                        <button className="btn btn-secondary" onClick={close}>
                          Cancel
                        </button>
                        <button className="btn btn-danger" onClick={onLogout}>
                          Yes, Logout
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </Popup>
            </li>
          </>
        ) : (
          <li>
            <Link to="/login">Login</Link>
          </li>
        )}
      </ul>
    </header>
  );
}

export default Header;
