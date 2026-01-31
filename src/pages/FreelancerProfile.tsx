import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, MessageSquare } from 'lucide-react';
import { Layout } from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { PageLoader } from '@/components/ui/LoadingSpinner';
import { ProfileHeader } from '@/components/profile/ProfileHeader';
import { SkillsDisplay } from '@/components/profile/SkillsDisplay';
import { PortfolioSection } from '@/components/profile/PortfolioSection';
import { EducationSection } from '@/components/profile/EducationSection';
import { WorkingStyleSection } from '@/components/profile/WorkingStyleSection';
import { TrustBadges } from '@/components/profile/TrustBadges';
import { FreelancerReviews } from '@/components/profile/FreelancerReviews';
import { FreelancerServices } from '@/components/profile/FreelancerServices';
import { 
  useFreelancerProfile, 
  useFreelancerStats, 
  useFreelancerGigs,
  useFreelancerReviews 
} from '@/hooks/useFreelancerProfile';

export default function FreelancerProfile() {
  const { id } = useParams<{ id: string }>();
  
  const { data: profile, isLoading: profileLoading } = useFreelancerProfile(id);
  const { data: stats } = useFreelancerStats(id);
  const { data: gigs } = useFreelancerGigs(id);
  const { data: reviews } = useFreelancerReviews(id);

  if (profileLoading) {
    return (
      <Layout>
        <PageLoader />
      </Layout>
    );
  }

  if (!profile) {
    return (
      <Layout>
        <div className="page-container text-center py-20">
          <h1 className="text-2xl font-bold mb-4">Freelancer Not Found</h1>
          <p className="text-muted-foreground mb-6">
            The profile you're looking for doesn't exist.
          </p>
          <Link to="/gigs">
            <Button>Browse Gigs</Button>
          </Link>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="page-container max-w-4xl mx-auto">
        {/* Back Button */}
        <Link to="/gigs" className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground mb-6">
          <ArrowLeft className="w-4 h-4" />
          Back to Gigs
        </Link>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          {/* Header Card */}
          <Card>
            <CardContent className="p-6">
              <ProfileHeader 
                profile={profile} 
                isEmailVerified={true}
              />
              
              {/* Bio */}
              {profile.bio && (
                <div className="mt-6 pt-6 border-t border-border">
                  <h2 className="text-lg font-semibold mb-2">About</h2>
                  <p className="text-muted-foreground whitespace-pre-wrap">
                    {profile.bio}
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Two Column Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-6">
              {/* Skills & Tools */}
              <SkillsDisplay skills={profile.skills} tools={profile.tools} />

              {/* Services */}
              {gigs && gigs.length > 0 && (
                <FreelancerServices gigs={gigs} userId={id!} />
              )}

              {/* Portfolio */}
              {profile.portfolio_items.length > 0 && (
                <PortfolioSection items={profile.portfolio_items} isEditable={false} />
              )}

              {/* Reviews */}
              {stats && reviews && (
                <FreelancerReviews reviews={reviews} stats={stats} />
              )}
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Working Style */}
              <WorkingStyleSection
                responseTime={profile.response_time}
                availabilityHours={profile.availability_hours}
                preferredCommunication={profile.preferred_communication}
              />

              {/* Education */}
              <EducationSection
                program={profile.education_program}
                institution={profile.education_institution}
                year={profile.education_year}
                certifications={profile.certifications}
              />

              {/* Trust Badges */}
              <TrustBadges
                isEmailVerified={true}
                isIdentityVerified={profile.is_identity_verified}
                memberSince={profile.created_at}
              />

              {/* CTA */}
              <Card>
                <CardContent className="p-4 space-y-3">
                  <Link to={`/gigs?seller=${id}`}>
                    <Button className="w-full">View All Gigs</Button>
                  </Link>
                </CardContent>
              </Card>
            </div>
          </div>
        </motion.div>
      </div>
    </Layout>
  );
}
