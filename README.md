# [OLD] Hot Takes API
Hot Takes API is the first project I did with Node.js/Express.
It's a secured REST API, that handles requests/responses for a given front-end app (spicy sauces app).
It includes features like token handling (JsonWebToken), password hashing (Bcrypt), MongoDB database management (Mongoose), etc..

## Installation
Here are the dependancies you need to install:

NodeJS 12.14 or 14.0.
Angular CLI 7.0.2.
node-sass : make sure to use the corresponding version to NodeJS. For Noe 14.0 for instance, you need node-sass in version 4.14+.
On Windows, these installations require to use PowerShell in administrator mode.

Then, clone this repo, run npm install, and run npm install --save-dev run-script-os.

## Usage

```bash
npm start
```
This should both run the local server and launch your browser.

If your browser fails to launch, or shows a 404 error, navigate your browser to http://localhost:8080.

The app should reload automatically when you make a change to a file.

Use Ctrl+C in the terminal to stop the local server.
