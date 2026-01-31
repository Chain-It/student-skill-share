import { Clock, MessageSquare, Calendar } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface WorkingStyleSectionProps {
  responseTime: string | null;
  availabilityHours: string | null;
  preferredCommunication: string[];
}

export function WorkingStyleSection({ 
  responseTime, 
  availabilityHours, 
  preferredCommunication 
}: WorkingStyleSectionProps) {
  const hasData = responseTime || availabilityHours || preferredCommunication.length > 0;

  if (!hasData) {
    return null;
  }

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-lg flex items-center gap-2">
          <Clock className="w-5 h-5 text-primary" />
          Working Style
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {responseTime && (
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-full bg-green-100 dark:bg-green-900/30">
              <Clock className="w-4 h-4 text-green-600 dark:text-green-400" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Response Time</p>
              <p className="font-medium">{responseTime}</p>
            </div>
          </div>
        )}

        {availabilityHours && (
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-full bg-blue-100 dark:bg-blue-900/30">
              <Calendar className="w-4 h-4 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Availability</p>
              <p className="font-medium">{availabilityHours}</p>
            </div>
          </div>
        )}

        {preferredCommunication.length > 0 && (
          <div className="flex items-start gap-3">
            <div className="p-2 rounded-full bg-purple-100 dark:bg-purple-900/30">
              <MessageSquare className="w-4 h-4 text-purple-600 dark:text-purple-400" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground mb-1">Preferred Communication</p>
              <div className="flex flex-wrap gap-1">
                {preferredCommunication.map((method) => (
                  <Badge key={method} variant="secondary" className="text-xs">
                    {method}
                  </Badge>
                ))}
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
