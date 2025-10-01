import { Mail, Award, Target, Heart } from "lucide-react";
import { TestimonialsSection } from "@/components/ui/testimonials-with-marquee";
import { Features } from "@/components/ui/features-8";

const AboutSection = () => {
  const teamMembers = [
    {
      author: {
        name: "Ms. Issar",
        handle: "Teacher Supervisor",
        avatar: "https://i.ibb.co/XrB6Lnxn/Kanchan-png.png"
      },
      text: "Faculty advisor who mentors members, verifies questions, plans events, and links the club with opportunities."
    },
    {
      author: {
        name: "Mr. Kumar",
        handle: "Teacher Supervisor", 
        avatar: "https://i.ibb.co/dJP3CQPY/Ajay-png.png"
      },
      text: "Faculty advisor who guides, supports, and supervises club activities."
    },
    {
      author: {
        name: "Abdul Rahman Rahimi",
        handle: "President • Grade 12",
        avatar: "https://i.ibb.co/RGwD1Twj/Abdul-Rahman-png.png"
      },
      text: "Leads the Math Club, oversees activities and meetings, represents the club to teachers and school administration, and helps with competition questions when needed."
    },
    {
      author: {
        name: "Aarush Bansal",
        handle: "Vice President • Grade 12",
        avatar: "https://i.ibb.co/1f8j7qdT/Aarush-png.png"
      },
      text: "Assists with competitions, prepares and reviews questions, and helps with meeting preparation."
    },
    {
      author: {
        name: "Suyansh Mittal",
        handle: "Second VP & Question Coordinator • Grade 12",
        avatar: "https://i.ibb.co/QFXGwPj3/Suryansh-png.png"
      },
      text: "Creates competition questions, prepares materials, ensures everything is ready for events."
    },
    {
      author: {
        name: "Akankshya Panda",
        handle: "Communications & Outreach Officer • Grade 12",
        avatar: "https://i.ibb.co/jvRhrvrX/Akankshya-png.png"
      },
      text: "Manages social media and announcements, gives speeches when needed, and assists the Problem/Question Coordinator with preparing and reviewing competition materials."
    },
    {
      author: {
        name: "Sherry Naem",
        handle: "Question Coordinator Assistant • Grade 12",
        avatar: "https://i.ibb.co/KjTzYvr2/Sherry-png.png"
      },
      text: "Supports the Problem / Question Coordinator by helping draft, proof-read, and test competition questions and materials."
    },
    {
      author: {
        name: "Hasan Ahmad",
        handle: "Treasurer • Grade 12",
        avatar: "https://i.ibb.co/Zz7FpQzV/Hasan-png.png"
      },
      text: "Supports Treasurer 1, tracks spending, ensures budget is used properly."
    },
    {
      author: {
        name: "Moamel Al-Rammahi",
        handle: "Website Developer • Grade 12",
        avatar: "https://i.ibb.co/hJRGztcZ/Moamel-png.png"
      },
      text: "Manages and updates the Breaking Math website to keep it clear, useful, and up to date."
    }
  ];

  const clubStats = [
    { label: "Active Members", value: "1", suffix: " Year Running" },
    { label: "Competition Awards", value: "0", suffix: " This Year" },
    { label: "Weekly Sessions", value: "2", suffix: " Per Week" },
    { label: "Success Rate", value: "100%", suffix: " Satisfaction" }
  ];


  return (
    <>
      {/* Executive Team Section - Enhanced */}
      <section className="relative py-8 overflow-hidden">
        <div className="absolute inset-0 pointer-events-none opacity-50">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl animate-float-slow"></div>
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-secondary/10 rounded-full blur-3xl animate-float-slower"></div>
        </div>
        <div className="relative z-10">
          <TestimonialsSection
            title="Executive Team & Supervisors"
            description="Meet the passionate leaders and mentors driving Breaking Math forward with innovation and dedication."
            testimonials={teamMembers}
          />
        </div>
      </section>

      {/* About Section - Enhanced */}
      <section id="about" className="py-20 bg-muted/30 relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-20 right-20 w-64 h-64 bg-accent/10 rounded-full blur-3xl animate-pulse-slow"></div>
        </div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-6xl mx-auto">
            {/* Section Header - Animated */}
            <div className="text-center mb-8 animate-fade-in">
              <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-primary via-secondary to-primary bg-clip-text text-transparent animate-gradient" style={{ backgroundSize: "200% auto" }}>
                About Breaking Math
              </h2>
              <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-8 animate-fade-in" style={{ animationDelay: "100ms" }}>
                We're a passionate community of mathematical minds at Bramalea Secondary School, 
                dedicated to making math fun, collaborative, and rewarding.
              </p>
            </div>

            {/* Features Section */}
            <Features />
          </div>
        </div>
      </section>
    </>
  );
};

export default AboutSection;
