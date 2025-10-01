import { Mail, Instagram, MapPin, Clock, Phone, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";
const ContactSection = () => {
  const {
    toast
  } = useToast();
  const [formData, setFormData] = useState({
    name: "",
    studentNumber: "",
    subject: "",
    message: ""
  });
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const {
      id,
      value
    } = e.target;
    let fieldName = id.replace('contact-', '');

    // Convert kebab-case to camelCase
    fieldName = fieldName.replace(/-([a-z])/g, (match, letter) => letter.toUpperCase());
    setFormData(prev => ({
      ...prev,
      [fieldName]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validation
    if (!formData.name.trim()) {
      toast({
        title: "Missing Information",
        description: "Please enter your name.",
        variant: "destructive"
      });
      return;
    }
    if (!formData.studentNumber.trim()) {
      toast({
        title: "Missing Information",
        description: "Please enter your student number.",
        variant: "destructive"
      });
      return;
    }
    if (!formData.subject.trim()) {
      toast({
        title: "Missing Information",
        description: "Please enter a subject.",
        variant: "destructive"
      });
      return;
    }
    if (!formData.message.trim()) {
      toast({
        title: "Missing Information",
        description: "Please enter your message.",
        variant: "destructive"
      });
      return;
    }

    try {
      const response = await fetch('https://woosegomxvbgzelyqvoj.supabase.co/functions/v1/submit-contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Indvb3NlZ29teHZiZ3plbHlxdm9qIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTg2Nzg3OTAsImV4cCI6MjA3NDI1NDc5MH0.htpKQLRZjqwochLN7MBVI8tA5F-AAwktDd5SLq6vUSc`
        },
        body: JSON.stringify({
          name: formData.name,
          studentNumber: formData.studentNumber,
          subject: formData.subject,
          message: formData.message,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        toast({
          title: "Message Sent Successfully! ✉️",
          description: "Thank you for contacting Breaking Math. We'll get back to you soon!"
        });

        // Reset form
        setFormData({
          name: "",
          studentNumber: "",
          subject: "",
          message: ""
        });
      } else {
        toast({
          title: "Error",
          description: data.error || "Failed to send message. Please try again.",
          variant: "destructive"
        });
      }
    } catch (error) {
      toast({
        title: "Network Error",
        description: "Unable to send message. Please check your connection and try again.",
        variant: "destructive"
      });
    }
  };
  return <section id="contact" className="py-20 bg-gradient-to-br from-primary/5 to-secondary/5">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          {/* Section Header */}
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">Get In Touch</h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Have questions about Breaking Math? Want to learn more about our activities? 
              We'd love to hear from you!
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-8 lg:gap-12">
            {/* Contact Information */}
            <div className="order-2 lg:order-1">
              <h3 className="text-2xl font-bold mb-6 lg:mb-8">Contact Information</h3>
              
              <div className="space-y-4 lg:space-y-6">
                {/* Teacher Supervisors */}
                <div className="bg-card rounded-xl p-4 lg:p-6 border border-border shadow-sm">
                  <h4 className="font-semibold mb-3 lg:mb-4 flex items-center text-sm lg:text-base">
                    <Mail className="h-4 w-4 lg:h-5 lg:w-5 mr-2 text-primary" />
                    Teacher Supervisors
                  </h4>
                  <div className="space-y-2 lg:space-y-3">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1 sm:gap-2">
                      <span className="font-medium text-sm lg:text-base">Ms. Issar</span>
                      <a href="mailto:p0188851@pdsb.net" className="text-primary hover:underline text-sm lg:text-base break-all">
                        p0188851@pdsb.net
                      </a>
                    </div>
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1 sm:gap-2">
                      <span className="font-medium text-sm lg:text-base">Mr. Kumar</span>
                      <a href="mailto:p0201001@pdsb.net" className="text-primary hover:underline text-sm lg:text-base break-all">
                        p0201001@pdsb.net
                      </a>
                    </div>
                  </div>
                </div>

                {/* Club Information */}
                <div className="bg-card rounded-xl p-4 lg:p-6 border border-border shadow-sm">
                  <h4 className="font-semibold mb-3 lg:mb-4 flex items-center text-sm lg:text-base">
                    <MapPin className="h-4 w-4 lg:h-5 lg:w-5 mr-2 text-primary" />
                    Club Location
                  </h4>
                  <p className="text-muted-foreground mb-1 lg:mb-2 text-sm lg:text-base">Bramalea Secondary School</p>
                  <p className="text-muted-foreground text-sm lg:text-base">Room 208</p>
                </div>

                {/* Meeting Times */}
                <div className="bg-card rounded-xl p-4 lg:p-6 border border-border shadow-sm">
                  <h4 className="font-semibold mb-3 lg:mb-4 flex items-center text-sm lg:text-base">
                    <Clock className="h-4 w-4 lg:h-5 lg:w-5 mr-2 text-primary" />
                    Meeting Schedule
                  </h4>
                  <div className="space-y-1 lg:space-y-2 text-muted-foreground">
                    <p className="text-sm lg:text-base"><strong>Regular Meetings:</strong> Thursdays, 11:10 AM - 12:05 PM</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Message Form */}
            <div className="order-1 lg:order-2">
              <h3 className="text-2xl font-bold mb-6 lg:mb-8">Send Us a Message</h3>
              
              <div className="bg-card rounded-xl p-6 lg:p-8 border border-border shadow-lg">
                <form className="space-y-4 lg:space-y-6" onSubmit={handleSubmit}>
                  <div>
                    <label htmlFor="contact-name" className="block text-sm font-medium mb-2">
                      Your Name
                    </label>
                    <input 
                      type="text" 
                      id="contact-name" 
                      value={formData.name} 
                      onChange={handleInputChange} 
                      className="w-full px-3 lg:px-4 py-2 lg:py-3 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent text-foreground bg-background text-sm lg:text-base" 
                      placeholder="Enter your name" 
                      maxLength={100}
                    />
                  </div>

                  <div>
                    <label htmlFor="contact-student-number" className="block text-sm font-medium mb-2">
                      Student Number
                    </label>
                    <input 
                      type="text" 
                      id="contact-student-number" 
                      value={formData.studentNumber} 
                      onChange={handleInputChange} 
                      className="w-full px-3 lg:px-4 py-2 lg:py-3 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent text-foreground bg-background text-sm lg:text-base" 
                      placeholder="Enter your student number" 
                      maxLength={50}
                    />
                  </div>

                  <div>
                    <label htmlFor="contact-subject" className="block text-sm font-medium mb-2">
                      Subject
                    </label>
                    <input 
                      type="text" 
                      id="contact-subject" 
                      value={formData.subject} 
                      onChange={handleInputChange} 
                      className="w-full px-3 lg:px-4 py-2 lg:py-3 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent text-foreground bg-background text-sm lg:text-base" 
                      placeholder="Enter subject" 
                      maxLength={200}
                    />
                  </div>

                  <div>
                    <label htmlFor="contact-message" className="block text-sm font-medium mb-2">
                      Message
                    </label>
                    <textarea 
                      id="contact-message" 
                      rows={4} 
                      value={formData.message} 
                      onChange={handleInputChange} 
                      className="w-full px-3 lg:px-4 py-2 lg:py-3 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent text-foreground bg-background text-sm lg:text-base resize-y" 
                      placeholder="Tell us how we can help you..."
                      maxLength={1000}
                    ></textarea>
                  </div>

                  <Button type="submit" className="w-full">
                    <MessageCircle className="mr-2 h-4 w-4 lg:h-5 lg:w-5" />
                    Send Message
                  </Button>
                </form>

              </div>
            </div>
          </div>

        </div>
      </div>
    </section>;
};
export default ContactSection;