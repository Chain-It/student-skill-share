import { Wrench, Code } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface SkillsDisplayProps {
  skills: string[];
  tools: string[];
}

export function SkillsDisplay({ skills, tools }: SkillsDisplayProps) {
  if (skills.length === 0 && tools.length === 0) {
    return null;
  }

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-lg flex items-center gap-2">
          <Code className="w-5 h-5 text-primary" />
          Skills & Tools
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {skills.length > 0 && (
          <div>
            <p className="text-sm font-medium text-muted-foreground mb-2">Skills</p>
            <div className="flex flex-wrap gap-2">
              {skills.map((skill) => (
                <Badge key={skill} variant="default">
                  {skill}
                </Badge>
              ))}
            </div>
          </div>
        )}

        {tools.length > 0 && (
          <div>
            <p className="text-sm font-medium text-muted-foreground mb-2 flex items-center gap-1">
              <Wrench className="w-3 h-3" />
              Tools
            </p>
            <div className="flex flex-wrap gap-2">
              {tools.map((tool) => (
                <Badge key={tool} variant="outline">
                  {tool}
                </Badge>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
