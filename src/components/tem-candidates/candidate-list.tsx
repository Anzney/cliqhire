import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Users, RefreshCw } from 'lucide-react';
import { TemporaryCandidate } from '@/types/temCandidate';
import { CandidateTable } from './candidate-table';

interface CandidateListProps {
  candidates: TemporaryCandidate[];
  isLoading: boolean;
  error: Error | null;
  results: number;
  onRefresh: () => void;
}

export const CandidateList: React.FC<CandidateListProps> = ({
  candidates,
  isLoading,
  error,
  results,
  onRefresh,
}) => {
  if (error) {
    return (
      <Card className="w-full">
        <CardContent className="flex flex-col items-center justify-center py-12">
          <div className="text-center space-y-4">
            <div className="text-6xl text-destructive">⚠️</div>
            <h3 className="text-xl font-semibold">Error Loading Candidates</h3>
            <p className="text-muted-foreground max-w-md">
              {error.message || 'Failed to load temporary candidates. Please try again.'}
            </p>
            <Button onClick={onRefresh} variant="outline">
              <RefreshCw className="h-4 w-4 mr-2" />
              Try Again
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Users className="h-5 w-5 text-muted-foreground" />
          <h2 className="text-2xl font-bold">Temporary Candidates</h2>
          <Badge variant="secondary">{results}</Badge>
        </div>
        <Button onClick={onRefresh} variant="outline" size="sm">
          <RefreshCw className="h-4 w-4 mr-2" />
          Refresh
        </Button>
      </div>
      
      <CandidateTable candidates={candidates} isLoading={isLoading} />
    </div>
  );
};
