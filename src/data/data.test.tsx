import React from "react";
import {
  getPostsWithAuthorAndComments,
  getPostWithAuthorAndComments,
} from "./data";
import {
  post1Comments,
  post2,
  post2Comments,
  posts,
  user1,
  user2,
  users,
} from "./data.test/mockApiResponses";

describe("getPostsWithAuthorAndComments", () => {
  test("rejects for empty JSON responses to all", () => {
    global.fetch = (jest.fn(() =>
      Promise.resolve({
        text: () => {
          return Promise.resolve("{}");
        },
      })
    ) as unknown) as typeof fetch;
    expect.assertions(2);
    const result = getPostsWithAuthorAndComments();
    expect(global.fetch).toBeCalledTimes(3);
    return expect(result).rejects.toBeInstanceOf(Error);
  });

  test("rejects for empty responses to all", () => {
    global.fetch = (jest.fn(() =>
      Promise.resolve({
        text: () => Promise.resolve(""),
      })
    ) as unknown) as typeof fetch;

    expect.assertions(2);
    const result = getPostsWithAuthorAndComments();
    expect(global.fetch).toBeCalledTimes(3);
    return expect(result).rejects.toBeInstanceOf(Error);
  });

  test("rejects for fetch errors", () => {
    const fetchError = Error("Some fetch error");
    global.fetch = (jest.fn(() =>
      Promise.reject(fetchError)
    ) as unknown) as typeof fetch;

    expect.assertions(1);
    return expect(getPostsWithAuthorAndComments()).rejects.toEqual(fetchError);
  });

  test("rejects for empty JSON responses to comments", () => {
    global.fetch = (jest.fn((req) =>
      Promise.resolve({
        text: () => {
          if (typeof req !== "string") return Promise.reject();
          if (req.endsWith("/posts")) {
            return Promise.resolve(posts);
          } else if (req.endsWith("/users")) {
            return Promise.resolve(users);
          }
          return Promise.resolve("{}");
        },
      })
    ) as unknown) as typeof fetch;

    expect.assertions(1);
    return expect(getPostsWithAuthorAndComments()).rejects.toEqual(
      Error("Expected comments endpoint to return an array")
    );
  });

  test("resolves for no comments", () => {
    global.fetch = (jest.fn((req) =>
      Promise.resolve({
        text: () => {
          if (typeof req !== "string") return Promise.reject();
          if (req.endsWith("/posts")) {
            return Promise.resolve(posts);
          } else if (req.endsWith("/users")) {
            return Promise.resolve(users);
          } else if ("/comments") {
            return Promise.resolve("[]");
          }
          return Promise.resolve("{}");
        },
      })
    ) as unknown) as typeof fetch;

    expect.assertions(1);
    return expect(getPostsWithAuthorAndComments()).resolves.toEqual([
      {
        body:
          "quia et suscipitsuscipit recusandae consequuntur expedita et cumreprehenderit molestiae ut ut quas totamnostrum rerum est autem sunt rem eveniet architecto",
        comments: [],
        id: 1,
        title:
          "sunt aut facere repellat provident occaecati excepturi optio reprehenderit",
        user: { id: 2, name: "Ervin Howell" },
      },
      {
        body:
          "est rerum tempore vitaesequi sint nihil reprehenderit dolor beatae ea dolores nequefugiat blanditiis voluptate porro vel nihil molestiae ut reiciendisqui aperiam non debitis possimus qui neque nisi nulla",
        comments: [],
        id: 2,
        title: "qui est esse",
        user: { id: 1, name: "Leanne Graham" },
      },
    ]);
  });

  test("resolves for comments", () => {
    global.fetch = (jest.fn((req) =>
      Promise.resolve({
        text: () => {
          if (typeof req !== "string") return Promise.reject();
          if (req.endsWith("/posts")) {
            return Promise.resolve(posts);
          } else if (req.endsWith("/users")) {
            return Promise.resolve(users);
          } else if (req.endsWith("/comments")) {
            let p1Comments = JSON.parse(post1Comments);
            let p2Comments = JSON.parse(post2Comments);
            return Promise.resolve(
              JSON.stringify((p1Comments as []).concat(p2Comments))
            );
          }
          return Promise.resolve("{}");
        },
      })
    ) as unknown) as typeof fetch;

    expect.assertions(1);
    return expect(getPostsWithAuthorAndComments()).resolves.toEqual([
      {
        body:
          "quia et suscipitsuscipit recusandae consequuntur expedita et cumreprehenderit molestiae ut ut quas totamnostrum rerum est autem sunt rem eveniet architecto",
        comments: [
          {
            id: 3,
            name: "odio adipisci rerum aut animi",
            email: "Nikita@garfield.biz",
            body:
              "quia molestiae reprehenderit quasi aspernatur\naut expedita occaecati aliquam eveniet laudantium\nomnis quibusdam delectus saepe quia accusamus maiores nam est\ncum et ducimus et vero voluptates excepturi deleniti ratione",
          },
          {
            id: 4,
            name: "alias odio sit",
            email: "Lew@alysha.tv",
            body:
              "non et atque\noccaecati deserunt quas accusantium unde odit nobis qui voluptatem\nquia voluptas consequuntur itaque dolor\net qui rerum deleniti ut occaecati",
          },
        ],
        id: 1,
        title:
          "sunt aut facere repellat provident occaecati excepturi optio reprehenderit",
        user: { id: 2, name: "Ervin Howell" },
      },
      {
        body:
          "est rerum tempore vitaesequi sint nihil reprehenderit dolor beatae ea dolores nequefugiat blanditiis voluptate porro vel nihil molestiae ut reiciendisqui aperiam non debitis possimus qui neque nisi nulla",
        comments: [
          {
            id: 9,
            name: "provident id voluptas",
            email: "Meghan_Littel@rene.us",
            body:
              "sapiente assumenda molestiae atque\nadipisci laborum distinctio aperiam et ab ut omnis\net occaecati aspernatur odit sit rem expedita\nquas enim ipsam minus",
          },
          {
            id: 10,
            name: "eaque et deleniti atque tenetur ut quo ut",
            email: "Carmen_Keeling@caroline.name",
            body:
              "voluptate iusto quis nobis reprehenderit ipsum amet nulla\nquia quas dolores velit et non\naut quia necessitatibus\nnostrum quaerat nulla et accusamus nisi facilis",
          },
        ],
        id: 2,
        title: "qui est esse",
        user: { id: 1, name: "Leanne Graham" },
      },
    ]);
  });

  test("reject for comments not conforming to API model", () => {
    global.fetch = (jest.fn((req) =>
      Promise.resolve({
        text: () => {
          if (typeof req !== "string") return Promise.reject();
          if (req.endsWith("/posts")) {
            return Promise.resolve(posts);
          } else if (req.endsWith("/users")) {
            return Promise.resolve(users);
          } else if (req.endsWith("/comments")) {
            let p1Comments = JSON.parse(post1Comments);
            let p2Comments = JSON.parse(`[{
                "postId": 2,
                "id": 9,
                "name": "provident id voluptas",
                "email": "Meghan_Littel@rene.us",
                "body": "sapiente assumenda molestiae atque\\nadipisci laborum distinctio aperiam et ab ut omnis\\net occaecati aspernatur odit sit rem expedita\\nquas enim ipsam minus"
              },
              {
                "postId": 2,
                "id": 10,
                "email": "Carmen_Keeling@caroline.name",
                "body": "voluptate iusto quis nobis reprehenderit ipsum amet nulla\\nquia quas dolores velit et non\\naut quia necessitatibus\\nnostrum quaerat nulla et accusamus nisi facilis"
              }]`);
            return Promise.resolve(
              JSON.stringify((p1Comments as []).concat(p2Comments))
            );
          }
          return Promise.resolve("{}");
        },
      })
    ) as unknown) as typeof fetch;

    expect.assertions(1);
    return expect(getPostsWithAuthorAndComments()).rejects.toEqual(
      Error("Unexpected data received from comment endpoint")
    );
  });

  test("rejects when user can not be found", () => {
    global.fetch = (jest.fn((req) =>
      Promise.resolve({
        text: () => {
          if (typeof req !== "string") return Promise.reject();
          if (req.endsWith("/posts")) {
            return Promise.resolve(posts);
          } else if (req.endsWith("/users")) {
            return Promise.resolve(JSON.stringify([JSON.parse(user2)]));
          } else if ("/comments") {
            return Promise.resolve("[]");
          }
          return Promise.resolve("{}");
        },
      })
    ) as unknown) as typeof fetch;

    expect.assertions(1);
    return expect(getPostsWithAuthorAndComments()).rejects.toEqual(
      Error("Couldn't retrieve user for post")
    );
  });

  test("rejects for non-JSON users response", () => {
    global.fetch = (jest.fn((req) =>
      Promise.resolve({
        text: () => {
          if (typeof req !== "string") return Promise.reject();
          if (req.endsWith("/posts")) {
            return Promise.resolve(posts);
          } else if (req.endsWith("/users")) {
            return Promise.resolve(`non-json`);
          } else if ("/comments") {
            return Promise.resolve("[]");
          }
          return Promise.resolve("{}");
        },
      })
    ) as unknown) as typeof fetch;

    expect.assertions(1);
    return expect(getPostsWithAuthorAndComments()).rejects.toEqual(
      Error("Unexpected data received from users endpoint")
    );
  });

  test("rejects for non-array users response", () => {
    global.fetch = (jest.fn((req) =>
      Promise.resolve({
        text: () => {
          if (typeof req !== "string") return Promise.reject();
          if (req.endsWith("/posts")) {
            return Promise.resolve(posts);
          } else if (req.endsWith("/users")) {
            return Promise.resolve(`{}`);
          } else if ("/comments") {
            return Promise.resolve("[]");
          }
          return Promise.resolve("{}");
        },
      })
    ) as unknown) as typeof fetch;

    expect.assertions(1);
    return expect(getPostsWithAuthorAndComments()).rejects.toEqual(
      Error("Expected users endpoint to return an array")
    );
  });

  test("rejects when user does not conform to api model", () => {
    global.fetch = (jest.fn((req) =>
      Promise.resolve({
        text: () => {
          if (typeof req !== "string") return Promise.reject();
          if (req.endsWith("/posts")) {
            return Promise.resolve(posts);
          } else if (req.endsWith("/users")) {
            return Promise.resolve(`[
                {
                  "id": 1,
                  "name": 4,
                  "username": "Bret",
                  "email": "Sincere@april.biz",
                  "address": {
                    "street": "Kulas Light",
                    "suite": "Apt. 556",
                    "city": "Gwenborough",
                    "zipcode": "92998-3874",
                    "geo": {
                      "lat": "-37.3159",
                      "lng": "81.1496"
                    }
                  },
                  "phone": "1-770-736-8031 x56442",
                  "website": "hildegard.org",
                  "company": {
                    "name": "Romaguera-Crona",
                    "catchPhrase": "Multi-layered client-server neural-net",
                    "bs": "harness real-time e-markets"
                  }
                }]`);
          } else if ("/comments") {
            return Promise.resolve("[]");
          }
          return Promise.resolve("{}");
        },
      })
    ) as unknown) as typeof fetch;

    expect.assertions(1);
    return expect(getPostsWithAuthorAndComments()).rejects.toEqual(
      Error("Unexpected data received from users endpoint")
    );
  });
});

describe("getPostWithAuthorAndComments", () => {
  test("rejects for empty JSON responses to all", () => {
    global.fetch = (jest.fn(() =>
      Promise.resolve({
        text: () => {
          return Promise.resolve("{}");
        },
      })
    ) as unknown) as typeof fetch;
    expect.assertions(1);
    return expect(getPostWithAuthorAndComments(2)).rejects.toEqual(
      Error("Unexpected data received from post endpoint")
    );
  });

  test("rejects for empty responses to all", () => {
    global.fetch = (jest.fn(() =>
      Promise.resolve({
        text: () => Promise.resolve(""),
      })
    ) as unknown) as typeof fetch;

    expect.assertions(1);
    return expect(getPostWithAuthorAndComments(2)).rejects.toEqual(
      Error("Unexpected data received from post endpoint")
    );
  });

  test("rejects for fetch errors", () => {
    const fetchError = Error("Some fetch error");
    global.fetch = (jest.fn(() =>
      Promise.reject(fetchError)
    ) as unknown) as typeof fetch;

    expect.assertions(1);
    return expect(getPostWithAuthorAndComments(2)).rejects.toEqual(fetchError);
  });

  test("rejects for empty JSON responses to comments", () => {
    global.fetch = (jest.fn((req) =>
      Promise.resolve({
        text: () => {
          if (typeof req !== "string") return Promise.reject();
          if (req.endsWith("/posts/2")) {
            return Promise.resolve(post2);
          } else if (req.endsWith("/users/1")) {
            return Promise.resolve(user1);
          }
          return Promise.resolve("{}");
        },
      })
    ) as unknown) as typeof fetch;

    expect.assertions(1);
    return expect(getPostWithAuthorAndComments(2)).rejects.toEqual(
      Error("Expected comments endpoint to return an array")
    );
  });

  test("resolves for proper inputs", () => {
    global.fetch = (jest.fn((req) =>
      Promise.resolve({
        text: () => {
          if (typeof req !== "string") return Promise.reject();
          if (req.endsWith("/posts/2")) {
            return Promise.resolve(post2);
          } else if (req.endsWith("/users/1")) {
            return Promise.resolve(user1);
          } else if (req.endsWith("/2/comments")) {
            return Promise.resolve(post2Comments);
          }
          return Promise.resolve("{}");
        },
      })
    ) as unknown) as typeof fetch;

    expect.assertions(1);
    return expect(getPostWithAuthorAndComments(2)).resolves.toEqual({
      id: 2,
      title: "qui est esse",
      body:
        "est rerum tempore vitaesequi sint nihil reprehenderit dolor beatae ea dolores nequefugiat blanditiis voluptate porro vel nihil molestiae ut reiciendisqui aperiam non debitis possimus qui neque nisi nulla",
      comments: [
        {
          id: 9,
          name: "provident id voluptas",
          email: "Meghan_Littel@rene.us",
          body:
            "sapiente assumenda molestiae atque\nadipisci laborum distinctio aperiam et ab ut omnis\net occaecati aspernatur odit sit rem expedita\nquas enim ipsam minus",
        },
        {
          id: 10,
          name: "eaque et deleniti atque tenetur ut quo ut",
          email: "Carmen_Keeling@caroline.name",
          body:
            "voluptate iusto quis nobis reprehenderit ipsum amet nulla\nquia quas dolores velit et non\naut quia necessitatibus\nnostrum quaerat nulla et accusamus nisi facilis",
        },
      ],
      user: {
        id: 1,
        name: "Leanne Graham",
      },
    });
  });

  test("resolves for no comments", () => {
    global.fetch = (jest.fn((req) =>
      Promise.resolve({
        text: () => {
          if (typeof req !== "string") return Promise.reject();
          if (req.endsWith("/posts/2")) {
            return Promise.resolve(post2);
          } else if (req.endsWith("/users/1")) {
            return Promise.resolve(user1);
          } else if (req.endsWith("/2/comments")) {
            return Promise.resolve("[]");
          }
          return Promise.resolve("{}");
        },
      })
    ) as unknown) as typeof fetch;

    expect.assertions(1);
    return expect(getPostWithAuthorAndComments(2)).resolves.toEqual({
      id: 2,
      title: "qui est esse",
      body:
        "est rerum tempore vitaesequi sint nihil reprehenderit dolor beatae ea dolores nequefugiat blanditiis voluptate porro vel nihil molestiae ut reiciendisqui aperiam non debitis possimus qui neque nisi nulla",
      comments: [],
      user: {
        id: 1,
        name: "Leanne Graham",
      },
    });
  });

  test("rejects for non-json response from user ep", () => {
    global.fetch = (jest.fn((req) =>
      Promise.resolve({
        text: () => {
          if (typeof req !== "string") return Promise.reject();
          if (req.endsWith("/posts/2")) {
            return Promise.resolve(post2);
          } else if (req.endsWith("/users/1")) {
            return Promise.resolve("nonjson");
          } else if (req.endsWith("/2/comments")) {
            return Promise.resolve("[]");
          }
          return Promise.resolve("{}");
        },
      })
    ) as unknown) as typeof fetch;

    expect.assertions(1);
    return expect(getPostWithAuthorAndComments(2)).rejects.toEqual(
      Error("Unexpected data received from user endpoint")
    );
  });

  test("rejects no postId is specified", () => {
    global.fetch = (jest.fn((req) =>
      Promise.resolve({
        text: () => {
          if (typeof req !== "string") return Promise.reject();
          if (req.endsWith("/posts/2")) {
            return Promise.resolve(post2);
          } else if (req.endsWith("/users/1")) {
            return Promise.resolve(user1);
          } else if (req.endsWith("/2/comments")) {
            return Promise.resolve(post2Comments);
          }
          return Promise.resolve("{}");
        },
      })
    ) as unknown) as typeof fetch;

    expect.assertions(1);
    return expect(
      getPostWithAuthorAndComments((undefined as unknown) as number)
    ).rejects.toEqual(Error("PostId must be provided"));
  });

  test("rejects when comment does not conform to api model", () => {
    global.fetch = (jest.fn((req) =>
      Promise.resolve({
        text: () => {
          if (typeof req !== "string") return Promise.reject();
          if (req.endsWith("/posts/2")) {
            return Promise.resolve(post2);
          } else if (req.endsWith("/users/1")) {
            return Promise.resolve(user1);
          } else if (req.endsWith("/2/comments")) {
            return Promise.resolve(`[{
                "postId": 2,
                "id": 9,
                "name": "provident id voluptas",
                "email": "Meghan_Littel@rene.us",
                "body": "sapiente assumenda molestiae atque\\nadipisci laborum distinctio aperiam et ab ut omnis\\net occaecati aspernatur odit sit rem expedita\\nquas enim ipsam minus"
              },
              {
                "postId": 2,
                "id": 10,
                "name": "eaque et deleniti atque tenetur ut quo ut",
                "email": 1,
                "body": "voluptate iusto quis nobis reprehenderit ipsum amet nulla\\nquia quas dolores velit et non\\naut quia necessitatibus\\nnostrum quaerat nulla et accusamus nisi facilis"
              }]`);
          }
          return Promise.resolve("{}");
        },
      })
    ) as unknown) as typeof fetch;

    expect.assertions(1);
    return expect(getPostWithAuthorAndComments(2)).rejects.toEqual(
      Error("Unexpected data received from comment endpoint")
    );
  });

  test("rejects when comment does not have postId from requested post", () => {
    global.fetch = (jest.fn((req) =>
      Promise.resolve({
        text: () => {
          if (typeof req !== "string") return Promise.reject();
          if (req.endsWith("/posts/2")) {
            return Promise.resolve(post2);
          } else if (req.endsWith("/users/1")) {
            return Promise.resolve(user1);
          } else if (req.endsWith("/2/comments")) {
            return Promise.resolve(`[{
                "postId": 2,
                "id": 9,
                "name": "provident id voluptas",
                "email": "Meghan_Littel@rene.us",
                "body": "sapiente assumenda molestiae atque\\nadipisci laborum distinctio aperiam et ab ut omnis\\net occaecati aspernatur odit sit rem expedita\\nquas enim ipsam minus"
              },
              {
                "postId": 1,
                "id": 10,
                "name": "eaque et deleniti atque tenetur ut quo ut",
                "email": "Carmen_Keeling@caroline.name",
                "body": "voluptate iusto quis nobis reprehenderit ipsum amet nulla\\nquia quas dolores velit et non\\naut quia necessitatibus\\nnostrum quaerat nulla et accusamus nisi facilis"
              }]`);
          }
          return Promise.resolve("{}");
        },
      })
    ) as unknown) as typeof fetch;

    expect.assertions(1);
    return expect(getPostWithAuthorAndComments(2)).rejects.toEqual(
      Error("Expected candidate postId to equal requested postId")
    );
  });
});
