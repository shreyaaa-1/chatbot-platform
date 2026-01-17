import { useEffect, useState } from "react";
import api from "../api/axios";
import Sidebar from "./Sidebar";

export default function Layout({ children }) {
  const [projects, setProjects] = useState([]);

  useEffect(() => {
    api.get("/projects").then((res) => setProjects(res.data));
  }, []);

  return (
    <div className="h-screen flex bg-[#0f0f0f] overflow-hidden">
      <Sidebar projects={projects} />

      <main className="flex-1 overflow-y-auto">
        {typeof children === "function"
          ? children({ projects, setProjects })
          : children}
      </main>
    </div>
  );
}
