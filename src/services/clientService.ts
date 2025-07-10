import axios, { AxiosError } from "axios";

// Interface for Primary Contact
export interface PrimaryContact {
  name: string;
  email: string;
  phone: string;
  countryCode?: string;
  position?: string;
  linkedin?: string;
  error?: string;
}

export const clientStageStatuses = [
  "Replied to a message",
  "Calls",
  "Attended a meeting",
  "Profile Sent",
  "Contract Sent",
  "Contract Negotiation",
] as const;

export type ClientStageStatus = (typeof clientStageStatuses)[number];

export interface ClientResponse {
  _id: string;
  name: string;
  emails?: string[];
  phoneNumber?: string;
  website?: string;
  industry?: string;
  location?: string;
  address?: string;
  googleMapsLink?: string;
  incorporationDate?: string | null;
  registrationNumber?: string;
  lineOfBusiness?: string[];
  countryOfBusiness?: string;
  referredBy?: string;
  linkedInProfile?: string;
  linkedInPage?: string;
  countryCode?: string;
  primaryContacts?: PrimaryContact[];
  clientStage?: "Lead" | "Engaged" | "Negotiation" | "Signed";
  clientStageStatus?: ClientStageStatus;
  clientTeam?: "Enterprise" | "SMB" | "Mid-Market";
  clientRm?: string;
  clientAge?: number;
  contractNumber?: string;
  contractStartDate?: string | null;
  contractEndDate?: string | null;
  contractValue?: number;
  contractType?: string;
  cLevelPercentage?: number;
  belowCLevelPercentage?: number;
  fixedPercentageNotes?: string;
  fixedPercentageValue?: string;
  fixedPercentageAdvanceNotes?: string;
  cLevelPercentageNotes?: string;
  belowCLevelPercentageNotes?: string;
  fixWithoutAdvanceNotes?: string;
  seniorLevelPercentage?: number;
  executivesPercentage?: number;
  nonExecutivesPercentage?: number;
  otherPercentage?: number;
  seniorLevelNotes?: string;
  executivesNotes?: string;
  nonExecutivesNotes?: string;
  otherNotes?: string;
  profileImage?: string | null;
  crCopy?: string | null;
  vatCopy?: string | null;
  gstTinDocument?: string | null;
  fixedPercentage?: string | null;
  fixedPercentageAdvance?: string | null;
  variablePercentageCLevel?: string | null;
  variablePercentageBelowCLevel?: string | null;
  fixWithoutAdvance?: string | null;
  seniorLevel?: string | null;
  executives?: string | null;
  nonExecutives?: string | null;
  other?: string | null;
  salesLead?: string;
  jobCount?: number; // Added optional jobCount property
  createdAt: string;
  updatedAt?: string;
  __v?: number;
  error?: string;
  labelType?: {
    seniorLevel?: string;
    executives?: string;
    nonExecutives?: string;
    other?: string;
  };
}

interface ApiResponse<T> {
  status: string;
  success: boolean;
  results?: number;
  data: T;
  message?: string;
  error?: string;
}


const API_URL = process.env.NEXT_PUBLIC_API_URL || "https://aems-backend.onrender.com/api";

/**
 * Deep clones an object and removes circular references
 */
const deepCloneAndSanitize = (obj: any): any => {
  const seen = new WeakSet();
  
  const clone = (item: any): any => {
    if (item === null || typeof item !== "object") return item;
    if (item instanceof Date) return item.toISOString();
    if (item instanceof File) return item; // Keep File objects as-is for now
    
    if (seen.has(item)) {
      return {}; // Remove circular reference
    }
    seen.add(item);
    
    if (Array.isArray(item)) {
      return item.map(clone);
    }
    
    const cloned: any = {};
    for (const key in item) {
      if (item.hasOwnProperty(key)) {
        cloned[key] = clone(item[key]);
      }
    }
    return cloned;
  };
  
  return clone(obj);
};

/**
 * Validates and sanitizes client data
 */
const validateAndSanitizeClientData = (data: any) => {
  try {
    // First, deep clone and remove circular references
    const sanitized = deepCloneAndSanitize(data);
    
    // Ensure required fields exist and are valid
    if (!sanitized.name || sanitized.name.trim() === '') {
      throw new Error('Client name is required');
    }
    
    // Initialize arrays if they don't exist
    sanitized.emails = Array.isArray(sanitized.emails) ? sanitized.emails : [];
    sanitized.lineOfBusiness = Array.isArray(sanitized.lineOfBusiness) ? sanitized.lineOfBusiness : [];
    sanitized.primaryContacts = Array.isArray(sanitized.primaryContacts) ? sanitized.primaryContacts : [];
    
    // Convert string numbers to actual numbers where expected
    const numericFields = [
      'clientAge', 'contractValue', 'cLevelPercentage', 'belowCLevelPercentage',
      'seniorLevelPercentage', 'executivesPercentage', 'nonExecutivesPercentage', 'otherPercentage'
    ];
    
    numericFields.forEach(field => {
      if (sanitized[field] !== null && sanitized[field] !== undefined) {
        const num = Number(sanitized[field]);
        sanitized[field] = isNaN(num) ? 0 : num;
      }
    });
    
    // Clean up undefined values
    Object.keys(sanitized).forEach(key => {
      if (sanitized[key] === undefined) {
        delete sanitized[key];
      }
    });
    
    // Ensure dates are strings or null
    if (sanitized.contractStartDate && !(typeof sanitized.contractStartDate === 'string')) {
      sanitized.contractStartDate = new Date(sanitized.contractStartDate).toISOString();
    }
    if (sanitized.contractEndDate && !(typeof sanitized.contractEndDate === 'string')) {
      sanitized.contractEndDate = new Date(sanitized.contractEndDate).toISOString();
    }
    // if (sanitized.incorporationDate && !(typeof sanitized.incorporationDate === 'string')) {
    //   sanitized.incorporationDate = new Date(sanitized.incorporationDate).toISOString();
    // }
    
    // Validate primary contacts
    if (sanitized.primaryContacts && Array.isArray(sanitized.primaryContacts)) {
      sanitized.primaryContacts = sanitized.primaryContacts.map((contact: any) => {
        if (typeof contact === 'object' && contact !== null) {
          return {
            name: contact.name || '',
            email: contact.email || '',
            phone: contact.phone || '',
            countryCode: contact.countryCode || '',
            position: contact.position || '',
            linkedin: contact.linkedin || ''
          };
        }
        return contact;
      });
    }
    
    // Validate labelType
    if (sanitized.labelType && typeof sanitized.labelType === 'object') {
      sanitized.labelType = {
        seniorLevel: sanitized.labelType.seniorLevel || '',
        executives: sanitized.labelType.executives || '',
        nonExecutives: sanitized.labelType.nonExecutives || '',
        other: sanitized.labelType.other || '',
      };
    } else {
      sanitized.labelType = {
        seniorLevel: '',
        executives: '',
        nonExecutives: '',
        other: '',
      };
    }
    
    return sanitized;
  } catch (error: unknown) {
    console.error('Data validation error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown validation error';
    throw new Error(`Data validation failed: ${errorMessage}`);
  }
};

/**
 * Prepares FormData for requests with file uploads
 */
const prepareFormData = (data: any): FormData => {
  const formData = new FormData();
  const fileFields = [
    'profileImage', 'crCopy', 'vatCopy', 'gstTinDocument',
    'fixedPercentage', 'fixedPercentageAdvance',
    'variablePercentageCLevel', 'variablePercentageBelowCLevel',
    'fixWithoutAdvance', 'seniorLevel', 'executives',
    'nonExecutives', 'other'
  ];

  // Append all non-file fields
  Object.keys(data).forEach(key => {
    if (fileFields.includes(key)) {
      return; // Skip file fields for now
    }

    const value = data[key];
    
    if (value === null || value === undefined) {
      return;
    }

    if (Array.isArray(value) || (typeof value === 'object' && key === 'labelType')) {
      try {
        formData.append(key, JSON.stringify(value));
      } catch (error) {
        console.warn(`Could not stringify field ${key}:`, error);
        // Skip this field if it can't be stringified
      }
    } else if (typeof value === 'object') {
      try {
        formData.append(key, JSON.stringify(value));
      } catch (error) {
        console.warn(`Could not stringify field ${key}:`, error);
      }
    } else {
      formData.append(key, String(value));
    }
  });

  // Append file fields
  fileFields.forEach(field => {
    const file = data[field];
    if (file instanceof File && file.size > 0) {
      formData.append(field, file, file.name);
    }
  });

  return formData;
};

/**
 * Prepares plain JSON data for requests without files
 */
const prepareJsonData = (data: any) => {
  const jsonData = { ...data };
  const fileFields = [
    'profileImage', 'crCopy', 'vatCopy', 'gstTinDocument',
    'fixedPercentage', 'fixedPercentageAdvance',
    'variablePercentageCLevel', 'variablePercentageBelowCLevel',
    'fixWithoutAdvance', 'seniorLevel', 'executives',
    'nonExecutives', 'other'
  ];

  // Convert File objects to null for JSON payload
  fileFields.forEach(field => {
    if (jsonData[field] instanceof File) {
      jsonData[field] = null;
    }
  });

  return jsonData;
};

/**
 * Determines if the payload contains any file uploads
 */
const hasFileUploads = (data: any): boolean => {
  const fileFields = [
    'profileImage', 'crCopy', 'vatCopy', 'gstTinDocument',
    'fixedPercentage', 'fixedPercentageAdvance',
    'variablePercentageCLevel', 'variablePercentageBelowCLevel',
    'fixWithoutAdvance', 'seniorLevel', 'executives',
    'nonExecutives', 'other'
  ];

  return fileFields.some(
    field => data[field] instanceof File && data[field].size > 0
  );
};

/**
 * Handles sending client requests with proper content type
 */
const sendClientRequest = async (
  url: string,
  method: 'post' | 'put',
  rawData: any
) => {
  try {
    // First validate and sanitize the data
    const validatedData = validateAndSanitizeClientData(rawData);
    
    // console.log('Validated data before sending:', {
    //   name: validatedData.name,
    //   hasFiles: hasFileUploads(validatedData),
    //   keys: Object.keys(validatedData)
    // });
    
    if (hasFileUploads(validatedData)) {
      const formData = prepareFormData(validatedData);
      
      return await axios({
        method,
        url,
        data: formData,
        // When sending FormData, do not set Content-Type header
        // The browser will automatically set it with the correct boundary
        timeout: 30000, // 30 second timeout
      });
    } else {
      const jsonData = prepareJsonData(validatedData);
      
      // Test JSON serialization before sending
      try {
        const testSerialization = JSON.stringify(jsonData);
      } catch (serializationError) {
        console.error('JSON serialization failed:', serializationError);
        throw new Error('Data contains non-serializable content');
      }
      
      
      return await axios({
        method,
        url,
        data: jsonData,
        headers: {
          'Content-Type': 'application/json',
        },
        timeout: 30000, // 30 second timeout
      });
    }
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      console.error('Request error details:', {
        message: error.message,
        status: error.response?.status,
        statusText: error.response?.statusText,
        data: error.response?.data
      });
      throw error;
    }
    console.error('Non-Axios error:', error);
    throw new Error('An unexpected error occurred');
  }
};

/**
 * Enhanced error handler with better error parsing
 */
const handleError = (error: AxiosError) => {
  let errorMessage = "Unknown error occurred";
  
  if (error.response) {
    // Server responded with error status
    const errorData = error.response.data as any;
    errorMessage = errorData?.message || errorData?.error || `Server error: ${error.response.status}`;
    
    // Log detailed error info for debugging
    console.error("API Error Details:", {
      status: error.response.status,
      statusText: error.response.statusText,
      data: errorData,
      url: error.config?.url,
      method: error.config?.method
    });
  } else if (error.request) {
    // Request made but no response received
    errorMessage = "No response from server. Please check your connection.";
    console.error("Network Error:", error.request);
  } else {
    // Error in request setup
    errorMessage = error.message;
    console.error("Request Setup Error:", error.message);
  }
  
  return new Error(errorMessage);
};

// Create a new client
const createClient = async (rawData: FormData | Omit<ClientResponse, "_id" | "createdAt" | "updatedAt"> & {
  profileImage?: File | null;
  crCopy?: File | null;
  vatCopy?: File | null;
  gstTinDocument?: File | null;
  fixedPercentage?: File | null;
  fixedPercentageAdvance?: File | null;
  variablePercentageCLevel?: File | null;
  variablePercentageBelowCLevel?: File | null;
  fixWithoutAdvance?: File | null;
  seniorLevel?: File | null;
  executives?: File | null;
  nonExecutives?: File | null;
  other?: File | null;
}): Promise<ClientResponse> => {
  try {
    if (rawData instanceof FormData) {
      // When sending FormData, do not set Content-Type header
      // The browser will automatically set it with the correct boundary
      const response = await axios.post<ApiResponse<ClientResponse>>(
        `${API_URL}/clients`,
        rawData,
        {
          timeout: 30000
        }
      );
      return response.data.data;
    } else {
      const response = await sendClientRequest(`${API_URL}/clients`, 'post', rawData);
      return response.data.data;
    }
  } catch (error: any) {
    console.error('Create client error:', error);
    throw handleError(error);
  }
};

// Get all clients
const getClients = async (queryParams: {
  page?: number;
  limit?: number;
  search?: string;
  industry?: string;
  clientStage?: "Lead" | "Engaged" | "Negotiation" | "Signed";
  clientTeam?: "Enterprise" | "SMB" | "Mid-Market";
} = {}): Promise<{ clients: ClientResponse[]; total: number; page: number; pages: number }> => {
  try {
    const response = await axios.get(`${API_URL}/clients`, { 
      params: queryParams,
      timeout: 15000
    });
    
    // Log the response for debugging
    
    // Handle different response formats
    if (response.data.success && Array.isArray(response.data.data)) {
      // Format is { success: true, data: [...clients] }
      const clients = response.data.data;
      const meta = response.data.meta || { total: clients.length, page: 1, pages: 1 };
      
      return {
        clients: clients,
        total: meta.total || clients.length,
        page: meta.page || 1,
        pages: meta.pages || 1
      };
    } else if (response.data.data && response.data.data.clients) {
      // Format is { data: { clients: [...], total: X, page: Y, pages: Z } }
      return response.data.data;
    } else {
      // Fallback for unexpected format
      console.error('Unexpected API response format:', response.data);
      const clients = Array.isArray(response.data) ? response.data : 
                    (Array.isArray(response.data.data) ? response.data.data : []);
      
      return {
        clients: clients,
        total: clients.length,
        page: 1,
        pages: 1
      };
    }
  } catch (error: any) {
    console.error('Error in getClients:', error);
    throw handleError(error);
  }
};

// Get client names
const getClientNames = async (search?: string): Promise<string[]> => {
  try {
    const response = await axios.get<ApiResponse<string[]>>(
      `${API_URL}/clients/names`,
      { 
        params: { search },
        timeout: 10000
      }
    );
    return response.data.data;
  } catch (error: any) {
    throw handleError(error);
  }
};

// Get client by ID
const getClientById = async (id: string): Promise<ClientResponse> => {
  try {
    const response = await axios.get<ApiResponse<ClientResponse>>(
      `${API_URL}/clients/${id}`,
      { timeout: 15000 }
    );
    return response.data.data;
  } catch (error: any) {
    throw handleError(error);
  }
};

// Update client
const updateClient = async (
  id: string,
  rawData: Omit<ClientResponse, "_id" | "createdAt" | "updatedAt"> & {
    profileImage?: File | string | null;
    crCopy?: File | string | null;
    vatCopy?: File | string | null;
    gstTinDocument?: File | string | null;
    fixedPercentage?: File | string | null;
    fixedPercentageAdvance?: File | string | null;
    variablePercentageCLevel?: File | string | null;
    variablePercentageBelowCLevel?: File | string | null;
    fixWithoutAdvance?: File | string | null;
    seniorLevel?: File | string | null;
    executives?: File | string | null;
    nonExecutives?: File | string | null;
    other?: File | string | null;
  }
): Promise<ClientResponse> => {
  try {
    const response = await sendClientRequest(
      `${API_URL}/clients/${id}`,
      'put',
      rawData
    );
    return response.data.client;
  } catch (error: any) {
    throw handleError(error);
  }
};

// Update client stage
const updateClientStage = async (
  id: string,
  stage: "Lead" | "Engaged" | "Negotiation" | "Signed"
): Promise<ClientResponse> => {
  try {
    // Fetch the full client data to avoid backend issues with partial updates.
    const currentClient = await getClientById(id);

    const dataToUpdate = {
      ...currentClient,
      clientStage: stage,
    };

    // Remove fields that should not be sent in an update payload.
    const { _id, createdAt, updatedAt, __v, ...updatePayload } = dataToUpdate;

    // Manually remove file URL fields to prevent backend errors.
    const fileFields = [
      'profileImage', 'crCopy', 'vatCopy', 'gstTinDocument', 'fixedPercentage', 
      'fixedPercentageAdvance', 'variablePercentageCLevel', 'variablePercentageBelowCLevel', 
      'fixWithoutAdvance', 'seniorLevel', 'executives', 'nonExecutives', 'other'
    ];
    fileFields.forEach(field => delete (updatePayload as any)[field]);

    // Call the main updateClient function to reuse its logic, including validation.
    return await updateClient(id, updatePayload);

  } catch (error: any) {
    console.error("Error updating client stage:", error);
    // The error is already handled by `updateClient`, so we just re-throw it.
    throw error;
  }
};

// Update client stage status
const updateClientStageStatus = async (
  id: string,
  status: ClientStageStatus
): Promise<ClientResponse> => {
  try {
    // Fetch the full client data to avoid backend issues with partial updates.
    const currentClient = await getClientById(id);

    const dataToUpdate = {
      ...currentClient,
      clientStageStatus: status,
    };

    // Remove fields that should not be sent in an update payload.
    const { _id, createdAt, updatedAt, __v, ...updatePayload } = dataToUpdate;

    // Manually remove file URL fields to prevent backend errors.
    const fileFields = [
      'profileImage', 'crCopy', 'vatCopy', 'gstTinDocument', 'fixedPercentage', 
      'fixedPercentageAdvance', 'variablePercentageCLevel', 'variablePercentageBelowCLevel', 
      'fixWithoutAdvance', 'seniorLevel', 'executives', 'nonExecutives', 'other'
    ];
    fileFields.forEach(field => delete (updatePayload as any)[field]);

    // Call the main updateClient function to reuse its logic, including validation.
    return await updateClient(id, updatePayload);

  } catch (error: any) {
    console.error("Error updating client stage status:", error);
    // The error is already handled by `updateClient`, so we just re-throw it.
    throw error;
  }
};

// Delete client
const deleteClient = async (id: string): Promise<void> => {
  try {
    await axios.delete<ApiResponse<null>>(`${API_URL}/clients/${id}`, {
      timeout: 10000
    });
  } catch (error: any) {
    throw handleError(error);
  }
};

// Upload client file
const uploadClientFile = async (
  clientId: string,
  file: File,
  field: "profileImage" | "crCopy" | "vatCopy" | "gstTinDocument" | 
        "fixedPercentage" | "fixedPercentageAdvance" | 
        "variablePercentageCLevel" | "variablePercentageBelowCLevel" | 
        "fixWithoutAdvance" | "seniorLevel" | "executives" | 
        "nonExecutives" | "other"
): Promise<string> => {
  try {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("field", field);

    const response = await axios.post<ApiResponse<{ filePath: string }>>(
      `${API_URL}/clients/${clientId}/upload`,
      formData,
      { 
        // When sending FormData, do not set Content-Type header
        // The browser will automatically set it with the correct boundary
        timeout: 30000
      }
    );
    return response.data.data.filePath;
  } catch (error: any) {
    throw handleError(error);
  }
};

// Add primary contact
const addPrimaryContact = async (
  clientId: string,
  contactData: PrimaryContact
): Promise<ClientResponse> => {
  try {
    // Validate contact data
    const validatedContact = validateAndSanitizeClientData(contactData);
    
    const response = await axios.post<ApiResponse<ClientResponse>>(
      `${API_URL}/clients/${clientId}/primary-contacts`,
      validatedContact,
      { 
        headers: { "Content-Type": "application/json" },
        timeout: 15000
      }
    );
    return response.data.data;
  } catch (error: any) {
    throw handleError(error);
  }
};

export {
  createClient,
  getClients,
  getClientNames,
  getClientById,
  updateClient,
  updateClientStage,
  updateClientStageStatus,
  deleteClient,
  uploadClientFile,
  addPrimaryContact,
};