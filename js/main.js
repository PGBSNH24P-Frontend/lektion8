import { Todo } from "./todo.js";

function renderTodos(todos) {
    for (const todo of todos) {
        const div = document.createElement("div");
        div.textContent = todo.title;

        div.addEventListener('click', () => {
            const h2 = document.createElement("h2");
            h2.textContent = "HEJ!";
            div.append(h2);
        });

        document.body.append(div);
    }
}

renderTodos([
    new Todo("Städa"),
    new Todo("Handla"),
]);