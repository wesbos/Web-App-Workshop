## Modules

ES6 Brought JavaScript modules to the language.

Modules allow us to share code between files in a project, this has a number of benefits over previous script tags:

* No relying on global scope
* Sharing code between projects is easier
* Standard system for sharing code with open source project
* Allow us to build tooling and libraries that are focused
* Easy dependency management

Let's say we have a function called `calculateBill`, this might live inside a file called `calculateBill.js`.

Then we have another file called `app.js` which listens for clicks on buttons.

Out code would look like this:

calculateBill.js
```js
  function calculateBill(total, tip, tax) {
    return total + (total * tip) + (total * tax);
  }

  export default calculateBill;
```

By `export`ing the function from `calculateBill.js`, it allows us to now `import` and access that function in any other files that we need.

Our app.js file would look like this:

```js
import calculateBill from './calculateBill';

const button = document.querySelector('button');

button.addEventListener('click', () => {
  const total = calculateBill(100, 0.20, 0.13);
  // do something with the total
});
```

Now there are a few things about modules that we need to understand, lets go through them now.

## Scope
Scope - or where your code is available - is an important thing here.

When creating an app with modules, there is no concept of global scope. In our above example, there is no way that `app.js` can use `calculateBill()` unless we explicitly export it from calculateBill.js (surface it)  and then import it (grab it).

Each file is a module, and a module has it's own scope. Any functions or variables created in that file are scoped to the module (or a lower level block/function) and can be freely used inside that module, but once you need to share _anything_ with another file - variables, objects, arrays, functions, classes, strings, numbers - you must export it from that file and import it into where you need it.

## Easy to remove unused code

Modules are great because instead of coding a behemoth scripts.js, we can code small modules that do one thing.

One huge benefit to using modules is that if you aren't using a function - like calculateBill.js - you can just stop importing it to that file. If no files are left importing that function, your bundler will simply exclude that file from the final bundle.js file thus making your application smaller!

## Dependencies

Another huge benefit to modules is that dependencies are only imported into the file where they are needed.

Previously you may have coded a website that does this:

```html
<script src="jquery.js"></script>
<script src="someSlider.js"></script>
<script src="someData.js"></script>
<script src="app.js"></script>
```

The code in `app.js` assumes that jquery, slider and data have been loaded onto the page and then just go ahead and use those functions.

With Modules, you only import the code you need into that file. For example, let's take this code again:

```js
import calculateBill from './calculateBill';

const button = document.querySelector('button');

button.addEventListener('click', () => {
  const total = calculateBill(100, 0.20, 0.13);
  // do something with the total
});
```

What if calculateBill needed a function called `formatMoney()` to take the final amount and format it in dollars and cents?

Well, we don't need to import `formatMoney` into app.js because we don't need it there, we import it _where we need it_:


calculateBill.js
```js
  import formatMoney from './formatMoney';

  function calculateBill(total, tip, tax) {
    const dollars = total + (total * tip) + (total * tax);
    return formatMoney(dollars);
  }

  export default calculateBill;
```

This is called the dependency tree - you dependencies can have dependencies and they can have dependencies and they can have dependencies and they can have dependencies and they can have dependencies and they can have dependencies and they can have dependencies and they can have dependencies and they can have dependencies and they can have dependencies and they can have dependencies and they can have dependencies and they can have dependencies and they can have dependencies and they can have dependencies and they can have dependencies and they can have dependencies and they can have dependencies and they can have dependencies and they can have dependencies and they can have dependencies and they can have dependencies and they can have dependencies and they can have dependencies and they can have dependencies and they can have dependencies and they can have dependencies and they can have dependencies and they can have dependencies and they can have dependencies and they can have dependencies and they can have dependencies and they can have dependencies and they can have dependencies and they can have dependencies and they can have dependencies and they can have dependencies and they can have dependencies and they can have dependencies and they can have dependencies and they can have dependencies and they can have dependencies and they can have dependencies and they can have dependencies and they can have dependencies and they can have dependencies and they can have dependencies and they.

## Open Source Ecosystem

Many (most? all?) of the open source modules we use are published to npm which will allow us to install and import them into our project.

We simply `npm install lodash`

and then import them into the project.

```js
import _ from 'lodash';
```

## Pick and Choose

Many open source authors publish their modules in a way where you can just import the pieces you need, leaving the rest behind.

`npm i lodash.unique`

then

```js
import unique from 'lodash.unique';
```

Some tooling will also scrub unused parts of a module from your final bundle - this is referred to as tree-shaking or dead code elimination.

## Default Imports & Exports

There are two ways to import/export functions in modules - default and named.

Everything we have seen so far is default.

Default exports are used to export the main functionality of a file.

A benefit to default exports is that they can be imported without knowing the name of the thing you are importing.

humans.js
```js
  const people = ['wes', 'kait', 'lux', 'people'];
  export default people;
```

app.js
```js
  import folks from './humans';
  // or
  import people from './humans';
  // or
  import iCanNameThisWhateverIWant from './humans';
```

This is different than named exports/imports - more in a second.

You typically export default at the end of a file - like above - or during the function/class definition.

```js
export default async function go() { ... }
export default class Header extends React.Component { ... }
```

## Named Imports & Exports

Now - modules often will export multiple items from themselves, but default imports/exports only allow for one.

This is where named exports/imports come in. You can export as many things you want:

```js
export const age = 100;
export const name = 'wes';
export function sayHello() {
  console.log('Hello');
}
```

You simply tack a `export` infront of most expressions.

We also have the option of exporting multiple items at the bottom of the file:

wes.js
```js
const age = 100;
const name = 'wes';
function sayHello() {
  console.log('Hello');
}
export{ age, name, sayHello };
```

Now to import these, **you must know the name of them** - that is why they are called named exports.

app.js
```js
import { name, sayHello } from './wes';
```

You'll notice in all the examples we leave the `.js`  off - this is assumed.

You can also rename them as you import them to avoid potential naming conflicts

app.js
```js
import { name as firstName, sayHello } from './wes';
```

## Tooling
Now, one sunny day in the future we will be able to use these modules directly in the browser. Until then, we need to use tooling to compile them into one (or many) bundle.js files.

There are many tools that do this - WebPack, Browserify, rollup, Parcel to name a few. Many React, Vue or Angular frameworks also handle this for complexity for you.

WebPack has pushed this space forward in recent years, but is incredibly complicated to get setup. A relatively new bundler called Parcel has greatly simplified this tooling — that is what we will be using today.


## Code Along: Let's open the `photobooth`  folder and:

1. npm install
1. Open package.json to see the dependencies
1. create an app.js
1. create a `sayHi.js` file in the `src` folder
1. write a function in sayHi and import it into app.js
1. To start the app, we run `npm start`
