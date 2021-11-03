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

Most HTML-based UIs follow this cycle: `1: Render UI` -> `2: Respond to user input` -> `3: Update State` -> `4: Update UI`  Then we go back to step **2** whenever user interacts with the UI.

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
        // Scalar values such a string, number, etc. will be converted into text nodes.
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

document.body.appendChild(Counter());
```

## 3: Update the state

The idea is simple, just update some info, but the implications around it makes it a rather delicate task, mostly because that implies mutation, and mutation, being vital for the app to live, is also an enemy of clarity in functional code. 

But there are plenty of articles and truly smart guys covering that, so, we're just going to cover how JustJs manages state.

The approach taken in this case is to have what I call a State Unit, which is nothing more than an object that holds a value and provides means to: **Get** the value, **Set** the value and **Subscribe** to value changes.

So, back to our counter app, all we need is to have a state unit for our count number:

```javascript
//Let's import the state function.
import { state, div, strong, button } from "justjs/index.js";

function Counter(){
    // Let's create a state unit for Count
    const [getCount, setCount, subscribeToCount] = state(0);

    const handleButtonClick = () => console.log("I got clicked");

    return div({},
        "The count Is: ",
        strong({}),
        div({},
            button({
                onClick: handleButtonClick
            }, "Click here to add.")
        )
    )
}

document.body.appendChild(Counter());
```

As you can see, in order to create a state unit, all we need to do is to call the `state(initialValue)` function. It receive an initial value and returns three functions in an array:

* The **Getter** which returns the latest state value.
* The **Setter** which allows to update the state value and also notifies the subscribers of a change in the state.
* The **Subscribe** which allows to provide a function (subscriber) that will be invoked whenever a change in the state happens.

Knowing that we can just use the setter to update the state, we could just change our click event listener so it does its job. We'll cover how to update the UI later in the next section.

```javascript
//Let's import the state function.
import { state, div, strong, button } from "justjs/index.js";

function Counter(){
    // Let's create a state unit for Count
    const [getCount, setCount, subscribeToCount] = state(0);

    // Let's update the state
    const handleButtonClick = () => setCount(getCount() + 1);

    return div({},
        "The count Is: ",
        strong({}),
        div({},
            button({
                onClick: handleButtonClick
            }, "Click here to add.")
        )
    )
}

document.body.appendChild(Counter());
```

## 4: Update UI

> **DEADLY IMPORTANT NOTE:** For those comming from React.
>
> JustJS is a really simple library, so, it doesn't have its fancy and complex render cycle, it just provides a means to create and update DOM in a particular, and (hopefully) functional way. DOM is manipulated directly and the functions, although looking similar to React functional components, don't run in each "render" (there's no such thing here), they run **only once**.

Before covering how UI update works in JustJS, let's first do it the **manual way**:

```javascript
import { state, div, strong, button } from "justjs/index.js";

function Counter(){
    const [getCount, setCount, subscribeToCount] = state(0);

    const handleButtonClick = () => setCount(getCount() + 1);

    // Hold an instance of the element that we'll need to update:
    const countDisplay = strong({}, getCount());

    // Subscribe to changes in the Count state:
    subscribeToCount((newValue) => countDisplay.textContent = newValue)

    return div({},
        "The count Is: ",
        // Add the element to the Div
        countDisplay,
        div({},
            button({
                onClick: handleButtonClick
            }, "Click here to add.")
        )
    )
}

document.body.appendChild(Counter());
```

With the above code, we have effectively subscribed to Count changes and, whenever a change happens, we update our `countDisplay` instance. Since that object is a DOM node, the change will become visible in the screen.

So far, so good. But dealing with DOM references seems cumbersome and breaks the expressiveness of the UI creation, so, what can we do to simplify that? Well, it happens that `el` and its folks have a solution: Just send the **subscribe** function:

```javascript
import { state, div, strong, button } from "justjs/index.js";

function Counter(){
    const [getCount, setCount, subscribeToCount] = state(0);

    const handleButtonClick = () => setCount(getCount() + 1);

    return div({},
        "The count Is: ",
        // Add the element to the Div
        strong({}, 
            // Whenever we change the count, this text node will be replaced.
            subscribeToCount
        ),
        div({},
            button({
                onClick: handleButtonClick
            }, "Click here to add.")
        )
    )
}

document.body.appendChild(Counter());
```

What's going on here? Well, it happens that, `el` will interpret any child or attribute value (except for event listeners) as a signal to subscribe itself to changes, essentially doing what we covered in the **manual way** section. For child nodes it will replace the entire child node with the given value, and for attributes it will update the value.

# The sideEffect Function

Until now, we have covered UI updates for pretty basic scenarios: Text nodes and text attributes. But what if we need to respond to state changes by rendering several elements? Or what if we need to convert the value to something else? This is where **sideEffect** function comes into play. 

The **sideEffect** function covers these scenarios:

1. State value needs to be transformed:
    * To a DOM subtree.
    * To an attribute value.
2. We need to make an update responding to multiple subscriptions/state units.

The structure of a side effect is this:

```javascript

const subscribeToMySideEffect = sideEffect(
    reducerFunction, 
    subscribeToState1,
    subscribeToState2,
    ...
)

```

What happens here is that we create a new **subscribe** function which value will be whatever the **reducerFunction** returns as a response to the other **subscribeTo** being invoked. The **reducerFunction** will receive the current state associated to each of the other **subscribeTo** as parameters.

All the above sounds confusing, but that's actually what happens. To clarify a little bit, let's look at some examples:

## 1. State value needs to be transformed

Let's take again our Counter example. Let's say we need to add a label saying if the number is odd or even, and use `<em>` for Odd and `<strong>` for Even values. One way to approach that is this:

```javascript
// Let's import our sideEffect function
import { state, sideEffect, div, strong, em, button } from "justjs/index.js";

function Counter(){
    const [getCount, setCount, subscribeToCount] = state(0);

    const handleButtonClick = () => setCount(getCount() + 1);

    // Create a new subscribe function
    const subscribeToOddEvenElement = sideEffect(
        // Which value will be what this function returns
        (count) => count % 2 === 0 ? strong({}, "Even") : em({}, "Odd"),
        // In response to this other subscribe function.
        subscribeToCount
    );

    return div({},
        "The count Is: ",
        strong({}, subscribeToCount),
        // Insert the element which will be updated whenever we call setCount.
        subscribeToOddEvenElement,
        div({},
            button({
                onClick: handleButtonClick
            }, "Click here to add.")
        )
    )
}

document.body.appendChild(Counter());
```

With the code above, you can render an element based on the current Count state and update it whenever the value changes. You could also separate the reducer function as its own component in order to make the code look clearer:

```javascript
// Let's import our sideEffect function
import { state, sideEffect, div, strong, em, button } from "justjs/index.js";

// Let's separate the odd/even tag in its own component:
function OddEvenTag({ count }){
    return count % 2 === 0 ? strong({}, "Even") : em({}, "Odd");
}

function Counter(){
    const [getCount, setCount, subscribeToCount] = state(0);

    const handleButtonClick = () => setCount(getCount() + 1);

    // Create a new subscribe function
    const subscribeToOddEvenElement = sideEffect(
        // Which value will be what this function returns
        (count) => OddEvenTag({ count }),
        // In response to this other subscribe function.
        subscribeToCount
    );

    return div({},
        "The count Is: ",
        strong({}, subscribeToCount),
        // Insert the element which will be updated whenever we call setCount.
        subscribeToOddEvenElement,
        div({},
            button({
                onClick: handleButtonClick
            }, "Click here to add.")
        )
    )
}

document.body.appendChild(Counter());
```

## 2. Responding to multiple subscriptions/state units.

# The Special Attributes

## On`<event>` Attributes
## Function (Subscription) Attributes
## Value Attribute
## Boolean Attributes
## Focus Attribute
