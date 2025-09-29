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

  createTeam(teamData: Omit<Team, '_id' | 'createdAt' | 'updatedAt'>): Team {
    const newTeam: Team = {
      _id: `team_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      ...teamData,
      status: 'Active',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    
    this.teams.push(newTeam);
    return newTeam;
  }

  getTeams(): Team[] {
    return this.teams;
  }

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
  if (req.method === 'POST') {
    try {
      const { teamName, hiringManagerId, teamLeadId, recruiterIds } = req.body;
      
      // Validate required fields
      if (!teamName || !hiringManagerId || !teamLeadId || !recruiterIds || !Array.isArray(recruiterIds) || recruiterIds.length === 0) {
        return res.status(400).json({
          status: 'error',
          message: 'Missing required fields: teamName, hiringManagerId, teamLeadId, and recruiterIds array are required'
        });
      }

      const createdTeam = teamsStore.createTeam({
        teamName,
        hiringManagerId,
        teamLeadId,
        recruiterIds,
      });

      return res.status(201).json({
        status: 'success',
        data: {
          team: createdTeam
        },
        message: 'Team created successfully'
      });
    } catch (error) {
      console.error('Error creating team:', error);
      return res.status(500).json({
        status: 'error',
        message: 'Internal server error'
      });
    }
  }

  res.setHeader('Allow', ['POST']);
  res.status(405).end(`Method ${req.method} Not Allowed`);
}
