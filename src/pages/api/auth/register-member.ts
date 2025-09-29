import type { NextApiRequest, NextApiResponse } from 'next';
import axios from 'axios';

// Types for the registration request
interface RegisterMemberRequest {
  teamMemberId: string;
  teamMemberName: string;
  email: string;
  password: string;
}

interface RegisterMemberResponse {
  success: boolean;
  message: string;
  data?: {
    user: {
      id: string;
      name: string;
      email: string;
      role: string;
      teamMemberId: string;
      isActive: boolean;
      createdAt: string;
    };
  };
}

// Middleware to check if user is admin
const isAdmin = (req: NextApiRequest): boolean => {
  // Get the authorization header
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return false;
  }

  const token = authHeader.substring(7);
  
  // In a real implementation, you would:
  // 1. Verify the JWT token
  // 2. Check if the user has admin role
  // 3. Return true only if user is admin
  
  // For now, we'll implement a basic check
  // You should replace this with proper JWT verification and role checking
  try {
    // This is a placeholder - implement proper JWT verification
    // const decoded = jwt.verify(token, process.env.JWT_SECRET!);
    // return decoded.role === 'admin';
    
    // For development/testing purposes, we'll assume the token is valid
    // In production, implement proper JWT verification
    return true;
  } catch (error) {
    console.error('Token verification failed:', error);
    return false;
  }
};

// Validate request data
const validateRequest = (data: RegisterMemberRequest): string[] => {
  const errors: string[] = [];

  if (!data.teamMemberId) {
    errors.push('Team member ID is required');
  }

  if (!data.teamMemberName) {
    errors.push('Team member name is required');
  }

  if (!data.email) {
    errors.push('Email is required');
  } else if (!/\S+@\S+\.\S+/.test(data.email)) {
    errors.push('Please enter a valid email address');
  }

  if (!data.password) {
    errors.push('Password is required');
  } else if (data.password.length < 6) {
    errors.push('Password must be at least 6 characters long');
  }

  return errors;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<RegisterMemberResponse>
) {
  // Only allow POST method
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST']);
    return res.status(405).json({
      success: false,
      message: `Method ${req.method} Not Allowed`
    });
  }

  try {
    // Check if user is admin
    if (!isAdmin(req)) {
      return res.status(403).json({
        success: false,
        message: 'Access denied. Admin privileges required.'
      });
    }

    // Validate request body
    const { teamMemberId, teamMemberName, email, password } = req.body as RegisterMemberRequest;
    
    const validationErrors = validateRequest({ teamMemberId, teamMemberName, email, password });
    if (validationErrors.length > 0) {
      return res.status(400).json({
        success: false,
        message: validationErrors.join(', ')
      });
    }

    // Get the API URL from environment variables
    const API_URL = process.env.NEXT_PUBLIC_API_URL || "https://aems-backend.onrender.com/api";
    
    // First, verify that the team member exists
    try {
      const teamMemberResponse = await axios.get(`${API_URL}/api/users/${teamMemberId}`, {
        headers: {
          'Authorization': req.headers.authorization || '',
          'Content-Type': 'application/json',
        },
      });

      if (!teamMemberResponse.data || teamMemberResponse.data.status !== 'success') {
        return res.status(404).json({
          success: false,
          message: 'Team member not found'
        });
      }

      const teamMember = teamMemberResponse.data.data.user || teamMemberResponse.data.data;
      
      // Check if the team member already has authentication credentials
      if (teamMember.authAccount) {
        return res.status(400).json({
          success: false,
          message: 'Team member already has authentication credentials'
        });
      }

    } catch (error: any) {
      console.error('Error fetching team member:', error);
      if (error.response?.status === 404) {
        return res.status(404).json({
          success: false,
          message: 'Team member not found'
        });
      }
      throw error;
    }

    // Register the team member with authentication credentials
    const registrationPayload = {
      teamMemberId,
      teamMemberName,
      email,
      password,
      role: 'team_member', // Default role for team members
      isActive: true
    };

    const registrationResponse = await axios.post(
      `${API_URL}/api/auth/register-member`, 
      registrationPayload,
      {
        headers: {
          'Authorization': req.headers.authorization || '',
          'Content-Type': 'application/json',
        },
      }
    );

    if (registrationResponse.data && registrationResponse.data.status === 'success') {
      const registeredUser = registrationResponse.data.data.user || registrationResponse.data.data;
      
      return res.status(201).json({
        success: true,
        message: 'Team member registered successfully',
        data: {
          user: {
            id: registeredUser.id || registeredUser._id,
            name: registeredUser.name,
            email: registeredUser.email,
            role: registeredUser.role || 'team_member',
            teamMemberId: registeredUser.teamMemberId || teamMemberId,
            isActive: registeredUser.isActive !== false,
            createdAt: registeredUser.createdAt || new Date().toISOString(),
          }
        }
      });
    }

    // If the response doesn't indicate success
    return res.status(500).json({
      success: false,
      message: registrationResponse.data?.message || 'Failed to register team member'
    });

  } catch (error: any) {
    console.error('Error in register-member API:', error);
    
    // Handle specific error cases
    if (error.response?.status === 409) {
      return res.status(409).json({
        success: false,
        message: 'User with this email already exists'
      });
    }
    
    if (error.response?.status === 400) {
      return res.status(400).json({
        success: false,
        message: error.response.data?.message || 'Invalid request data'
      });
    }

    // Generic error response
    return res.status(500).json({
      success: false,
      message: error.response?.data?.message || 'Internal server error'
    });
  }
}
