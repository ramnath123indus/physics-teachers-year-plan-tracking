import express from 'express';
import Teacher from '../models/Teacher.js';

const router = express.Router();

// Login Route (Becomes POST /api/login when mounted in server.js)
router.post('/login', async (req, res) => {
  const { username, password } = req.body;

  // 1. Check for Admin credentials
  if (username === 'admin' && password === 'admin123') {
    return res.json({
      role: 'admin',
      username: 'admin',
      message: 'Admin login successful'
    });
  }

  // 2. Check for Default Teacher credentials
  if (username === 'teacher' && password === 'teacher123') {
    return res.json({
      role: 'teacher',
      username: 'teacher',
      message: 'Teacher login successful'
    });
  }

  // 3. Check against teachers registered in your database
  try {
    const teacherDoc = await Teacher.findOne({ teacherName: username });
    
    if (teacherDoc && password === 'teacher123') {
      return res.json({
        role: 'teacher',
        username: teacherDoc.teacherName,
        teacherId: teacherDoc._id,
        assignments: teacherDoc.assignments,
        message: 'Teacher login successful'
      });
    }
  } catch (err) {
    console.error('Database login error:', err);
  }

  // If credentials don't match anything
  return res.status(401).json({ error: 'Invalid username or password.' });
});

export default router;