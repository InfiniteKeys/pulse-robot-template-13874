import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Save, TrendingUp } from 'lucide-react';

interface Stats {
  id?: string;
  active_members: number;
  competitions: number;
  awards_won: number;
  years_running: string;
  success_rate: string;
  weekly_sessions: number;
}

const StatsManagement = () => {
  const [stats, setStats] = useState<Stats>({
    active_members: 8,
    competitions: 0,
    awards_won: 0,
    years_running: '1st',
    success_rate: '100%',
    weekly_sessions: 2
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const { data, error } = await supabase
        .from('club_stats')
        .select('*')
        .maybeSingle();

      if (error) throw error;
      
      if (data) {
        setStats(data);
      }
    } catch (error) {
      console.error('Error fetching stats:', error);
      toast({
        title: "Error",
        description: "Failed to load stats. Using defaults.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const { data: existingData } = await supabase
        .from('club_stats')
        .select('id')
        .maybeSingle();

      if (existingData) {
        // Update existing
        const { error } = await supabase
          .from('club_stats')
          .update({
            active_members: stats.active_members,
            competitions: stats.competitions,
            awards_won: stats.awards_won,
            years_running: stats.years_running,
            success_rate: stats.success_rate,
            weekly_sessions: stats.weekly_sessions,
            updated_at: new Date().toISOString()
          })
          .eq('id', existingData.id);

        if (error) throw error;
      } else {
        // Insert new
        const { error } = await supabase
          .from('club_stats')
          .insert([{
            active_members: stats.active_members,
            competitions: stats.competitions,
            awards_won: stats.awards_won,
            years_running: stats.years_running,
            success_rate: stats.success_rate,
            weekly_sessions: stats.weekly_sessions
          }]);

        if (error) throw error;
      }

      toast({
        title: "Success",
        description: "Stats updated successfully!"
      });
    } catch (error) {
      console.error('Error saving stats:', error);
      toast({
        title: "Error",
        description: "Failed to save stats. Please try again.",
        variant: "destructive"
      });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <Card className="animate-fade-in">
      <CardHeader>
        <div className="flex items-center space-x-2">
          <TrendingUp className="h-5 w-5 text-primary" />
          <CardTitle>Club Statistics</CardTitle>
        </div>
        <CardDescription>
          Manage the statistics displayed on the homepage
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label htmlFor="active_members">Active Members</Label>
            <Input
              id="active_members"
              type="number"
              value={stats.active_members}
              onChange={(e) => setStats({ ...stats, active_members: parseInt(e.target.value) || 0 })}
              min="0"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="competitions">Competitions</Label>
            <Input
              id="competitions"
              type="number"
              value={stats.competitions}
              onChange={(e) => setStats({ ...stats, competitions: parseInt(e.target.value) || 0 })}
              min="0"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="awards_won">Awards Won</Label>
            <Input
              id="awards_won"
              type="number"
              value={stats.awards_won}
              onChange={(e) => setStats({ ...stats, awards_won: parseInt(e.target.value) || 0 })}
              min="0"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="years_running">Years Running</Label>
            <Input
              id="years_running"
              type="text"
              value={stats.years_running}
              onChange={(e) => setStats({ ...stats, years_running: e.target.value })}
              placeholder="e.g., 1st, 2nd, 3rd"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="success_rate">Success Rate</Label>
            <Input
              id="success_rate"
              type="text"
              value={stats.success_rate}
              onChange={(e) => setStats({ ...stats, success_rate: e.target.value })}
              placeholder="e.g., 100%"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="weekly_sessions">Weekly Sessions</Label>
            <Input
              id="weekly_sessions"
              type="number"
              value={stats.weekly_sessions}
              onChange={(e) => setStats({ ...stats, weekly_sessions: parseInt(e.target.value) || 0 })}
              min="0"
            />
          </div>
        </div>

        <div className="flex justify-end pt-4">
          <Button onClick={handleSave} disabled={saving} className="w-full md:w-auto">
            {saving ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Save className="mr-2 h-4 w-4" />
                Save Statistics
              </>
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default StatsManagement;
