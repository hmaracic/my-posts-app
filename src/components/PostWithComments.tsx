import React, { memo } from "react";
import CommentModel from "../model/CommentModel";
import PostModel from "../model/PostModel";
import withLogging from "../utils/withLogging";
import Comment from "./Comment";
import Post from "./Post";
import "./PostWithComments.css";

export interface PostWithCommentsProps extends React.HTMLProps<HTMLDivElement> {
  post: PostModel;
}

interface CommentsContainerProps extends React.HTMLProps<HTMLDivElement> {
  comments: Array<CommentModel>;
}

// memoized to prevent re-rendering if no input props change on the parent
const CommentsContainer = memo(
  ({ comments, ...props }: CommentsContainerProps): React.ReactElement => (
    <div className="comments-container" {...props}>
      {comments.map((comment) => (
        <Comment key={comment.id} comment={comment} />
      ))}
    </div>
  )
);

/**
 * Composite component which displays a post and all its comments
 */
const PostWithComments: React.FC<PostWithCommentsProps> = ({
  post,
  ...props
}): React.ReactElement => (
  <div className="post-comments-ctr" {...props}>
    <Post post={post} />
    {(post.comments && <CommentsContainer comments={post.comments} />) ?? ""}
  </div>
);

export default withLogging(PostWithComments, "PostWithComments");
