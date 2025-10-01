import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { Pencil, Trash2, Plus, Loader2 } from 'lucide-react';

interface Announcement {
  id: string;
  title: string | null;
  text: string | null;
  creator_name: string | null;
  creation_time: string | null;
  created_at: string;
}

const AnnouncementManagement = () => {
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [editingAnnouncement, setEditingAnnouncement] = useState<Announcement | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    title: '',
    text: '',
    creator_name: '',
    announcement_id: '',
    classroom_id: ''
  });

  useEffect(() => {
    fetchAnnouncements();
  }, []);

  const fetchAnnouncements = async () => {
    try {
      const { data, error } = await supabase
        .from('classroom_announcements')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setAnnouncements(data || []);
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const submitData = {
        ...formData,
        creation_time: new Date().toISOString(),
        update_time: new Date().toISOString()
      };

      if (editingAnnouncement) {
        const { error } = await supabase
          .from('classroom_announcements')
          .update(submitData)
          .eq('id', editingAnnouncement.id);

        if (error) throw error;
        toast({
          title: "Announcement Updated",
          description: "The announcement has been updated successfully."
        });
      } else {
        const { error } = await supabase
          .from('classroom_announcements')
          .insert([submitData]);

        if (error) throw error;
        toast({
          title: "Announcement Created",
          description: "The announcement has been created successfully."
        });
      }

      resetForm();
      setDialogOpen(false);
      fetchAnnouncements();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive"
      });
    } finally {
      setSubmitting(false);
    }
  };

  const handleEdit = (announcement: Announcement) => {
    setEditingAnnouncement(announcement);
    setFormData({
      title: announcement.title || '',
      text: announcement.text || '',
      creator_name: announcement.creator_name || '',
      announcement_id: '',
      classroom_id: ''
    });
    setDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this announcement?')) return;

    try {
      const { error } = await supabase
        .from('classroom_announcements')
        .delete()
        .eq('id', id);

      if (error) throw error;
      toast({
        title: "Announcement Deleted",
        description: "The announcement has been deleted successfully."
      });
      fetchAnnouncements();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive"
      });
    }
  };

  const resetForm = () => {
    setFormData({
      title: '',
      text: '',
      creator_name: '',
      announcement_id: '',
      classroom_id: ''
    });
    setEditingAnnouncement(null);
  };

  if (loading) {
    return (
      <div className="flex justify-center py-8">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div className="flex-1">
              <CardTitle>Manage Announcements</CardTitle>
              <CardDescription>Create, edit, and delete announcements</CardDescription>
            </div>
            <Dialog open={dialogOpen} onOpenChange={(open) => {
              setDialogOpen(open);
              if (!open) resetForm();
            }}>
              <DialogTrigger asChild>
                <Button className="w-full sm:w-auto" size="sm">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Announcement
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto w-[95vw] sm:w-full">
                <DialogHeader>
                  <DialogTitle>{editingAnnouncement ? 'Edit Announcement' : 'Create New Announcement'}</DialogTitle>
                  <DialogDescription>
                    {editingAnnouncement ? 'Update the announcement details below' : 'Fill in the announcement details below'}
                  </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="title">Title *</Label>
                    <Input
                      id="title"
                      value={formData.title}
                      onChange={e => setFormData({ ...formData, title: e.target.value })}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="text">Content *</Label>
                    <Textarea
                      id="text"
                      value={formData.text}
                      onChange={e => setFormData({ ...formData, text: e.target.value })}
                      rows={5}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="creator_name">Creator Name</Label>
                    <Input
                      id="creator_name"
                      value={formData.creator_name}
                      onChange={e => setFormData({ ...formData, creator_name: e.target.value })}
                      placeholder="Optional"
                    />
                  </div>
                  {!editingAnnouncement && (
                    <>
                      <div className="space-y-2">
                        <Label htmlFor="announcement_id">Announcement ID *</Label>
                        <Input
                          id="announcement_id"
                          value={formData.announcement_id}
                          onChange={e => setFormData({ ...formData, announcement_id: e.target.value })}
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="classroom_id">Classroom ID *</Label>
                        <Input
                          id="classroom_id"
                          value={formData.classroom_id}
                          onChange={e => setFormData({ ...formData, classroom_id: e.target.value })}
                          required
                        />
                      </div>
                    </>
                  )}
                  <div className="flex gap-2 justify-end">
                    <Button type="button" variant="outline" onClick={() => setDialogOpen(false)}>
                      Cancel
                    </Button>
                    <Button type="submit" disabled={submitting}>
                      {submitting ? 'Saving...' : (editingAnnouncement ? 'Update' : 'Create')}
                    </Button>
                  </div>
                </form>
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {announcements.length === 0 ? (
              <p className="text-center text-muted-foreground py-8">No announcements found</p>
            ) : (
              announcements.map((announcement) => (
                <Card key={announcement.id}>
                  <CardHeader>
                    <div className="flex flex-col sm:flex-row items-start justify-between gap-3">
                      <div className="flex-1 min-w-0">
                        <CardTitle className="break-words">{announcement.title}</CardTitle>
                        <CardDescription className="break-words">
                          {announcement.creator_name && `By ${announcement.creator_name} • `}
                          {announcement.creation_time 
                            ? new Date(announcement.creation_time).toLocaleDateString()
                            : new Date(announcement.created_at).toLocaleDateString()
                          }
                        </CardDescription>
                      </div>
                      <div className="flex gap-2 shrink-0">
                        <Button variant="outline" size="icon" onClick={() => handleEdit(announcement)}>
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button variant="outline" size="icon" onClick={() => handleDelete(announcement.id)}>
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  {announcement.text && (
                    <CardContent>
                      <p className="text-sm text-muted-foreground whitespace-pre-wrap">{announcement.text}</p>
                    </CardContent>
                  )}
                </Card>
              ))
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AnnouncementManagement;