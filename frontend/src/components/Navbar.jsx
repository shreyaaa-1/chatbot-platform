export default function Navbar() {
  return (
    <nav className="h-14 bg-gray-900 text-white flex items-center justify-between px-6">
      <h1 className="text-lg font-semibold">
        Chatbot Platform
      </h1>

      <button className="text-sm hover:underline">
        Logout
      </button>
    </nav>
  );
}
