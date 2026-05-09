const pool = require("../config/db");

const searchCustomers = async (req, res) => {
  try {
    const { query } = req.query;

    if (!query || !query.trim()) {
      return res.status(400).json({ message: "Search query is required" });
    }

    const searchTerm = `%${query.trim()}%`;

    const result = await pool.query(
      `SELECT *
       FROM customers
       WHERE first_name ILIKE $1
          OR last_name ILIKE $1
          OR CONCAT(first_name, ' ', last_name) ILIKE $1
          OR email ILIKE $1
          OR phone ILIKE $1
       ORDER BY created_at DESC`,
      [searchTerm]
    );

    res.json(result.rows);
  } catch (error) {
    console.error("Error searching customers:", error);
    res.status(500).json({ message: "Server error" });
  }
};

const getCustomers = async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT * FROM customers ORDER BY created_at DESC"
    );

    res.json(result.rows);
  } catch (error) {
    console.error("Error getting customers:", error);
    res.status(500).json({ message: "Server error" });
  }
};

const getCustomerById = async (req, res) => {
  try {
    const { id } = req.params;

    const result = await pool.query(
      "SELECT * FROM customers WHERE id = $1",
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Customer not found" });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error("Error getting customer:", error);
    res.status(500).json({ message: "Server error" });
  }
};

const createCustomer = async (req, res) => {
  try {
    const { first_name, last_name, phone, email, address, notes } = req.body;

    const result = await pool.query(
      `INSERT INTO customers 
       (first_name, last_name, phone, email, address, notes)
       VALUES ($1, $2, $3, $4, $5, $6)
       RETURNING *`,
      [first_name, last_name, phone, email, address, notes]
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error("Error creating customer:", error);
    res.status(500).json({ message: "Server error" });
  }
};

const updateCustomer = async (req, res) => {
  try {
    const { id } = req.params;
    const { first_name, last_name, phone, email, address, notes } = req.body;

    const result = await pool.query(
      `UPDATE customers
       SET first_name = $1,
           last_name = $2,
           phone = $3,
           email = $4,
           address = $5,
           notes = $6
       WHERE id = $7
       RETURNING *`,
      [first_name, last_name, phone, email, address, notes, id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Customer not found" });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error("Error updating customer:", error);
    res.status(500).json({ message: "Server error" });
  }
};

const deleteCustomer = async (req, res) => {
  try {
    const { id } = req.params;

    const result = await pool.query(
      "DELETE FROM customers WHERE id = $1 RETURNING *",
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Customer not found" });
    }

    res.json({
      message: "Customer deleted successfully",
      deletedCustomer: result.rows[0],
    });
  } catch (error) {
    console.error("Error deleting customer:", error);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = {
  getCustomers,
  getCustomerById,
  createCustomer,
  updateCustomer,
  deleteCustomer,
  searchCustomers,
};