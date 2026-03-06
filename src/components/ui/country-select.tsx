"use client";

import React, { useState, useEffect, useRef } from "react";
import { Input } from "@/components/ui/input";
import { useDebounce } from "@/hooks/use-debounce";
import { Search, Loader2, ChevronDown } from "lucide-react";
import axios from "axios";

interface CountryData {
    name: { common: string };
    flags: { svg: string; png: string; alt: string };
    demonyms?: { eng?: { m: string; f: string } };
    cca2: string;
}

interface CountrySelectProps {
    value: string;
    onChange: (value: string, nationality?: string) => void;
    type?: "country" | "nationality";
    placeholder?: string;
    className?: string;
    error?: boolean;
}

export function CountrySelect({
    value,
    onChange,
    type = "country",
    placeholder = "Select...",
    className = "",
    error = false,
}: CountrySelectProps) {
    const [countries, setCountries] = useState<CountryData[]>([]);
    const [isOpen, setIsOpen] = useState(false);
    const [search, setSearch] = useState("");
    const [loading, setLoading] = useState(false);

    const debouncedSearch = useDebounce(search, 300);
    const wrapperRef = useRef<HTMLDivElement>(null);

    // Fetch all countries initially
    useEffect(() => {
        const fetchCountries = async () => {
            setLoading(true);
            try {
                const res = await axios.get("https://restcountries.com/v3.1/all?fields=name,flags,demonyms,cca2");
                setCountries(res.data);
            } catch (err) {
                console.error("Failed to fetch countries", err);
            } finally {
                setLoading(false);
            }
        };
        fetchCountries();
    }, []);

    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
                setIsOpen(false);
                setSearch("");
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const getDisplayText = (country: CountryData) => {
        if (type === "nationality") {
            return country.demonyms?.eng?.m || country.name.common;
        }
        return country.name.common;
    };

    const filteredCountries = countries.filter((country) => {
        const text = getDisplayText(country).toLowerCase();
        return text.includes(debouncedSearch.toLowerCase());
    }).sort((a, b) => getDisplayText(a).localeCompare(getDisplayText(b)));

    return (
        <div ref={wrapperRef} className={`relative ${className}`}>
            <button
                type="button"
                onClick={() => setIsOpen(!isOpen)}
                className={`flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring disabled:cursor-not-allowed disabled:opacity-50 ${error ? 'border-red-500' : ''}`}
            >
                {value ? (
                    <span className="truncate">{value}</span>
                ) : (
                    <span className="text-muted-foreground">{placeholder}</span>
                )}
                <ChevronDown className="h-4 w-4 opacity-50 ml-2" />
            </button>

            {isOpen && (
                <div className="absolute z-50 mt-1 w-full rounded-md border bg-popover text-popover-foreground shadow-md bg-white dark:bg-zinc-950 max-h-80 flex flex-col">
                    <div className="flex items-center border-b px-3 shrink-0">
                        <Search className="mr-2 h-4 w-4 shrink-0 opacity-50" />
                        <input
                            className="flex h-10 w-full rounded-md bg-transparent py-3 text-sm outline-none placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50"
                            placeholder="Search..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            // Prevent clicking on the input from closing the modal
                            onClick={(e) => e.stopPropagation()}
                            autoFocus
                        />
                        {loading && <Loader2 className="h-4 w-4 shrink-0 animate-spin text-muted-foreground" />}
                    </div>

                    <div className="overflow-auto p-1 flex-1">
                        {filteredCountries.length === 0 ? (
                            <div className="p-2 text-sm text-center text-muted-foreground py-6">
                                No results found.
                            </div>
                        ) : (
                            filteredCountries.map((country) => {
                                const text = getDisplayText(country);
                                const nationalityName = country.demonyms?.eng?.m || country.name.common;

                                return (
                                    <div
                                        key={country.cca2}
                                        className="flex cursor-pointer items-center gap-2 rounded-sm px-2 py-1.5 text-sm hover:bg-zinc-100 dark:hover:bg-zinc-800"
                                        onClick={() => {
                                            onChange(text, nationalityName);
                                            setSearch("");
                                            setIsOpen(false);
                                        }}
                                    >
                                        <img
                                            src={country.flags.svg}
                                            alt={country.flags.alt || `Flag of ${country.name.common}`}
                                            className="h-4 w-6 object-cover rounded-sm border shrink-0"
                                        />
                                        <span className="truncate">{text}</span>
                                    </div>
                                );
                            })
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}
