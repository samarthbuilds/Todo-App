const todoForm = document.querySelector("#todoForm");
const todoInput = document.querySelector("#todoInput");
const todoList = document.querySelector("#todoList");
const errorMessage = document.querySelector("#errorMessage");
const emptyMessage = document.querySelector("#emptyMessage");

const filterButtons = document.querySelectorAll("[data-filter]");

let todos = JSON.parse(localStorage.getItem("todos")) || [];

let currentFilter = "all";


// ==============================
// SAVE TO LOCAL STORAGE
// ==============================

async function saveTodos() {

    localStorage.setItem(
        "todos",
        JSON.stringify(todos)
    );

    try {

        const message =
            await fakeSaveToServer(todos);

        console.log(message);

    } catch (error) {

        console.log("Save error:", error);

    } finally {

        console.log("Save operation finished.");

    }

}


// ==============================
// SIMULATED SERVER REQUEST
// ==============================

function fakeSaveToServer(todos) {

    return new Promise((resolve, reject) => {

        setTimeout(() => {

            const success = true;

            if (success) {

                resolve("Todos saved successfully.");

            } else {

                reject("Failed to save todos.");

            }

        }, 500);

    });

}


// ==============================
// ADD TODO
// ==============================

todoForm.addEventListener("submit", (event) => {

    event.preventDefault();

    const text = todoInput.value.trim();

    if (text === "") {

        errorMessage.textContent =
            "Task cannot be empty.";

        return;

    }

    if (text.length < 3) {

        errorMessage.textContent =
            "Task must contain at least 3 characters.";

        return;

    }

    errorMessage.textContent = "";

    const todo = {

        id: Date.now(),

        text: text,

        completed: false

    };

    todos.push(todo);

    saveTodos();

    todoInput.value = "";

    renderTodos();

});


// ==============================
// RENDER TODOS
// ==============================

function renderTodos() {

    todoList.innerHTML = "";

    let filteredTodos = todos;

    if (currentFilter === "active") {

        filteredTodos = todos.filter(
            todo => !todo.completed
        );

    }

    if (currentFilter === "completed") {

        filteredTodos = todos.filter(
            todo => todo.completed
        );

    }

    filteredTodos.forEach(todo => {

        const li = document.createElement("li");

        li.classList.add("todo");

        const span = document.createElement("span");

        span.textContent = todo.text;

        span.classList.add("todo-text");

        if (todo.completed) {

            span.classList.add("completed");

        }

        span.addEventListener("click", () => {

            toggleTodo(todo.id);

        });

        const deleteButton =
            document.createElement("button");

        deleteButton.textContent = "Delete";

        deleteButton.classList.add("delete-btn");

        deleteButton.addEventListener("click", () => {

            deleteTodo(todo.id);

        });

        li.append(span, deleteButton);

        todoList.append(li);

    });

    emptyMessage.style.display =
        filteredTodos.length === 0
            ? "block"
            : "none";

}


// ==============================
// DELETE TODO
// ==============================

function deleteTodo(id) {

    todos = todos.filter(todo => {

        return todo.id !== id;

    });

    saveTodos();

    renderTodos();

}


// ==============================
// TOGGLE TODO
// ==============================

function toggleTodo(id) {

    todos = todos.map(todo => {

        if (todo.id === id) {

            return {
                ...todo,
                completed: !todo.completed
            };

        }

        return todo;

    });

    saveTodos();

    renderTodos();

}


// ==============================
// FILTERS
// ==============================

filterButtons.forEach(button => {

    button.addEventListener("click", () => {

        currentFilter = button.dataset.filter;

        renderTodos();

    });

});


// ==============================
// INITIAL RENDER
// ==============================

renderTodos();