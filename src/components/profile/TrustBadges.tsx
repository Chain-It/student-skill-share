import { CheckCircle, Shield, Mail, Calendar } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { format } from 'date-fns';

interface TrustBadgesProps {
  isEmailVerified: boolean;
  isIdentityVerified: boolean;
  memberSince: string;
}

export function TrustBadges({ 
  isEmailVerified, 
  isIdentityVerified, 
  memberSince 
}: TrustBadgesProps) {
  const items = [
    {
      icon: Mail,
      label: 'Email Verified',
      verified: isEmailVerified,
    },
    {
      icon: Shield,
      label: 'Identity Verified',
      verified: isIdentityVerified,
    },
    {
      icon: Calendar,
      label: `Member since ${format(new Date(memberSince), 'MMM yyyy')}`,
      verified: true,
    },
  ];

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-lg flex items-center gap-2">
          <CheckCircle className="w-5 h-5 text-primary" />
          Trust & Verification
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {items.map((item, index) => (
          <div key={index} className="flex items-center gap-3">
            <div className={`p-2 rounded-full ${item.verified ? 'bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400' : 'bg-muted text-muted-foreground'}`}>
              <item.icon className="w-4 h-4" />
            </div>
            <span className={item.verified ? 'text-foreground' : 'text-muted-foreground'}>
              {item.label}
            </span>
            {item.verified && <CheckCircle className="w-4 h-4 text-green-500 ml-auto" />}
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
