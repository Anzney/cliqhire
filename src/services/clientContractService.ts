import axios from "axios";

// Update contract API function
export const updateContract = async (clientId: string, contractType: string, contractData: any) => {
  try {
    // Create FormData for file uploads and other data
    const formData = new FormData();

    // Helper function to append data to FormData
    const appendToFormData = (key: string, value: any) => {
      if (value === null || value === undefined) {
        return;
      }

      if (value instanceof File) {
        formData.append(key, value);
      } else if (value instanceof Date) {
        formData.append(key, value.toISOString());
      } else if (typeof value === "object") {
        formData.append(key, JSON.stringify(value));
      } else {
        formData.append(key, String(value));
      }
    };

    // Append all contract data to FormData
    Object.keys(contractData).forEach((key) => {
      const value = contractData[key];

      // Handle file fields specifically
      if (key.includes("Document") || key.includes("Proposal")) {
        if (value instanceof File) {
          formData.append(key, value);
        } else if (value && typeof value === "object" && value.url) {
          // If it's an existing file object, don't append it
          // The backend will keep the existing file
          return;
        }
      } else {
        appendToFormData(key, value);
      }
    });

    const response = await axios.patch(
      `http://localhost:8000/api/updatecontracts/${clientId}/${contractType}`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      },
    );

    return response.data;
  } catch (error) {
    console.error("Error updating contract:", error);
    throw error;
  }
};

// Delete contract API function
export const deleteContract = async (clientId: string, contractType: string) => {
  try {
    const response = await axios.delete(
      `http://localhost:8000/api/deletecontracts/${clientId}/${contractType}`,
    );
    return response.data;
  } catch (error) {
    console.error("Error deleting contract:", error);
    throw error;
  }
};

// Add contract API function
export const addContract = async (clientId: string, contractType: string, contractData: any) => {
  try {
    // Create FormData for file uploads and other data
    const formData = new FormData();

    // Add clientId and contractType
    formData.append("clientId", clientId);
    formData.append("businessType", contractType);

    // Helper function to append data to FormData
    const appendToFormData = (key: string, value: any) => {
      if (value === null || value === undefined) {
        return;
      }

      if (value instanceof File) {
        formData.append(key, value);
      } else if (value instanceof Date) {
        formData.append(key, value.toISOString());
      } else if (typeof value === "object") {
        formData.append(key, JSON.stringify(value));
      } else {
        formData.append(key, String(value));
      }
    };

    // Handle file uploads with specific naming based on contract type
    if (contractType === "consultingContractHRC") {
      const { technicalProposalDocument, financialProposalDocument } = contractData;
      if (technicalProposalDocument) {
        formData.append("techProposalDocHRC", technicalProposalDocument);
      }
      if (financialProposalDocument) {
        formData.append("finProposalDocHRC", financialProposalDocument);
      }
    }
    if (contractType === "consultingContractMGTC") {
      const { technicalProposalDocument, financialProposalDocument } = contractData;
      if (technicalProposalDocument) {
        formData.append("techProposalDocMGTC", technicalProposalDocument);
      }
      if (financialProposalDocument) {
        formData.append("finProposalDocMGTC", financialProposalDocument);
      }
    }
    if (contractType === "businessContractRQT") {
      const { contractDocument } = contractData;
      if (contractDocument) {
        formData.append("businessContractRQTDocument", contractDocument);
      }
    }
    if (contractType === "businessContractHMS") {
      const { contractDocument } = contractData;
      if (contractDocument) {
        formData.append("businessContractHMSDocument", contractDocument);
      }
    }
    if (contractType === "businessContractIT") {
      const { contractDocument } = contractData;
      if (contractDocument) {
        formData.append("businessContractITDocument", contractDocument);
      }
    }
    if (contractType === "outsourcingContract") {
      const { contractDocument } = contractData;
      if (contractDocument) {
        formData.append("outsourcingContractDocument", contractDocument);
      }
    }

    // Append all other contract data to FormData (excluding files which are handled above)
    Object.keys(contractData).forEach((key) => {
      const value = contractData[key];

      // Skip file fields as they are handled specifically above
      if (key.includes("Document")) {
        return;
      }

      appendToFormData(key, value);
    });

    const response = await axios.post(`http://localhost:8000/api/addContracts`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    return response.data;
  } catch (error) {
    console.error("Error adding contract:", error);
    throw error;
  }
};
