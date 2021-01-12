import React from "react";
import CommentModel from "../model/CommentModel";
import withLogging from "../utils/withLogging";
import "./Comment.css";

interface CommentProps extends React.HTMLProps<HTMLDivElement> {
  comment: CommentModel;
}

/**
 * Comment display component. Besides the comment model takes in all div props and applies them to the root 
 * `div` of the component.
 */
const Comment = ({ comment, ...props }: CommentProps): JSX.Element => (
  <div className="comment" {...props}>
    <div className="name">
      <span className="label">Name:</span>
      {comment.name}
    </div>
    <div className="email">
      <span className="label">Email:</span>
      {comment.email}
    </div>
    <div className="body">
      <span className="label">Body:</span>
      {comment.body}
    </div>
  </div>
);

export default withLogging(Comment, "Comment");
