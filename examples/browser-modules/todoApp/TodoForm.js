import { state } from "/dist/browser/state.js";
import { form, fieldset, legend, input, button } from "/dist/browser/html.js";


function TodoForm({ onSubmit }) {
    const [getText, setText, subscribeToText] = state("");

    const [textIsEmpty, setTextIsEmpty, subscribeToTextIsEmpty] = state(true);

    const handleFormSubmit = (e) => {
        e.preventDefault();

        if (textIsEmpty()) {
            return;
        }

        const value = getText();

        onSubmit({ value });

        setText("")
    }

    const handleTextChange = (e) => {
        setText(e.target.value);
        setTextIsEmpty(!getText());
    }

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