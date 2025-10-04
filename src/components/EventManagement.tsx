import { useState, useEffect } from 'react';
// import { supabase } from '@/integrations/supabase/client'; // 🛑 Removed problematic import alias
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { Pencil, Trash2, Plus, Loader2 } from 'lucide-react';
import { useAuth } from './AuthProvider'; // Assuming AuthProvider handles user state

interface Event {
  id: string;
  name: string;
  description: string | null;
  date: string;
  time: string;
  location: string;
  participants: string;
  created_at: string;
}

// 🛑 MOCK FUNCTION: Replaces supabase.auth.getSession() to allow compilation and token simulation
// In a real app, this logic would live in your AuthProvider or client setup.
const getMockSession = async () => {
    // In the sandbox, we mock a session to allow the UI logic to proceed.
    // Replace this with your actual Supabase auth call if you move this file into your project.
    return { data: { session: { access_token: 'MOCK_ADMIN_TOKEN_12345' } } };
};


const EventManagement = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [editingEvent, setEditingEvent] = useState<Event | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  
  // State for delete confirmation modal
  const [isConfirmingDelete, setIsConfirmingDelete] = useState(false);
  const [eventToDeleteId, setEventToDeleteId] = useState<string | null>(null);

  const { toast } = useToast();
  // const { user } = useAuth(); // Assuming 'user' is correctly populated

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    date: '',
    time: '',
    location: '',
    participants: ''
  });

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    setLoading(true);
    try {
      // NOTE: This assumes the Netlify function '/.netlify/functions/get-events' is public and doesn't require auth.
      const response = await fetch('/.netlify/functions/get-events');
      if (!response.ok) throw new Error('Failed to fetch events');
      
      const data = await response.json();
      setEvents(data || []);
    } catch (error) {
      console.error('Error fetching events:', error);
      toast({
        title: "Error",
        description: "Failed to fetch events.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Basic validation
    if (!formData.name || !formData.date || !formData.time || !formData.location || !formData.participants) {
      toast({
        title: "Error",
        description: "Please fill in all required fields.",
        variant: "destructive"
      });
      return;
    }

    setSubmitting(true);

    try {
      // 1️⃣ Get current session and access token securely using the mock
      // 🛑 REPLACE MOCK WITH ACTUAL: const { data: { session } } = await supabase.auth.getSession();
      const { data: { session } } = await getMockSession();
      const accessToken = session?.access_token;

      if (!accessToken) throw new Error('You must be logged in as an admin to perform this action.');

      // 2️⃣ Prepare request body
      const body = {
        id: editingEvent?.id || null,
        ...formData
      };

      // 3️⃣ Decide endpoint based on whether editing or creating
      const endpoint = editingEvent
        ? 'update-event'
        : 'create-event';

      // 4️⃣ Call Supabase edge function with proper JWT
      const res = await fetch(
        // NOTE: Hardcoded Supabase URL. Using relative path for Netlify Edge/Functions is often better.
        // Assuming this is required:
        `https://woosegomxvbgzelyqvoj.supabase.co/functions/v1/${endpoint}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${accessToken}`, // The server is rejecting this token/role
          },
          body: JSON.stringify(body),
        }
      );

      if (!res.ok) {
        // We expect the original admin error here until we fix the backend function
        const errorText = await res.text();
        let errorMessage = 'Failed to save event';
        try {
            // Edge functions often return JSON errors
            const errorData = JSON.parse(errorText);
            errorMessage = errorData?.message || errorData?.error || errorText;
        } catch (e) {
            errorMessage = errorText; // Fallback to raw text
        }
        throw new Error(errorMessage);
      }

      toast({
        title: "Success",
        description: editingEvent ? "Event updated successfully." : "Event created successfully."
      });

      // Reset form and refresh events
      setDialogOpen(false);
      resetForm();
      fetchEvents();

    } catch (error: any) {
      console.error('Error saving event:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to save event.",
        variant: "destructive"
      });
    } finally {
      setSubmitting(false);
    }
  };

  const handleEdit = (event: Event) => {
    setEditingEvent(event);
    setFormData({
      name: event.name,
      description: event.description || '',
      date: event.date,
      time: event.time,
      location: event.location,
      participants: event.participants
    });
    setDialogOpen(true);
  };

  const confirmDelete = (id: string) => {
    setEventToDeleteId(id);
    setIsConfirmingDelete(true);
  };
  
  const handleDelete = async () => {
    if (!eventToDeleteId) return;

    // Close the modal and show loading state
    setIsConfirmingDelete(false);
    setSubmitting(true);

    try {
      // Get current session and access token securely using the mock
      // 🛑 REPLACE MOCK WITH ACTUAL: const { data: { session } } = await supabase.auth.getSession();
      const { data: { session } } = await getMockSession();
      const accessToken = session?.access_token;

      if (!accessToken) throw new Error('You must be logged in as an admin to perform this action.');
      
      // Call Netlify function with Authorization header
      const response = await fetch('/.netlify/functions/delete-event', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${accessToken}`,
        },
        body: JSON.stringify({ id: eventToDeleteId }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData?.message || 'Failed to delete event');
      }
      
      toast({
        title: "Success",
        description: "Event deleted successfully."
      });
      fetchEvents();
    } catch (error: any) {
      console.error('Error deleting event:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to delete event.",
        variant: "destructive"
      });
    } finally {
      setSubmitting(false);
      setEventToDeleteId(null);
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      date: '',
      time: '',
      location: '',
      participants: ''
    });
    setEditingEvent(null);
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
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Manage Events</CardTitle>
              <CardDescription>Create, edit, and delete events</CardDescription>
            </div>
            <Dialog open={dialogOpen} onOpenChange={(open) => {
              setDialogOpen(open);
              if (!open) resetForm();
            }}>
              <DialogTrigger asChild>
                <Button disabled={submitting}>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Event
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>{editingEvent ? 'Edit Event' : 'Create New Event'}</DialogTitle>
                  <DialogDescription>
                    {editingEvent ? 'Update the event details below' : 'Fill in the event details below'}
                  </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Event Name *</Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={e => setFormData({ ...formData, name: e.target.value })}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="description">Description</Label>
                    <Textarea
                      id="description"
                      value={formData.description}
                      onChange={e => setFormData({ ...formData, description: e.target.value })}
                      rows={3}
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="date">Date *</Label>
                      <Input
                        id="date"
                        type="date"
                        value={formData.date}
                        onChange={e => setFormData({ ...formData, date: e.target.value })}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="time">Time *</Label>
                      <Input
                        id="time"
                        type="time"
                        value={formData.time}
                        onChange={e => setFormData({ ...formData, time: e.target.value })}
                        required
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="location">Location *</Label>
                    <Input
                      id="location"
                      value={formData.location}
                      onChange={e => setFormData({ ...formData, location: e.target.value })}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="participants">Participants *</Label>
                    <Input
                      id="participants"
                      value={formData.participants}
                      onChange={e => setFormData({ ...formData, participants: e.target.value })}
                      placeholder="e.g., All members, Grade 9-12, etc."
                      required
                    />
                  </div>
                  <div className="flex gap-2 justify-end">
                    <Button type="button" variant="outline" onClick={() => setDialogOpen(false)} disabled={submitting}>
                      Cancel
                    </Button>
                    <Button type="submit" disabled={submitting}>
                      {submitting ? (
                        <><Loader2 className="h-4 w-4 mr-2 animate-spin" /> Saving...</>
                      ) : (editingEvent ? 'Update' : 'Create')}
                    </Button>
                  </div>
                </form>
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {events.length === 0 ? (
              <p className="text-center text-muted-foreground py-8">No events found</p>
            ) : (
              events.map((event) => (
                <Card key={event.id} className="relative">
                  {submitting && (eventToDeleteId === event.id || (editingEvent?.id === event.id && dialogOpen)) && (
                    <div className="absolute inset-0 bg-white/70 flex items-center justify-center rounded-lg z-10">
                      <Loader2 className="h-8 w-8 animate-spin text-primary" />
                    </div>
                  )}
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle>{event.name}</CardTitle>
                        <CardDescription>
                          {new Date(event.date).toLocaleDateString()} at {event.time} • {event.location}
                        </CardDescription>
                      </div>
                      <div className="flex gap-2">
                        <Button variant="outline" size="icon" onClick={() => handleEdit(event)} disabled={submitting}>
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button variant="outline" size="icon" onClick={() => confirmDelete(event.id)} disabled={submitting}>
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  {event.description && (
                    <CardContent>
                      <p className="text-sm text-muted-foreground">{event.description}</p>
                      <p className="text-sm text-muted-foreground mt-2">
                        <strong>Participants:</strong> {event.participants}
                      </p>
                    </CardContent>
                  )}
                </Card>
              ))
            )}
          </div>
        </CardContent>
      </Card>
      
      {/* Custom Delete Confirmation Dialog */}
      <Dialog open={isConfirmingDelete} onOpenChange={setIsConfirmingDelete}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Confirm Deletion</DialogTitle>
            <DialogDescription>
              Are you sure you want to permanently delete this event? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsConfirmingDelete(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDelete} disabled={submitting}>
              {submitting ? 'Deleting...' : 'Delete'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default EventManagement;
