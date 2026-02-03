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
                  Explore Gigs
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
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="bg-card p-6 rounded-xl border border-border hover-lift"
              >
                <feature.icon className="w-10 h-10 text-primary mb-4" />
                <h3 className="font-semibold text-lg mb-2">{feature.title}</h3>
                <p className="text-muted-foreground text-sm">{feature.desc}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Skills in Demand
            </h2>
            <p className="text-muted-foreground">
              Browse popular services students are hiring (and selling) right now
            </p>
          </motion.div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {GIG_CATEGORIES.slice(0, 8).map((cat, i) => {
              const Icon = cat.icon;
              return (
                <motion.div
                  key={cat.value}
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.05 }}
                >
                  <Link
                    to={`/gigs?category=${cat.value}`}
                    className="block p-6 bg-card border border-border rounded-xl text-center hover-lift group"
                  >
                    <div className="mb-3 flex justify-center">
                      <Icon className="w-10 h-10 text-primary group-hover:scale-110 transition-transform" />
                    </div>
                    <span className="font-medium">{cat.label}</span>
                  </Link>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Featured Gigs */}
      {featuredGigs.length > 0 && (
        <section className="py-16 bg-muted/30">
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="flex items-center justify-between mb-8"
            >
              <div>
                <h2 className="text-3xl md:text-4xl font-bold mb-2">
                  Trending Gigs 🚀
                </h2>
                <p className="text-muted-foreground">
                  High-quality services students are booking right now
                </p>
              </div>
              <Button variant="outline" asChild>
                <Link to="/gigs">Explore All Gigs</Link>
              </Button>
            </motion.div>

            <div className="card-grid">
              {featuredGigs.map((gig, i) => (
                <GigCard key={gig.id} gig={gig} index={i} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ──────────────────────────────────────────────── */}
      {/* NEW: Stats Section */}
      <section className="py-16 bg-gradient-to-br from-primary/5 to-secondary/5">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              CampusGigs in Numbers
            </h2>
            <p className="text-muted-foreground text-lg">
              Real students, real earnings, real impact — growing fast across campuses
            </p>
          </motion.div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {[
              { icon: Users, value: "1,000+", label: "Active Students" },
              { icon: DollarSign, value: "₦10M+", label: "Earnings Paid Out" },
              { icon: Trophy, value: "4.8/5", label: "Average Rating" },
              { icon: Zap, value: "500+", label: "Gigs Completed" },
            ].map((stat, i) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
              >
                <stat.icon className="w-12 h-12 mx-auto text-primary mb-4" />
                <p className="text-4xl md:text-5xl font-bold mb-2">{stat.value}</p>
                <p className="text-muted-foreground">{stat.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* NEW: Testimonials Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Students Crushing It on CampusGigs
            </h2>
            <p className="text-muted-foreground text-lg">
              Hear from peers who've turned skills into cash and experience
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                quote: "Earned ₦180k in my first semester doing logo gigs — flexible around exams and built an amazing portfolio!",
                name: "Aisha • Graphic Design, UNILAG",
              },
              {
                quote: "Landed consistent tutoring clients for Mathematics — paid my rent and gained teaching experience employers love.",
                name: "Umar • Computer Science, GSU",
              },
              {
                quote: "Quick video edits for campus events turned into steady side income. Payments are fast and secure!",
                name: "Abdushshakur • Architecture, ATBU",
              },
            ].map((testimonial, i) => (
              <motion.div
                key={testimonial.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="bg-card p-8 rounded-xl border border-border shadow-sm"
              >
                <MessageSquare className="w-10 h-10 text-primary/40 mb-6" />
                <p className="text-lg mb-6 italic">"{testimonial.quote}"</p>
                <p className="font-semibold">{testimonial.name}</p>
              </motion.div>
            ))}
          </div>

          <div className="text-center mt-12">
            <Button asChild variant="outline" size="lg">
              <Link to="/signup">Join Them — Start Earning Today</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* NEW: Expanded Benefits */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Why Campus Students Love It Here
            </h2>
            <p className="text-muted-foreground text-lg">
              Designed exclusively for campus life — flexible, skill-building, and rewarding
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              { icon: Calendar, title: "Schedule Around Lectures", desc: "Gig when it fits your timetable — no fixed hours." },
              { icon: Zap, title: "Build Real-World Experience", desc: "Projects that look killer on your CV/resume." },
              { icon: Shield, title: "Secure Campus Payments", desc: "Stripe-powered, fast withdrawals to your account." },
              { icon: Users, title: "Peer-to-Peer Trust", desc: "Verified students only — we speak the same language." },
              { icon: Sparkles, title: "Grow Your Portfolio Fast", desc: "Every gig adds professional work samples." },
              { icon: DollarSign, title: "Earn While You Learn", desc: "Extra cash for fees, data, or fun — up to ₦200k+/month possible." },
            ].map((benefit, i) => (
              <motion.div
                key={benefit.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="bg-card p-6 rounded-xl border border-border hover-lift"
              >
                <benefit.icon className="w-10 h-10 text-primary mb-4" />
                <h3 className="font-semibold text-xl mb-3">{benefit.title}</h3>
                <p className="text-muted-foreground">{benefit.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* NEW: How It Works */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Get Started in Minutes
            </h2>
            <p className="text-muted-foreground text-lg">
              Simple steps to turn your skills into income
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              { step: "1", title: "Create Your Profile", desc: "Add skills, bio, and portfolio — get verified fast." },
              { step: "2", title: "Browse or Post Gigs", desc: "Find jobs to bid on or create your own services." },
              { step: "3", title: "Deliver & Get Paid", desc: "Work, submit, get approved — cash in your account." },
            ].map((item, i) => (
              <motion.div
                key={item.step}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.2 }}
                className="text-center"
              >
                <div className="w-16 h-16 mx-auto rounded-full bg-primary text-primary-foreground flex items-center justify-center text-2xl font-bold mb-6">
                  {item.step}
                </div>
                <h3 className="text-xl font-bold mb-3">{item.title}</h3>
                <p className="text-muted-foreground">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* NEW: FAQ Teaser */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4 max-w-4xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Got Questions?
            </h2>
            <p className="text-muted-foreground text-lg">
              Quick answers to get you started
            </p>
          </motion.div>

          <div className="space-y-6">
            {[
              { q: "Is it free to join?", a: "Yes — sign up, create gigs, and browse completely free. We only take a small commission on completed work." },
              { q: "How do payments work?", a: "Secure via Stripe. Funds held until delivery approved, then released instantly." },
              { q: "Who can post gigs?", a: "Any verified student or campus-affiliated employer. Quality first." },
            ].map((faq, i) => (
              <motion.div
                key={faq.q}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="bg-card p-6 rounded-xl border border-border"
              >
                <HelpCircle className="w-8 h-8 text-primary mb-4" />
                <h3 className="font-semibold text-lg mb-2">{faq.q}</h3>
                <p className="text-muted-foreground">{faq.a}</p>
              </motion.div>
            ))}
          </div>

          <div className="text-center mt-10">
            <Button asChild variant="link">
              <Link to="/faq">See All FAQs</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* CTA Section (original final one) */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="bg-gradient-to-br from-primary to-primary/80 rounded-3xl p-8 md:p-12 text-center text-primary-foreground"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Got Skills? Get Paid.
            </h2>
            <p className="text-primary-foreground/80 mb-8 max-w-xl mx-auto">
              Launch your first gig in minutes and start earning while building
              real experience, a portfolio, and your reputation.
            </p>
            <Button
              size="lg"
              variant="secondary"
              asChild
              className="text-lg px-8"
            >
              <Link to="/signup">
                Start Selling Today
                <ArrowRight className="ml-2 w-5 h-5" />
              </Link>
            </Button>
          </motion.div>
        </div>
      </section>
    </Layout>
  );
}
