# Package Contents

These are the contents of this build:

* **justjs.js:** JustJs bundled and non-minified to use on IIFE mode.
* **justjs.min.js:** Same as above, but minified.
* **browser/** All the individual modules of JustJs to use on Browser module mode.
* **browser-min/** Same as above, but minified.

# Usage Modes

JustJs has at least two usage modes:

* The new and fancy browser module.
* The old school Immediately Invoked Function Expression (IIFE).

Both are meant to free you from depending on a build system and directly use the library as a browser script. Yet, you can still use the source code (https://github.com/JeyDotC/JustJs) as part of your webpack-ed app.

Let's explore the basic usage modes:

## Browser Module (modern, fancy, preferred?)

In order to use JustJs as browser module, all you need to do is to put the contents of the `browser/` or `browser-min/` folder publicly available in your website, preferable under a `justjs/` folder.

That way you can now import justjs from your browser module scripts:

At your HTML:

```HTML
<script type="module" src="/path/to/my-cool-module.js"></script>
```

At your script:

```javascript
// path/to/my-cool-module.js

import {state, sideEffect, div, p, h1 } from '/justjs/index.js';

```

> For more info on browser modules please, read the [MDN docs](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Modules), it's a very interesting and exciting topic.

## IIFE (old school, like, jQuery-level old school!)

> **WARNING** Even if JustJs uses the classic IIFE way of working, the library is plagued with modern JavaScript usage, so, no support for IE... at least not for now.

To use the classic Immediately Invoked Function Expression (IIFE) way to work, all you need to do is to make either `justjs.js` or `justjs.min.js` publicly available in your server, make sure to import it before your code and take the functions you need from the globally available var `justjs`.

At your HTML:

```HTML
<script src="justjs.js"></script>
<script src="my-cool-script.js"></script>
```

At your script:

```javascript
// my-cool-script.js
(function (){
    const { state, sideEffect, div, p, h1 } = justjs;

})(); 
// enclosing your script into a IIFE is not necessary, but it's always a good idea.
```

> You can check usage examples of both modes at the [examples](https://github.com/JeyDotC/JustJs/tree/master/examples) folder in JustJs source code.