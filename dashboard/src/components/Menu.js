import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

const Menu = () => {
  const [selectedMenu, setSelectedMenu] = useState(0);
  const [isProfileDropDownOpen, setIsProfileDropDownOpen] = useState(false);
  const [username, setUsername] = useState("USERID");

  useEffect(() => {
    const verifyUser = async () => {
      try {
        const { data } = await axios.post(
          "http://localhost:3002/auth",
          {},
          { withCredentials: true }
        );

        if (data?.status && data?.user) {
          setUsername(data.user);
        }
      } catch (error) {
        console.log(error);
      }
    };

    verifyUser();
  }, []);

  const handleMenuClick = (index) => {
    setSelectedMenu(index);
  };

  const handleProfileClick = () => {
    setIsProfileDropDownOpen(!isProfileDropDownOpen);
  };

  const handleLogout = () => {
    document.cookie = "token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    window.location.href = "http://localhost:3000/";
  };

  const menuClass = "menu";
  const activeMenuClass = "menu selected";

  return (
    <div className="menu-container">
     <img src="/logo.png" alt="KiteImg" style={{ width: "50px" }} />
      <div className="menus">
        <ul>
          <li>
            <Link style={{ textDecoration: "none" }} to="/dashboard"
              onClick={() => handleMenuClick(0)}>
              <p className={selectedMenu === 0 ? activeMenuClass : menuClass}>Dashboard</p>
            </Link>
          </li>
          <li>
            <Link style={{ textDecoration: "none" }} to="/dashboard/orders"
              onClick={() => handleMenuClick(1)}>
              <p className={selectedMenu === 1 ? activeMenuClass : menuClass}>Orders</p>
            </Link>
          </li>
          <li>
            <Link style={{ textDecoration: "none" }} to="/dashboard/holdings"
              onClick={() => handleMenuClick(2)}>
              <p className={selectedMenu === 2 ? activeMenuClass : menuClass}>Holdings</p>
            </Link>
          </li>
          <li>
            <Link style={{ textDecoration: "none" }} to="/dashboard/positions"
              onClick={() => handleMenuClick(3)}>
              <p className={selectedMenu === 3 ? activeMenuClass : menuClass}>Positions</p>
            </Link>
          </li>
          <li>
            <Link style={{ textDecoration: "none" }} to="/dashboard/funds"
              onClick={() => handleMenuClick(4)}>
              <p className={selectedMenu === 4 ? activeMenuClass : menuClass}>Funds</p>
            </Link>
          </li>
          <li>
            <Link style={{ textDecoration: "none" }} to="/dashboard/apps"
              onClick={() => handleMenuClick(5)}>
              <p className={selectedMenu === 5 ? activeMenuClass : menuClass}>Apps</p>
            </Link>
          </li>
        </ul>
        <hr />
        <div className="profile" onClick={handleProfileClick}>
          <div className="avatar">{username.charAt(0).toUpperCase()}</div>
          <p className="username">{username}</p>
        </div>
        {isProfileDropDownOpen && (
          <div className="profile-dropdown">
            <p className="profile-name">{username}</p>
            <button type="button" className="logout-btn" onClick={handleLogout}>
              Logout
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Menu;
