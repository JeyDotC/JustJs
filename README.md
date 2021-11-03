# JustJS

> - Mom, I want React
> - We have React at Home
>
> The React at home...

JustJS is this small experiment intended to create the smallest and simplest possible library that mimics a few functionalities from React, but without all the compiling, bundling, webpacking and other crazy stuff required to use it. Just plain old JavaScript.

# Sample Usage

Let's create the classic counter app:

```javascript
import { state, div, strong, button } from "justjs/index.js";

function Counter(){

    const [getCount, setCount, subscribeToCount] = state(0);

    const handleButtonClick = () => setCount(getCount() + 1);

    return div({},
        "The count Is: ",
        strong({}, subscribeToCount),
        div({},
            button({
                onClick: handleButtonClick
            }, "Click here to add.")
        )
    )
}

document.body.appendChild(Counter());
```

# Basic Concepts

Most HTML-based UIs follow this cycle: `1: Render UI` -> `2: Respond to user input` -> `3: Update State` -> `4: Update UI` -> `5: Back to step 2`.

The difference between one framework or the other usually lies in how they handle each step, but in essence, they all do more or less the same.

Let's see how we do that in our sample counter App:

## 1: Render UI

JustJs adds a set of functions that serve as a way to render the UI. These are rather simple, they just create a new Element instance. Though, they have several extra capabilities we'll see later on.

The basic way to create an HTML element is this:

```javascript
import { el, div } from "justjs/index.js";

const divElement = div();

// Or

const divElement = el("div");
```

The above code will create and return a simple HTMLDivElement instance which you can insert in your DOM.

The JustJs has the `el` function that allows to create any type of element, just send the element's tag name as the first parameter. All other HTML elements exist as functions on their own, but they have nothing special, they just call `el` providing a specific tag name.

The signature of el is this:

```javascript
function el(tagName, attributes, child1, child2, ...){...}

// And for each HTML element e.g. <div>:
function div(attributes, child1, child2, ...){...}
```

So, the first thing we do in our counter is to render the initial UI:

```javascript
// Import the elements we'll need:
import { div, strong, button } from "justjs/index.js";

function Counter(){

    return div({},
        "The count Is: ",
        strong({}),
        div({},
            button({}, "Click here to add.")
        )
    )
}

// Insert our Counter app into the DOM
document.body.appendChild(Counter());
```

## 2: Respond to user Input

The typical way to respond to user input is by listening to events. The `el` function, thus all the element functions, treat all attributes starting with `on` as event listeners. So, whenever we send an `on<event-name>` attribute, we're telling `el` to add an event listener for `<event-name>`. 

In our counter app, we want to listen to the button's click, so, this is what we do:

```javascript
// Import the elements we'll need:
import { div, strong, button } from "justjs/index.js";

function Counter(){

    // Let's create a handler as we usually do on React by convention:
    const handleButtonClick = () => console.log("I got clicked");

    return div({},
        "The count Is: ",
        strong({}),
        div({},
            button({
                // Let's register the event handler.
                onClick: handleButtonClick
            }, "Click here to add.")
        )
    )
}

// Insert our Counter app into the DOM
document.body.appendChild(Counter());
```