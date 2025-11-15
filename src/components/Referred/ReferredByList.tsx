"use client"

import * as React from "react"
import { useState, useEffect, useCallback } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Loader2, Search, User } from "lucide-react"
import { getReferredList } from "@/services/referredService"

export interface ReferredByListProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSelect: (user: any) => void
}

export function ReferredByList({ open, onOpenChange, onSelect }: ReferredByListProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [referredList, setReferredList] = useState<any[]>([])
  const [filteredList, setFilteredList] = useState<any[]>([])

  useEffect(() => {
    if (open) {
      fetchReferredList()
    }
  }, [open])

  useEffect(() => {
    if (searchQuery.trim() === "") {
      setFilteredList(referredList)
    } else {
      const query = searchQuery.toLowerCase()
      const filtered = referredList.filter(
        (user) =>
          user.name.toLowerCase().includes(query) ||
          user.email.toLowerCase().includes(query) ||
          user.phone.includes(query) ||
          user.position.toLowerCase().includes(query)
      )
      setFilteredList(filtered)
    }
  }, [searchQuery, referredList])

  const fetchReferredList = async () => {
    try {
      setIsLoading(true)
      const data = await getReferredList()
      setReferredList(data)
      setFilteredList(data)
    } catch (error) {
      console.error("Error fetching referred list:", error)
      // You might want to add error handling here (e.g., toast notification)
    } finally {
      setIsLoading(false)
    }
  }

  const handleSelect = useCallback((user: any) => {
    // Prevent multiple clicks
    if (isLoading) return;
    onSelect(user);
  }, [isLoading, onSelect]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-center text-lg font-medium">Select Referrer</DialogTitle>
        </DialogHeader>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search by name or email"
            className="w-full pl-9 h-10"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <ScrollArea className="h-[300px] mt-4 -mx-6 px-6">
          {isLoading ? (
            <div className="flex items-center justify-center h-full py-8">
              <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
            </div>
          ) : (
            <div className="space-y-2 py-2">
              {filteredList.map((user) => {
                const initials = user.name
                  .split(' ')
                  .map((n: string) => n[0])
                  .join('')
                  .toUpperCase()
                  .substring(0, 2);

                return (
                  <div
                    key={user._id}
                    className="flex items-center justify-between p-3 hover:bg-muted/50 rounded-lg transition-colors"
                  >
                    <div className="flex items-center space-x-3">
                      <Avatar className="h-10 w-10">
                        <AvatarImage src={user.avatar} alt={user.name} />
                        <AvatarFallback className="bg-primary/10 text-primary">
                          {initials}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="text-sm font-medium">{user.name}</p>
                        <p className="text-xs text-muted-foreground">{user.email}</p>
                      </div>
                    </div>
                    <Button 
                      size="sm" 
                      variant="outline" 
                      className="h-8 text-xs px-3"
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        handleSelect(user);
                      }}
                    >
                      Select
                    </Button>
                  </div>
                );
              })}
              {filteredList.length === 0 && (
                <div className="flex flex-col items-center justify-center py-8 text-center">
                  <User className="h-10 w-10 text-muted-foreground mb-2" />
                  <p className="text-sm font-medium text-muted-foreground">
                    {searchQuery.trim() === '' ? 'No referrers found' : 'No matching referrers'}
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {searchQuery.trim() === '' ? 'There are no referrers to display' : 'Try a different search term'}
                  </p>
                </div>
              )}
            </div>
          )}
        </ScrollArea>
      </DialogContent>
    </Dialog>
  )
}
