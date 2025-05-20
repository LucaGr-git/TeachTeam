import React from "react";

interface SectionProps {
  title: string;
  children: React.ReactNode;
  className?: string;
}

const Section = ({ title, children, className="section"}: SectionProps) => {
  return (
    <section className={className}>
      <h1 className="font-medium text-xl ">{title}</h1>
      {children}
    </section>
  );
};

export default Section;
