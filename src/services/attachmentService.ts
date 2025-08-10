import axios from "axios";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export interface Attachment {
  _id: string;
  fileName: string;
  uploadedAt: string;
  file: string;
}

// Create a new attachment (file upload)
export const createJobAttachment = async (file: File, jobId: string): Promise<Attachment> => {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("job_id", jobId);
  const response = await axios.post(`${API_URL}/api/jobattachments`, formData);
  return response.data.data;
};

// Get attachments by job ID
export const getJobAttachmentsByJobId = async (jobId: string): Promise<Attachment[]> => {
  const response = await axios.get(`${API_URL}/api/jobattachments/job/${jobId}`);
  return response.data.data;
};

// Get a single attachment by ID
export const getJobAttachmentById = async (id: string): Promise<Attachment> => {
  const response = await axios.get(`${API_URL}/api/jobattachments/${id}`);
  return response.data.data;
};

// Update an attachment by ID (PATCH for partial update)
export const updateJobAttachment = async (id: string, updateData: Partial<Attachment>): Promise<Attachment> => {
  const response = await axios.patch(`${API_URL}/api/jobattachments/${id}`, updateData);
  return response.data.data;
};

// Delete an attachment by ID
export const deleteJobAttachment = async (id: string): Promise<void> => {
  await axios.delete(`${API_URL}/api/jobattachments/${id}`);
}; 