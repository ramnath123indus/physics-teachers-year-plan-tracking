import express from 'express';

const router = express.Router();

// Test student route
router.get('/', (req, res) => {
  res.json({ message: 'Student route is working!' });
});

export default router;