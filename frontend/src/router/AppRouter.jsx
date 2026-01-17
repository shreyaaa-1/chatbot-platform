import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import ProtectedRoute from "./ProtectedRoute";
import Layout from "../components/Layout";
import { useEffect } from "react";
import api from "../api/axios";
import Login from "../auth/Login";
import Register from "../auth/Register";


// Temporary placeholders (real pages come later)
const Dashboard = () => {
  useEffect(() => {
    api
      .get("/projects")
      .then((res) => console.log("Projects:", res.data))
      .catch((err) => console.error(err));
  }, []);

  return <div>Dashboard</div>;
};
const ProjectDetail = () => <div>Project Detail</div>;

export default function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/dashboard" />} />

        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Layout>
                <Dashboard />
              </Layout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/projects/:id"
          element={
            <ProtectedRoute>
              <Layout>
                <ProjectDetail />
              </Layout>
            </ProtectedRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}
