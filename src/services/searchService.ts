import axios from "axios";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

export interface SearchResultItem {
    id: string;
    _id?: string;
    name?: string;
    email?: string;
    subtitle?: string;
    status?: string;
}

export interface JobSearchResult {
    id: string;
    _id?: string;
    jobTitle: string;
    client: {
        name: string;
    } | string;
    status?: string;
}

export interface GlobalSearchResponse {
    success: boolean;
    data: {
        candidates: SearchResultItem[];
        clients: SearchResultItem[];
        jobs: JobSearchResult[];
        teamMembers: SearchResultItem[];
    };
    totalCount: number;
    message?: string;
}

export interface GlobalSearchParams {
    q: string;
    limit?: number;
}

/**
 * Global search across candidates, clients, jobs, and team members
 * @param params - Search parameters (query and optional limit)
 * @returns Promise with search results
 */
export const globalSearch = async (params: GlobalSearchParams): Promise<GlobalSearchResponse> => {
    try {
        const { q, limit = 5 } = params;

        // Validate query length (backend accepts 2+ characters)
        if (!q || q.trim().length < 2) {
            return {
                success: false,
                data: {
                    candidates: [],
                    clients: [],
                    jobs: [],
                    teamMembers: []
                },
                totalCount: 0,
                message: "Search query must be at least 2 characters"
            };
        }

        const response = await axios.get<GlobalSearchResponse>(`${API_URL}/api/search`, {
            params: {
                q: q.trim(),
                limit: Math.min(limit, 50) // Cap at 50 to prevent abuse
            },
            timeout: 10000, // 10 second timeout
            withCredentials: true // Include auth cookies
        });

        return response.data;
    } catch (error: any) {
        console.error("Global search error:", error);

        // Handle specific error cases
        if (error.response) {
            const status = error.response.status;
            const errorData = error.response.data;

            if (status === 400) {
                return {
                    success: false,
                    data: {
                        candidates: [],
                        clients: [],
                        jobs: [],
                        teamMembers: []
                    },
                    totalCount: 0,
                    message: errorData.message || "Invalid search query"
                };
            }

            if (status === 401) {
                return {
                    success: false,
                    data: {
                        candidates: [],
                        clients: [],
                        jobs: [],
                        teamMembers: []
                    },
                    totalCount: 0,
                    message: "Authentication required"
                };
            }

            if (status === 429) {
                return {
                    success: false,
                    data: {
                        candidates: [],
                        clients: [],
                        jobs: [],
                        teamMembers: []
                    },
                    totalCount: 0,
                    message: "Too many requests. Please try again later."
                };
            }
        }

        // Generic error fallback
        return {
            success: false,
            data: {
                candidates: [],
                clients: [],
                jobs: [],
                teamMembers: []
            },
            totalCount: 0,
            message: "Search failed. Please try again."
        };
    }
};
