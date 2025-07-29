import React, { useEffect, useState } from "react";
import { Row, Col, Card, Typography, Spin, Alert } from "antd";
import {
  BarChart,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  CartesianGrid,
  Bar,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";

const { Title } = Typography;

const COLORS = ["#0088FE", "#00C49F", "#FFBB28"];

const Dashboard = () => {
  const [metrics, setMetrics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch("http://127.0.0.1:8000/metrics")
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch metrics");
        return res.json();
      })
      .then((data) => {
        setMetrics(data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  if (loading) return <Spin size="large" />;
  if (error)
    return <Alert message="Error" description={error} type="error" showIcon />;

  return (
    <div style={{ padding: 24 }}>
      <Row gutter={[16, 16]}>
        <Col xs={24} md={12} lg={12}>
          <Card title="Alcohol by Quality">
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={metrics.alcohol_by_quality}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="quality_label" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="alcohol" fill="#8884d8" />
              </BarChart>
            </ResponsiveContainer>
          </Card>
        </Col>

        <Col xs={24} md={12} lg={12}>
          <Card title="Sulphates by Quality">
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={metrics.sulphates_by_quality}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="quality_label" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="sulphates" fill="#82ca9d" />
              </BarChart>
            </ResponsiveContainer>
          </Card>
        </Col>

        <Col xs={24} md={12} lg={12}>
          <Card title="Volatile Acidity by Quality">
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={metrics.volatile_by_quality}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="quality_label" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="volatile acidity" fill="#ffc658" />
              </BarChart>
            </ResponsiveContainer>
          </Card>
        </Col>

        <Col xs={24} md={12} lg={12}>
          <Card title="Quality Distribution (Pie Chart)">
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={metrics.quality_distribution}
                  dataKey="percentage"
                  nameKey="quality_label"
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  label={({ name, percent }) =>
                    `${name}: ${(percent * 100).toFixed(0)}%`
                  }
                >
                  {metrics.quality_distribution.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => `${value.toFixed(1)}%`} />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default Dashboard;
