## Starting our Photobooth Application

Now that we know about modules, let's start building out out application.

## Organization

There are many schools of though on code organization and it will ultimately boil down to you and your team's preferences. Here is one way to scaffold an application.

```
app.js
src/
lib/
node_modules/
components/
```

**app.js:** With application, you typically have an entry point in your root folder called `index.js`, `app.js`, or `scripts.js`.

**src/** : We are going to have a `src/` folder, inside of that will contain most of the functionality of your application.

**node_modules/** : will contain any installed dependencies

**lib/**: will contain any helper or libary code that isn't in an external package

**components/**: This is often more react or componentized specific, but this folder will include the scripts that make display components.


Larger src folders might have nested folders where each folder has an index.js file that imports/exports everything from that folder. This allows to you simply `import { takePhoto} from './photo'` instead of `import { takePhoto} from './photo/takePhoto'`

```
src/
  photo/
    index.js
    takePhoto.js
    loadPhoto.js
  video/
    index.js
    loadVideo.js
    filters.js
```

Our application is small, so we only will have a `src/` folder.

