var todoApp = todoApp || {};

(function (exports) {
    const { ul, strike, span, li, input, label, button } = justjs;

    exports.TodoList = function ({ todos, onTodoDoneChange }) {
        return ul({ style: "list-style-type: none;"},
            ...todos.map(({ id, text, done }) => {
                const todoId = `todo-${id}`;
                const handleCheckboxChange = (e) => {
                    onTodoDoneChange({id, done: e.target.checked });
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
})(todoApp);