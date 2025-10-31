import { api } from '@/lib/axios-config';

export interface LinkedInPostPayload {
  text: string;
}

export const postToLinkedIn = async (payload: LinkedInPostPayload) => {
  try {
    const response = await api.post('/api/linkedin/post', payload);
    return response.data;
  } catch (error) {
    throw error;
  }
};
