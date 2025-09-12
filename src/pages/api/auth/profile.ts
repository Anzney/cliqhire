import type { NextApiRequest, NextApiResponse } from 'next';

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
  if (req.method === 'GET') {
    try {
      // In a real application, you would:
      // 1. Verify the JWT token from Authorization header
      // 2. Extract user ID from token
      // 3. Query database for user data and tasks
      
      // For now, we'll return mock data
      // You can add authentication logic here:
      // const authHeader = req.headers.authorization;
      // if (!authHeader || !authHeader.startsWith('Bearer ')) {
      //   return res.status(401).json({ error: 'Unauthorized' });
      // }
      
      // Mock: Get first user (in real app, get by token)
      const user = mockUsers[0];
      if (!user) {
        return res.status(404).json({
          status: 'error',
          message: 'User not found'
        });
      }

      // Remove password from user object
      const { password: _, ...userWithoutPassword } = user;
      
      // Filter tasks for this user (in real app, filter by user ID)
      const userTasks = mockTasks; // For demo, all users get the same tasks

      return res.status(200).json({
        status: 'success',
        data: {
          user: userWithoutPassword,
          tasks: userTasks
        },
        message: 'Profile retrieved successfully'
      });
    } catch (error) {
      console.error('Error fetching profile:', error);
      return res.status(500).json({
        status: 'error',
        message: 'Internal server error'
      });
    }
  }

  res.setHeader('Allow', ['GET']);
  res.status(405).end(`Method ${req.method} Not Allowed`);
}
