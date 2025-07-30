import type { NextApiRequest, NextApiResponse } from 'next';

// In-memory store for demonstration (replace with DB in production)
let candidates: any[] = [];

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    const candidate = req.body;
    candidates.push(candidate);
    return res.status(201).json(candidate);
  }
  if (req.method === 'GET') {
    return res.status(200).json(candidates);
  }
  res.setHeader('Allow', ['GET', 'POST']);
  res.status(405).end(`Method ${req.method} Not Allowed`);
}
