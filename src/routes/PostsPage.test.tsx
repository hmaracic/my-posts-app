import React from "react";
import { render, screen } from "@testing-library/react";
import { PostsPage } from "./PostsPage";
import { getPostsWithAuthorAndComments } from "../data/data";
import PostModel from "../model/PostModel";
import { BrowserRouter } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";

describe("PostsPage", () => {
  let posts: PostModel[];

  beforeEach(async () => {
    posts = await getPostsWithAuthorAndComments();
  });

  test("renders no post containers when there are none", () => {
    const result = render(
      <HelmetProvider>
        <BrowserRouter>
          <PostsPage posts={[]} searchTerm={""} />
        </BrowserRouter>
      </HelmetProvider>
    );
    const postContainers = result.container.querySelectorAll(
      ".post-comments-ctr"
    );

    expect(postContainers).toBeTruthy();
    expect(postContainers.length).toBe(0);
  });

  test("renders 2 post containers for 2 posts in input", () => {
    const result = render(
      <HelmetProvider>
        <BrowserRouter>
          <PostsPage posts={posts} searchTerm={""} />
        </BrowserRouter>
      </HelmetProvider>
    );
    const postContainers = result.container.querySelectorAll(
      ".post-comments-ctr"
    );

    expect(postContainers).toBeTruthy();
    expect(postContainers.length).toBe(2);
  });

  test("renders 1 post from author containing search term", () => {
    const result = render(
      <HelmetProvider>
        <BrowserRouter>
          <PostsPage posts={posts} searchTerm={"grahaM"} />
        </BrowserRouter>
      </HelmetProvider>
    );
    const postContainers = result.container.querySelectorAll(
      ".post-comments-ctr"
    );

    expect(postContainers).toBeTruthy();
    expect(postContainers.length).toBe(1);
    const bodyElement = screen.getByText(/qui est esse/i);
    expect(bodyElement).toBeInTheDocument();
    expect(postContainers.item(0)).toContainElement(bodyElement);
  });
});
