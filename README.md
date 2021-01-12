# My Posts App

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).
It supports two routes, `/posts` and `/post/:id` where `:id` is a number between 1 and 100.

## Running | Building | Deploying | Testing

The project comes pre-built. The deployment files are in the `build` folder.\
The easies way to run the app in a Node.js environment is to use [serve](https://www.npmjs.com/package/serve).\
Run `npx serve -s build` in the project root. This will serve files from the `build` folder,\
rewriting all requests to non-existent resources, allowing for HTML5 pushState-based client-side routing.

To see how to run the app interactively, rebuild it or deploy in another way, please check out the following:

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.\
You will also see any lint errors in the console.

### `npm test` | `npm test -- --coverage`

`npm test` launches the test runner in the interactive watch mode.\
`npm test -- --coverage` launches the test runner in the interactive watch mode with coverage display.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `npm run build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
The app is ready to be deployed.

The easiest way to server it in a Node.js environment is by using [serve](https://www.npmjs.com/package/serve).\
After running `npm run build` in the project root, run `npx serve -s build` in the same folder.\
This will serve files from the `build` folder, rewriting all requests to non-existent
resources, allowing for HTML5 pushState-based client-side routing.

For details on possible methods of deployment, please see the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.
