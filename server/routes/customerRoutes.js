const express = require("express");

const {
  getCustomers,
  getCustomerById,
  createCustomer,
  updateCustomer,
  deleteCustomer,
  searchCustomers,
} = require("../controllers/customerController");

const { getJobsByCustomer } = require("../controllers/jobController");

const router = express.Router();

router.get("/", getCustomers);
router.get("/search", searchCustomers);
router.get("/:customerId/jobs", getJobsByCustomer);
router.get("/:id", getCustomerById);
router.post("/", createCustomer);
router.put("/:id", updateCustomer);
router.delete("/:id", deleteCustomer);

module.exports = router;