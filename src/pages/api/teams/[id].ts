import type { NextApiRequest, NextApiResponse } from 'next';

// Mock data store for teams (replace with actual database in production)
interface Team {
  _id: string;
  teamName: string;
  hiringManagerId: string;
  teamLeadId: string;
  recruiterIds: string[];
  status: string;
  createdAt: string;
  updatedAt: string;
}

class TeamsStore {
  private teams: Team[] = [];

  getTeamById(id: string): Team | undefined {
    return this.teams.find(team => team._id === id);
  }

  updateTeam(id: string, updateData: Partial<Team>): Team | null {
    const teamIndex = this.teams.findIndex(team => team._id === id);
    if (teamIndex === -1) return null;
    
    this.teams[teamIndex] = {
      ...this.teams[teamIndex],
      ...updateData,
      updatedAt: new Date().toISOString(),
    };
    
    return this.teams[teamIndex];
  }

  deleteTeam(id: string): boolean {
    const teamIndex = this.teams.findIndex(team => team._id === id);
    if (teamIndex === -1) return false;
    
    this.teams.splice(teamIndex, 1);
    return true;
  }
}

const teamsStore = new TeamsStore();

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query;

  if (typeof id !== 'string') {
    return res.status(400).json({
      status: 'error',
      message: 'Invalid team ID'
    });
  }

  if (req.method === 'GET') {
    try {
      const team = teamsStore.getTeamById(id);
      
      if (!team) {
        return res.status(404).json({
          status: 'error',
          message: 'Team not found'
        });
      }

      return res.status(200).json({
        status: 'success',
        data: {
          team
        },
        message: 'Team retrieved successfully'
      });
    } catch (error) {
      console.error('Error fetching team:', error);
      return res.status(500).json({
        status: 'error',
        message: 'Internal server error'
      });
    }
  }

  if (req.method === 'PUT') {
    try {
      const { teamName, hiringManagerId, teamLeadId, recruiterIds } = req.body;
      
      // Validate that at least one field is provided
      if (!teamName && !hiringManagerId && !teamLeadId && !recruiterIds) {
        return res.status(400).json({
          status: 'error',
          message: 'At least one field must be provided for update'
        });
      }

      const updateData: Partial<Team> = {};
      if (teamName) updateData.teamName = teamName;
      if (hiringManagerId) updateData.hiringManagerId = hiringManagerId;
      if (teamLeadId) updateData.teamLeadId = teamLeadId;
      if (recruiterIds && Array.isArray(recruiterIds)) updateData.recruiterIds = recruiterIds;

      const updatedTeam = teamsStore.updateTeam(id, updateData);
      
      if (!updatedTeam) {
        return res.status(404).json({
          status: 'error',
          message: 'Team not found'
        });
      }

      return res.status(200).json({
        status: 'success',
        data: {
          team: updatedTeam
        },
        message: 'Team updated successfully'
      });
    } catch (error) {
      console.error('Error updating team:', error);
      return res.status(500).json({
        status: 'error',
        message: 'Internal server error'
      });
    }
  }

  if (req.method === 'DELETE') {
    try {
      const deleted = teamsStore.deleteTeam(id);
      
      if (!deleted) {
        return res.status(404).json({
          status: 'error',
          message: 'Team not found'
        });
      }

      return res.status(200).json({
        status: 'success',
        message: 'Team deleted successfully'
      });
    } catch (error) {
      console.error('Error deleting team:', error);
      return res.status(500).json({
        status: 'error',
        message: 'Internal server error'
      });
    }
  }

  res.setHeader('Allow', ['GET', 'PUT', 'DELETE']);
  res.status(405).end(`Method ${req.method} Not Allowed`);
}
