import {
  ApiPost,
  ApiUser,
  isApiComment,
  isApiPost,
  isApiUser,
} from "../model/ApiModels";
import CommentModel from "../model/CommentModel";
import PostModel from "../model/PostModel";
import UserModel from "../model/UserModel";

type UserModelMap = { [key: number]: UserModel };
type CommentModelMap = { [key: number]: Array<CommentModel> };

export const getPostsWithAuthorAndComments = (): Promise<Array<PostModel>> =>
  // since they're independent start all fetch requests in parallel (if interpreter supports)
  // and wait for all three results (including dependent per-fetch processing) before merging
  Promise.all([
    getUsersMap(),
    getCommentsMap(),
    fetch(`https://jsonplaceholder.typicode.com/posts`)
      .then((response) => response.text())
      .then((stringResponse) => {
        let parsedPosts;
        try {
          parsedPosts = JSON.parse(stringResponse);
        } catch (error) {
          throw new Error("Unexpected data received from posts endpoint");
        }

        if (!Array.isArray(parsedPosts) || !parsedPosts.every(isApiPost)) {
          throw new Error("Unexpected data received from posts endpoint");
        }

        const apiPosts = parsedPosts as Array<ApiPost>;
        return apiPosts;
      }),
  ]).then((usersAndCommentsAndPosts) => {
    const apiPosts = usersAndCommentsAndPosts[2];
    return apiPosts.map((apiPost) => {
      const users = usersAndCommentsAndPosts[0];
      const comments = usersAndCommentsAndPosts[1];
      const user = users[apiPost.userId];
      if (!user) {
        throw new Error("Couldn't retrieve user for post");
      }

      return {
        id: apiPost.id,
        title: apiPost.title,
        body: apiPost.body,
        comments: comments[apiPost.id] ?? [],
        user,
      };
    });
  });

export const getPostWithAuthorAndComments = (
  postId: number
): Promise<PostModel> =>
  // get only the post and its comments in parallel since we need the post
  // to find out the userId and get the user
  Promise.all([
    fetch(`https://jsonplaceholder.typicode.com/posts/${postId}`)
      .then((response) => response.text())
      .then((stringResponse) => {
        let parsedPost;
        try {
          parsedPost = JSON.parse(stringResponse);
        } catch (error) {
          throw new Error("Unexpected data received from post endpoint");
        }
        if (!isApiPost(parsedPost)) {
          throw new Error("Unexpected data received from post endpoint");
        }
        const apiPost = parsedPost as ApiPost;
        return Promise.all([apiPost, getUser(apiPost.userId)]);
      }),
    getCommentsForPost(postId),
  ]).then((postComponents) => {
    const apiPost = postComponents[0][0];
    const user = postComponents[0][1];
    const comments = postComponents[1];

    return {
      id: apiPost.id,
      title: apiPost.title,
      body: apiPost.body,
      comments,
      user,
    };
  });

/**
 * Returns users as a map of users with user id as the map key
 */
const getUsersMap = (): Promise<UserModelMap> =>
  fetch(`https://jsonplaceholder.typicode.com/users`)
    .then((response) => response.text())
    .then((stringUsers) => {
      let parseResult;
      try {
        parseResult = JSON.parse(stringUsers);
      } catch (error) {
        throw new Error("Unexpected data received from users endpoint");
      }
      if (!Array.isArray(parseResult)) {
        throw new Error("Expected users endpoint to return an array");
      }
      return (parseResult as Array<unknown>).reduce<UserModelMap>(
        (acc, potentialUser) => {
          if (!isApiUser(potentialUser)) {
            throw new Error("Unexpected data received from users endpoint");
          }
          const apiUser = potentialUser as ApiUser;
          acc[apiUser.id] = { id: apiUser.id, name: apiUser.name };
          return acc;
        },
        {}
      );
    });

const getUser = (userId: number): Promise<UserModel> =>
  fetch(`https://jsonplaceholder.typicode.com/users/${userId}`)
    .then((response) => response.text())
    .then((stringUser) => {
      let parseResult;
      try {
        parseResult = JSON.parse(stringUser);
      } catch (error) {
        new Error("Unexpected data received from user endpoint");
      }
      if (!isApiUser(parseResult)) {
        throw new Error("Unexpected data received from user endpoint");
      }
      const apiUser = parseResult as ApiUser;
      return { id: apiUser.id, name: apiUser.name };
    });

export const getCommentsForPost = (
  postId: number
): Promise<Array<CommentModel>> => {
  if (postId === undefined || postId === null) {
    return Promise.reject(new Error("PostId must be provided"));
  }
  return fetch(`https://jsonplaceholder.typicode.com/posts/${postId}/comments`)
    .then((response) => response.text())
    .then((stringResponse) => {
      let parsedComments;
      try {
        parsedComments = JSON.parse(stringResponse);
      } catch (error) {
        throw new Error("Unexpected data received from comment endpoint");
      }

      if (!Array.isArray(parsedComments)) {
        throw new Error("Expected comments endpoint to return an array");
      }

      return (parsedComments as Array<unknown>).map<CommentModel>(
        (commentCandidate) => {
          if (!isApiComment(commentCandidate)) {
            throw new Error("Unexpected data received from comment endpoint");
          }

          if (commentCandidate.postId !== postId) {
            throw new Error(
              "Expected candidate postId to equal requested postId"
            );
          }

          return {
            id: commentCandidate.id,
            name: commentCandidate.name,
            email: commentCandidate.email,
            body: commentCandidate.body,
          };
        }
      );
    });
};

/**
 * Returns comments as a map of comment arrays with parent postId as the map key
 */
const getCommentsMap = (): Promise<CommentModelMap> =>
  fetch(`https://jsonplaceholder.typicode.com/comments`)
    .then((response) => response.text())
    .then((stringComments) => {
      const parseResult = JSON.parse(stringComments);
      if (!Array.isArray(parseResult)) {
        throw new Error("Expected comments endpoint to return an array");
      }
      return (parseResult as Array<unknown>).reduce<CommentModelMap>(
        (acc, commentCandidate) => {
          if (!isApiComment(commentCandidate)) {
            throw new Error("Unexpected data received from comment endpoint");
          }

          const commentArray = acc[commentCandidate.postId] ?? [];
          commentArray.push({
            id: commentCandidate.id,
            name: commentCandidate.name,
            email: commentCandidate.email,
            body: commentCandidate.body,
          });
          acc[commentCandidate.postId] = commentArray;

          return acc;
        },
        {}
      );
    });
