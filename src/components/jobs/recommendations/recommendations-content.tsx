"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { MapPin, Briefcase, Users, Languages, Sparkles, Plus, RotateCcw, Search, X } from "lucide-react"
import Link from "next/link"

interface RecommendationsContentProps {
  jobId: string;
}

export function RecommendationsContent({ jobId }: RecommendationsContentProps) {
  return (
    <div className="flex flex-col h-full">
      {/* Search Filters */}
      <div className="p-4 space-y-4 border-b">
        <div className="grid grid-cols-5 gap-2">
          {/* Location Filter */}
          <div className="relative">
            <Select>
              <SelectTrigger className="w-full">
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-muted-foreground" />
                  <span>Location</span>
                </div>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Locations</SelectItem>
                <SelectItem value="remote">Remote</SelectItem>
                <SelectItem value="onsite">On-site</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Job Title Filter */}
          <div className="relative">
            <Select>
              <SelectTrigger className="w-full">
                <div className="flex items-center gap-2">
                  <Briefcase className="h-4 w-4 text-muted-foreground" />
                  <span>SDE</span>
                </div>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="sde">SDE</SelectItem>
                <SelectItem value="senior">Senior SDE</SelectItem>
                <SelectItem value="lead">Lead SDE</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Employers Filter */}
          <div className="relative">
            <Select>
              <SelectTrigger className="w-full">
                <div className="flex items-center gap-2">
                  <Users className="h-4 w-4 text-muted-foreground" />
                  <span>Employers</span>
                </div>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Employers</SelectItem>
                <SelectItem value="tech">Tech Companies</SelectItem>
                <SelectItem value="startup">Startups</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Languages Filter */}
          <div className="relative">
            <Select>
              <SelectTrigger className="w-full">
                <div className="flex items-center gap-2">
                  <Languages className="h-4 w-4 text-muted-foreground" />
                  <span>Languages</span>
                </div>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Languages</SelectItem>
                <SelectItem value="english">English</SelectItem>
                <SelectItem value="spanish">Spanish</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Skills Filter */}
          <div className="relative">
            <Select>
              <SelectTrigger className="w-full">
                <div className="flex items-center gap-2">
                  <Sparkles className="h-4 w-4 text-muted-foreground" />
                  <span>Skills</span>
                </div>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Skills</SelectItem>
                <SelectItem value="javascript">JavaScript</SelectItem>
                <SelectItem value="python">Python</SelectItem>
                <SelectItem value="java">Java</SelectItem>
              </SelectContent>
            </Select>
            <Button 
              size="sm" 
              variant="ghost" 
              className="absolute right-0 top-0 h-full px-3 hover:bg-transparent text-blue-600"
            >
              <Plus className="h-4 w-4"/>
            </Button>
          </div>
        </div>

        {/* More Search Options */}
        <div className="flex items-center justify-between">
          <Button variant="link" className="text-blue-600 p-0 h-auto">
            + More Search Criteria
          </Button>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" className="gap-2">
              <Search className="h-4 w-4" />
              Search
            </Button>
            <Button variant="outline" size="sm" className="gap-2">
              <RotateCcw className="h-4 w-4" />
              Reset
            </Button>
            <Button variant="outline" size="sm" className="gap-2">
              <X className="h-4 w-4" />
              Clear all
            </Button>
          </div>
        </div>
      </div>

      {/* Empty State */}
      <div className="flex-1 flex flex-col items-center justify-center p-8">
        <div className="w-64 h-64 mb-6">
          <svg
            viewBox="0 0 200 200"
            className="w-full h-full text-blue-100"
          >
            <rect x="40" y="40" width="120" height="120" rx="8" fill="currentColor" />
            <circle cx="100" cy="80" r="20" fill="#60A5FA"/>
            <path d="M70 120 L130 120" stroke="#60A5FA" strokeWidth="4" strokeLinecap="round"/>
            <path d="M80 140 L120 140" stroke="#60A5FA" strokeWidth="4" strokeLinecap="round"/>
          </svg>
        </div>
        <h3 className="text-xl font-semibold mb-2">No candidates found.</h3>
        <p className="text-muted-foreground text-center mb-4">
          Please adjust your search or start sourcing candidates through Sourcing Hub.
        </p>
        <Link 
          href="#" 
          className="text-blue-600 hover:underline text-sm mb-4"
        >
          Learn more about Sourcing Hub
        </Link>
        <Button className="gap-2">
          Access Sourcing Hub
        </Button>
      </div>
    </div>
  )
}
