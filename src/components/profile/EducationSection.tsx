import { GraduationCap, Award } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import type { Certification } from '@/lib/profile-types';

interface EducationSectionProps {
  program: string | null;
  institution: string | null;
  year: number | null;
  level: string | null;
  certifications: Certification[];
}

export function EducationSection({ 
  program, 
  institution, 
  year, 
  level,
  certifications 
}: EducationSectionProps) {
  const hasEducation = program || institution || year || level;
  const hasCertifications = certifications.length > 0;

  if (!hasEducation && !hasCertifications) {
    return null;
  }

  // Display level if available, otherwise fallback to "Class of {year}" for legacy data
  const getEducationLevel = () => {
    if (level) return level;
    if (year && year > 1900 && year < 2100) return `Class of ${year}`;
    return null;
  };

  const displayLevel = getEducationLevel();

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-lg flex items-center gap-2">
          <GraduationCap className="w-5 h-5 text-primary" />
          Education & Certifications
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {hasEducation && (
          <div className="flex items-start gap-3">
            <div className="p-2 rounded-full bg-primary/10">
              <GraduationCap className="w-4 h-4 text-primary" />
            </div>
            <div>
              {program && <p className="font-medium">{program}</p>}
              {institution && (
                <p className="text-sm text-muted-foreground">{institution}</p>
              )}
              {displayLevel && (
                <p className="text-sm text-muted-foreground">{displayLevel}</p>
              )}
            </div>
          </div>
        )}

        {hasCertifications && (
          <div className="space-y-2">
            <p className="text-sm font-medium flex items-center gap-2">
              <Award className="w-4 h-4" />
              Certifications
            </p>
            <div className="flex flex-wrap gap-2">
              {certifications.map((cert) => (
                <Badge key={cert.id} variant="outline" className="gap-1">
                  {cert.name}
                  {cert.url && (
                    <a
                      href={cert.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary hover:underline"
                    >
                      ↗
                    </a>
                  )}
                </Badge>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
