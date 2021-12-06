
import { state, sideEffect, div, button } from "/dist/browser/index.js";
import { TodoForm } from "./TodoForm.js";
import { TodoList } from "./TodoList.js";

let lastId = 1;

 function App() {
    const [getTodos, setTodos, subscribeToTodos] = state([]);

    const handleTodoFormSubmit = ({ value }) => {
        setTodos([{ id: lastId++, text: value, done: false }, ...getTodos()]);
    };

    const handleTodoDoneChange = ({ id, done }) => {
        setTodos(getTodos().map((todo) => {
            if (todo.id === id) {
                return { ...todo, done };
            }

            return todo;
        }))
    };

    const handleRemoveDoneButtonClick = (e) => {
        e.preventDefault();
        setTodos(getTodos().filter((todo) => !todo.done));
    };

    const subscribeToTodosList = sideEffect(
        (todos) => TodoList({ todos, onTodoDoneChange: handleTodoDoneChange }),
        subscribeToTodos
    );

    const subscribeToTodosAreEmpty = sideEffect(
        (todos) => todos.length === 0,
        subscribeToTodos
    );

    return div({},
        TodoForm({ onSubmit: handleTodoFormSubmit }),
        div({},
            button({ onclick: handleRemoveDoneButtonClick, disabled: subscribeToTodosAreEmpty },
                "Remove Done"
            )
        ),
        subscribeToTodosList
    );
}

export { App }