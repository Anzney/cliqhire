import type { NextApiRequest, NextApiResponse } from 'next';
import { candidatesStore } from './_candidatesStore';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    const payload = req.body || {};
    const id: string = payload._id || payload.id || payload.candidateId || `${Date.now()}`;
    const created = candidatesStore.upsertCandidate({ _id: id, ...payload, appliedJobs: [] });
    return res.status(201).json(created);
  }
  if (req.method === 'GET') {
    return res.status(200).json(candidatesStore.listCandidates());
  }
  res.setHeader('Allow', ['GET', 'POST']);
  res.status(405).end(`Method ${req.method} Not Allowed`);
}
