function Navbar({ currentPage, setCurrentPage }) {
  return (
    <nav className="navbar">
      <div className="brand">
        <span className="brand-mark">◆</span>
        <span>Black Diamond</span>
      </div>

      <div className="nav-links">
        <button
          className={currentPage === "dashboard" ? "nav-link active" : "nav-link"}
          onClick={() => setCurrentPage("dashboard")}
        >
          Dashboard
        </button>

        <button
          className={currentPage === "customers" ? "nav-link active" : "nav-link"}
          onClick={() => setCurrentPage("customers")}
        >
          Customers
        </button>
      </div>
    </nav>
  );
}

export default Navbar;