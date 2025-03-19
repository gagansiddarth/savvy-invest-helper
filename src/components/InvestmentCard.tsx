
import React from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ExternalLink, Info } from 'lucide-react';

interface InvestmentCardProps {
  name: string;
  type: string;
  description: string;
  riskLevel: string;
  expectedReturn: string;
  className?: string;
}

const InvestmentCard: React.FC<InvestmentCardProps> = ({
  name,
  type,
  description,
  riskLevel,
  expectedReturn,
  className
}) => {
  const getRiskBadgeColor = () => {
    switch (riskLevel.toLowerCase()) {
      case 'very low':
        return 'bg-finance-blue text-blue-700';
      case 'low':
        return 'bg-finance-green text-green-700';
      case 'moderate':
      case 'medium':
        return 'bg-finance-yellow text-yellow-700';
      case 'high':
        return 'bg-finance-red text-red-700';
      case 'very high':
      case 'extremely high':
        return 'bg-destructive/20 text-destructive';
      default:
        return 'bg-secondary text-secondary-foreground';
    }
  };

  return (
    <Card className={`overflow-hidden transition-all duration-300 hover:shadow-card-hover ${className}`}>
      <CardHeader className="pb-3">
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-lg">{name}</CardTitle>
            <CardDescription className="mt-1">{type}</CardDescription>
          </div>
          <Badge variant="outline" className={`${getRiskBadgeColor()}`}>
            {riskLevel}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="pb-3">
        <p className="text-sm text-muted-foreground">{description}</p>
        <div className="mt-4 flex items-center justify-between">
          <div>
            <p className="text-xs text-muted-foreground">Expected Return</p>
            <p className="text-lg font-semibold">{expectedReturn}</p>
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex justify-between pt-0">
        <Button variant="ghost" size="sm" className="text-xs">
          <Info className="h-3.5 w-3.5 mr-1" />
          Learn More
        </Button>
        <Button variant="outline" size="sm" className="text-xs">
          <ExternalLink className="h-3.5 w-3.5 mr-1" />
          Research
        </Button>
      </CardFooter>
    </Card>
  );
};

export default InvestmentCard;
