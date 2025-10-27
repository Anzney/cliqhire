import React from 'react'
import { Button } from "@/components/ui/button"
import { Plus, SlidersHorizontal, RefreshCcw, MoreVertical, Trash2 } from 'lucide-react'
import { useState , useEffect } from 'react'

type DashboardHeaderProps = {
  setOpen: (open: boolean) => void; 
  setFilterOpen: (open: boolean) => void;
  initialLoading: boolean;
  heading: string;
  buttonText: string;
  showFilterButton?: boolean;
  showCreateButton?: boolean;
  rightContent?: React.ReactNode;
  onRefresh?: () => void;
  selectedCount?: number;
  onDelete?: () => void;
}

const  Dashboardheader= ({
    setOpen, 
    setFilterOpen, 
    initialLoading,
    heading,
    buttonText,
    showFilterButton = true,
    showCreateButton = true,
    rightContent,
    onRefresh,
    selectedCount = 0,
    onDelete,
}:DashboardHeaderProps)=> {

  return (
    <div>
         {/* Header */}
        {/* <div className="border-b">
          <div className="flex h-16 items-center px-4">
            <h1 className="text-2xl font-semibold">{heading}</h1>
          </div>
        </div> */}

        {/* Toolbar */}
        <div className="flex items-center justify-between p-4">
          {showCreateButton ? (
            <Button size="sm" onClick={() => setOpen(true)}>
              <Plus className="h-4 w-4 mr-2" />
              {buttonText}
            </Button>
          ) : (<div />)}
          <div className="flex items-center gap-2">
            {rightContent ? (
              rightContent
            ) : (
              <>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="text-destructive hover:text-destructive/90 hover:bg-destructive/10"
                  disabled={selectedCount === 0}
                  onClick={onDelete}
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  {selectedCount > 0 ? `Delete (${selectedCount})` : 'Delete'}
                </Button>
                {showFilterButton && (
                  <Button variant="outline" size="sm" onClick={() => setFilterOpen(true)}>
                    <SlidersHorizontal className="h-4 w-4 mr-2" />
                    Filters
                  </Button>
                )}
              </>
            )}
            <Button 
              variant="outline" 
              size="sm" 
              onClick={onRefresh}
              disabled={initialLoading}
            >
              {initialLoading ? (
                <>
                  <RefreshCcw className="h-4 w-4 mr-2 animate-spin" />
                  Loading...
                </>
              ) : (
                <>
                  <RefreshCcw className="h-4 w-4 mr-2" />
                  Refresh
                </>
              )}
            </Button>
             {/* <Button variant="ghost" size="sm">
              <MoreVertical className="h-4 w-4" />
            </Button>                             */}
          </div>
        </div> 
    </div>
  )
}


export default Dashboardheader ;
