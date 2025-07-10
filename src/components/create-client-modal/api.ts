import axios from "axios";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "https://aems-backend-main.onrender.com/api";

export const createClient = async (data: FormData) => {
  try {
    const response = await axios.post(
      `${API_URL}/clients`,
      // "http://localhost:5000/api/clients"
      data,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
    return { success: true, data: response.data };
  } catch (error: any) {
    console.error("API Error:", error);
    throw new Error(error.response?.data?.message || "Failed to create client");
  }
};