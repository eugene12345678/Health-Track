import express from 'express';
import { prisma } from '../index.js';

const router = express.Router();

// Get all clients
router.get('/', async (req, res) => {
  try {
    const clients = await prisma.client.findMany({
      orderBy: { name: 'asc' }
    });
    res.json(clients);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Search clients by name
router.get('/search', async (req, res) => {
  try {
    const { name } = req.query;
    
    if (!name) {
      return res.status(400).json({ error: 'Search term is required' });
    }
    
    const clients = await prisma.client.findMany({
      where: {
        name: {
          contains: String(name).toLowerCase(),
        }
      },
      orderBy: { name: 'asc' }
    });
    
    res.json(clients);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get a single client by ID with enrollments
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const client = await prisma.client.findUnique({
      where: { id: Number(id) },
      include: {
        enrollments: {
          include: {
            program: true
          }
        }
      }
    });
    
    if (!client) {
      return res.status(404).json({ error: 'Client not found' });
    }
    
    res.json(client);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create a new client
router.post('/', async (req, res) => {
  try {
    const { name, age, gender, phone, address } = req.body;
    
    // Store name in lowercase for consistent search
    const normalizedName = name.toLowerCase();
    
    // Validation
    if (!name) return res.status(400).json({ error: 'Name is required' });
    if (!age) return res.status(400).json({ error: 'Age is required' });
    if (!gender) return res.status(400).json({ error: 'Gender is required' });
    if (!phone) return res.status(400).json({ error: 'Phone is required' });
    if (!address) return res.status(400).json({ error: 'Address is required' });
    
    const client = await prisma.client.create({
      data: { 
        name: normalizedName, 
        age: Number(age), 
        gender, 
        phone, 
        address 
      }
    });
    
    res.status(201).json(client);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update a client
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { name, age, gender, phone, address } = req.body;
    
    // Store name in lowercase for consistent search
    const normalizedName = name.toLowerCase();
    
    const client = await prisma.client.update({
      where: { id: Number(id) },
      data: { 
        name: normalizedName, 
        age: Number(age), 
        gender, 
        phone, 
        address 
      }
    });
    
    res.json(client);
  } catch (error) {
    if (error.code === 'P2025') {
      return res.status(404).json({ error: 'Client not found' });
    }
    res.status(500).json({ error: error.message });
  }
});

// Delete a client
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    // First delete related enrollments
    await prisma.enrollment.deleteMany({
      where: { clientId: Number(id) }
    });
    
    // Then delete the client
    await prisma.client.delete({
      where: { id: Number(id) }
    });
    
    res.status(204).send();
  } catch (error) {
    if (error.code === 'P2025') {
      return res.status(404).json({ error: 'Client not found' });
    }
    res.status(500).json({ error: error.message });
  }
});

export default router;