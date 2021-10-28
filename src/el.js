const setScalarValue = (element, key, value) => {
    if(key === "focus" && value === true){
        element.removeAttribute("disabled");
        element.focus();
        return;
    }
    if(typeof value === "boolean" && value === false){
        element.removeAttribute(key);
        return;
    }
    if(key === "value"){
        element.value = value;
        return;
    }
    element.setAttribute(key, value);
}

function normalizeNonFunctionElement(nonFunctionElement){
    if(typeof nonFunctionElement === "object" && nonFunctionElement !== null){
        return nonFunctionElement;
    }

    return document.createTextNode(nonFunctionElement);
}

function normalizeFunctionElement(functionElement){
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
        if(typeof e === "function"){
            return normalizeFunctionElement(e);
        }

        return normalizeNonFunctionElement(e);
    });

    parentElement.replaceChildren(...elementsToAdd);
}

const el = (elementName, attributes, ...children) => {
    const element = document.createElement(elementName);
    const providedAttributes = attributes || {};
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
        if(key.startsWith('on')){
            if(typeof value === 'function'){
                const eventName = key.substring(2).toLowerCase();
                element.addEventListener(eventName, value);
            }
            return;
        }

        // Handle bound values
        if(typeof value === "function"){
            const initialValue = value((newValue)=> setScalarValue(element, key, newValue));
            setScalarValue(element, key, initialValue)
            return;
        }

        // All other attributes
        setScalarValue(element, key, value);
        
    });

    return element;
}

export { el };