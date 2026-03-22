import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { ExternalLink, Mail, Phone, User, Calendar } from 'lucide-react';
import { TemporaryCandidate } from '@/types/temCandidate';

interface CandidateCardProps {
  candidate: TemporaryCandidate;
}

export const CandidateCard: React.FC<CandidateCardProps> = ({ candidate }) => {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(word => word.charAt(0))
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <Card className="w-full hover:shadow-md transition-shadow duration-200">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center space-x-3">
            <Avatar className="h-12 w-12">
              <AvatarFallback className="bg-brand-primary text-brand-primary-foreground">
                {getInitials(candidate.name)}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <CardTitle className="text-lg font-semibold truncate">
                {candidate.name}
              </CardTitle>
              <p className="text-sm text-muted-foreground">
                Added by {candidate.CreatedBy?.name || 'Unknown'}
              </p>
            </div>
          </div>
          <Badge variant={candidate.showProfile ? 'default' : 'secondary'}>
            {candidate.showProfile ? 'Visible' : 'Hidden'}
          </Badge>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-3">
        <div className="flex items-center space-x-2 text-sm">
          <Mail className="h-4 w-4 text-muted-foreground" />
          <span className="truncate">{candidate.email}</span>
        </div>
        
        <div className="flex items-center space-x-2 text-sm">
          <Phone className="h-4 w-4 text-muted-foreground" />
          <span>{candidate.phone}</span>
        </div>
        
        <div className="flex items-center space-x-2 text-sm">
          <Calendar className="h-4 w-4 text-muted-foreground" />
          <span>Added {formatDate(candidate.createdAt)}</span>
        </div>
        
        <div className="flex items-center space-x-2 text-sm">
          <User className="h-4 w-4 text-muted-foreground" />
          <span className="text-muted-foreground">Pipeline ID: {candidate.pipelineId}</span>
        </div>
        
        {candidate.profileLink && (
          <div className="pt-2">
            <Button 
              variant="outline" 
              size="sm" 
              className="w-full"
              onClick={() => window.open(candidate.profileLink, '_blank')}
            >
              <ExternalLink className="h-4 w-4 mr-2" />
              View Profile
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
