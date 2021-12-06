import { state, sideEffect, form, fieldset, legend, input, button } from "/dist/browser/index.js";


function TodoForm({ onSubmit }) {
    const [getText, setText, subscribeToText] = state("");

    const handleFormSubmit = (e) => {
        e.preventDefault();

        const value = getText();

        if(value.length === 0){
            return;
        }

        onSubmit({ value });

        setText("");
    }

    const handleTextChange = (e) => {
        setText(e.target.value);
    }

    const subscribeToTextIsEmpty = sideEffect((text) => text.length === 0, subscribeToText);

    return form({
            onSubmit: handleFormSubmit
        },
        fieldset({}, legend({}, "Add TODO"),
            input({
                type: "text",
                placeholder: "Todo text",
                value: subscribeToText,
                onkeyup: handleTextChange
            }),
            button({ type: "submit", disabled: subscribeToTextIsEmpty }, "Add")
        )
    );
};

export { TodoForm }