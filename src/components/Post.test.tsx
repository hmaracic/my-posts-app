import React from "react";
import { render, screen } from "@testing-library/react";
import Post from "./Post";
import PostModel from "../model/PostModel";

const demoPost: PostModel = {
  id: 13,
  title: "Demo Post Title",
  body: "This is a body of a demo test post",
  comments: [],
  user: {
    id: 15,
    name: "Demo User",
  },
};

describe("Post", () => {
  test("renders user name", () => {
    render(<Post post={demoPost} />);
    const userNameElement = screen.getByText(/demo user/i);
    expect(userNameElement).toBeInTheDocument();
  });

  test("renders post title", () => {
    render(<Post post={demoPost} />);
    const postTitleElement = screen.getByText(/demo post title/i);
    expect(postTitleElement).toBeInTheDocument();
  });

  test("renders post body", () => {
    render(<Post post={demoPost} />);
    const bodyElement = screen.getByText(/this is a body of a demo test post/i);
    expect(bodyElement).toBeInTheDocument();
  });
});
