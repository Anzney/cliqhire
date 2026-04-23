import { api } from "@/lib/axios-config";

export interface CitySuggestion {
  city: string;
  state: string;
  country: string;
  label: string;
  lat: number;
  lng: number;
}

class LocationService {
  /**
   * Search for cities based on a prefix or name
   * @param query The search query (minimum 2 characters required)
   */
  async searchCities(query: string): Promise<CitySuggestion[]> {
    if (!query || query.length < 2) {
      return [];
    }

    try {
      const response = await api.get(`/api/location/cities`, {
        params: { q: query },
      });
      return response.data || [];
    } catch (error) {
      console.error("Failed to fetch cities:", error);
      return [];
    }
  }
}

export const locationService = new LocationService();
export default LocationService;
