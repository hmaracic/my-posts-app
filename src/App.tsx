import React from "react";
import { HelmetProvider } from "react-helmet-async";
import {
  BrowserRouter,
  Switch,
  Route,
  Redirect,
  RouteProps,
  RouteComponentProps,
} from "react-router-dom";
import PostModel from "./model/PostModel";
import PostPage from "./routes/PostPage";
import PostsPage from "./routes/PostsPage";
import SearchContainer from "./components/search/SearchContainer";
import {
  getPostsWithAuthorAndComments,
  getPostWithAuthorAndComments,
} from "./data/data";
import { isNumeric } from "./utils/utils";
import WithData from "./data/WithData";
import { LoggingProvider } from "./utils/withLogging";

interface PostRouteComponentProps extends RouteProps {
  render: (props: RouteComponentProps<{ postId: string }>) => React.ReactNode;
}

interface FetchSuccess<DataType> {
  type: "success";
  data: DataType;
}

interface FetchError {
  type: "error";
  error: string;
}

type FetchResponse<DataType> = FetchSuccess<DataType> | FetchError;

const withLoadingAndErrorMsg = <DataType extends unknown>(
  data: FetchResponse<DataType> | null,
  transformer: (val: DataType) => React.ReactNode | React.ReactNode[]
): React.ReactNode | React.ReactNode[] =>
  (data &&
    (data.type === "error"
      ? data.error
      : data.data && transformer(data.data))) ??
  "Loading...";

function App(): React.ReactElement {
  return (
    <LoggingProvider propsMessage="Hello from">
      <BrowserRouter>
        <SearchContainer>
          <HelmetProvider>
            <div className="App">
              <Switch>
                <Route
                  path="/posts"
                  render={(_): React.ReactNode => (
                    <WithData<FetchResponse<Array<PostModel>>>
                      dataId={undefined}
                      dataFunction={(provideData): void => {
                        getPostsWithAuthorAndComments().then(
                          (posts) =>
                            provideData({ type: "success", data: posts }),
                          (_) =>
                            provideData({
                              type: "error",
                              error: "Error retrieving posts",
                            })
                        );
                      }}
                    >
                      {(data): React.ReactNode => {
                        return withLoadingAndErrorMsg(data, (posts) => (
                          <PostsPage posts={posts} />
                        ));
                      }}
                    </WithData>
                  )}
                />
                <Route<PostRouteComponentProps>
                  path="/post/:postId"
                  render={({
                    match: {
                      params: { postId },
                    },
                  }): React.ReactNode => (
                    <WithData<FetchResponse<PostModel>, string>
                      dataId={postId}
                      dataFunction={(provideData, dataIdString): void => {
                        if (!isNumeric(dataIdString)) {
                          provideData({
                            type: "error",
                            error: "Invalid post number",
                          });
                          return;
                        }
                        const postId = parseInt(dataIdString);
                        getPostWithAuthorAndComments(postId).then(
                          (post) =>
                            provideData({ type: "success", data: post }),
                          (_) =>
                            provideData({
                              type: "error",
                              error: "Error retrieving the requested post",
                            })
                        );
                      }}
                    >
                      {(data): React.ReactNode => {
                        return withLoadingAndErrorMsg(data, (post) => (
                          <PostPage post={post} />
                        ));
                      }}
                    </WithData>
                  )}
                />
                <Route>
                  <Redirect to="/posts" />
                </Route>
              </Switch>
            </div>
          </HelmetProvider>
        </SearchContainer>
      </BrowserRouter>
    </LoggingProvider>
  );
}

export default App;
