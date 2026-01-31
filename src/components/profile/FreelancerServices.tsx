import { Link } from 'react-router-dom';
import { Briefcase, Clock, ArrowRight } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { formatPrice } from '@/lib/utils';

interface Gig {
  id: string;
  title: string;
  price_ngn: number;
  delivery_days: number;
  average_rating: number | null;
  total_reviews: number | null;
}

interface FreelancerServicesProps {
  gigs: Gig[];
  userId: string;
}

export function FreelancerServices({ gigs, userId }: FreelancerServicesProps) {
  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-lg flex items-center justify-between">
          <span className="flex items-center gap-2">
            <Briefcase className="w-5 h-5 text-primary" />
            Services Offered
          </span>
          {gigs.length > 0 && (
            <Link to={`/gigs?seller=${userId}`}>
              <Button variant="ghost" size="sm" className="gap-1">
                View All
                <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent>
        {gigs.length === 0 ? (
          <p className="text-muted-foreground text-center py-4">
            No active services yet.
          </p>
        ) : (
          <div className="space-y-3">
            {gigs.slice(0, 5).map((gig) => (
              <Link
                key={gig.id}
                to={`/gigs/${gig.id}`}
                className="flex items-center justify-between p-3 rounded-lg border border-border hover:bg-accent/50 transition-colors"
              >
                <div className="flex-1 min-w-0">
                  <p className="font-medium truncate">{gig.title}</p>
                  <div className="flex items-center gap-3 text-sm text-muted-foreground mt-1">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {gig.delivery_days} day{gig.delivery_days > 1 ? 's' : ''}
                    </span>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-primary">{formatPrice(gig.price_ngn)}</p>
                </div>
              </Link>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
