import { ul, strike, span, li, input, label } from "/dist/browser/index.js";

function TodoList({ todos, onTodoDoneChange }) {
    return ul({ style: { listStyleType: "none" } },
        ...todos.map(({ id, text, done }) => {
            const todoId = `todo-${id}`;
            const handleCheckboxChange = (e) => {
                onTodoDoneChange({ id, done: e.target.checked });
            }
            return li({},
                input({
                    id: todoId,
                    type: "checkbox",
                    checked: done,
                    onchange: handleCheckboxChange
                }),
                label({ for: todoId },
                    done ? strike({}, text) : span({}, text)
                )
            )
        })
    )
};

export { TodoList }