import { Brain, DoorOpen, MessageSquare, Search, Trophy } from "lucide-react";
import RadialOrbitalTimeline from "@/components/ui/radial-orbital-timeline";

const mathTimelineData = [
  {
    id: 1,
    title: "Mental Math Challenge",
    date: "Weekly",
    content: "Test your mental calculation skills with rapid-fire math problems. Speed and accuracy are key!",
    category: "Challenge",
    icon: Brain,
    relatedIds: [2, 3],
    status: "completed" as const,
    energy: 100,
  },
  {
    id: 2,
    title: "Math Escape Challenge",
    date: "Monthly",
    content: "Solve puzzles and equations to unlock doors and escape the room. Work against the clock!",
    category: "Puzzle",
    icon: DoorOpen,
    relatedIds: [1, 3, 4],
    status: "completed" as const,
    energy: 100,
  },
  {
    id: 3,
    title: "Math Memory Duel",
    date: "Bi-weekly",
    content: "Remember patterns, sequences, and formulas. Compete head-to-head in memory challenges.",
    category: "Memory",
    icon: MessageSquare,
    relatedIds: [1, 2, 4, 5],
    status: "completed" as const,
    energy: 100,
  },
  {
    id: 4,
    title: "The Error Hunt",
    date: "Weekly",
    content: "Find mistakes in mathematical solutions. Sharpen your analytical skills and attention to detail.",
    category: "Analysis",
    icon: Search,
    relatedIds: [2, 3, 5],
    status: "completed" as const,
    energy: 100,
  },
  {
    id: 5,
    title: "Tournament of Teams",
    date: "Quarterly",
    content: "Form teams and compete in the ultimate math showdown. Collaboration meets competition!",
    category: "Tournament",
    icon: Trophy,
    relatedIds: [3, 4],
    status: "completed" as const,
    energy: 100,
  },
];

const MathTimelineSection = () => {
  return <RadialOrbitalTimeline timelineData={mathTimelineData} />;
};

export default MathTimelineSection;