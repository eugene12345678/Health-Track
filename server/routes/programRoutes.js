import express from 'express';
import { prisma } from '../index.js';

const router = express.Router();

// Get all programs
router.get('/', async (req, res) => {
  try {
    const programs = await prisma.program.findMany({
      orderBy: { name: 'asc' }
    });
    res.json(programs);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get a single program by ID
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const program = await prisma.program.findUnique({
      where: { id: Number(id) },
      include: {
        enrollments: {
          include: {
            client: true
          }
        }
      }
    });
    
    if (!program) {
      return res.status(404).json({ error: 'Program not found' });
    }
    
    res.json(program);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create a new program
router.post('/', async (req, res) => {
  try {
    const { name, description } = req.body;
    
    if (!name) {
      return res.status(400).json({ error: 'Program name is required' });
    }
    
    const program = await prisma.program.create({
      data: { name, description }
    });
    
    res.status(201).json(program);
  } catch (error) {
    if (error.code === 'P2002') {
      return res.status(400).json({ error: 'A program with this name already exists' });
    }
    res.status(500).json({ error: error.message });
  }
});

// Update a program
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description } = req.body;
    
    const program = await prisma.program.update({
      where: { id: Number(id) },
      data: { name, description }
    });
    
    res.json(program);
  } catch (error) {
    if (error.code === 'P2025') {
      return res.status(404).json({ error: 'Program not found' });
    }
    if (error.code === 'P2002') {
      return res.status(400).json({ error: 'A program with this name already exists' });
    }
    res.status(500).json({ error: error.message });
  }
});

// Delete a program
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    // Check if program has enrollments
    const enrollmentCount = await prisma.enrollment.count({
      where: { programId: Number(id) }
    });
    
    if (enrollmentCount > 0) {
      return res.status(400).json({ 
        error: 'Cannot delete program with active enrollments',
        count: enrollmentCount
      });
    }
    
    await prisma.program.delete({
      where: { id: Number(id) }
    });
    
    res.status(204).send();
  } catch (error) {
    if (error.code === 'P2025') {
      return res.status(404).json({ error: 'Program not found' });
    }
    res.status(500).json({ error: error.message });
  }
});

export default router;