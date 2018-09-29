# Static Starter

A static site boilerplate. Includes Webpack + SCSS + ES6 + Pug.

## Getting started

Clone the repository, and delete the `.git` folder. Then:

```bash
npm install

git init
git add .
git commit -m "Initial commit based on static-starter"
```

## Resulting output

For each `.pug` file in the `templates` directory Webpack will generate an `.html` file with the same name. It will respect folders as well. Files that start with an underscore, like `_example.com` will NOT generate an HTML file (useful for partial and layout templates).

Keep in mind that if you add new `.pug` files you'll need to restart Webpack for them to be generated.

### Development mode

Run `npm start` to start the Webpack Dev Server. This will serve your files on `localhost:8080` with hot reload on save.

### Production mode

Run `npm run build` to generate assets optimized for production in the `/dist` folder.
