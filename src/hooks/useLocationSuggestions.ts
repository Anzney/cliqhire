import { useQuery } from "@tanstack/react-query";
import { locationService } from "@/services/locationService";
import { useDebounce } from "./use-debounce";

export function useLocationSuggestions(query: string) {
  const debouncedQuery = useDebounce(query, 300);

  return useQuery({
    queryKey: ["location-suggestions", debouncedQuery],
    queryFn: () => locationService.searchCities(debouncedQuery),
    enabled: debouncedQuery.length >= 2,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
}
