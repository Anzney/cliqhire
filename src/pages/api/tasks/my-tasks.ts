import type { NextApiRequest, NextApiResponse } from 'next';

// Mock task data structure
interface Task {
  id: string;
  title: string;
  description?: string;
  priority: 'high' | 'medium' | 'low';
  dueDate?: string;
  dueTime?: string;
  status: 'pending' | 'in-progress' | 'completed';
  category: 'follow-up' | 'admin' | 'research' | 'meeting' | 'other';
  createdAt: string;
  followUpType?: 'cv-received' | 'candidate-response' | 'client-feedback' | 'interview-scheduled' | 'offer-sent' | 'other';
  followUpStatus?: 'pending' | 'in-progress' | 'completed';
  relatedCandidate?: string;
  relatedJob?: string;
  relatedClient?: string;
}

// Mock tasks data - in a real app, this would come from a database
const mockTasks: Task[] = [
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
  },
  {
    id: '4',
    title: 'Review candidate profiles',
    description: 'Screen applications for marketing role',
    priority: 'low',
    dueDate: '2024-01-18',
    status: 'in-progress',
    category: 'research',
    createdAt: '2024-01-13'
  },
  {
    id: '5',
    title: 'Follow up with client',
    description: 'Check on contract status',
    priority: 'medium',
    dueDate: '2024-01-19',
    dueTime: '16:00',
    status: 'pending',
    category: 'follow-up',
    createdAt: '2024-01-14',
    followUpType: 'client-feedback',
    followUpStatus: 'pending',
    relatedClient: 'Global Solutions'
  }
];

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    try {
      // In a real application, you would:
      // 1. Verify the JWT token from Authorization header
      // 2. Extract user ID from token
      // 3. Query database for user's tasks
      
      // For now, we'll return mock data
      // You can add authentication logic here:
      // const authHeader = req.headers.authorization;
      // if (!authHeader || !authHeader.startsWith('Bearer ')) {
      //   return res.status(401).json({ error: 'Unauthorized' });
      // }
      
      // Filter tasks based on current date or other criteria
      const today = new Date().toISOString().split('T')[0];
      const upcomingTasks = mockTasks.filter(task => 
        !task.dueDate || task.dueDate >= today
      );

      return res.status(200).json({
        status: 'success',
        data: {
          tasks: upcomingTasks
        },
        message: 'Tasks retrieved successfully'
      });
    } catch (error) {
      console.error('Error fetching tasks:', error);
      return res.status(500).json({
        status: 'error',
        message: 'Internal server error'
      });
    }
  }

  if (req.method === 'POST') {
    try {
      const { title, description, priority, dueDate, dueTime, category, followUpType, relatedCandidate, relatedJob, relatedClient } = req.body;
      
      // Validate required fields
      if (!title || !priority || !category) {
        return res.status(400).json({
          status: 'error',
          message: 'Missing required fields: title, priority, and category are required'
        });
      }

      const newTask: Task = {
        id: Date.now().toString(),
        title,
        description,
        priority,
        dueDate,
        dueTime,
        status: 'pending',
        category,
        createdAt: new Date().toISOString().split('T')[0],
        followUpType: category === 'follow-up' ? followUpType : undefined,
        followUpStatus: category === 'follow-up' ? 'pending' : undefined,
        relatedCandidate,
        relatedJob,
        relatedClient
      };

      // In a real app, save to database
      mockTasks.push(newTask);

      return res.status(201).json({
        status: 'success',
        data: {
          task: newTask
        },
        message: 'Task created successfully'
      });
    } catch (error) {
      console.error('Error creating task:', error);
      return res.status(500).json({
        status: 'error',
        message: 'Internal server error'
      });
    }
  }

  if (req.method === 'PUT') {
    try {
      const { id, ...updateData } = req.body;
      
      if (!id) {
        return res.status(400).json({
          status: 'error',
          message: 'Task ID is required'
        });
      }

      const taskIndex = mockTasks.findIndex(task => task.id === id);
      if (taskIndex === -1) {
        return res.status(404).json({
          status: 'error',
          message: 'Task not found'
        });
      }

      // Update task
      mockTasks[taskIndex] = { ...mockTasks[taskIndex], ...updateData };

      return res.status(200).json({
        status: 'success',
        data: {
          task: mockTasks[taskIndex]
        },
        message: 'Task updated successfully'
      });
    } catch (error) {
      console.error('Error updating task:', error);
      return res.status(500).json({
        status: 'error',
        message: 'Internal server error'
      });
    }
  }

  if (req.method === 'DELETE') {
    try {
      const { id } = req.query;
      
      if (!id || typeof id !== 'string') {
        return res.status(400).json({
          status: 'error',
          message: 'Task ID is required'
        });
      }

      const taskIndex = mockTasks.findIndex(task => task.id === id);
      if (taskIndex === -1) {
        return res.status(404).json({
          status: 'error',
          message: 'Task not found'
        });
      }

      // Remove task
      mockTasks.splice(taskIndex, 1);

      return res.status(200).json({
        status: 'success',
        message: 'Task deleted successfully'
      });
    } catch (error) {
      console.error('Error deleting task:', error);
      return res.status(500).json({
        status: 'error',
        message: 'Internal server error'
      });
    }
  }

  res.setHeader('Allow', ['GET', 'POST', 'PUT', 'DELETE']);
  res.status(405).end(`Method ${req.method} Not Allowed`);
}
