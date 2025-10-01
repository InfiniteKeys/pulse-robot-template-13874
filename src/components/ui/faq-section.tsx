import React from 'react';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';

const FAQSection = () => {
  const faqs = [
    {
      question: "What is Breaking Math Club?",
      answer: "Breaking Math Club is the official math club of Bramalea Secondary School. We're a community of students who enjoy exploring mathematics through challenges, competitions, and collaborative problem-solving."
    },
    {
      question: "Who can join the club?",
      answer: "Any student at Bramalea Secondary School can join, regardless of their current math level. We welcome students from grades 9-12 who have an interest in mathematics and want to improve their problem-solving skills."
    },
    {
      question: "When does the club meet?",
      answer: "We meet once a week on Thursdays from 11:10 AM to 12:05 PM in Room 208."
    },
    {
      question: "Do I need to be good at math to join?",
      answer: "Not at all! We welcome students of all skill levels. Our goal is to help everyone improve and develop a love for mathematics in a supportive environment."
    }
  ];

  return (
    <section id="faq" className="py-20 bg-muted/20">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Frequently Asked Questions
            </h2>
            <p className="text-lg text-muted-foreground">
              Everything you need to know about Breaking Math Club
            </p>
          </div>

          <Accordion type="single" collapsible className="space-y-4">
            {faqs.map((faq, index) => (
              <AccordionItem
                key={index}
                value={`item-${index}`}
                className="bg-background/50 backdrop-blur-sm rounded-lg border border-border px-6"
              >
                <AccordionTrigger className="text-left hover:text-primary transition-colors py-6">
                  <span className="font-semibold">{faq.question}</span>
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground pb-6 pt-2 leading-relaxed">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>

          <div className="text-center mt-12">
            <p className="text-muted-foreground mb-4">
              Still have questions? We'd love to hear from you!
            </p>
            <a
              href="#contact"
              className="inline-flex items-center text-primary hover:text-primary/80 transition-colors font-medium"
            >
              Get in touch with us
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FAQSection;
