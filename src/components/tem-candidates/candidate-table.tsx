import React from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { ExternalLink, Mail, Phone, Calendar } from 'lucide-react';
import { TemporaryCandidate } from '@/types/temCandidate';

interface CandidateTableProps {
  candidates: TemporaryCandidate[];
  isLoading: boolean;
}

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString();
};

const CandidateTableRow: React.FC<{ candidate: TemporaryCandidate }> = ({ candidate }) => {
  return (
    <TableRow>
      <TableCell className="font-medium">{candidate.name}</TableCell>
      <TableCell>
        <div className="flex items-center space-x-2">
          <Mail className="h-4 w-4 text-muted-foreground" />
          <span className="truncate max-w-[200px]">{candidate.email}</span>
        </div>
      </TableCell>
      <TableCell>
        <div className="flex items-center space-x-2">
          <Phone className="h-4 w-4 text-muted-foreground" />
          <span>{candidate.phone}</span>
        </div>
      </TableCell>
      <TableCell>{candidate.CreatedBy?.name || 'Unknown'}</TableCell>
      <TableCell>
        <div className="flex items-center space-x-2">
          <Calendar className="h-4 w-4 text-muted-foreground" />
          <span>{formatDate(candidate.createdAt)}</span>
        </div>
      </TableCell>
      <TableCell>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <div className="flex items-center space-x-2 cursor-help">
                <span className="text-sm text-muted-foreground font-mono">
                  {candidate.pipelineId.slice(-8)}
                </span>
              </div>
            </TooltipTrigger>
            <TooltipContent>
              <p className="font-mono text-xs">{candidate.pipelineId}</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </TableCell>
      <TableCell>
        {candidate.profileLink && (
          <Button
            variant="outline"
            size="sm"
            onClick={() => window.open(candidate.profileLink, '_blank')}
          >
            <ExternalLink className="h-4 w-4 mr-2" />
            Profile
          </Button>
        )}
      </TableCell>
    </TableRow>
  );
};

const TableSkeleton: React.FC = () => {
  return (
    <>
      {[...Array(5)].map((_, index) => (
        <TableRow key={index}>
          <TableCell><Skeleton className="h-4 w-32" /></TableCell>
          <TableCell><Skeleton className="h-4 w-40" /></TableCell>
          <TableCell><Skeleton className="h-4 w-32" /></TableCell>
          <TableCell><Skeleton className="h-4 w-24" /></TableCell>
          <TableCell><Skeleton className="h-4 w-24" /></TableCell>
          <TableCell><Skeleton className="h-4 w-20" /></TableCell>
          <TableCell><Skeleton className="h-8 w-20" /></TableCell>
        </TableRow>
      ))}
    </>
  );
};

export const CandidateTable: React.FC<CandidateTableProps> = ({ candidates, isLoading }) => {
  if (isLoading) {
    return (
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Phone</TableHead>
              <TableHead>Created_By</TableHead>
              <TableHead>Created Date</TableHead>
              <TableHead>Pipeline ID</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableSkeleton />
          </TableBody>
        </Table>
      </div>
    );
  }

  if (candidates.length === 0) {
    return (
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Phone</TableHead>
              <TableHead>Created_By</TableHead>
              <TableHead>Created Date</TableHead>
              <TableHead>Pipeline ID</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow>
              <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                No temporary candidates found
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </div>
    );
  }

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Phone</TableHead>
            <TableHead>Created_By</TableHead>
            <TableHead>Created Date</TableHead>
            <TableHead>Pipeline ID</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {candidates.map((candidate) => (
            <CandidateTableRow key={candidate._id} candidate={candidate} />
          ))}
        </TableBody>
      </Table>
    </div>
  );
};
