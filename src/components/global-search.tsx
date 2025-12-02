"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { useDebounce } from "@/hooks/use-debounce";
import { Badge } from "@/components/ui/badge";
import { Briefcase, Users, User, Building2, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import {
    Command,
    CommandInput,
    CommandList,
    CommandItem,
    CommandEmpty,
} from "@/components/ui/command";
import { globalSearch } from "@/services/searchService";

type ResultItem = {
    type: 'client' | 'job' | 'candidate' | 'teamMember' | 'team';
    data: any;
};

export function GlobalSearch() {
    const router = useRouter();
    const [query, setQuery] = React.useState("");
    const debouncedQuery = useDebounce(query, 500);
    const [loading, setLoading] = React.useState(false);
    const [isOpen, setIsOpen] = React.useState(false);
    const containerRef = React.useRef<HTMLDivElement>(null);
    const lastSearchedQueryRef = React.useRef<string>("");

    const [results, setResults] = React.useState<{
        clients: any[];
        jobs: any[];
        candidates: any[];
        teamMembers: any[];
    }>({
        clients: [],
        jobs: [],
        candidates: [],
        teamMembers: [],
    });

    const flatResults = React.useMemo(() => {
        const items: ResultItem[] = [];
        results.clients.forEach(c => items.push({ type: 'client', data: c }));
        results.jobs.forEach(j => items.push({ type: 'job', data: j }));
        results.candidates.forEach(c => items.push({ type: 'candidate', data: c }));
        results.teamMembers.forEach(t => items.push({ type: 'teamMember', data: t }));
        return items;
    }, [results]);

    const getItemTitle = (item: ResultItem) => {
        if (item.type === 'job') return item.data.jobTitle;
        return item.data.name;
    };

    const getItemSubtitle = (item: ResultItem) => {
        if (item.type === 'job') return typeof item.data.client === 'string' ? 'Client' : item.data.client?.name;
        if (item.type === 'client') return item.data.subtitle || item.data.industry || "Client";
        if (item.type === 'candidate') return item.data.subtitle || item.data.email;
        if (item.type === 'team') return item.data.subtitle || item.data.email;
        if (item.type === 'teamMember') return item.data.subtitle || item.data.email;
        return "";
    };

    // Filter results to ensure visual relevance (Client-side refinement)
    const filteredFlatResults = React.useMemo(() => {
        if (!query || query.trim().length < 2) return [];

        const searchTerms = query.toLowerCase().trim();

        return flatResults.filter(item => {
            const name = (item.data.name || item.data.jobTitle || "").toLowerCase();
            const subtitle = (getItemSubtitle(item) || "").toLowerCase();
            const email = (item.data.email || "").toLowerCase();
            const phone = (item.data.phone || item.data.phoneNumber || "").toString().toLowerCase();

            // Logic:
            // 1. Name/Title must START with the query (e.g., "Rah" -> "Rahul")
            // 2. Email must START with the query (e.g., "rah" -> "rahul@gmail.com")
            // 3. Phone number can contain or start with the query
            // 4. Subtitle/Industry can start with the query

            return name.startsWith(searchTerms) ||
                email.startsWith(searchTerms) ||
                subtitle.startsWith(searchTerms) ||
                phone.includes(searchTerms);
        });
    }, [flatResults, query]);

    const callSearchApi = React.useCallback(async (searchQuery: string) => {
        const trimmedQuery = searchQuery.trim();

        if (!trimmedQuery || trimmedQuery.length < 2) {
            setResults({ clients: [], jobs: [], candidates: [], teamMembers: [] });
            setIsOpen(false);
            return;
        }

        // Prevent duplicate API calls
        if (lastSearchedQueryRef.current === trimmedQuery) {
            setIsOpen(true);
            return;
        }

        lastSearchedQueryRef.current = trimmedQuery;
        setLoading(true);
        setIsOpen(true);

        try {
            const response = await globalSearch({
                q: trimmedQuery,
                limit: 5
            });

            if (response.success && response.data) {
                setResults({
                    clients: response.data.clients || [],
                    jobs: response.data.jobs || [],
                    candidates: response.data.candidates || [],
                    teamMembers: response.data.teamMembers || []
                });
            } else {
                setResults({ clients: [], jobs: [], candidates: [], teamMembers: [] });
            }
        } catch (error) {
            console.error("Global search error:", error);
            setResults({ clients: [], jobs: [], candidates: [], teamMembers: [] });
        } finally {
            setLoading(false);
        }
    }, []);

    React.useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    // Debounced auto-search effect
    React.useEffect(() => {
        const len = debouncedQuery.trim().length;
        const isEmail = debouncedQuery.includes('@');
        // Check if it looks like a phone number (at least 3 digits)
        const isPhone = /^\d{3,}$/.test(debouncedQuery.trim());

        // Auto-search logic:
        // 1. Must be at least 3 characters
        // 2. General text: Triggers only on multiples of 3 (3, 6, 9...) to reduce API calls
        // 3. Email/Phone: Triggers on ANY length (after debounce) to ensure we catch the full input
        if (debouncedQuery && len >= 3) {
            if (len % 3 === 0 || isEmail || isPhone) {
                callSearchApi(debouncedQuery);
            }
        } else if (len < 2) {
            // Clear results if query is too short
            setResults({ clients: [], jobs: [], candidates: [], teamMembers: [] });
            setIsOpen(false);
            lastSearchedQueryRef.current = "";
        }
    }, [debouncedQuery, callSearchApi]);

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            if (query.trim().length >= 2) {
                callSearchApi(query);
            }
        }
    };

    const handleSelect = (type: string, id: string) => {
        setIsOpen(false);
        setQuery("");

        switch (type) {
            case "candidate":
                // Correct route: /candidates/[id] (not /dashboard/candidates/[id])
                router.push(`/candidates/${id}`);
                break;
            case "client":
                // Correct route: /clients/[id] (not /dashboard/clients/[id])
                router.push(`/clients/${id}`);
                break;
            case "job":
                // Correct route: /jobs/[id] (not /dashboard/jobs/[id])
                router.push(`/jobs/${id}`);
                break;
            case "team":
            case "teamMember":
                // Team members don't have a detail page, navigate to team list
                // Pass ID as query parameter so the list can highlight it
                router.push(`/teammembers?highlight=${id}`);
                break;
            default:
                console.warn('Unknown result type:', type);
        }
    };

    const getIcon = (type: string) => {
        switch (type) {
            case 'client': return <Building2 className="h-4 w-4 text-green-600" />;
            case 'job': return <Briefcase className="h-4 w-4 text-blue-600" />;
            case 'candidate': return <User className="h-4 w-4 text-yellow-600" />;
            case 'team':
            case 'teamMember': return <Users className="h-4 w-4 text-purple-600" />;
            default: return null;
        }
    };

    const getIconBg = (type: string) => {
        switch (type) {
            case 'client': return "bg-green-100";
            case 'job': return "bg-blue-100";
            case 'candidate': return "bg-yellow-100";
            case 'team':
            case 'teamMember': return "bg-purple-100";
            default: return "bg-gray-100";
        }
    };

    const getBadgeStyle = (type: string) => {
        switch (type) {
            case 'client': return "bg-green-500 hover:bg-green-600";
            case 'job': return "bg-blue-500 hover:bg-blue-600";
            case 'candidate': return "bg-yellow-500 hover:bg-yellow-600";
            case 'team':
            case 'teamMember': return "bg-purple-500 hover:bg-purple-600";
            default: return "bg-gray-500";
        }
    };

    const getLabel = (type: string) => {
        switch (type) {
            case 'client': return "Client";
            case 'job': return "Job";
            case 'candidate': return "Candidate";
            case 'team':
            case 'teamMember': return "Team";
            default: return "Result";
        }
    };

    return (
        <div className="relative max-w-[400px] w-full mx-auto" ref={containerRef}>
            <Command
                shouldFilter={false}
                className="rounded-lg border border-blue-200 bg-blue-50 shadow-none overflow-visible focus-within:border-blue-600 focus-within:ring-1 focus-within:ring-blue-600 [&_[cmdk-input-wrapper]]:border-0 transition-all"
            >
                <CommandInput
                    placeholder="Search (Ctrl+K)"
                    value={query}
                    onValueChange={(val) => {
                        setQuery(val);
                    }}
                    onKeyDown={handleKeyDown}
                    onFocus={() => {
                        if (filteredFlatResults.length > 0) {
                            setIsOpen(true);
                        }
                    }}
                    className="border-none focus:ring-0"
                />

                {isOpen && (loading || filteredFlatResults.length > 0) && (
                    <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-lg shadow-lg border border-gray-200 overflow-hidden z-50">
                        <CommandList className="max-h-[80vh] overflow-y-auto p-2">
                            {loading && (
                                <div className="flex items-center justify-center p-4">
                                    <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
                                </div>
                            )}

                            {!loading && filteredFlatResults.length === 0 && (
                                <CommandEmpty className="py-6 text-center text-sm">
                                    No results found for "{query}"
                                </CommandEmpty>
                            )}

                            {!loading && filteredFlatResults.map((item) => (
                                <CommandItem
                                    key={`${item.type}-${item.data.id || item.data._id}`}
                                    value={`${item.type}-${item.data.id || item.data._id}-${getItemTitle(item)}`}
                                    onSelect={() => handleSelect(item.type, item.data.id || item.data._id)}
                                    className="flex items-center p-2 rounded-md cursor-pointer mb-1"
                                >
                                    <div className={cn("h-8 w-8 rounded-full flex items-center justify-center mr-3 shrink-0", getIconBg(item.type))}>
                                        {getIcon(item.type)}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm font-medium text-gray-900 truncate">{getItemTitle(item)}</p>
                                        <p className="text-xs text-gray-500 truncate">{getItemSubtitle(item)}</p>
                                    </div>
                                    <Badge className={cn("ml-2 shrink-0", getBadgeStyle(item.type))}>
                                        {getLabel(item.type)}
                                    </Badge>
                                </CommandItem>
                            ))}
                        </CommandList>
                    </div>
                )}
            </Command>
        </div>
    );
}
