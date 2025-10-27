import React from 'react';
import { TableHead, TableRow } from './ui/table';
import { ArrowUpDown } from 'lucide-react';
import { Button } from './ui/button';

type SortConfig = {
  field: string;
  order: 'asc' | 'desc';
};

type TableHeaderProps = {
  tableHeadArr: string[];
  className?: string;
  sortConfig?: SortConfig;
  onSort?: (field: string) => void;
};

const Tableheader = ({ tableHeadArr, className, sortConfig, onSort }: TableHeaderProps) => {
  const handleSort = (field: string) => {
    if (onSort) {
      onSort(field);
    }
  };

  const getSortIcon = (field: string) => {
    if (field !== 'name') return null;
    if (!sortConfig || sortConfig.field !== 'name') {
      return <ArrowUpDown className="ml-1 h-3 w-3 opacity-0 group-hover:opacity-100 transition-opacity" />;
    }
    return sortConfig.order === 'asc' ? (
      <ArrowUpDown className="ml-1 h-3 w-3 rotate-180" />
    ) : (
      <ArrowUpDown className="ml-1 h-3 w-3" />
    );
  };

  return (
    <TableRow className={`hover:bg-transparent ${className || ''}`}>
      {tableHeadArr.map((head: string, index: number) => {
        const fieldName = head.toLowerCase().replace(/\s+/g, '');
        const isSortable = fieldName === 'name'; // Only make Name column sortable
        
        return (
          <TableHead key={index} className="text-xs uppercase text-muted-foreground font-medium">
            {isSortable ? (
              <Button
                variant="ghost"
                className="p-0 h-auto font-medium hover:bg-transparent group"
                onClick={() => handleSort(fieldName)}
              >
                <div className="flex items-center">
                  {head}
                  {getSortIcon(fieldName)}
                </div>
              </Button>
            ) : (
              head
            )}
          </TableHead>
        );
      })}
    </TableRow>
  );
};

export default Tableheader;
