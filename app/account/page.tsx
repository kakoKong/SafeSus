'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { useAuth } from '@/lib/auth-context';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import LoginModal from '@/components/shared/LoginModal';
import EmptyState from '@/components/shared/EmptyState';
import { 
  User, 
  Mail, 
  Calendar, 
  Bookmark, 
  FileText, 
  Settings, 
  LogOut,
  MapPin,
  Clock,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Shield,
  Award,
  Star,
  TrendingUp,
  ShieldCheck
} from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import type { UserProfile, UserBadge } from '@/types';

interface UserStats {
  savedCities: number;
  submittedTips: number;
  pendingTips: number;
  approvedTips: number;
}

export default function AccountPage() {
  const { user, loading: authLoading } = useAuth();
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [userBadges, setUserBadges] = useState<UserBadge[]>([]);
  const [stats, setStats] = useState<UserStats>({
    savedCities: 0,
    submittedTips: 0,
    pendingTips: 0,
    approvedTips: 0,
  });
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  const router = useRouter();
  const supabase = createClient();

  useEffect(() => {
    if (!authLoading) {
      if (user) {
        fetchUserStats();
      } else {
        setShowLoginModal(true);
        setLoading(false);
      }
    }
  }, [user, authLoading]);

  async function fetchUserStats() {
    if (!user) return;

    try {
      // Fetch or create user profile
      let { data: profile } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('user_id', user.id)
        .single();

      // Create profile if it doesn't exist
      if (!profile) {
        const { data: newProfile, error } = await supabase
          .from('user_profiles')
          .insert({ 
            user_id: user.id, 
            role: 'traveler',
            score: 0 
          })
          .select()
          .single();

        if (!error) profile = newProfile;
      }

      setUserProfile(profile);

      // Fetch user badges
      const { data: badges } = await supabase
        .from('user_badges')
        .select(`
          *,
          badge:badges(*)
        `)
        .eq('user_id', user.id);

      setUserBadges(badges || []);

      // Fetch saved cities count
      const { count: savedCount } = await supabase
        .from('saved_cities')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', user.id);

      // Fetch all tip submissions
      const { data: tips } = await supabase
        .from('tip_submissions')
        .select('status')
        .eq('user_id', user.id);

      const pendingCount = tips?.filter(t => t.status === 'pending').length || 0;
      const approvedCount = tips?.filter(t => t.status === 'approved').length || 0;

      setStats({
        savedCities: savedCount || 0,
        submittedTips: tips?.length || 0,
        pendingTips: pendingCount,
        approvedTips: approvedCount,
      });
    } catch (error) {
      console.error('Error fetching stats:', error);
    } finally {
      setLoading(false);
    }
  }

  const handleLogout = async () => {
    await supabase.auth.signOut();
    toast({
      title: 'Signed out',
      description: 'You have been successfully signed out.',
    });
    router.push('/');
  };

  if (authLoading || loading) {
    return (
      <div className="container px-4 py-12 max-w-4xl mx-auto">
        <div className="flex justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <>
        <div className="container px-4 py-12 max-w-2xl mx-auto">
          <EmptyState
            icon={<User className="h-6 w-6" />}
            title="Sign In Required"
            description="Sign in to view and manage your account."
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
        />
      </>
    );
  }

  const joinDate = new Date(user.created_at).toLocaleDateString('en-US', {
    month: 'long',
    year: 'numeric',
  });

  return (
    <div className="container px-4 py-12 max-w-6xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold mb-2">My Account</h1>
            <p className="text-muted-foreground">
              Manage your profile and view your activity
            </p>
          </div>
          <div className="flex gap-2">
            {userProfile?.role === 'admin' && (
              <Link href="/admin/dashboard">
                <Button className="gap-2 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700">
                  <ShieldCheck className="h-4 w-4" />
                  Admin Dashboard
                </Button>
              </Link>
            )}
            {userProfile?.role === 'guardian' && (
              <Link href="/guardian">
                <Button variant="outline" className="gap-2">
                  <Shield className="h-4 w-4" />
                  Guardian Dashboard
                </Button>
              </Link>
            )}
          </div>
        </div>
      </div>

      {/* Role & Score Banner */}
      {userProfile && (
        <Card className={`mb-6 ${
          userProfile.role === 'admin' 
            ? 'bg-gradient-to-r from-purple-500/10 to-blue-500/10 border-purple-500/20' 
            : 'bg-gradient-to-r from-primary/10 to-blue-500/10 border-primary/20'
        }`}>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className={`p-3 rounded-full ${
                  userProfile.role === 'admin' 
                    ? 'bg-gradient-to-br from-purple-500/20 to-blue-500/20' 
                    : 'bg-primary/20'
                }`}>
                  {userProfile.role === 'admin' && <ShieldCheck className="h-8 w-8 text-purple-600 dark:text-purple-400" />}
                  {userProfile.role === 'guardian' && <Shield className="h-8 w-8 text-primary" />}
                  {userProfile.role === 'local' && <MapPin className="h-8 w-8 text-primary" />}
                  {userProfile.role === 'traveler' && <User className="h-8 w-8 text-primary" />}
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="text-xl font-bold capitalize">{userProfile.role}</h3>
                    {userProfile.role === 'admin' && (
                      <Badge className="bg-gradient-to-r from-purple-600 to-blue-600 border-0">
                        <ShieldCheck className="h-3 w-3 mr-1" />
                        Full Access
                      </Badge>
                    )}
                    {userProfile.role === 'guardian' && (
                      <Badge className="bg-primary">Verified</Badge>
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {userProfile.role === 'admin' && 'Platform administrator with full access'}
                    {userProfile.role === 'guardian' && 'Help maintain community quality'}
                    {userProfile.role === 'local' && 'Share local knowledge'}
                    {userProfile.role === 'traveler' && 'Explorer and contributor'}
                  </p>
                </div>
              </div>
              <div className="text-right">
                <div className="flex items-center gap-2 justify-end mb-1">
                  <Star className="h-5 w-5 text-yellow-500" />
                  <span className="text-3xl font-bold">{userProfile.score}</span>
                </div>
                <p className="text-sm text-muted-foreground">Contribution Score</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Main Content - Left Column */}
        <div className="lg:col-span-2 space-y-6">
          {/* Profile Info Card */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                Profile Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-start gap-4">
                <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                  {user.user_metadata?.avatar_url ? (
                    <img 
                      src={user.user_metadata.avatar_url} 
                      alt="Profile" 
                      className="w-16 h-16 rounded-full"
                    />
                  ) : (
                    <User className="h-8 w-8 text-primary" />
                  )}
                </div>
                <div className="flex-1 space-y-3">
                  {user.user_metadata?.full_name && (
                    <div>
                      <p className="text-sm text-muted-foreground">Full Name</p>
                      <p className="font-medium">{user.user_metadata.full_name}</p>
                    </div>
                  )}
                  <div>
                    <p className="text-sm text-muted-foreground flex items-center gap-2">
                      <Mail className="h-4 w-4" />
                      Email
                    </p>
                    <p className="font-medium">{user.email}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground flex items-center gap-2">
                      <Calendar className="h-4 w-4" />
                      Member Since
                    </p>
                    <p className="font-medium">{joinDate}</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Badges */}
          {userBadges.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Award className="h-5 w-5" />
                  Your Badges
                </CardTitle>
                <CardDescription>
                  Achievements earned through contributions
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {userBadges.map((userBadge) => (
                    <div key={userBadge.badge_id} className="p-4 border rounded-lg text-center hover:bg-accent/50 transition-colors">
                      <div className="text-3xl mb-2">{userBadge.badge?.icon || '🏆'}</div>
                      <p className="font-semibold text-sm">{userBadge.badge?.name}</p>
                      <p className="text-xs text-muted-foreground mt-1">{userBadge.badge?.description}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Activity Stats */}
          <Card>
            <CardHeader>
              <CardTitle>Your Activity</CardTitle>
              <CardDescription>
                Your contributions and saved items
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="p-4 border rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <Bookmark className="h-5 w-5 text-primary" />
                    <span className="text-2xl font-bold">{stats.savedCities}</span>
                  </div>
                  <p className="text-sm font-medium">Saved Cities</p>
                  <p className="text-xs text-muted-foreground">Quick access destinations</p>
                </div>

                <div className="p-4 border rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <FileText className="h-5 w-5 text-primary" />
                    <span className="text-2xl font-bold">{stats.submittedTips}</span>
                  </div>
                  <p className="text-sm font-medium">Submitted Tips</p>
                  <p className="text-xs text-muted-foreground">Total contributions</p>
                </div>

                <div className="p-4 border rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <CheckCircle2 className="h-5 w-5 text-green-500" />
                    <span className="text-2xl font-bold">{stats.approvedTips}</span>
                  </div>
                  <p className="text-sm font-medium">Approved Tips</p>
                  <p className="text-xs text-muted-foreground">Published and live</p>
                </div>

                <div className="p-4 border rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <Clock className="h-5 w-5 text-yellow-500" />
                    <span className="text-2xl font-bold">{stats.pendingTips}</span>
                  </div>
                  <p className="text-sm font-medium">Pending Tips</p>
                  <p className="text-xs text-muted-foreground">Awaiting review</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Submitted Tips Card */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Recent Submissions</CardTitle>
                  <CardDescription>
                    Safety tips you've submitted
                  </CardDescription>
                </div>
                <Link href="/submit">
                  <Button variant="outline" size="sm">
                    Submit New Tip
                  </Button>
                </Link>
              </div>
            </CardHeader>
            <CardContent>
              <RecentSubmissions userId={user.id} />
            </CardContent>
          </Card>
        </div>

        {/* Sidebar - Right Column */}
        <div className="space-y-6">
          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Link href="/account/saved">
                <Button variant="outline" className="w-full justify-start">
                  <Bookmark className="mr-2 h-4 w-4" />
                  View Saved Cities
                </Button>
              </Link>
              <Link href="/submit">
                <Button variant="outline" className="w-full justify-start">
                  <MapPin className="mr-2 h-4 w-4" />
                  Submit a Tip
                </Button>
              </Link>
              <Link href="/cities">
                <Button variant="outline" className="w-full justify-start">
                  <MapPin className="mr-2 h-4 w-4" />
                  Browse Cities
                </Button>
              </Link>
              {userProfile?.role === 'admin' && (
                <Link href="/admin/dashboard">
                  <Button className="w-full justify-start bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 border-0">
                    <ShieldCheck className="mr-2 h-4 w-4" />
                    Admin Dashboard
                  </Button>
                </Link>
              )}
              {userProfile?.role === 'guardian' && (
                <Link href="/guardian">
                  <Button variant="outline" className="w-full justify-start bg-primary/5">
                    <Shield className="mr-2 h-4 w-4 text-primary" />
                    Guardian Dashboard
                  </Button>
                </Link>
              )}
            </CardContent>
          </Card>

          {/* Contribution Info */}
          <Card className="bg-blue-50 dark:bg-blue-950/20 border-blue-200 dark:border-blue-800">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <TrendingUp className="h-5 w-5" />
                Earn Points
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm">
              <div className="flex items-center justify-between">
                <span>Submit a tip</span>
                <span className="font-semibold">+10 pts</span>
              </div>
              <div className="flex items-center justify-between">
                <span>Get tip approved</span>
                <span className="font-semibold">+10 pts</span>
              </div>
              <div className="flex items-center justify-between">
                <span>Verify as Guardian</span>
                <span className="font-semibold">+5 pts</span>
              </div>
              <div className="pt-3 mt-3 border-t text-xs text-muted-foreground">
                Higher scores unlock badges and exclusive features
              </div>
            </CardContent>
          </Card>

          {/* Account Settings */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Account Settings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button 
                variant="outline" 
                className="w-full justify-start"
                onClick={handleLogout}
              >
                <LogOut className="mr-2 h-4 w-4" />
                Sign Out
              </Button>
            </CardContent>
          </Card>

          {/* Help Card */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Need Help?</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <p className="text-sm text-muted-foreground">
                Have questions or feedback? We're here to help.
              </p>
              <Link href="/submit">
                <Button variant="outline" size="sm" className="w-full">
                  Contact Support
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

// Component to show recent submissions
function RecentSubmissions({ userId }: { userId: string }) {
  const [submissions, setSubmissions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const supabase = createClient();

  useEffect(() => {
    fetchSubmissions();
  }, [userId]);

  async function fetchSubmissions() {
    const { data } = await supabase
      .from('tip_submissions')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(5);

    setSubmissions(data || []);
    setLoading(false);
  }

  if (loading) {
    return <div className="text-sm text-muted-foreground">Loading...</div>;
  }

  if (submissions.length === 0) {
    return (
      <div className="text-center py-8">
        <FileText className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
        <p className="text-sm text-muted-foreground">No submissions yet</p>
        <p className="text-xs text-muted-foreground mt-1">
          Help other travelers by submitting safety tips
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {submissions.map((submission) => (
        <div 
          key={submission.id}
          className="p-3 border rounded-lg hover:bg-accent/50 transition-colors"
        >
          <div className="flex items-start justify-between gap-2">
            <div className="flex-1 min-w-0">
              <p className="font-medium text-sm truncate">{submission.title}</p>
              <p className="text-xs text-muted-foreground line-clamp-2 mt-1">
                {submission.summary}
              </p>
            </div>
            <Badge 
              variant={
                submission.status === 'approved' ? 'default' : 
                submission.status === 'pending' ? 'secondary' : 
                'destructive'
              }
              className="flex-shrink-0"
            >
              {submission.status === 'approved' && <CheckCircle2 className="h-3 w-3 mr-1" />}
              {submission.status === 'pending' && <Clock className="h-3 w-3 mr-1" />}
              {submission.status === 'rejected' && <XCircle className="h-3 w-3 mr-1" />}
              {submission.status}
            </Badge>
          </div>
          <p className="text-xs text-muted-foreground mt-2">
            {new Date(submission.created_at).toLocaleDateString()}
          </p>
        </div>
      ))}
    </div>
  );
}

