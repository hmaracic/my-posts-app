import React from "react";
import { Helmet } from "react-helmet-async";
import PostModel from "../model/PostModel";
import PostWithComments from "../components/PostWithComments";
import withLogging from "../utils/withLogging";

interface PostPageProps extends React.HTMLProps<HTMLDivElement> {
  post: PostModel;
}

/**
 * The page for the single-post route.
 */
const PostPage = ({
  post,
  ...props
}: PostPageProps): React.ReactElement | null => (
  <div className="post-page" {...props}>
    <Helmet>
      <title>
        {`${post.title
          .split(" ")
          .map((word) =>
            word.length > 1
              ? word[0].toUpperCase() + word.substr(1)
              : word.length === 0
              ? word
              : word.toUpperCase()
          )
          .join(" ")} - ${post.user?.name ?? ""} - My Posts`}
      </title>
      <meta name="description" content="List of all posts with comments" />
    </Helmet>
    <PostWithComments post={post} />
  </div>
);

export default withLogging(PostPage, "PostPage");
