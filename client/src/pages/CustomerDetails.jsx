import { useEffect, useState } from "react";
import api from "../services/api";

function CustomerDetails({ customerId, setCurrentPage }) {
  const [customer, setCustomer] = useState(null);
  const [jobs, setJobs] = useState([]);
  const [jobFormData, setJobFormData] = useState({
    title: "",
    description: "",
    status: "pending",
    scheduled_date: "",
    estimated_price: "",
    final_price: "",
    notes: "",
  });
  const [editingJobId, setEditingJobId] = useState(null);
  const [editJobData, setEditJobData] = useState({
    title: "",
    description: "",
    status: "pending",
    scheduled_date: "",
    estimated_price: "",
    final_price: "",
    notes: "",
  });
  const [error, setError] = useState("");

  const fetchCustomerDetails = async () => {
    try {
      const customerResponse = await api.get(`/customers/${customerId}`);
      const jobsResponse = await api.get(`/customers/${customerId}/jobs`);

      setCustomer(customerResponse.data);
      setJobs(jobsResponse.data);
    } catch (err) {
      console.error(err);
      setError("Could not load customer details.");
    }
  };

  useEffect(() => {
    fetchCustomerDetails();
  }, [customerId]);

  const handleJobChange = (event) => {
    const { name, value } = event.target;

    setJobFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleJobSubmit = async (event) => {
    event.preventDefault();
    setError("");

    if (!jobFormData.title) {
      setError("Job title is required.");
      return;
    }

    try {
      await api.post("/jobs", {
        customer_id: customerId,
        title: jobFormData.title,
        description: jobFormData.description,
        status: jobFormData.status,
        scheduled_date: jobFormData.scheduled_date || null,
        estimated_price: jobFormData.estimated_price || null,
        final_price: jobFormData.final_price || null,
        notes: jobFormData.notes,
      });

      setJobFormData({
        title: "",
        description: "",
        status: "pending",
        scheduled_date: "",
        estimated_price: "",
        final_price: "",
        notes: "",
      });

      fetchCustomerDetails();
    } catch (err) {
      console.error(err);
      setError("Could not create job.");
    }
  };

  const startEditingJob = (job) => {
    setEditingJobId(job.id);

    setEditJobData({
      title: job.title || "",
      description: job.description || "",
      status: job.status || "pending",
      scheduled_date: job.scheduled_date ? job.scheduled_date.slice(0, 10) : "",
      estimated_price: job.estimated_price || "",
      final_price: job.final_price || "",
      notes: job.notes || "",
    });
  };

  const cancelEditingJob = () => {
    setEditingJobId(null);

    setEditJobData({
      title: "",
      description: "",
      status: "pending",
      scheduled_date: "",
      estimated_price: "",
      final_price: "",
      notes: "",
    });
  };

  const handleEditJobChange = (event) => {
    const { name, value } = event.target;

    setEditJobData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleUpdateJob = async (jobId) => {
    setError("");

    if (!editJobData.title) {
      setError("Job title is required.");
      return;
    }

    try {
      await api.put(`/jobs/${jobId}`, {
        customer_id: customerId,
        title: editJobData.title,
        description: editJobData.description,
        status: editJobData.status,
        scheduled_date: editJobData.scheduled_date || null,
        estimated_price: editJobData.estimated_price || null,
        final_price: editJobData.final_price || null,
        notes: editJobData.notes,
      });

      cancelEditingJob();
      fetchCustomerDetails();
    } catch (err) {
      console.error(err);
      setError("Could not update job.");
    }
  };

  const handleDeleteJob = async (jobId) => {
    const confirmed = window.confirm("Are you sure you want to delete this job?");

    if (!confirmed) {
      return;
    }

    try {
      await api.delete(`/jobs/${jobId}`);
      fetchCustomerDetails();
    } catch (err) {
      console.error(err);
      setError("Could not delete job.");
    }
  };

  if (error && !customer) {
    return (
      <main className="page">
        <button
          className="secondary-btn"
          onClick={() => setCurrentPage("customers")}
        >
          ← Back to Customers
        </button>

        <p className="error">{error}</p>
      </main>
    );
  }

  if (!customer) {
    return (
      <main className="page">
        <p>Loading customer details...</p>
      </main>
    );
  }

  return (
    <main className="page">
      <button
        className="secondary-btn"
        onClick={() => setCurrentPage("customers")}
      >
        ← Back to Customers
      </button>

      <section className="page-header customer-detail-header">
        <div>
          <p className="eyebrow">Customer Profile</p>
          <h1>
            {customer.first_name} {customer.last_name}
          </h1>
          <p className="hero-text">
            View customer contact information, create new service jobs, and
            review service history.
          </p>
        </div>
      </section>

      {error && <p className="error">{error}</p>}

      <section className="details-grid">
        <div className="details-left-column">
          <article className="list-card">
            <h2>Contact Information</h2>

            <div className="detail-list">
              <p>
                <strong>Phone:</strong> {customer.phone || "No phone listed"}
              </p>
              <p>
                <strong>Email:</strong> {customer.email || "No email listed"}
              </p>
              <p>
                <strong>Address:</strong>{" "}
                {customer.address || "No address listed"}
              </p>
              <p>
                <strong>Notes:</strong> {customer.notes || "No notes listed"}
              </p>
            </div>
          </article>

          <form className="form-card" onSubmit={handleJobSubmit}>
            <h2>Add Service Job</h2>

            <label>
              Job Title
              <input
                type="text"
                name="title"
                value={jobFormData.title}
                onChange={handleJobChange}
                placeholder="Laptop Diagnostic"
              />
            </label>

            <label>
              Description
              <textarea
                name="description"
                value={jobFormData.description}
                onChange={handleJobChange}
                placeholder="Describe the customer issue..."
                rows="3"
              />
            </label>

            <label>
              Status
              <select
                name="status"
                value={jobFormData.status}
                onChange={handleJobChange}
              >
                <option value="pending">Pending</option>
                <option value="scheduled">Scheduled</option>
                <option value="completed">Completed</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </label>

            <label>
              Scheduled Date
              <input
                type="date"
                name="scheduled_date"
                value={jobFormData.scheduled_date}
                onChange={handleJobChange}
              />
            </label>

            <div className="form-row">
              <label>
                Estimated Price
                <input
                  type="number"
                  step="0.01"
                  name="estimated_price"
                  value={jobFormData.estimated_price}
                  onChange={handleJobChange}
                  placeholder="90.00"
                />
              </label>

              <label>
                Final Price
                <input
                  type="number"
                  step="0.01"
                  name="final_price"
                  value={jobFormData.final_price}
                  onChange={handleJobChange}
                  placeholder="120.00"
                />
              </label>
            </div>

            <label>
              Job Notes
              <textarea
                name="notes"
                value={jobFormData.notes}
                onChange={handleJobChange}
                placeholder="Internal notes about the job..."
                rows="3"
              />
            </label>

            <button className="primary-btn" type="submit">
              Add Job
            </button>
          </form>
        </div>

        <article className="list-card">
          <div className="section-title">
            <h2>Service Jobs</h2>
            <span>{jobs.length} total</span>
          </div>

          {jobs.length === 0 ? (
            <p className="muted">No jobs for this customer yet.</p>
          ) : (
            <div className="job-list">
              {jobs.map((job) => (
                <article className="job-card" key={job.id}>
                  {editingJobId === job.id ? (
                    <div className="edit-job-form">
                      <label>
                        Job Title
                        <input
                          type="text"
                          name="title"
                          value={editJobData.title}
                          onChange={handleEditJobChange}
                        />
                      </label>

                      <label>
                        Description
                        <textarea
                          name="description"
                          value={editJobData.description}
                          onChange={handleEditJobChange}
                          rows="3"
                        />
                      </label>

                      <label>
                        Status
                        <select
                          name="status"
                          value={editJobData.status}
                          onChange={handleEditJobChange}
                        >
                          <option value="pending">Pending</option>
                          <option value="scheduled">Scheduled</option>
                          <option value="completed">Completed</option>
                          <option value="cancelled">Cancelled</option>
                        </select>
                      </label>

                      <label>
                        Scheduled Date
                        <input
                          type="date"
                          name="scheduled_date"
                          value={editJobData.scheduled_date}
                          onChange={handleEditJobChange}
                        />
                      </label>

                      <div className="form-row">
                        <label>
                          Estimated Price
                          <input
                            type="number"
                            step="0.01"
                            name="estimated_price"
                            value={editJobData.estimated_price}
                            onChange={handleEditJobChange}
                          />
                        </label>

                        <label>
                          Final Price
                          <input
                            type="number"
                            step="0.01"
                            name="final_price"
                            value={editJobData.final_price}
                            onChange={handleEditJobChange}
                          />
                        </label>
                      </div>

                      <label>
                        Job Notes
                        <textarea
                          name="notes"
                          value={editJobData.notes}
                          onChange={handleEditJobChange}
                          rows="3"
                        />
                      </label>

                      <div className="job-actions">
                        <button
                          className="primary-btn"
                          type="button"
                          onClick={() => handleUpdateJob(job.id)}
                        >
                          Save Changes
                        </button>

                        <button
                          className="secondary-btn no-margin"
                          type="button"
                          onClick={cancelEditingJob}
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  ) : (
                    <>
                      <div className="job-card-header">
                        <div>
                          <h3>{job.title}</h3>
                          <p>{job.description || "No description provided."}</p>
                        </div>

                        <span className={`status-badge ${job.status}`}>
                          {job.status}
                        </span>
                      </div>

                      <div className="job-meta">
                        <p>
                          <strong>Scheduled:</strong>{" "}
                          {job.scheduled_date
                            ? new Date(job.scheduled_date).toLocaleDateString()
                            : "Not scheduled"}
                        </p>
                        <p>
                          <strong>Estimate:</strong>{" "}
                          {job.estimated_price
                            ? `$${job.estimated_price}`
                            : "No estimate"}
                        </p>
                        <p>
                          <strong>Final:</strong>{" "}
                          {job.final_price
                            ? `$${job.final_price}`
                            : "Not finalized"}
                        </p>
                      </div>

                      {job.notes && <p className="job-notes">{job.notes}</p>}

                      <div className="job-actions">
                        <button
                          className="secondary-btn no-margin"
                          type="button"
                          onClick={() => startEditingJob(job)}
                        >
                          Edit
                        </button>

                        <button
                          className="danger-btn"
                          type="button"
                          onClick={() => handleDeleteJob(job.id)}
                        >
                          Delete
                        </button>
                      </div>
                    </>
                  )}
                </article>
              ))}
            </div>
          )}
        </article>
      </section>
    </main>
  );
}

export default CustomerDetails;