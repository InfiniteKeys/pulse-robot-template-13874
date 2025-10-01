import React, { useState, useEffect } from 'react';

import { AlertCircle, Info, Star, Megaphone } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
interface Announcement {
  id: string;
  title: string;
  content: string;
  type: 'info' | 'celebration' | 'general';
  creator_name: string | null;
  created_at: string;
}
const AnnouncementsSection = () => {
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [loading, setLoading] = useState(true);
  const fetchAnnouncements = async () => {
    try {
      const response = await fetch('/.netlify/functions/get-announcements');
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

      const contentType = response.headers.get('content-type') || '';
      let data: any = [];
      if (contentType.includes('application/json')) {
        data = await response.json();
      } else {
        const text = await response.text();
        console.warn('Non-JSON response for announcements:', text.slice(0, 200));
        data = [];
      }

      const transformedData = (data?.map((item: any) => ({
        id: item.id,
        title: item.title || 'Announcement',
        content: item.text || '',
        type: 'general' as const,
        creator_name: item.creator_name,
        created_at: item.creation_time || item.created_at
      })) || []) as Announcement[];

      setAnnouncements(transformedData);
    } catch (error) {
      console.error('Error fetching announcements:', error);
      setAnnouncements([]);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchAnnouncements();
  }, []);
  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'Unknown date';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  // Static announcements as fallback when no admin announcements
  const staticAnnouncements = [{
    id: 1,
    type: "celebration" as const,
    title: "Congratulations to Our Winners!",
    date: "December 15, 2023",
    content: "Sarah Chen and Marcus Johnson placed 1st and 3rd respectively at the Regional Math Competition. Amazing work representing Breaking Math!"
  }, {
    id: 2,
    type: "info" as const,
    title: "Winter Break Meeting Schedule",
    date: "December 10, 2023",
    content: "Please note that our regular meetings will resume on January 8th, 2024. We'll be sending out competition prep materials during the break."
  }, {
    id: 3,
    type: "general" as const,
    title: "New Member Orientation",
    date: "December 8, 2023",
    content: "Welcome to all our new members who joined this month! Orientation session will be held next Wednesday at 3:30 PM in Room 205."
  }];
  const getAnnouncementStyle = (type?: string) => {
    switch (type) {
      case "celebration":
        return "border-green-200";
      case "info":
        return "border-blue-200";
      default:
        return "border-primary/20";
    }
  };
  const getIconColor = (type?: string) => {
    switch (type) {
      case "celebration":
        return "bg-green-100 text-green-600";
      case "info":
        return "bg-blue-100 text-blue-600";
      default:
        return "bg-primary/10 text-primary";
    }
  };
  return <section className="py-20 px-4 relative overflow-hidden">
      {/* Background with gradient and blur effect */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-secondary/5 to-accent/10"></div>
      <div className="absolute inset-0 backdrop-blur-sm"></div>
      
      <div className="max-w-4xl mx-auto relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            Latest Announcements
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Stay updated with the latest news, events, and important information from Breaking Math Club
          </p>
        </div>

        {loading ? <div className="text-center">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            <p className="mt-4 text-muted-foreground">Loading announcements...</p>
          </div> : <div className="space-y-6">
            {announcements.length > 0 ? announcements.map((announcement, index) => <div key={announcement.id || index} className="backdrop-blur-md rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 border border-white/20 bg-gray-900">
                  {/* Twitter-style header */}
                  <div className="flex items-center gap-3 mb-4">
                    <Avatar className="h-12 w-12">
                      <AvatarImage src="" alt={announcement.creator_name || "User"} />
                      <AvatarFallback className="bg-primary text-primary-foreground font-semibold">
                        {announcement.creator_name ? announcement.creator_name.charAt(0).toUpperCase() : "A"}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <h3 className="font-bold text-foreground text-lg">
                          {announcement.creator_name || "Admin"}
                        </h3>
                        <div className={`p-1 rounded-full ${getIconColor(announcement.type)}`}>
                          {announcement.type === 'info' && <Info className="w-4 h-4" />}
                          {announcement.type === 'celebration' && <Star className="w-4 h-4" />}
                          {announcement.type === 'general' && <Megaphone className="w-4 h-4" />}
                        </div>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {formatDate(announcement.created_at)}
                      </p>
                    </div>
                  </div>
                  
                  {/* Tweet content */}
                  <div className="ml-15">
                    <h4 className="font-semibold text-lg mb-2 text-foreground">
                      {announcement.title}
                    </h4>
                    <div className="text-foreground/90 leading-relaxed font-medium" dangerouslySetInnerHTML={{
              __html: announcement.content
            }} />
                  </div>
                </div>) :
        // Static announcements fallback
        staticAnnouncements.map((announcement, index) => <div key={index} className="bg-white/80 backdrop-blur-md rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 border border-white/20">
                  {/* Twitter-style header */}
                  <div className="flex items-center gap-3 mb-4">
                    <Avatar className="h-12 w-12">
                      <AvatarImage src="" alt="Admin" />
                      <AvatarFallback className="bg-primary text-primary-foreground font-semibold">
                        A
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <h3 className="font-bold text-foreground text-lg">
                          Breaking Math Admin
                        </h3>
                        <div className={`p-1 rounded-full ${getIconColor(announcement.type)}`}>
                          {announcement.type === 'info' && <Info className="w-4 h-4" />}
                          {announcement.type === 'celebration' && <Star className="w-4 h-4" />}
                          {announcement.type === 'general' && <Megaphone className="w-4 h-4" />}
                        </div>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {announcement.date}
                      </p>
                    </div>
                  </div>
                  
                  {/* Tweet content */}
                  <div className="ml-15">
                    <h4 className="font-semibold text-lg mb-2 text-foreground">
                      {announcement.title}
                    </h4>
                    <div className="text-foreground/90 leading-relaxed font-medium" dangerouslySetInnerHTML={{
              __html: announcement.content
            }} />
                  </div>
                </div>)}
          </div>}
      </div>
    </section>;
};
export default AnnouncementsSection;