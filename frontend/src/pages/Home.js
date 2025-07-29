import React from "react";
import { Typography } from "antd";

const Home = () => {
  return (
    <div style={{ textAlign: "center", marginTop: "40px" }}>
      <Typography.Title level={3}>
        Welcome to the Wine Quality Prediction Portal!
      </Typography.Title>

      <img
        src="/wine.jpg"
        alt="Wine Bottle"
        style={{ width: "300px", marginTop: "20px" }}
      />
    </div>
  );
};

export default Home;
