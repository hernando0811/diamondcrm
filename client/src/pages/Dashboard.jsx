import { useEffect, useState } from "react";
import api from "../services/api";
import StatCard from "../components/StatCard";

function Dashboard({ setCurrentPage, setSelectedCustomerId }) {
  const [stats, setStats] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [hasSearched, setHasSearched] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await api.get("/dashboard/stats");
        setStats(response.data);
      } catch (err) {
        console.error(err);
        setError("Could not load dashboard stats.");
      }
    };

    fetchStats();
  }, []);

  const handleSearch = async (event) => {
    event.preventDefault();
    setError("");
    setHasSearched(true);

    if (!searchQuery.trim()) {
      setSearchResults([]);
      setError("Enter a name, email, or phone number to search.");
      return;
    }

    try {
      const response = await api.get(
        `/customers/search?query=${encodeURIComponent(searchQuery)}`
      );

      setSearchResults(response.data);
    } catch (err) {
      console.error(err);
      setError("Could not search customers.");
    }
  };

  const clearSearch = () => {
    setSearchQuery("");
    setSearchResults([]);
    setHasSearched(false);
    setError("");
  };

  if (!stats) {
    return (
      <main className="page">
        <h1>DiamondCRM</h1>
        <p>Loading dashboard...</p>
      </main>
    );
  }

  return (
    <main className="page">
      <section className="hero">
        <p className="eyebrow">Service Business CRM</p>
        <h1>Admin Dashboard</h1>
        <p className="hero-text">
          Track customers, jobs, scheduling, and revenue.
        </p>
      </section>

      {error && <p className="error">{error}</p>}

      <section className="stats-grid">
        <StatCard title="Total Customers" value={stats.total_customers} />
        <StatCard title="Total Jobs" value={stats.total_jobs} />
        <StatCard title="Pending Jobs" value={stats.pending_jobs} />
        <StatCard title="Scheduled Jobs" value={stats.scheduled_jobs} />
        <StatCard title="Completed Jobs" value={stats.completed_jobs} />
        <StatCard
          title="Estimated Revenue"
          value={`$${stats.estimated_revenue}`}
        />
        <StatCard
          title="Completed Revenue"
          value={`$${stats.completed_revenue}`}
        />
      </section>

      <section className="dashboard-search-card">
        <div className="section-title">
          <h2>Customer Lookup</h2>
          {hasSearched && (
            <button className="secondary-btn no-margin" onClick={clearSearch}>
              Clear
            </button>
          )}
        </div>

        <form className="dashboard-search-form" onSubmit={handleSearch}>
          <input
            type="text"
            value={searchQuery}
            onChange={(event) => setSearchQuery(event.target.value)}
            placeholder="Search by name, email, or phone..."
          />

          <button className="primary-btn" type="submit">
            Search
          </button>
        </form>

        {hasSearched && searchResults.length === 0 && (
          <p className="muted">No matching customers found.</p>
        )}

        {searchResults.length > 0 && (
          <div className="customer-list search-results">
            {searchResults.map((customer) => (
              <article
                 className="customer-card clickable"
                 key={customer.id}
                    onClick={() => {
                    setSelectedCustomerId(customer.id);
                     setCurrentPage("customerDetails");
  }}
>
                <h3>
                  {customer.first_name} {customer.last_name}
                </h3>
                <p>{customer.phone || "No phone listed"}</p>
                <p>{customer.email || "No email listed"}</p>
                <p>{customer.address || "No address listed"}</p>

                {customer.notes && (
                  <p className="customer-notes">{customer.notes}</p>
                )}
                <p className="view-details">View customer profile →</p>
              </article>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}

export default Dashboard;