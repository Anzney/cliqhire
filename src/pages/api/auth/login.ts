import type { NextApiRequest, NextApiResponse } from 'next';
import axios from 'axios';

// Mock user data - in a real app, this would come from your database
const mockUsers = [
  {
    id: '1',
    name: 'John Doe',
    email: 'john@example.com',
    password: 'password123', // In real app, this would be hashed
    role: 'recruiter',
    isActive: true,
    lastLogin: new Date().toISOString(),
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: new Date().toISOString(),
    permissions: ['read:candidates', 'write:candidates', 'read:jobs'],
    defaultPermissions: ['read:candidates']
  }
];

// Mock tasks data
const mockTasks = [
  {
    id: '1',
    title: 'Follow up with John Doe',
    description: 'Check on interview feedback',
    priority: 'high',
    dueDate: '2024-01-15',
    dueTime: '10:00',
    status: 'pending',
    category: 'follow-up',
    createdAt: '2024-01-10',
    followUpType: 'candidate-response',
    followUpStatus: 'pending',
    relatedCandidate: 'John Doe',
    relatedJob: 'Senior Developer',
    relatedClient: 'Tech Corp'
  },
  {
    id: '2',
    title: 'Prepare interview questions',
    description: 'Create technical questions for backend developer role',
    priority: 'medium',
    dueDate: '2024-01-16',
    dueTime: '14:00',
    status: 'pending',
    category: 'admin',
    createdAt: '2024-01-11'
  },
  {
    id: '3',
    title: 'Client meeting - Acme Inc',
    description: 'Discuss new requirements',
    priority: 'high',
    dueDate: '2024-01-17',
    dueTime: '09:00',
    status: 'pending',
    category: 'meeting',
    createdAt: '2024-01-12',
    relatedClient: 'Acme Inc'
  }
];

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    try {
      const { email, password } = req.body;
      
      // Validate required fields
      if (!email || !password) {
        return res.status(400).json({
          status: 'error',
          message: 'Email and password are required'
        });
      }

      // Find user by email
      const user = mockUsers.find(u => u.email === email);
      
      if (!user || user.password !== password) {
        return res.status(401).json({
          status: 'error',
          message: 'Invalid email or password'
        });
      }

      // Generate a mock JWT token (in real app, use proper JWT library)
      const accessToken = `mock-jwt-token-${user.id}-${Date.now()}`;
      
      // Remove password from user object before sending
      const { password: _, ...userWithoutPassword } = user;
      
      // Filter tasks for this user (in real app, filter by user ID)
      const userTasks = mockTasks; // For demo, all users get the same tasks

      return res.status(200).json({
        status: 'success',
        data: {
          accessToken,
          user: userWithoutPassword,
          tasks: userTasks
        },
        message: 'Login successful'
      });
    } catch (error) {
      console.error('Error during login:', error);
      return res.status(500).json({
        status: 'error',
        message: 'Internal server error'
      });
    }
  }

  res.setHeader('Allow', ['POST']);
  res.status(405).end(`Method ${req.method} Not Allowed`);
}
