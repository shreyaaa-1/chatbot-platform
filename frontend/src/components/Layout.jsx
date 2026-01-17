import Sidebar from "./Sidebar";

export default function Layout({ children }) {
  return (
    <div className="h-screen flex bg-[#0f0f0f]">
      <Sidebar />
      <main className="flex-1 flex flex-col">
        {children}
      </main>
    </div>
  );
}
