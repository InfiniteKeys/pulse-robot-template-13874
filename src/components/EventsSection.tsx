import { useState, useEffect } from "react";

import { Calendar, Clock, MapPin, Users } from "lucide-react";
interface Event {
  id: string;
  name: string;
  description: string | null;
  date: string;
  time: string;
  location: string;
  participants: string;
}
const EventsSection = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    let isMounted = true;
    
    const loadEvents = async () => {
      if (isMounted) {
        await fetchEvents();
      }
    };
    
    loadEvents();
    
    return () => {
      isMounted = false;
    };
  }, []);

  const fetchEvents = async () => {
    try {
      const response = await fetch('/.netlify/functions/get-events');
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

      const contentType = response.headers.get('content-type') || '';
      let data: any = [];
      if (contentType.includes('application/json')) {
        data = await response.json();
      } else {
        const text = await response.text();
        console.warn('Non-JSON response for events:', text.slice(0, 200));
        data = [];
      }
      setEvents(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Error fetching events:', error);
      setEvents([]);
    } finally {
      setLoading(false);
    }
  };
  const CountdownTimer = ({
    targetDate
  }: {
    targetDate: string;
  }) => {
    const [timeLeft, setTimeLeft] = useState({
      days: 0,
      hours: 0,
      minutes: 0,
      seconds: 0
    });
    useEffect(() => {
      const timer = setInterval(() => {
        const now = new Date().getTime();
        const target = new Date(targetDate).getTime();
        const difference = target - now;
        if (difference > 0) {
          setTimeLeft({
            days: Math.floor(difference / (1000 * 60 * 60 * 24)),
            hours: Math.floor(difference % (1000 * 60 * 60 * 24) / (1000 * 60 * 60)),
            minutes: Math.floor(difference % (1000 * 60 * 60) / (1000 * 60)),
            seconds: Math.floor(difference % (1000 * 60) / 1000)
          });
        }
      }, 1000);
      return () => clearInterval(timer);
    }, [targetDate]);
    return <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 md:gap-3 text-center">
        <TimeBox value={timeLeft.days} label="Days" />
        <TimeBox value={timeLeft.hours} label="Hours" />
        <TimeBox value={timeLeft.minutes} label="Min" />
        <TimeBox value={timeLeft.seconds} label="Sec" />
      </div>;
  };

  // Simple time box component
  const TimeBox = ({ value, label }: { value: number; label: string }) => (
    <div className="flex flex-col items-center p-2 rounded-lg bg-background/50 border border-primary/20 hover:border-primary/40 transition-all group hover:scale-105">
      <span className="text-2xl md:text-3xl font-bold text-primary tabular-nums group-hover:scale-110 transition-transform">
        {String(value).padStart(2, '0')}
      </span>
      <span className="text-xs text-muted-foreground uppercase tracking-wider mt-1">{label}</span>
    </div>
  );
  return <section id="events" className="py-20 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-10 right-10 w-72 h-72 bg-primary/10 rounded-full blur-3xl animate-float-slow"></div>
        <div className="absolute bottom-10 left-10 w-96 h-96 bg-secondary/10 rounded-full blur-3xl animate-float-slower"></div>
      </div>
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-6xl mx-auto">
          {/* Section Header - Animated */}
          <div className="text-center mb-16 animate-fade-in">
            <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-primary via-secondary to-primary bg-clip-text text-transparent animate-gradient" style={{ backgroundSize: "200% auto" }}>
              Upcoming Events
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Join us for exciting mathematical competitions, workshops, and social events throughout the year.
            </p>
          </div>

          {/* Events Grid - Animated */}
          {loading ? <div className="text-center py-16 animate-pulse">
              <div className="animate-spin w-12 h-12 border-4 border-primary border-t-transparent rounded-full mx-auto"></div>
              <p className="mt-4 text-muted-foreground">Loading events...</p>
            </div> : events.length === 0 ? <div className="text-center py-16 animate-fade-in">
              <div className="inline-block p-8 rounded-full bg-primary/10 mb-4 animate-scale-pulse">
                <Calendar className="h-16 w-16 text-primary" />
              </div>
              <p className="text-xl text-muted-foreground">No events scheduled at the moment.</p>
              <p className="text-muted-foreground mt-2">Check back soon for upcoming events!</p>
            </div> : <div className="grid lg:grid-cols-2 gap-8">
              {events.map((event, index) => <div 
                key={event.id} 
                className="event-card animate-fade-in hover:shadow-2xl transition-all duration-500"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                {/* Event Header - Enhanced */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold mb-2 group-hover:text-primary transition-colors duration-300">{event.name}</h3>
                    <div className="flex flex-col sm:flex-row sm:items-center text-muted-foreground text-sm space-y-2 sm:space-y-0 sm:space-x-4">
                      <div className="flex items-center hover:text-primary transition-colors">
                        <Calendar className="h-4 w-4 mr-1" />
                        {new Date(event.date).toLocaleDateString('en-US', {
                      weekday: 'long',
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                      </div>
                      <div className="flex items-center hover:text-secondary transition-colors">
                        <Clock className="h-4 w-4 mr-1" />
                        {new Date(`2000-01-01T${event.time}`).toLocaleTimeString('en-US', {
                      hour: 'numeric',
                      minute: '2-digit',
                      hour12: true
                    })}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Event Details - Enhanced */}
                <div className="space-y-3 mb-6">
                  <div className="flex items-center text-muted-foreground hover:text-primary transition-colors group">
                    <MapPin className="h-4 w-4 mr-2 flex-shrink-0 group-hover:scale-110 transition-transform" />
                    <span>{event.location}</span>
                  </div>
                  <div className="flex items-center text-muted-foreground hover:text-secondary transition-colors group">
                    <Users className="h-4 w-4 mr-2 flex-shrink-0 group-hover:scale-110 transition-transform" />
                    <span>{event.participants}</span>
                  </div>
                  {event.description && <p className="text-muted-foreground leading-relaxed">
                      {event.description}
                    </p>}
                </div>

                {/* Countdown Timer - Simplified & Animated */}
                <div className="mt-6 p-5 bg-gradient-to-br from-primary/10 via-secondary/5 to-primary/10 rounded-lg border border-primary/30 hover:border-primary/50 transition-all duration-300 hover:shadow-lg hover:shadow-primary/20">
                  <p className="text-sm font-semibold text-center mb-4 text-primary flex items-center justify-center gap-2">
                    <Clock className="h-4 w-4 animate-pulse" />
                    Time Remaining
                  </p>
                  <CountdownTimer targetDate={event.date} />
                </div>
              </div>)}
            </div>}

          {/* Call to Action */}
          <div className="text-center mt-16">
            
          </div>
        </div>
      </div>
    </section>;
};
export default EventsSection;