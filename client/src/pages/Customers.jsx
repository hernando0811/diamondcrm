import { useEffect, useState } from "react";
import api from "../services/api";

function Customers({ setCurrentPage, setSelectedCustomerId }) {
  const [customers, setCustomers] = useState([]);
  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    phone: "",
    email: "",
    address: "",
    notes: "",
  });
  const [error, setError] = useState("");

  const fetchCustomers = async () => {
    try {
      const response = await api.get("/customers");
      setCustomers(response.data);
    } catch (err) {
      console.error(err);
      setError("Could not load customers.");
    }
  };

  useEffect(() => {
    fetchCustomers();
  }, []);

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");

    if (!formData.first_name || !formData.last_name) {
      setError("First name and last name are required.");
      return;
    }

    try {
      await api.post("/customers", formData);

      setFormData({
        first_name: "",
        last_name: "",
        phone: "",
        email: "",
        address: "",
        notes: "",
      });

      fetchCustomers();
    } catch (err) {
      console.error(err);
      setError("Could not create customer.");
    }
  };

  return (
    <main className="page">
      <section className="page-header">
        <div>
          <p className="eyebrow">Customer Management</p>
          <h1>Customers</h1>
          <p className="hero-text">
            Add customers, store contact details, and keep notes for future
            service jobs.
          </p>
        </div>
      </section>

      <section className="content-grid">
        <form className="form-card" onSubmit={handleSubmit}>
          <h2>Add Customer</h2>

          {error && <p className="error">{error}</p>}

          <div className="form-row">
            <label>
              First Name
              <input
                type="text"
                name="first_name"
                value={formData.first_name}
                onChange={handleChange}
                placeholder="John"
              />
            </label>

            <label>
              Last Name
              <input
                type="text"
                name="last_name"
                value={formData.last_name}
                onChange={handleChange}
                placeholder="Smith"
              />
            </label>
          </div>

          <label>
            Phone
            <input
              type="text"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              placeholder="704-555-1234"
            />
          </label>

          <label>
            Email
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="customer@email.com"
            />
          </label>

          <label>
            Address
            <input
              type="text"
              name="address"
              value={formData.address}
              onChange={handleChange}
              placeholder="Charlotte, NC"
            />
          </label>

          <label>
            Notes
            <textarea
              name="notes"
              value={formData.notes}
              onChange={handleChange}
              placeholder="Customer notes..."
              rows="4"
            />
          </label>

          <button className="primary-btn" type="submit">
            Add Customer
          </button>
        </form>

        <section className="list-card">
          <div className="section-title">
            <h2>Customer List</h2>
            <span>{customers.length} total</span>
          </div>

          {customers.length === 0 ? (
            <p className="muted">No customers yet.</p>
          ) : (
            <div className="customer-list">
              {customers.map((customer) => (
                <article
                  className="customer-card clickable"
                  key={customer.id}
                  onClick={() => {
                    setSelectedCustomerId(customer.id);
                    setCurrentPage("customerDetails");
                  }}
                >
                  <div>
                    <h3>
                      {customer.first_name} {customer.last_name}
                    </h3>
                    <p>{customer.phone || "No phone listed"}</p>
                    <p>{customer.email || "No email listed"}</p>
                    <p>{customer.address || "No address listed"}</p>
                  </div>

                  {customer.notes && (
                    <p className="customer-notes">{customer.notes}</p>
                  )}

                  <p className="view-details">View customer details →</p>
                </article>
              ))}
            </div>
          )}
        </section>
      </section>
    </main>
  );
}

export default Customers;