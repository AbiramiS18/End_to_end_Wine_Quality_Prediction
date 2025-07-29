import React, { useState } from "react";

const Prediction = ({ onPrediction }) => {
  const [formData, setFormData] = useState({
    fixed_acidity: "",
    volatile_acidity: "",
    citric_acid: "",
    residual_sugar: "",
    chlorides: "",
    free_sulfur_dioxide: "",
    total_sulfur_dioxide: "",
    density: "",
    pH: "",
    sulphates: "",
    alcohol: "",
    type: "red",
  });

  const [prediction, setPrediction] = useState(null);
  const [qualityLabel, setQualityLabel] = useState("");

  const handleChange = (e) => {
    const value = e.target.value;
    setFormData({
      ...formData,
      [e.target.name]: value === "" ? "" : parseFloat(value),
    });
  };

  const getQualityCategory = (quality) => {
    if (quality <= 5) return "Low";
    if (quality === 6) return "Medium";
    return "High";
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch("http://localhost:8000/predict", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error("Prediction failed");
      }

      const data = await response.json();
      setPrediction(data.prediction);

      const category = getQualityCategory(data.prediction);
      setQualityLabel(category);

      if (onPrediction) onPrediction(data.prediction);
    } catch (error) {
      console.error("Prediction error:", error);
    }
  };

  const getMessage = (label) => {
    switch (label) {
      case "Low":
        return "Your wine is Low quality wine 🧃";
      case "Medium":
        return "Your wine is Medium quality wine 🍷";
      case "High":
        return "Your wine is High quality wine 🍷";
      default:
        return "";
    }
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        height: "calc(100vh - 64px)",
        overflow: "hidden",
        justifyContent: "center",
      }}
    >
      <form
        onSubmit={handleSubmit}
        style={{
          maxWidth: "800px",
          width: "100%",
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: "16px",
          padding: "20px",
        }}
      >
        {/* Wine Type Select */}
        <div style={{ display: "flex", flexDirection: "column" }}>
          <label style={{ fontWeight: "bold", marginBottom: "4px" }}>
            Type:
          </label>
          <select
            name="type"
            value={formData.type}
            onChange={handleChange}
            style={{
              padding: "8px",
              border: "1px solid #ccc",
              borderRadius: "4px",
            }}
          >
            <option value="red">Red</option>
            <option value="white">White</option>
          </select>
        </div>

        {/* Other numeric fields */}
        {Object.keys(formData)
          .filter((field) => field !== "type")
          .map((field) => (
            <div
              key={field}
              style={{ display: "flex", flexDirection: "column" }}
            >
              <label style={{ fontWeight: "bold", marginBottom: "4px" }}>
                {field.replace(/_/g, " ")}:
              </label>
              <input
                type="number"
                step="any"
                name={field}
                value={formData[field]}
                onChange={handleChange}
                required
                style={{
                  padding: "8px",
                  border: "1px solid #ccc",
                  borderRadius: "4px",
                }}
              />
            </div>
          ))}

        <div
          style={{
            gridColumn: "1 / -1",
            textAlign: "center",
            marginTop: "10px",
          }}
        >
          <button
            type="submit"
            style={{
              padding: "10px 20px",
              fontWeight: "bold",
              backgroundColor: "#1890ff",
              color: "white",
              border: "none",
              borderRadius: "4px",
              cursor: "pointer",
            }}
          >
            Predict
          </button>
        </div>
      </form>

      {prediction !== null && (
        <div style={{ marginTop: "20px", textAlign: "center" }}>
          <h2>
            Wine Quality:{" "}
            <span style={{ color: "#1890ff", fontWeight: "bold" }}>
              {prediction} ({qualityLabel})
            </span>
          </h2>
          <p
            style={{
              fontWeight: "bold",
              fontSize: "18px",
              color:
                qualityLabel === "Low"
                  ? "red"
                  : qualityLabel === "Medium"
                  ? "#f0ad4e"
                  : "green",
            }}
          >
            {getMessage(qualityLabel)}
          </p>
        </div>
      )}
    </div>
  );
};

export default Prediction;
