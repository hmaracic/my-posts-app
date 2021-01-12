// jest-dom adds custom jest matchers for asserting on DOM nodes.
// allows you to do things like:
// expect(element).toHaveTextContent(/react/i)
// learn more: https://github.com/testing-library/jest-dom
import '@testing-library/jest-dom';
import { post1, post1Comments, post2, post2Comments, posts, user1, user2, users } from './data/data.test/mockApiResponses';


beforeEach(() => {
    // mock fetch to prevent live network calls, providing default data used for tests.
    // since JEST uses sandboxed globals for each test, it seems to be necessary to put 
    // this in beforeEach
    // IMPORTANT: all calls inside individual test (suites) that use fetch therefore need
    // to be in the `beforeEach` method or the test itself, otherwise they will happen 
    // before fetch is mocked and use live network requests
    global.fetch = (jest.fn((req) =>
        Promise.resolve({
            text: () => {
                if (typeof req !== "string") return Promise.reject();
                if (req.endsWith("/posts")) {
                    return Promise.resolve(posts);
                } else if (req.endsWith("/users")) {
                    return Promise.resolve(users);
                } else if (req.endsWith("/posts/1")) {
                    return Promise.resolve(post1);
                } else if (req.endsWith("/posts/2")) {
                    return Promise.resolve(post2);
                } else if (req.endsWith("/users/1")) {
                    return Promise.resolve(user1);
                } else if (req.endsWith("/users/2")) {
                    return Promise.resolve(user2);
                } else if (req.endsWith("/1/comments")) {
                    return Promise.resolve(post1Comments);
                } else if (req.endsWith("/2/comments")) {
                    return Promise.resolve(post2Comments);
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
})