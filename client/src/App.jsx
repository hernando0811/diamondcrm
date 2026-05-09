import { useState } from "react";
import Navbar from "./components/Navbar";
import Dashboard from "./pages/Dashboard";
import Customers from "./pages/Customers";
import CustomerDetails from "./pages/CustomerDetails";

function App() {
  const [currentPage, setCurrentPage] = useState("dashboard");
  const [selectedCustomerId, setSelectedCustomerId] = useState(null);

  return (
    <>
      <Navbar currentPage={currentPage} setCurrentPage={setCurrentPage} />

      {currentPage === "dashboard" && (
        <Dashboard
          setCurrentPage={setCurrentPage}
          setSelectedCustomerId={setSelectedCustomerId}
        />
      )}

      {currentPage === "customers" && (
        <Customers
          setCurrentPage={setCurrentPage}
          setSelectedCustomerId={setSelectedCustomerId}
        />
      )}

      {currentPage === "customerDetails" && selectedCustomerId && (
        <CustomerDetails
          customerId={selectedCustomerId}
          setCurrentPage={setCurrentPage}
        />
      )}
    </>
  );
}

export default App;