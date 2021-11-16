
// Scalar value handlers
function focus(element, key, value) {
    const handled = key === "focus" && value === true;
    if (handled) {
        element.removeAttribute("disabled");
        element.focus();
    }
    return { handled };
}
function removeBooleanAttributeOnFalse(element, key, value) {
    const handled = typeof value === "boolean" && value === false;
    if (handled) {
        element.removeAttribute(key);
    }
    return { handled };
}
function invokeValueProperty(element, key, value) {
    const handled = key === "value";
    if (handled) {
        element.value = value;
    }
    return { handled };
}
function setStyleFromObject(element, key, value) {
    const handled = key === "style" && typeof value === "object";
    if(handled){
        // Clear any previous style
        element.setAttribute("style", "");
        // Map the given object into style properties
        Object.entries(value || {}).forEach(([property, styleValue]) => element.style[property] = styleValue);
    }
    return { handled };
}
function setDataAttributesFromObject(element, key, value){
    const handled = key === "data" && typeof value === "object";
    if(handled){
        // Remove data attributes that are not present in the given object
        for(const dataKey in element.dataset){
            if(!value.hasOwnProperty(dataKey)){
                delete element.dataset[dataKey];
            }
        }
        Object.entries(value || {}).forEach(([property, dataValue]) => element.dataset[property] = dataValue);
    }
    return { handled };
}
function setAttribute(element, key, value) {
    const handled = true;
    element.setAttribute(key, value);
    return { handled };
}

const scalarValueHandlers = [
    focus,
    removeBooleanAttributeOnFalse,
    invokeValueProperty,
    setStyleFromObject,
    setDataAttributesFromObject,
    setAttribute,
];

const setScalarValue = (element, key, value) => {
    for (const handler of scalarValueHandlers) {
        const { handled } = handler(element, key, value);
        if (handled) {
            break;
        }
    }
}

function normalizeNonFunctionElement(nonFunctionElement) {
    if (typeof nonFunctionElement === "object" && nonFunctionElement !== null) {
        return nonFunctionElement;
    }

    return document.createTextNode(nonFunctionElement);
}

function normalizeFunctionElement(functionElement) {
    let element = undefined;
    element = functionElement((newElement) => {
        const normalizedNewElement = normalizeNonFunctionElement(newElement);
        element.replaceWith(normalizedNewElement);
        element = normalizedNewElement;
        return element;
    });
    element = normalizeNonFunctionElement(element);
    return element;
}

function addElements(parentElement, children) {
    const elementsToAdd = children.map((e) => {
        if (typeof e === "function") {
            return normalizeFunctionElement(e);
        }

        return normalizeNonFunctionElement(e);
    });

    parentElement.replaceChildren(...elementsToAdd);
}

const el = (elementName, attributes, ...children) => {
    const element = document.createElement(elementName);
    const providedAttributes = typeof attributes === "object" && attributes !== null ? attributes : {};
    const normalizedAttributes = {
        ...providedAttributes,
        children: [
            ...(providedAttributes.children || []),
            ...children
        ]
    };

    Object.entries(normalizedAttributes).forEach(([key, value]) => {
        // Handle child elements
        if (key === 'children') {
            addElements(element, value);
            return;
        }

        // Handle events
        if (key.startsWith('on')) {
            if (typeof value === 'function') {
                const eventName = key.substring(2).toLowerCase();
                element.addEventListener(eventName, value);
            }
            return;
        }

        // Handle bound values
        if (typeof value === "function") {
            const initialValue = value((newValue) => setScalarValue(element, key, newValue));
            setScalarValue(element, key, initialValue)
            return;
        }

        // All other attributes
        setScalarValue(element, key, value);

    });

    return element;
}

export { el };