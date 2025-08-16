# Admin-Only User Registration API

## Overview
This API endpoint allows administrators to register existing team members with authentication credentials, enabling them to log into the system.

## Endpoint Details

### POST /api/auth/register-member

**Access:** Private (Admin only)  
**Purpose:** Register an existing team member profile with authentication credentials

### Request Headers
```
Authorization: Bearer <admin_jwt_token>
Content-Type: application/json
```

### Request Body
```json
{
  "teamMemberId": "string",
  "teamMemberName": "string", 
  "email": "string",
  "password": "string"
}
```

### Request Parameters
- `teamMemberId` (required): The unique identifier of the existing team member
- `teamMemberName` (required): The name of the team member
- `email` (required): Email address for login credentials (must be valid email format)
- `password` (required): Password for login (minimum 6 characters)

### Response Format

#### Success Response (201 Created)
```json
{
  "success": true,
  "message": "Team member registered successfully",
  "data": {
    "user": {
      "id": "string",
      "name": "string",
      "email": "string",
      "role": "team_member",
      "teamMemberId": "string",
      "isActive": true,
      "createdAt": "2024-01-01T00:00:00.000Z"
    }
  }
}
```

#### Error Responses

**400 Bad Request**
```json
{
  "success": false,
  "message": "Validation error message"
}
```

**403 Forbidden**
```json
{
  "success": false,
  "message": "Access denied. Admin privileges required."
}
```

**404 Not Found**
```json
{
  "success": false,
  "message": "Team member not found"
}
```

**409 Conflict**
```json
{
  "success": false,
  "message": "User with this email already exists"
}
```

**500 Internal Server Error**
```json
{
  "success": false,
  "message": "Internal server error"
}
```

## Security Features

1. **Admin-Only Access**: Only users with admin privileges can access this endpoint
2. **JWT Token Validation**: Requires valid admin JWT token in Authorization header
3. **Input Validation**: Validates all required fields and data formats
4. **Duplicate Prevention**: Prevents registration of users with existing email addresses
5. **Team Member Verification**: Verifies that the team member exists before registration

## Usage Examples

### Frontend Implementation
```typescript
import { registerTeamMember } from '@/services/teamMembersService';

const handleRegister = async () => {
  try {
    const result = await registerTeamMember({
      teamMemberId: "tm_123",
      teamMemberName: "John Doe",
      email: "john.doe@company.com",
      password: "securePassword123"
    });
    
    if (result.success) {
      console.log('User registered successfully:', result.user);
    }
  } catch (error) {
    console.error('Registration failed:', error.message);
  }
};
```

### Direct API Call
```javascript
const response = await fetch('/api/auth/register-member', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${adminToken}`,
  },
  body: JSON.stringify({
    teamMemberId: "tm_123",
    teamMemberName: "John Doe",
    email: "john.doe@company.com",
    password: "securePassword123"
  }),
});

const result = await response.json();
```

## Business Logic

1. **Admin Authentication**: Verifies that the requesting user has admin privileges
2. **Team Member Validation**: Checks if the specified team member exists in the system
3. **Credential Check**: Ensures the team member doesn't already have authentication credentials
4. **User Registration**: Creates authentication credentials for the team member
5. **Role Assignment**: Assigns appropriate role (default: 'team_member')
6. **Status Management**: Sets the user as active by default

## Integration Points

- **Team Members Service**: Uses existing team member data
- **Authentication System**: Integrates with existing JWT-based auth
- **User Management**: Creates user accounts for existing team member profiles
- **Role-Based Access Control**: Supports role assignment for different user types

## Notes

- This endpoint is designed for admin use only
- Team members must exist in the system before registration
- Email addresses must be unique across the system
- Passwords are hashed before storage (handled by backend)
- The endpoint supports various team member roles (Hiring Manager, Team Lead, Recruiter, Head Hunter)
