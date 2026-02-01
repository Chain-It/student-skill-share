import { useState, useRef, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Camera, User, Save, Loader2, Plus, X } from 'lucide-react';
import { Layout } from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { PageLoader } from '@/components/ui/LoadingSpinner';
import { SkillsInput } from '@/components/profile/SkillsInput';
import { PortfolioSection } from '@/components/profile/PortfolioSection';
import { useAuth } from '@/hooks/useAuth';
import { useProfile } from '@/hooks/useProfile';
import { useUpdateProfile, useUploadAvatar } from '@/hooks/useUpdateProfile';
import { 
  SKILL_SUGGESTIONS, 
  TOOL_SUGGESTIONS, 
  RESPONSE_TIME_OPTIONS,
  COMMUNICATION_METHODS,
  AVAILABILITY_OPTIONS,
  STUDENT_LEVEL_OPTIONS,
} from '@/lib/skills-constants';
import type { ExtendedProfile, Certification, PortfolioItem } from '@/lib/profile-types';

export default function Profile() {
  const { user, loading: authLoading, isEmailVerified } = useAuth();
  const { data: profile, isLoading: profileLoading } = useProfile();
  const updateProfile = useUpdateProfile();
  const uploadAvatar = useUploadAvatar();
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Basic Info
  const [username, setUsername] = useState('');
  const [bio, setBio] = useState('');
  const [professionalTitle, setProfessionalTitle] = useState('');
  const [location, setLocation] = useState('');

  // Skills & Tools
  const [skills, setSkills] = useState<string[]>([]);
  const [tools, setTools] = useState<string[]>([]);

  // Working Style
  const [availabilityHours, setAvailabilityHours] = useState('');
  const [responseTime, setResponseTime] = useState('');
  const [preferredCommunication, setPreferredCommunication] = useState<string[]>([]);

  // Education
  const [educationProgram, setEducationProgram] = useState('');
  const [educationInstitution, setEducationInstitution] = useState('');
  const [educationLevel, setEducationLevel] = useState('');
  const [educationYear, setEducationYear] = useState('');

  const [isInitialized, setIsInitialized] = useState(false);

  // Initialize form with profile data
  useEffect(() => {
    if (profile && !isInitialized) {
      const extendedProfile = profile as unknown as ExtendedProfile;
      setUsername(extendedProfile.username || '');
      setBio(extendedProfile.bio || '');
      setProfessionalTitle(extendedProfile.professional_title || '');
      setLocation(extendedProfile.location || '');
      setSkills(extendedProfile.skills || []);
      setTools(extendedProfile.tools || []);
      setAvailabilityHours(extendedProfile.availability_hours || '');
      setResponseTime(extendedProfile.response_time || '');
      setPreferredCommunication(extendedProfile.preferred_communication || []);
      setEducationProgram(extendedProfile.education_program || '');
      setEducationInstitution(extendedProfile.education_institution || '');
      setEducationYear(extendedProfile.education_year?.toString() || '');
      setEducationLevel(extendedProfile.education_level || '');
      setIsInitialized(true);
    }
  }, [profile, isInitialized]);

  if (authLoading || profileLoading) {
    return (
      <Layout>
        <PageLoader />
      </Layout>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (!isEmailVerified) {
    return <Navigate to="/verify-email" replace />;
  }

  const handleAvatarClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) return;
    if (file.size > 2 * 1024 * 1024) return;

    const avatarUrl = await uploadAvatar.mutateAsync(file);
    await updateProfile.mutateAsync({ avatar_url: avatarUrl });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username.trim()) return;

    await updateProfile.mutateAsync({
      username: username.trim(),
      bio: bio.trim() || null,
      professional_title: professionalTitle.trim() || null,
      location: location.trim() || null,
      skills,
      tools,
      availability_hours: availabilityHours || null,
      response_time: responseTime || null,
      preferred_communication: preferredCommunication,
      education_program: educationProgram.trim() || null,
      education_institution: educationInstitution.trim() || null,
      education_year: educationYear ? parseInt(educationYear) : null,
      education_level: educationLevel || null,
    });
  };

  const toggleCommunication = (method: string) => {
    setPreferredCommunication(prev => 
      prev.includes(method) 
        ? prev.filter(m => m !== method)
        : [...prev, method]
    );
  };

  const isSubmitting = updateProfile.isPending || uploadAvatar.isPending;
  const extendedProfile = profile as unknown as ExtendedProfile;

  return (
    <Layout>
      <div className="page-container max-w-3xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <Card>
            <CardHeader className="text-center">
              <CardTitle className="text-2xl">Edit Profile</CardTitle>
              <CardDescription>
                Build your professional freelancer profile
              </CardDescription>
            </CardHeader>

            <CardContent>
              <form onSubmit={handleSubmit}>
                <Tabs defaultValue="basic" className="w-full">
                  <TabsList className="grid w-full grid-cols-4 mb-6">
                    <TabsTrigger value="basic">Basic Info</TabsTrigger>
                    <TabsTrigger value="skills">Skills</TabsTrigger>
                    <TabsTrigger value="work">Work Style</TabsTrigger>
                    <TabsTrigger value="portfolio">Portfolio</TabsTrigger>
                  </TabsList>

                  {/* Basic Info Tab */}
                  <TabsContent value="basic" className="space-y-6">
                    {/* Avatar Section */}
                    <div className="flex flex-col items-center gap-4">
                      <div className="relative">
                        <Avatar className="w-24 h-24 cursor-pointer" onClick={handleAvatarClick}>
                          <AvatarImage src={extendedProfile?.avatar_url || undefined} />
                          <AvatarFallback className="bg-primary/10 text-primary text-2xl">
                            <User className="w-10 h-10" />
                          </AvatarFallback>
                        </Avatar>
                        <button
                          type="button"
                          onClick={handleAvatarClick}
                          className="absolute bottom-0 right-0 p-2 bg-primary text-primary-foreground rounded-full shadow-lg hover:bg-primary/90 transition-colors"
                          disabled={isSubmitting}
                        >
                          {uploadAvatar.isPending ? (
                            <Loader2 className="w-4 h-4 animate-spin" />
                          ) : (
                            <Camera className="w-4 h-4" />
                          )}
                        </button>
                      </div>
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        onChange={handleFileChange}
                        className="hidden"
                      />
                      <p className="text-sm text-muted-foreground">
                        Click to upload a new avatar (max 2MB)
                      </p>
                    </div>

                    {/* Username */}
                    <div className="space-y-2">
                      <Label htmlFor="username">Display Name *</Label>
                      <Input
                        id="username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        placeholder="Your display name"
                        required
                      />
                    </div>

                    {/* Professional Title */}
                    <div className="space-y-2">
                      <Label htmlFor="title">Professional Title</Label>
                      <Input
                        id="title"
                        value={professionalTitle}
                        onChange={(e) => setProfessionalTitle(e.target.value)}
                        placeholder="e.g., UI/UX Designer | Figma, Web & Mobile"
                        maxLength={80}
                      />
                      <p className="text-xs text-muted-foreground">
                        A keyword-rich headline that describes what you do ({professionalTitle.length}/80)
                      </p>
                    </div>

                    {/* Location */}
                    <div className="space-y-2">
                      <Label htmlFor="location">Location</Label>
                      <Input
                        id="location"
                        value={location}
                        onChange={(e) => setLocation(e.target.value)}
                        placeholder="e.g., Lagos, Nigeria"
                      />
                    </div>

                    {/* Bio */}
                    <div className="space-y-2">
                      <Label htmlFor="bio">About Me</Label>
                      <Textarea
                        id="bio"
                        value={bio}
                        onChange={(e) => setBio(e.target.value)}
                        placeholder="Tell clients about yourself, your experience, and what makes you unique..."
                        rows={5}
                        maxLength={500}
                      />
                      <p className="text-xs text-muted-foreground text-right">
                        {bio.length}/500 characters
                      </p>
                    </div>

                    {/* Email (read-only) */}
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        value={user.email || ''}
                        disabled
                        className="bg-muted"
                      />
                      <p className="text-xs text-muted-foreground">
                        Email cannot be changed
                      </p>
                    </div>
                  </TabsContent>

                  {/* Skills Tab */}
                  <TabsContent value="skills" className="space-y-6">
                    <SkillsInput
                      label="Skills (up to 10)"
                      value={skills}
                      onChange={setSkills}
                      suggestions={SKILL_SUGGESTIONS}
                      maxItems={10}
                      placeholder="Add a skill..."
                    />

                    <SkillsInput
                      label="Tools & Technologies (up to 10)"
                      value={tools}
                      onChange={setTools}
                      suggestions={TOOL_SUGGESTIONS}
                      maxItems={10}
                      placeholder="Add a tool..."
                    />

                    {/* Education */}
                    <div className="space-y-4 pt-4 border-t border-border">
                      <h3 className="font-medium">Education</h3>
                      
                      <div className="space-y-2">
                        <Label>Program of Study</Label>
                        <Input
                          value={educationProgram}
                          onChange={(e) => setEducationProgram(e.target.value)}
                          placeholder="e.g., Computer Science"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label>Institution</Label>
                        <Input
                          value={educationInstitution}
                          onChange={(e) => setEducationInstitution(e.target.value)}
                          placeholder="e.g., University of Lagos"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label>Current Level</Label>
                        <Select value={educationLevel} onValueChange={setEducationLevel}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select your level" />
                          </SelectTrigger>
                          <SelectContent>
                            {STUDENT_LEVEL_OPTIONS.map((option) => (
                              <SelectItem key={option} value={option}>
                                {option}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </TabsContent>

                  {/* Work Style Tab */}
                  <TabsContent value="work" className="space-y-6">
                    {/* Availability */}
                    <div className="space-y-2">
                      <Label>Weekly Availability</Label>
                      <Select value={availabilityHours} onValueChange={setAvailabilityHours}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select availability" />
                        </SelectTrigger>
                        <SelectContent>
                          {AVAILABILITY_OPTIONS.map((option) => (
                            <SelectItem key={option} value={option}>
                              {option}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Response Time */}
                    <div className="space-y-2">
                      <Label>Typical Response Time</Label>
                      <Select value={responseTime} onValueChange={setResponseTime}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select response time" />
                        </SelectTrigger>
                        <SelectContent>
                          {RESPONSE_TIME_OPTIONS.map((option) => (
                            <SelectItem key={option} value={option}>
                              {option}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Preferred Communication */}
                    <div className="space-y-2">
                      <Label>Preferred Communication Methods</Label>
                      <div className="flex flex-wrap gap-2">
                        {COMMUNICATION_METHODS.map((method) => (
                          <Badge
                            key={method}
                            variant={preferredCommunication.includes(method) ? 'default' : 'outline'}
                            className="cursor-pointer"
                            onClick={() => toggleCommunication(method)}
                          >
                            {method}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    {/* Ethical Guidelines */}
                    <div className="rounded-lg border border-border bg-muted/40 p-4 text-sm">
                      <p className="font-medium mb-1">Ethical Guidelines</p>
                      <p className="text-muted-foreground">
                        CampusGigs supports ethical services only. Freelancers should provide
                        tutoring, feedback, design, and skill-based assistance — not complete
                        graded academic work on behalf of others.
                      </p>
                    </div>
                  </TabsContent>

                  {/* Portfolio Tab */}
                  <TabsContent value="portfolio" className="space-y-6">
                    <PortfolioSection 
                      items={extendedProfile?.portfolio_items || []} 
                      isEditable={true} 
                    />
                    
                    <p className="text-sm text-muted-foreground text-center">
                      Add images, PDFs, or links to showcase your best work
                    </p>
                  </TabsContent>
                </Tabs>

                {/* Submit Button */}
                <div className="mt-8 pt-6 border-t border-border">
                  <Button
                    type="submit"
                    className="w-full"
                    disabled={isSubmitting || !username.trim()}
                  >
                    {updateProfile.isPending ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Saving...
                      </>
                    ) : (
                      <>
                        <Save className="w-4 h-4 mr-2" />
                        Save Profile
                      </>
                    )}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </Layout>
  );
}
