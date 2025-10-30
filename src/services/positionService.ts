import axios from 'axios';
import { api } from '@/lib/axios-config';
export interface Position {
  name: string;
}


export const createPosition = async (name: string): Promise<Position> => {
  try {
    const response = await api.post('/api/positions', { name });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getPositions = async (): Promise<Position[]> => {
  try {
    const response = await api.get('/api/positions');
    return response.data;
  } catch (error) {
    throw error;
  }
};
  