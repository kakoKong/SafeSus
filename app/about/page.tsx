import { Card } from '@/components/ui/card';
import { Shield, Users, Heart, Globe } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function AboutPage() {
  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="py-20 px-4">
        <div className="container max-w-4xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">
            About Safesus
          </h1>
          <p className="text-xl text-muted-foreground leading-relaxed">
            We're building a community-powered platform to help travelers stay safe and avoid scams. 
            Real tips from real people who've been there.
          </p>
        </div>
      </section>

      {/* Story */}
      <section className="py-16 px-4 bg-slate-50 dark:bg-slate-900">
        <div className="container max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold mb-6">Our Story</h2>
          <div className="prose prose-slate dark:prose-invert max-w-none">
            <p className="text-lg text-muted-foreground leading-relaxed mb-4">
              Safesus started from a simple frustration: getting scammed in Bangkok. We realized that while 
              there's tons of travel information out there, safety intel is scattered, outdated, or buried in 
              random forum posts from 2015.
            </p>
            <p className="text-lg text-muted-foreground leading-relaxed mb-4">
              So we built a platform where travelers can share real-time safety information, from common scams 
              to which neighborhoods to avoid at night. Every tip is reviewed by local guardians before going live.
            </p>
            <p className="text-lg text-muted-foreground leading-relaxed">
              We're not trying to scare anyone away from traveling. We just want you to be prepared, 
              aware, and confident when exploring new places.
            </p>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-16 px-4">
        <div className="container max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold mb-12 text-center">What We Believe</h2>
          <div className="grid md:grid-cols-2 gap-8">
            {[
              {
                icon: Users,
                title: 'Community First',
                description: 'Every tip comes from real travelers. No corporate BS, no paid reviews, just honest experiences.'
              },
              {
                icon: Shield,
                title: 'Quality Over Quantity',
                description: 'We verify everything through local guardians. Better to have 50 trustworthy tips than 500 questionable ones.'
              },
              {
                icon: Heart,
                title: 'Always Free',
                description: 'Safety information shouldn\'t cost money. Safesus will always be free for travelers.'
              },
              {
                icon: Globe,
                title: 'Local Perspective',
                description: 'We rely on people who actually live in these cities to verify information and keep it current.'
              }
            ].map((value, i) => {
              const Icon = value.icon;
              return (
                <Card key={i} className="p-6">
                  <Icon className="h-10 w-10 text-primary mb-4" />
                  <h3 className="text-xl font-bold mb-2">{value.title}</h3>
                  <p className="text-muted-foreground">{value.description}</p>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="py-16 px-4 bg-slate-50 dark:bg-slate-900">
        <div className="container max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold mb-6">The Team</h2>
          <p className="text-lg text-muted-foreground leading-relaxed mb-8">
            We're a small team of travelers and developers who got tired of falling for the same tourist traps. 
            Currently based between Bangkok and nomading around Southeast Asia.
          </p>
          <p className="text-lg text-muted-foreground leading-relaxed">
            But the real power of Safesus is our community of guardians - locals and long-term travelers who verify 
            tips and keep information up to date.
          </p>
        </div>
      </section>

      {/* Contact */}
      <section className="py-16 px-4">
        <div className="container max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-6">Get Involved</h2>
          <p className="text-lg text-muted-foreground mb-8">
            Want to help make travel safer? Contribute tips, become a guardian, or just spread the word.
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Link href="/submit">
              <Button size="lg">Submit a Tip</Button>
            </Link>
            <Link href="/guardian">
              <Button size="lg" variant="outline">Become a Guardian</Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

