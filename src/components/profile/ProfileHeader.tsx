import { User, MapPin, Clock, Calendar, CheckCircle, Shield } from 'lucide-react';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import type { ExtendedProfile } from '@/lib/profile-types';
import { format } from 'date-fns';

interface ProfileHeaderProps {
  profile: ExtendedProfile;
  isEmailVerified?: boolean;
  showEditButton?: boolean;
  onEditClick?: () => void;
}

export function ProfileHeader({ 
  profile, 
  isEmailVerified = false,
}: ProfileHeaderProps) {
  const memberSince = format(new Date(profile.created_at), 'MMMM yyyy');

  return (
    <div className="flex flex-col md:flex-row gap-6 items-start md:items-center">
      {/* Avatar */}
      <Avatar className="w-24 h-24 md:w-32 md:h-32 border-4 border-background shadow-lg">
        <AvatarImage src={profile.avatar_url || undefined} />
        <AvatarFallback className="bg-primary/10 text-primary text-3xl">
          <User className="w-12 h-12" />
        </AvatarFallback>
      </Avatar>

      {/* Info */}
      <div className="flex-1 space-y-2">
        <div className="flex flex-wrap items-center gap-2">
          <h1 className="text-2xl md:text-3xl font-bold">{profile.username}</h1>
          
          {/* Trust Badges */}
          {isEmailVerified && (
            <Badge variant="secondary" className="gap-1">
              <CheckCircle className="w-3 h-3" />
              Verified
            </Badge>
          )}
          {profile.is_identity_verified && (
            <Badge variant="default" className="gap-1">
              <Shield className="w-3 h-3" />
              ID Verified
            </Badge>
          )}
        </div>

        {/* Professional Title */}
        {profile.professional_title && (
          <p className="text-lg text-muted-foreground">
            {profile.professional_title}
          </p>
        )}

        {/* Meta Info */}
        <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
          {profile.location && (
            <span className="flex items-center gap-1">
              <MapPin className="w-4 h-4" />
              {profile.location}
            </span>
          )}
          {profile.availability_hours && (
            <span className="flex items-center gap-1">
              <Clock className="w-4 h-4" />
              {profile.availability_hours}
            </span>
          )}
          <span className="flex items-center gap-1">
            <Calendar className="w-4 h-4" />
            Member since {memberSince}
          </span>
        </div>
      </div>
    </div>
  );
}
