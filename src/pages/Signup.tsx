import { useState } from 'react';
import { Link, useNavigate, Navigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Layout } from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { useAuth } from '@/hooks/useAuth';
import { toast } from '@/hooks/use-toast';
import { Wallet, Briefcase, ShieldCheck, Zap, GraduationCap } from 'lucide-react'; // Added icons for benefits

const signupSchema = z.object({
  username: z
    .string()
    .min(3, 'Username must be at least 3 characters')
    .max(20, 'Username must be less than 20 characters')
    .regex(/^[a-zA-Z0-9_]+$/, 'Username can only contain letters, numbers, and underscores'),
  email: z.string().email('Please enter a valid email'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ['confirmPassword'],
});

type SignupFormData = z.infer<typeof signupSchema>;

export default function Signup() {
  const navigate = useNavigate();
  const { user, loading: authLoading, signUp, signInWithGoogle, signInWithApple } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const [isAppleLoading, setIsAppleLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignupFormData>({
    resolver: zodResolver(signupSchema),
  });

  if (authLoading) {
    return (
      <Layout>
        <div className="page-container flex items-center justify-center min-h-[60vh]">
          <LoadingSpinner size="lg" />
        </div>
      </Layout>
    );
  }

  if (user) {
    return <Navigate to="/dashboard" replace />;
  }

  const onSubmit = async (data: SignupFormData) => {
    setIsSubmitting(true);
    
    const { error } = await signUp(data.email, data.password, data.username);
    
    if (error) {
      toast({
        title: 'Signup failed',
        description: error.message,
        variant: 'destructive',
      });
      setIsSubmitting(false);
      return;
    }

    toast({
      title: 'Account created!',
      description: 'Welcome to CampusGigs. Start exploring!',
    });
    navigate('/dashboard');
  };

  // Realistic benefits tailored for signup context
  const benefits = [
    {
      icon: Wallet,
      title: 'Earn Around Your Schedule',
      desc: 'Take gigs when it fits your classes and exam timetable.',
    },
    {
      icon: Briefcase,
      title: 'Build Your Portfolio Fast',
      desc: 'Real projects from students and local clients — great for CVs.',
    },
    {
      icon: ShieldCheck,
      title: 'Safe & Campus-Focused',
      desc: 'Verified users only + secure payments via Stripe.',
    },
    {
      icon: Zap,
      title: 'Easy Start',
      desc: 'Quick setup → browse or create gigs in minutes.',
    },
  ];

  return (
    <Layout>
      <div className="min-h-screen relative overflow-hidden flex items-center justify-center py-12 px-4 bg-gradient-to-br from-primary/5 via-background to-secondary/5">
        {/* Background blobs matching landing page */}
        <div className="absolute top-20 left-10 w-72 h-72 bg-primary/10 rounded-full blur-3xl" />
        <div className="absolute bottom-10 right-10 w-96 h-96 bg-secondary/10 rounded-full blur-3xl" />

        <div className="relative w-full max-w-6xl grid md:grid-cols-2 gap-12 items-center">
          {/* Left side: Benefits (hidden on mobile) */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7 }}
            className="hidden md:block space-y-10"
          >
            <div className="text-left">
              <span className="text-7xl">🚀</span>
              <h1 className="text-4xl md:text-5xl font-bold mt-6 gradient-text">
                Join CampusGigs
              </h1>
              <p className="text-xl text-muted-foreground mt-4 max-w-md">
                Create your account and start earning or finding help from fellow students.
              </p>
            </div>

            <div className="space-y-6">
              {benefits.map((benefit, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.15 }}
                  className="flex gap-4 items-start bg-card/50 p-5 rounded-xl border border-border"
                >
                  <benefit.icon className="w-8 h-8 text-primary shrink-0 mt-1" />
                  <div>
                    <h3 className="font-semibold text-lg">{benefit.title}</h3>
                    <p className="text-muted-foreground text-sm">{benefit.desc}</p>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Mini testimonial */}
            <div className="bg-card p-6 rounded-xl border border-border">
              <p className="italic text-muted-foreground">
                "Signed up during mid-semester break — got my first gig within a week and earned ₦45k!"
              </p>
              <p className="font-semibold mt-3">— Aisha, Graphic Design Student</p>
            </div>

            <p className="text-sm text-muted-foreground">
              Trusted by students from universities across Nigeria.
            </p>
          </motion.div>

          {/* Right side: Original form card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}
            className="w-full max-w-md mx-auto md:max-w-none"
          >
            {/* Mobile-only header */}
            <div className="md:hidden text-center mb-8">
              <span className="text-6xl">🚀</span>
              <h2 className="text-3xl font-bold mt-4 gradient-text">Join CampusGigs</h2>
              <p className="text-muted-foreground mt-2">
                Create an account to start earning or find help
              </p>
            </div>

            <Card>
              <CardHeader className="text-center">
                <div className="text-4xl mb-2">🚀</div>
                <CardTitle className="text-2xl">Join CampusGigs</CardTitle>
                <CardDescription>
                  Create an account to start earning or find help
                </CardDescription>
              </CardHeader>

              <CardContent>
                {/* Your original form remains completely unchanged */}
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="username">Username</Label>
                    <Input
                      id="username"
                      placeholder="coolstudent"
                      {...register('username')}
                    />
                    {errors.username && (
                      <p className="text-sm text-destructive">{errors.username.message}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="your@email.com"
                      {...register('email')}
                    />
                    {errors.email && (
                      <p className="text-sm text-destructive">{errors.email.message}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="password">Password</Label>
                    <Input
                      id="password"
                      type="password"
                      placeholder="••••••••"
                      {...register('password')}
                    />
                    {errors.password && (
                      <p className="text-sm text-destructive">{errors.password.message}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="confirmPassword">Confirm Password</Label>
                    <Input
                      id="confirmPassword"
                      type="password"
                      placeholder="••••••••"
                      {...register('confirmPassword')}
                    />
                    {errors.confirmPassword && (
                      <p className="text-sm text-destructive">{errors.confirmPassword.message}</p>
                    )}
                  </div>

                  <Button
                    type="submit"
                    className="w-full"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <>
                        <LoadingSpinner size="sm" className="mr-2" />
                        Creating account...
                      </>
                    ) : (
                      'Create Account'
                    )}
                  </Button>
                </form>

                <p className="text-xs text-muted-foreground text-center mt-4">
                  By signing up, you agree to use this platform ethically 
                  for learning support only.
                </p>

                <div className="relative my-6">
                  <Separator />
                  <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-card px-2 text-xs text-muted-foreground">
                    or continue with
                  </span>
                </div>

                <Button
                  type="button"
                  variant="outline"
                  className="w-full mb-3"
                  disabled={isGoogleLoading}
                  onClick={async () => {
                    setIsGoogleLoading(true);
                    const { error } = await signInWithGoogle();
                    if (error) {
                      toast({
                        title: 'Google sign in failed',
                        description: error.message,
                        variant: 'destructive',
                      });
                    }
                    setIsGoogleLoading(false);
                  }}
                >
                  {isGoogleLoading ? (
                    <LoadingSpinner size="sm" className="mr-2" />
                  ) : (
                    <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24">
                      <path
                        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                        fill="#4285F4"
                      />
                      <path
                        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                        fill="#34A853"
                      />
                      <path
                        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                        fill="#FBBC05"
                      />
                      <path
                        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                        fill="#EA4335"
                      />
                    </svg>
                  )}
                  Continue with Google
                </Button>

                <Button
                  type="button"
                  variant="outline"
                  className="w-full mb-6"
                  disabled={isAppleLoading}
                  onClick={async () => {
                    setIsAppleLoading(true);
                    const { error } = await signInWithApple();
                    if (error) {
                      toast({
                        title: 'Apple sign in failed',
                        description: error.message,
                        variant: 'destructive',
                      });
                    }
                    setIsAppleLoading(false);
                  }}
                >
                  {isAppleLoading ? (
                    <LoadingSpinner size="sm" className="mr-2" />
                  ) : (
                    <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09l.01-.01zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z"/>
                    </svg>
                  )}
                  Continue with Apple
                </Button>

                <div className="mt-6 text-center text-sm">
                  <span className="text-muted-foreground">
                    Already have an account?{' '}
                  </span>
                  <Link to="/login" className="text-primary hover:underline font-medium">
                    Sign in
                  </Link>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </Layout>
  );
}
