import React from "react";
import { render, screen } from "@testing-library/react";
import Comment from "./Comment";
import CommentModel from "../model/CommentModel";

const demoComment: CommentModel = {
  id: 43,
  name: "Demo Author",
  email: "demo.author@comment.com",
  body: "This is a body of a demo test comment",
};

describe("Comment", () => {
  test("renders author name", () => {
    render(<Comment comment={demoComment} />);
    const authorNameElement = screen.getByText(/demo author/i);
    expect(authorNameElement).toBeInTheDocument();
  });

  test("renders author email", () => {
    render(<Comment comment={demoComment} />);
    const authorEmailElement = screen.getByText(/demo\.author@comment.com/i);
    expect(authorEmailElement).toBeInTheDocument();
  });

  test("renders comment body", () => {
    render(<Comment comment={demoComment} />);
    const bodyElement = screen.getByText(
      /this is a body of a demo test comment/i
    );
    expect(bodyElement).toBeInTheDocument();
  });
});
