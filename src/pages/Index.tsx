import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  ArrowRight,
  Sparkles,
  Users,
  Zap,
  Shield,
  Trophy,
  Calendar,
  DollarSign,
  MessageSquare,
  HelpCircle,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Layout } from '@/components/layout/Layout';
import { GigCard } from '@/components/gigs/GigCard';
import { useGigs } from '@/hooks/useGigs';
import { GIG_CATEGORIES } from '@/lib/constants';

export default function Index() {
  const { data: gigs, isLoading } = useGigs();
  const featuredGigs = gigs?.slice(0, 4) || [];

  return (
    <Layout>
      {/* Hero Section */}
      <section className="relative overflow-hidden py-20 md:py-32">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-background to-secondary/5" />
        <div className="absolute top-20 left-10 w-72 h-72 bg-primary/10 rounded-full blur-3xl" />
        <div className="absolute bottom-10 right-10 w-96 h-96 bg-secondary/10 rounded-full blur-3xl" />
        
        <div className="container mx-auto px-4 relative">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center max-w-4xl mx-auto"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: 'spring' }}
              className="inline-block mb-6"
            >
              <span className="text-6xl">🎓</span>
            </motion.div>
            
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight">
              <span className="gradient-text">Student Skills,</span>
              <br />
              Real-World Results
            </h1>
            
            <p className="text-lg md:text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              Discover ambitious students turning their skills into standout work.  
              From design and tutoring to tech and presentations — get high-quality help
              from peers who actually get it.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" asChild className="text-lg px-8">
                <Link to="/gigs">
                  Explore Top Gigs
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" asChild className="text-lg px-8">
                <Link to="/signup">Turn Skills Into Cash</Link>
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
          >
            {[
              {
                icon: Users,
                title: 'Built by Students',
                desc: 'Work with driven, verified students who know campus life and expectations',
              },
              {
                icon: Zap,
                title: 'Fast & Flexible',
                desc: 'Tight deadline? Many freelancers offer same-day or express delivery',
              },
              {
                icon: Shield,
                title: 'Payments You Can Trust',
                desc: 'Secure, hassle-free payments powered by Stripe protection',
              },
              {
                icon: Sparkles,
                title: 'Pro-Level Quality',
                desc: 'Highly rated gigs from students sharpening real-world skills',
              },
            ].map((feature, i) => (
              <motion.div
                key={feature
