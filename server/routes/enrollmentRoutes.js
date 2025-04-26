import express from 'express';
import { prisma } from '../index.js';

const router = express.Router();

// Get all enrollments
router.get('/', async (req, res) => {
  try {
    const enrollments = await prisma.enrollment.findMany({
      include: {
        client: true,
        program: true
      },
      orderBy: { enrolledAt: 'desc' }
    });
    
    res.json(enrollments);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create a new enrollment
router.post('/', async (req, res) => {
  try {
    const { clientId, programId } = req.body;
    
    if (!clientId) return res.status(400).json({ error: 'Client ID is required' });
    if (!programId) return res.status(400).json({ error: 'Program ID is required' });
    
    // Check if client exists
    const client = await prisma.client.findUnique({
      where: { id: Number(clientId) }
    });
    
    if (!client) {
      return res.status(404).json({ error: 'Client not found' });
    }
    
    // Check if program exists
    const program = await prisma.program.findUnique({
      where: { id: Number(programId) }
    });
    
    if (!program) {
      return res.status(404).json({ error: 'Program not found' });
    }
    
    // Check if enrollment already exists
    const existingEnrollment = await prisma.enrollment.findFirst({
      where: {
        clientId: Number(clientId),
        programId: Number(programId)
      }
    });
    
    if (existingEnrollment) {
      return res.status(400).json({ error: 'Client is already enrolled in this program' });
    }
    
    const enrollment = await prisma.enrollment.create({
      data: {
        clientId: Number(clientId),
        programId: Number(programId)
      },
      include: {
        client: true,
        program: true
      }
    });
    
    res.status(201).json(enrollment);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create multiple enrollments (enroll client in multiple programs)
router.post('/bulk', async (req, res) => {
  try {
    const { clientId, programIds } = req.body;
    
    if (!clientId) return res.status(400).json({ error: 'Client ID is required' });
    if (!programIds || !Array.isArray(programIds) || programIds.length === 0) {
      return res.status(400).json({ error: 'Program IDs array is required' });
    }
    
    // Check if client exists
    const client = await prisma.client.findUnique({
      where: { id: Number(clientId) }
    });
    
    if (!client) {
      return res.status(404).json({ error: 'Client not found' });
    }
    
    // Get existing enrollments for this client
    const existingEnrollments = await prisma.enrollment.findMany({
      where: { clientId: Number(clientId) },
      select: { programId: true }
    });
    
    const existingProgramIds = existingEnrollments.map(e => e.programId);
    
    // Filter out programs where enrollment already exists
    const newProgramIds = programIds
      .map(id => Number(id))
      .filter(id => !existingProgramIds.includes(id));
    
    if (newProgramIds.length === 0) {
      return res.status(400).json({ error: 'Client is already enrolled in all specified programs' });
    }
    
    // Create new enrollments
    const enrollments = await Promise.all(
      newProgramIds.map(async (programId) => {
        try {
          return await prisma.enrollment.create({
            data: {
              clientId: Number(clientId),
              programId
            },
            include: {
              program: true
            }
          });
        } catch (error) {
          // Skip any invalid program IDs
          return null;
        }
      })
    );
    
    // Filter out any null results (from errors)
    const validEnrollments = enrollments.filter(e => e !== null);
    
    res.status(201).json(validEnrollments);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Delete an enrollment
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    await prisma.enrollment.delete({
      where: { id: Number(id) }
    });
    
    res.status(204).send();
  } catch (error) {
    if (error.code === 'P2025') {
      return res.status(404).json({ error: 'Enrollment not found' });
    }
    res.status(500).json({ error: error.message });
  }
});

// Remove a client from a program
router.delete('/client/:clientId/program/:programId', async (req, res) => {
  try {
    const { clientId, programId } = req.params;
    
    const enrollment = await prisma.enrollment.findFirst({
      where: {
        clientId: Number(clientId),
        programId: Number(programId)
      }
    });
    
    if (!enrollment) {
      return res.status(404).json({ error: 'Enrollment not found' });
    }
    
    await prisma.enrollment.delete({
      where: { id: enrollment.id }
    });
    
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;