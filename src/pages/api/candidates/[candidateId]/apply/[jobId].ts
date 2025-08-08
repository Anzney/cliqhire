import type { NextApiRequest, NextApiResponse } from 'next';
import { candidatesStore } from '../../../_candidatesStore';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const { candidateId, jobId } = req.query as { candidateId?: string; jobId?: string };

  if (!candidateId || !jobId) {
    return res.status(400).json({ success: false, message: 'candidateId and jobId are required in the URL' });
  }

  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST']);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }

  try {
    const updated = candidatesStore.addAppliedJob(candidateId, jobId);
    return res.status(200).json({ success: true, data: updated });
  } catch (error: any) {
    console.error('Error applying candidate to job:', error);
    return res.status(500).json({ success: false, message: error?.message || 'Internal Server Error' });
  }
}


