import React from 'react'
import { TableHead , TableRow } from './ui/table'
type TableHeaderProps = {
  tableHeadArr: string[];   
  className?: string;
}

const Tableheader = ({tableHeadArr, className}:TableHeaderProps) => {
  return (
    <TableRow className={`hover:bg-transparent ${className || ''}`}>
      {tableHeadArr.map((head :string, index:number) => (
        <TableHead key={index} className="text-xs uppercase text-muted-foreground font-medium">
          {head}    
        </TableHead>
      ))}
    </TableRow>
  )
}

export default  Tableheader
