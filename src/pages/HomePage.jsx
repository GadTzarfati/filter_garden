import React from "react";
import { Link } from "react-router-dom";

const HomePage = () => {
  return (
    <div>
      <h2>Welcome to Filter Garden</h2>
      <p>Select an action:</p>
      <Link to="/tree-view" className="link-button">
        <img src="https://cdn-icons-png.flaticon.com/512/751/751463.png" alt="search icon" />
        Open Tree-View Editor
      </Link>
    </div>
  );
};

export default HomePage;
