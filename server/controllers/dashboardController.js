const pool = require("../config/db");

const getDashboardStats = async (req, res) => {
  try {
    const totalCustomersResult = await pool.query(
      "SELECT COUNT(*) FROM customers"
    );

    const totalJobsResult = await pool.query(
      "SELECT COUNT(*) FROM jobs"
    );

    const pendingJobsResult = await pool.query(
      "SELECT COUNT(*) FROM jobs WHERE status = 'pending'"
    );

    const scheduledJobsResult = await pool.query(
      "SELECT COUNT(*) FROM jobs WHERE status = 'scheduled'"
    );

    const completedJobsResult = await pool.query(
      "SELECT COUNT(*) FROM jobs WHERE status = 'completed'"
    );

    const estimatedRevenueResult = await pool.query(
      "SELECT COALESCE(SUM(estimated_price), 0) FROM jobs"
    );

    const completedRevenueResult = await pool.query(
      "SELECT COALESCE(SUM(final_price), 0) FROM jobs WHERE status = 'completed'"
    );

    res.json({
      total_customers: Number(totalCustomersResult.rows[0].count),
      total_jobs: Number(totalJobsResult.rows[0].count),
      pending_jobs: Number(pendingJobsResult.rows[0].count),
      scheduled_jobs: Number(scheduledJobsResult.rows[0].count),
      completed_jobs: Number(completedJobsResult.rows[0].count),
      estimated_revenue: Number(estimatedRevenueResult.rows[0].coalesce),
      completed_revenue: Number(completedRevenueResult.rows[0].coalesce),
    });
  } catch (error) {
    console.error("Error getting dashboard stats:", error);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = {
  getDashboardStats,
};