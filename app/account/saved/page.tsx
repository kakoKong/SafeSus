'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import EmptyState from '@/components/shared/EmptyState';
import LoginModal from '@/components/shared/LoginModal';
import { Bookmark, MapPin, Trash2 } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

interface SavedCity {
  city_id: number;
  created_at: string;
  cities: {
    id: number;
    name: string;
    country: string;
    slug: string;
  };
}

export default function SavedCitiesPage() {
  const [savedCities, setSavedCities] = useState<SavedCity[]>([]);
  const [loading, setLoading] = useState(true);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const { toast } = useToast();
  const supabase = createClient();

  useEffect(() => {
    checkAuthAndFetch();
  }, []);

  async function checkAuthAndFetch() {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      setIsAuthenticated(false);
      setShowLoginModal(true);
      setLoading(false);
      return;
    }

    setIsAuthenticated(true);
    await fetchSavedCities(user.id);
  }

  async function fetchSavedCities(userId: string) {
    const { data, error } = await supabase
      .from('saved_cities')
      .select('*, cities(*)')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Failed to fetch saved cities:', error);
    } else {
      setSavedCities(data || []);
    }
    setLoading(false);
  }

  async function handleRemove(cityId: number) {
    try {
      const res = await fetch('/api/save', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ city_id: cityId }),
      });

      if (res.ok) {
        setSavedCities(savedCities.filter((c) => c.city_id !== cityId));
        toast({ title: 'City removed from saved list' });
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to remove city',
        variant: 'destructive',
      });
    }
  }

  if (!isAuthenticated) {
    return (
      <>
        <div className="container px-4 py-12 max-w-2xl mx-auto">
          <EmptyState
            icon={<Bookmark className="h-6 w-6" />}
            title="Sign In Required"
            description="Sign in to view and manage your saved cities."
            action={
              <Button onClick={() => setShowLoginModal(true)}>
                Sign In
              </Button>
            }
          />
        </div>
        <LoginModal
          open={showLoginModal}
          onOpenChange={setShowLoginModal}
          onSuccess={() => {
            setIsAuthenticated(true);
            setShowLoginModal(false);
            checkAuthAndFetch();
          }}
        />
      </>
    );
  }

  if (loading) {
    return (
      <div className="container px-4 py-12 max-w-4xl mx-auto text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
      </div>
    );
  }

  return (
    <div className="container px-4 py-12 max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl md:text-4xl font-bold mb-2">Saved Cities</h1>
        <p className="text-muted-foreground">
          Quick access to your saved destinations.
        </p>
      </div>

      {savedCities.length === 0 ? (
        <EmptyState
          icon={<Bookmark className="h-6 w-6" />}
          title="No Saved Cities"
          description="Save cities you plan to visit for quick access later."
          action={
            <Button asChild>
              <Link href="/cities">Browse Cities</Link>
            </Button>
          }
        />
      ) : (
        <div className="grid md:grid-cols-2 gap-6">
          {savedCities.map((saved) => (
            <Card key={saved.city_id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="flex items-center gap-2">
                      <MapPin className="h-5 w-5 text-primary" />
                      {saved.cities.name}
                    </CardTitle>
                    <CardDescription>{saved.cities.country}</CardDescription>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleRemove(saved.city_id)}
                  >
                    <Trash2 className="h-4 w-4 text-muted-foreground hover:text-destructive" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <Link href={`/city/${saved.cities.slug}`}>
                  <Button variant="outline" className="w-full">
                    View City
                  </Button>
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

