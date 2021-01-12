import React from "react";
import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import PostModel from "../model/PostModel";
import PostWithComments from "../components/PostWithComments";
import { SearchBar } from "../components/search/SearchContainer";
import withSearch, {
  InjectedSearchProps,
} from "../components/search/withSearch";
import withLogging from "../utils/withLogging";
import "./PostsPage.css";

interface PostsPageProps
  extends React.HTMLProps<HTMLDivElement>,
    InjectedSearchProps {
  posts: PostModel[];
}

/**
 * The page for the all-posts route.
 */
export class PostsPage extends React.Component<PostsPageProps> {
  render(): React.ReactNode {
    const { posts, searchTerm, ...props } = this.props;
    const searchTermLC = searchTerm.toLowerCase();
    return (
      <div className="posts-page" {...props}>
        <Helmet>
          <title>All Posts - My Posts</title>
          <meta name="description" content="List of all posts with comments" />
        </Helmet>
        <SearchBar />

        {posts
          // keep only posts which satisfy current search term criteria
          // search term is case-insensitive
          .filter((post) =>
            searchTermLC === "" || post.user?.name == null
              ? true
              : post.user.name.toLowerCase()?.indexOf(searchTermLC) > -1
          )
          .map((post) => (
            <Link
              key={post.id}
              className={"post-link"}
              to={`../post/${post.id}`}
            >
              <PostWithComments post={post} />
            </Link>
          ))}
      </div>
    );
  }
}

export default withLogging(withSearch(PostsPage), "PostsPage");
