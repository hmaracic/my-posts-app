import React from "react";
import PostModel from "../model/PostModel";
import withLogging from "../utils/withLogging";
import "./Post.css";

interface PostProps extends React.HTMLProps<HTMLDivElement> {
  post: PostModel;
}

/**
 * Post display component. Besides the post model takes in all div props and applies them to the root 
 * `div` of the component.
 */
const Post = ({ post, ...props }: PostProps): JSX.Element => (
  <div className="post" {...props}>
    <div className="title">
      <span className="label">Title:</span>
      {post.title}
    </div>
    <div className="name">
      <span className="label">Name:</span>
      {post.user?.name}
    </div>
    <div className="body">
      <span className="label">Body:</span>
      {post.body}
    </div>
  </div>
);

export default withLogging(Post, "Post");
