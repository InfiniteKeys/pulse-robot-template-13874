"use client";

import { useState, useEffect, useRef } from "react";
import { ArrowRight, Link, Zap } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
interface TimelineItem {
  id: number;
  title: string;
  date: string;
  content: string;
  category: string;
  icon: React.ElementType;
  relatedIds: number[];
  status: "completed" | "in-progress" | "pending";
  energy: number;
}
interface RadialOrbitalTimelineProps {
  timelineData: TimelineItem[];
}
export default function RadialOrbitalTimeline({
  timelineData
}: RadialOrbitalTimelineProps) {
  const [expandedItems, setExpandedItems] = useState<Record<number, boolean>>({});
  const [rotationAngle, setRotationAngle] = useState<number>(0);
  const [autoRotate, setAutoRotate] = useState<boolean>(true);
  const [pulseEffect, setPulseEffect] = useState<Record<number, boolean>>({});
  const [centerOffset, setCenterOffset] = useState<{
    x: number;
    y: number;
  }>({
    x: 0,
    y: 0
  });
  const [activeNodeId, setActiveNodeId] = useState<number | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const orbitRef = useRef<HTMLDivElement>(null);
  const nodeRefs = useRef<Record<number, HTMLDivElement | null>>({});
  const handleContainerClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === containerRef.current || e.target === orbitRef.current) {
      setExpandedItems({});
      setActiveNodeId(null);
      setPulseEffect({});
      setAutoRotate(true);
    }
  };
  const toggleItem = (id: number) => {
    setExpandedItems(prev => {
      const newState = {
        ...prev
      };
      Object.keys(newState).forEach(key => {
        if (parseInt(key) !== id) {
          newState[parseInt(key)] = false;
        }
      });
      newState[id] = !prev[id];
      if (!prev[id]) {
        setActiveNodeId(id);
        setAutoRotate(false);
        const relatedItems = getRelatedItems(id);
        const newPulseEffect: Record<number, boolean> = {};
        relatedItems.forEach(relId => {
          newPulseEffect[relId] = true;
        });
        setPulseEffect(newPulseEffect);
        centerViewOnNode(id);
      } else {
        setActiveNodeId(null);
        setAutoRotate(true);
        setPulseEffect({});
      }
      return newState;
    });
  };
  useEffect(() => {
    let rotationTimer: NodeJS.Timeout;
    if (autoRotate) {
      rotationTimer = setInterval(() => {
        setRotationAngle(prev => {
          const newAngle = (prev + 0.3) % 360;
          return Number(newAngle.toFixed(3));
        });
      }, 50);
    }
    return () => {
      if (rotationTimer) {
        clearInterval(rotationTimer);
      }
    };
  }, [autoRotate]);
  const centerViewOnNode = (nodeId: number) => {
    if (!nodeRefs.current[nodeId]) return;
    const nodeIndex = timelineData.findIndex(item => item.id === nodeId);
    const totalNodes = timelineData.length;
    const targetAngle = nodeIndex / totalNodes * 360;
    setRotationAngle(270 - targetAngle);
  };
  const calculateNodePosition = (index: number, total: number) => {
    const angle = (index / total * 360 + rotationAngle) % 360;

    // Fixed radius calculation to maintain proper spacing and circle positioning
    const isMobile = window.innerWidth < 640;
    const isTablet = window.innerWidth < 1024;
    let baseRadius;
    if (isMobile) {
      baseRadius = 120; // Fixed radius for mobile to ensure proper spacing
    } else if (isTablet) {
      baseRadius = 120; // Same fixed radius for tablet as mobile
    } else {
      baseRadius = 192; // Fixed radius for desktop (matches w-96 = 384px / 2 = 192px)
    }
    const radian = angle * Math.PI / 180;

    // Position icons exactly on the circle circumference
    const x = baseRadius * Math.cos(radian) + centerOffset.x;
    const y = baseRadius * Math.sin(radian) + centerOffset.y;
    const zIndex = Math.round(100 + 50 * Math.cos(radian));
    const opacity = Math.max(0.6, Math.min(1, 0.6 + 0.4 * ((1 + Math.sin(radian)) / 2)));
    return {
      x,
      y,
      angle,
      zIndex,
      opacity
    };
  };
  const getRelatedItems = (itemId: number): number[] => {
    const currentItem = timelineData.find(item => item.id === itemId);
    return currentItem ? currentItem.relatedIds : [];
  };
  const isRelatedToActive = (itemId: number): boolean => {
    if (!activeNodeId) return false;
    const relatedItems = getRelatedItems(activeNodeId);
    return relatedItems.includes(itemId);
  };
  const getStatusStyles = (status: TimelineItem["status"]): string => {
    switch (status) {
      case "completed":
        return "text-primary-foreground bg-primary border-primary";
      case "in-progress":
        return "text-secondary-foreground bg-secondary border-secondary";
      case "pending":
        return "text-muted-foreground bg-muted border-muted";
      default:
        return "text-muted-foreground bg-muted border-muted";
    }
  };
  return <section className="w-full py-12 sm:py-24 md:py-32 bg-background text-foreground overflow-hidden">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-semibold leading-tight sm:text-5xl sm:leading-tight mb-4">Club Games & Activities</h2>
          <p className="text-md max-w-[600px] mx-auto font-medium text-muted-foreground sm:text-xl">Engage in fun math games and activities designed to strengthen your skills and challenge your mind.</p>
        </div>
        
        <div className="w-full h-[400px] sm:h-[500px] md:h-[600px] flex flex-col items-center justify-center relative" ref={containerRef} onClick={handleContainerClick}>
          <div className="relative w-full max-w-4xl h-full flex items-center justify-center">
            <div className="absolute w-full h-full flex items-center justify-center" ref={orbitRef} style={{
            perspective: "1000px",
            transform: `translate(${centerOffset.x}px, ${centerOffset.y}px)`
          }}>
              <div className="absolute w-10 h-10 sm:w-12 sm:h-12 md:w-16 md:h-16 rounded-full bg-gradient-to-br from-primary via-secondary to-primary animate-pulse flex items-center justify-center z-10">
                <div className="absolute w-12 h-12 sm:w-16 sm:h-16 md:w-20 md:h-20 rounded-full border border-primary/20 animate-ping opacity-70"></div>
                <div className="absolute w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 rounded-full border border-primary/10 animate-ping opacity-50" style={{
                animationDelay: "0.5s"
              }}></div>
                <div className="w-4 h-4 sm:w-6 sm:h-6 md:w-8 md:h-8 rounded-full bg-primary-foreground/80 backdrop-blur-md"></div>
              </div>

              <div className="absolute w-60 h-60 sm:w-80 sm:h-80 md:w-96 md:h-96 rounded-full border border-white/40"></div>

              {timelineData.map((item, index) => {
              const position = calculateNodePosition(index, timelineData.length);
              const isExpanded = expandedItems[item.id];
              const isRelated = isRelatedToActive(item.id);
              const isPulsing = pulseEffect[item.id];
              const Icon = item.icon;
              const nodeStyle = {
                transform: `translate3d(${position.x}px, ${position.y}px, 0)`,
                zIndex: isExpanded ? 200 : position.zIndex,
                opacity: isExpanded ? 1 : position.opacity
              };
              return <div key={item.id} ref={el => nodeRefs.current[item.id] = el} className={`absolute ${autoRotate ? "transition-none will-change-transform" : "transition-transform duration-300"} cursor-pointer`} style={nodeStyle} onClick={e => {
                e.stopPropagation();
                toggleItem(item.id);
              }}>
                    <div className={`absolute rounded-full -inset-1 ${isPulsing ? "animate-pulse duration-1000" : ""}`} style={{
                  background: `radial-gradient(circle, hsl(var(--primary) / 0.2) 0%, transparent 70%)`,
                  width: `${item.energy * 0.5 + 32}px`,
                  height: `${item.energy * 0.5 + 32}px`,
                  left: `-${(item.energy * 0.5 + 32 - 32) / 2}px`,
                  top: `-${(item.energy * 0.5 + 32 - 32) / 2}px`
                }}></div>

                    <div className={`
                      w-8 h-8 sm:w-8 sm:h-8 md:w-10 md:h-10 rounded-full flex items-center justify-center
                      ${isExpanded ? "bg-primary text-primary-foreground" : isRelated ? "bg-secondary text-secondary-foreground" : "bg-card text-card-foreground"}
                      border-2 
                      ${isExpanded ? "border-primary shadow-lg shadow-primary/30" : isRelated ? "border-secondary animate-pulse" : "border-border"}
                      transition-all duration-300 transform
                      ${isExpanded ? "scale-125 sm:scale-150" : ""}
                    `}>
                      <Icon size={12} className="sm:size-3 md:size-4" />
                    </div>

                    <div className={`
                      absolute top-8 sm:top-10 md:top-12 left-1/2 -translate-x-1/2 whitespace-nowrap
                      text-xs sm:text-xs md:text-sm font-semibold tracking-wider
                      transition-all duration-300
                      ${isExpanded ? "text-foreground scale-110 sm:scale-125" : "text-muted-foreground"}
                    `}>
                      {item.title}
                    </div>

                    {isExpanded && <Card className="absolute top-14 sm:top-16 md:top-20 left-1/2 -translate-x-1/2 w-48 sm:w-56 md:w-64 bg-card/95 backdrop-blur-lg border-border shadow-xl overflow-visible">
                        <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-px h-3 bg-border"></div>
                        <CardHeader className="pb-2">
                          
                          <CardTitle className="text-sm mt-2">
                            {item.title}
                          </CardTitle>
                        </CardHeader>
                        <CardContent className="text-xs text-muted-foreground">
                          <p>{item.content}</p>

                          <div className="mt-4 pt-3 border-t border-border">
                            
                            <div className="w-full h-1 bg-muted rounded-full overflow-hidden">
                              <div className="h-full bg-gradient-to-r from-primary to-secondary" style={{
                          width: `${item.energy}%`
                        }}></div>
                            </div>
                          </div>

                          {item.relatedIds.length > 0 && <div className="mt-4 pt-3 border-t border-border">
                              <div className="flex items-center mb-2">
                                <Link size={10} className="text-muted-foreground mr-1" />
                                <h4 className="text-xs uppercase tracking-wider font-medium text-muted-foreground">
                                  Related Topics
                                </h4>
                              </div>
                              <div className="flex flex-wrap gap-1">
                                {item.relatedIds.map(relatedId => {
                          const relatedItem = timelineData.find(i => i.id === relatedId);
                          return <Button key={relatedId} variant="outline" size="sm" className="flex items-center h-6 px-2 py-0 text-xs rounded border-border bg-transparent hover:bg-muted text-muted-foreground hover:text-foreground transition-all" onClick={e => {
                            e.stopPropagation();
                            toggleItem(relatedId);
                          }}>
                                      {relatedItem?.title}
                                      <ArrowRight size={8} className="ml-1 text-muted-foreground" />
                                    </Button>;
                        })}
                              </div>
                            </div>}
                        </CardContent>
                      </Card>}
                  </div>;
            })}
            </div>
          </div>
        </div>
      </div>
    </section>;
}