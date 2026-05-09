const pool = require("../config/db");

const getJobs = async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT jobs.*, 
              customers.first_name, 
              customers.last_name
       FROM jobs
       JOIN customers ON jobs.customer_id = customers.id
       ORDER BY jobs.created_at DESC`
    );

    res.json(result.rows);
  } catch (error) {
    console.error("Error getting jobs:", error);
    res.status(500).json({ message: "Server error" });
  }
};

const getJobById = async (req, res) => {
  try {
    const { id } = req.params;

    const result = await pool.query(
      `SELECT jobs.*, 
              customers.first_name, 
              customers.last_name
       FROM jobs
       JOIN customers ON jobs.customer_id = customers.id
       WHERE jobs.id = $1`,
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Job not found" });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error("Error getting job:", error);
    res.status(500).json({ message: "Server error" });
  }
};

const getJobsByCustomer = async (req, res) => {
  try {
    const { customerId } = req.params;

    const result = await pool.query(
      `SELECT *
       FROM jobs
       WHERE customer_id = $1
       ORDER BY created_at DESC`,
      [customerId]
    );

    res.json(result.rows);
  } catch (error) {
    console.error("Error getting customer jobs:", error);
    res.status(500).json({ message: "Server error" });
  }
};

const createJob = async (req, res) => {
  try {
    const {
      customer_id,
      title,
      description,
      status,
      scheduled_date,
      estimated_price,
      final_price,
      notes,
    } = req.body;

    const result = await pool.query(
      `INSERT INTO jobs
       (customer_id, title, description, status, scheduled_date, estimated_price, final_price, notes)
       VALUES ($1, $2, $3, COALESCE($4, 'pending'), $5, $6, $7, $8)
       RETURNING *`,
      [
        customer_id,
        title,
        description,
        status,
        scheduled_date,
        estimated_price,
        final_price,
        notes,
      ]
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error("Error creating job:", error);
    res.status(500).json({ message: "Server error" });
  }
};

const updateJob = async (req, res) => {
  try {
    const { id } = req.params;

    const {
      customer_id,
      title,
      description,
      status,
      scheduled_date,
      estimated_price,
      final_price,
      notes,
    } = req.body;

    const result = await pool.query(
      `UPDATE jobs
       SET customer_id = $1,
           title = $2,
           description = $3,
           status = $4,
           scheduled_date = $5,
           estimated_price = $6,
           final_price = $7,
           notes = $8,
           updated_at = CURRENT_TIMESTAMP
       WHERE id = $9
       RETURNING *`,
      [
        customer_id,
        title,
        description,
        status,
        scheduled_date,
        estimated_price,
        final_price,
        notes,
        id,
      ]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Job not found" });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error("Error updating job:", error);
    res.status(500).json({ message: "Server error" });
  }
};

const deleteJob = async (req, res) => {
  try {
    const { id } = req.params;

    const result = await pool.query(
      "DELETE FROM jobs WHERE id = $1 RETURNING *",
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Job not found" });
    }

    res.json({
      message: "Job deleted successfully",
      deletedJob: result.rows[0],
    });
  } catch (error) {
    console.error("Error deleting job:", error);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = {
  getJobs,
  getJobById,
  getJobsByCustomer,
  createJob,
  updateJob,
  deleteJob,
};