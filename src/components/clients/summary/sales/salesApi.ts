import axios from "axios";

// Updated to point directly to the sales API endpoint
const BASE_URL = "http://localhost:5000/api";

export interface SalesInfo {
  financials: string;
  nonFinancials: string;
  numberOfEmployees: string;
  formationYear: string;
}

// Fetch sales info from backend
export async function getSalesInfo(): Promise<SalesInfo> {
  // Dummy data for development. Remove this and uncomment the axios call when using a real API.
  return {
    financials: "50000",
    nonFinancials: "Demo non-financial info",
    numberOfEmployees: "25",
    formationYear: "2015",
  };
  

  // Example: GET http://localhost:5000/api/sales
  const response = await axios.get(`${BASE_URL}`); // <-- Now points directly to /sales
  return response.data;
  
}

// Update all sales info in backend
export async function updateSalesInfo(data: SalesInfo): Promise<void> {
  // Ensure all fields are strings (API may expect this)
  const payload = {
    financials: String(data.financials),
    nonFinancials: String(data.nonFinancials),
    numberOfEmployees: String(data.numberOfEmployees),
    formationYear: String(data.formationYear),
  };
  try {
    await axios.put(`${BASE_URL}/sales`, payload); // <-- Now points directly to /sales
  } catch (error: any) {
    // Log error details for debugging
    if (error.response) {
      console.error('API 400 Error:', error.response.data);
    } else {
      console.error('API Error:', error.message);
    }
    throw error;
  }
}

// Update a single field in sales info (partial update)
export async function patchSalesInfoField(field: keyof SalesInfo, value: string): Promise<void> {
  // Example: PATCH http://localhost:5000/api/sales
  // Sends { field: value } as the body
  await axios.patch(`${BASE_URL}/sales`, { [field]: value }); // <-- Now points directly to /sales
}
