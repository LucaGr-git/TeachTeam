import React from "react";
import { render, screen } from "@testing-library/react";
import TagDisplay from "@/components/general-components/TagDisplay";

describe("Testing TagDisplay", () => {

  // test for how an empty array is handled
  it("renders 'None applicable' when tags array is empty", () => {
    render(<TagDisplay tags={[]} />);
    // expect none applicable tag
    expect(screen.getByText("None applicable")).toBeInTheDocument();
    // expect fullwidth
    expect(screen.getByText("None applicable")).toHaveClass("w-full");
    // expect red text
    expect(screen.getByText("None applicable")).toHaveClass("text-destructive");
  });

  // test for rendering an array of tags with size 10
  it("renders all elements in a tag array of size 10", () => {
    // make a tag array with 10 elements
    const tags = [];
    for (let i = 1; i <= 10; ++i){
      tags.push(`Tag ${i}`)
    }
    render(<TagDisplay tags={tags} />);
    
    // iterate through all tags to see if they are in document
    tags.forEach(tag => {
      expect(screen.getByText(tag)).toBeInTheDocument();
    });
  });

  // test for rendering an array of tags with size 200
  it("renders all elements in a tag array of size 200", () => {
    // make a tag array with 200 elements
    const tags = [];
    for (let i = 1; i <= 200; ++i){
      tags.push(`Tag ${i}`)
    }
    render(<TagDisplay tags={tags} />);
    
    // iterate through all tags to see if they are in document
    tags.forEach(tag => {
      expect(screen.getByText(tag)).toBeInTheDocument();
    });
  });

  it("applies w-full class when fullWidth prop is true", () => {
    render(<TagDisplay tags={["Tag"]} fullWidth />);
    expect(screen.getByText("Tag")).toHaveClass("w-full");
  });

  
});
