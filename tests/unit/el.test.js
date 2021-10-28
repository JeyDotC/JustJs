import { expect, jest } from "@jest/globals";
import { el } from "../../src/el";

// Basic API

test("el: Create simple element", function () {
    expect(el("div")).toBeInstanceOf(HTMLDivElement);
});

test("el: Create element with basic attributes", function () {
    expect(el("div", {
        id: "my-id",
        title: "my-title"
    }))
        .toMatchObject({
            id: "my-id",
            title: "my-title"
        });
});

test("el: Create element with CSS classes", function () {
    const createdClasses = el("div", {
        "class": "some-class1 some-class2 some-class-3",
    }).classList;

    expect([...createdClasses]).toEqual(["some-class1", "some-class2", "some-class-3"]);
});

test("el: Setting a value to boolean true should add the attribute", function () {
    expect(el("div", {
        disabled: true,
    }).getAttribute("disabled")).toBe("true");
});

test("el: Setting a value to boolean false should NOT add the attribute", function () {
    expect(el("div", {
        disabled: false,
    }).hasAttribute("disabled")).toBe(false);
});

test("el: Setting a value starting with 'on' should add an event listener", function () {
    const onclick = jest.fn();
    const element = el("div", {
        disabled: false,
        onclick
    });
    element.click();
    expect(onclick).toBeCalledTimes(1);
});

test("el: Special attribute 'focus' should call the focus method when set to true.", function () {
    // Arrange
    const originalFocus = HTMLInputElement.prototype.focus;
    const mockFocus = jest.fn();
    HTMLInputElement.prototype.focus = mockFocus;

    // Act
    el("input", {
        focus: true,
    });
    HTMLInputElement.prototype.focus = originalFocus;

    // Assert
    expect(mockFocus).toBeCalledTimes(1);
});

test("el: Setting the input value should set the element's value property (not the attribute)", function () {
    const element = el("input", {
        value: "Some Value"
    });
    expect(element.hasAttribute('value')).toBe(false);
    expect(element.value).toBe("Some Value");
});

test("el: Element should be able to receive children as an attribute", function () {
    const element = el("div", {
        children: [
            el("input"),
            el("a"),
        ]
    });
    expect(element.childElementCount).toBe(2);
    expect(element.children[0]).toBeInstanceOf(HTMLInputElement);
    expect(element.children[1]).toBeInstanceOf(HTMLAnchorElement);
});

test("el: Element should be able to receive children as extra parameters", function () {
    const element = el("div", {},
        el("input"),
        el("a")
    );
    expect(element.childElementCount).toBe(2);
    expect(element.children[0]).toBeInstanceOf(HTMLInputElement);
    expect(element.children[1]).toBeInstanceOf(HTMLAnchorElement);
});

test.each([
    { value: "String Tex Node", expectedData: "String Tex Node" },
    { value: 0, expectedData: "0" },
    { value: 1, expectedData: "1" },
    { value: true, expectedData: "true" },
    { value: false, expectedData: "false" },
    { value: undefined, expectedData: "undefined" },
    { value: null, expectedData: "null" },
])("el: Element should receive escalar $value and convert it to a text node", function ({ value, expectedData }) {
    const element = el("div", {},
        value
    );

    const textNode = element.childNodes[0];

    expect(textNode).toBeInstanceOf(Text);
    expect(textNode.data).toBe(expectedData);
});

// Function attributes API

test("el: Receiving a function attribute should cause the element to assume it is a handle to subscribe to changes to the attribute's value",
    function () {
        // Arrange
        let attributeCallback = undefined;
        const initialValue = "my-el";
        const subscribeToId = (callback) => {
            attributeCallback = callback;
            return initialValue;
        };

        // Act
        const element = el("div", { id: subscribeToId });

        const firstElementId = element.id;

        attributeCallback("my-el-2");

        // Assert
        expect(firstElementId).toBe(initialValue);
        expect(element.id).toBe("my-el-2");
    });

test("el: Receiving a function child element should cause the element to assume it is a handle to subscribe to the child element being replaced.",
    function () {
        // Arrange
        let childNodeCallback = undefined;
        const initialValue = el("a");
        const subscribeToChildNode = (callback) => {
            childNodeCallback = callback;
            return initialValue;
        };

        // Act
        const element = el("div", {},
            el("div"),
            subscribeToChildNode,
            el("table")
        );

        const firstChildElement = element.children[1];

        childNodeCallback(el("p"));

        const currentChildElement = element.children[1];

        // Assert
        expect(firstChildElement).toBeInstanceOf(HTMLAnchorElement);
        expect(currentChildElement).toBeInstanceOf(HTMLParagraphElement);
        // Other elements should remain untouched
        expect(element.children[0]).toBeInstanceOf(HTMLDivElement);
        expect(element.children[2]).toBeInstanceOf(HTMLTableElement);
    });