import { BookOpen, Calculator, Trophy, Users } from "lucide-react";
const ResourcesSection = () => {
  const resources = [{
    icon: BookOpen,
    title: "Study Materials",
    description: "Access our comprehensive collection of math worksheets, problem sets, and study guides.",
    items: ["Competition Prep Guides", "Formula Sheets", "Practice Problems", "Video Tutorials"]
  }, {
    icon: Calculator,
    title: "Online Tools",
    description: "Essential mathematical tools and calculators to help with your studies and competitions.",
    items: ["Graphing Calculator", "Matrix Solver", "Integral Calculator", "Probability Tools"]
  }, {
    icon: Trophy,
    title: "Competition Resources",
    description: "Everything you need to excel in mathematics competitions at all levels.",
    items: ["Past Contest Papers", "Strategy Guides", "Time Management Tips", "Mock Competitions"]
  }, {
    icon: Users,
    title: "Study Groups",
    description: "Join or form study groups with fellow members to tackle challenging problems together.",
    items: ["Weekly Meet-ups", "Online Sessions", "Peer Tutoring", "Group Projects"]
  }];
  return <section id="resources" className="py-20 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          {/* Section Header */}
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">Resources & Support</h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Access a wealth of mathematical resources, tools, and support systems designed to help you excel.
            </p>
          </div>

          {/* Resources Grid */}
          <div className="grid md:grid-cols-2 gap-8">
            {resources.map((resource, index) => {
            const Icon = resource.icon;
            return <div key={index} className="team-card">
                  <div className="flex items-start space-x-4">
                    <div className="bg-primary/10 rounded-lg p-3 flex-shrink-0">
                      <Icon className="h-8 w-8 text-primary" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-xl font-semibold mb-3">{resource.title}</h3>
                      <p className="text-muted-foreground mb-4">{resource.description}</p>
                      <ul className="space-y-2">
                        {resource.items.map((item, itemIndex) => <li key={itemIndex} className="flex items-center space-x-2">
                            <div className="w-2 h-2 bg-primary rounded-full flex-shrink-0"></div>
                            <span className="text-sm text-muted-foreground">{item}</span>
                          </li>)}
                      </ul>
                    </div>
                  </div>
                </div>;
          })}
          </div>

          {/* Call to Action */}
          <div className="text-center mt-16">
            
          </div>
        </div>
      </div>
    </section>;
};
export default ResourcesSection;