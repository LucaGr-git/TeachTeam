import React from "react";
import { render, screen, fireEvent, act} from "@testing-library/react";
import TagCustomDisplay from "@/components/general-components/TagCustomizableDisplay";
import { z } from "zod";

describe("TagCustomDisplay", () => {
    // mock functions 
    const mockAddTag = jest.fn().mockReturnValue("");
    const mockRemoveTag = jest.fn().mockReturnValue("");

    // reset mock functions 
    beforeEach(() => {
        mockAddTag.mockReset();
        mockRemoveTag.mockReset();
    });

    // test for rendering tags properly 
    it("renders initial tags", () => {
        // render with 2 tags
        const tags = ["Tag 1", "Tag 2"];
        render(<TagCustomDisplay tags={tags} addTag={mockAddTag} removeTag={mockRemoveTag} />);

        tags.forEach(tag => {
        expect(screen.getByText(tag)).toBeInTheDocument();
        });
    });

    // test for calling removeTag function on button click
    it("calls removeTag when a tag button is clicked", () => {
     // render with 1 tag
        const tags = ["Tag"];
        render(<TagCustomDisplay tags={tags} addTag={mockAddTag} removeTag={mockRemoveTag} />);

        // use act as it is affecting a form
        act(() => {
            // click button that says tag to see if it will be removed
            fireEvent.click(screen.getByText("Tag"));
        })

        // expect the mock function to be called
        expect(mockRemoveTag).toHaveBeenCalledWith("Tag");
    });

    // test for adding a new tag
    it("submits a valid tag and calls addTag function", async () => {
        const placeholder: string = "placeholder";
        // render with empty tag array
        render(<TagCustomDisplay tags={[]} addTag={mockAddTag} removeTag={mockRemoveTag} placeholder={placeholder} />);

        // use async because of zod?
        await act(async () => {
            // type in NewTag
            const input = screen.getByPlaceholderText(placeholder);
            fireEvent.change(input, { target: { value: "NewTag" } });

            // get form via test-id
            const form = screen.getByTestId("customTagForm"); 

            fireEvent.submit(form);
        });

        // addTag should be called with correct parameter
        expect(mockAddTag).toHaveBeenCalledWith("NewTag");  
    });

    it("Zod validation error when input given is invalid", async () => {
        // error message
        const tooShortError: string = "That tag is too short"
        // zod validation stating minimum is 3 characters
        const inputValidation = z.string().min(3, { message: tooShortError});
        // render with given zod validation
        render(
          <TagCustomDisplay
            tags={[]}
            addTag={mockAddTag}
            removeTag={mockRemoveTag}
            inputValidation={inputValidation}
          />
        );

        // use async because of zod?
        await act(async () => {
            // type in invalid string '12'
            const input = screen.getByPlaceholderText("Add new");
            fireEvent.change(input, { target: { value: "12" } });

            // get form via test-id and submit
            const form = screen.getByTestId("customTagForm"); 
            fireEvent.submit(form);
        });

        // expect screen to contain the error message as it should be displayed
        expect(await screen.findByText(tooShortError)).toBeInTheDocument();
      });
});
