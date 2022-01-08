import counterUiLauncher from "@strut/counter.ui.launcher";
import counter from "@strut/counter";
import './base.css';
import './todo.css';

const count = counter('todo-mvc');
// ## Create a temp element.
// This temp element will be used to sanatize strings that will be rendered as `HTML`.
//
// Why do we need to sanatize HTML? Because we'll need to render untrusted input
// into the `DOM` when a user adds a new TODO.
// If we don't sanitize the input, someone could exploit the user's browser.
//
// The attack vector is unlikely given the todos are only saved in
// local storage but we should set a good example. Code online often gets copy-pasted
// into other developer's projects and we don't want to spread bad practices.
//
// Using an off-screen `HTML` element allows us to leverage the browser to perform
// sanitization rather than trying to do it ourselves.
const tempEl = document.createElement("div");

// ## Sanatize
// The actual sanatize method. `tempEl` was created outside of this method
// (above) so we don't incur the cost of creating an element every time we want to
// sanitize a string.
const sanitize = (value) => {
  count.bump('sanatize');
	if (value) {
		// ### Escape Hatch
		// Below is an "escape-hatch" to allow developers (who know what they are doing)
		// to inject raw, unsanitized, `HTML`.
		//
		// This is useful in cases where developers programatically create `HTML` strings.
		// I've personally used this when I want to return an `HTML` string from the server
		// (over a `REST` or `GraphQL API`) and then render it into the client.
		// This happens in cases where some legacy rendering logic only exists on the server
		// and the juice isn't worth the squeeze to move it to client side rendering.
		if (typeof value === "object" && value.__html__) {
			return value.__html__;
		}

		// ### Convenience
		// Check for array input. This allows developers to pass arrays of values
		// in addition to single values. E.g., `sanitize(['a','b','c'])` and `sanitize('a')`.
		// This is idiomatic JavaScript as JavaScript doesn't have a way to overload
		// functions based on parameter types.
		if (Array.isArray(value)) {
			return value.map(sanitize).join("");
		}
	}
	// ### Cool Trick
	// `tempEl.textContent = value;`
	// is a cool trick to sanitize the value using the browser's own sanitization logic.
	// This reduces our total program maintenance costs.
	// No need for us to maintain some silly regex's or string-replaces that might be missing some edge cases.
	tempEl.textContent = value;
	return tempEl.innerHTML;
};

// ## Tagged Templates
// ES6 Template Strings can be passed to a custom processor.
// Here we are defining an `html` function which we will use to process template strings
// that are intended to represent `HTML`.
//
// The `html` function will apply apply our sanitize method to any variables passed to the literal.
//
// **Example input:** `<p>${content}</p>`
//
// **Example output:** `{ __html__: '<p>some sanitized content</p>.' }`
const html = (parts, ...values) => {
  count.bump('html-template');
	// We return an object with an `__html__` property so we can compose the results
	// of `html` invocations. Remember earlier that `sanitize` ignores objects with
	// an `__html__` property as they've already been processed or asserted to be
	// safe by the developer.
	//
	// "asserted to be safe" is worth rabbitholing on. If a framework relies on assertions
	// or "developers doing the right thing" it means one of two things:
	// 1. The framework has a deficiency
	// 2. The language has a deficiency
	//
	// Ideally the language's type system would always enforce that the right thing
	// happens. There would be no need to trust developers to do the right thing
	// and no need for runtime assertions. Runtime assertions (e.g., `assert(x is notnull)`,
	// `assert(x > 0)`) are a symptom of a deficient type checker or a junior programmer
	// writing bad framework code.
	//
	// If this all seems far-fetched, take a look at Idris and OCaml.
	return {
		__html__: parts
			.map((part, i) => {
				return part + (i < values.length ? sanitize(values[i]) : "");
			})
			.join(""),
	};
};

// ## Root App
// Like HTML, application components are hierarchical. `todoApp` represents the
// root or top-level component that contains the entire application.
//
// In addition to "component trees" GUIs also have "state trees" which roughly
// parallel the component tree. The `state` parameter represents our applicaton's
// state tree.
const todoApp = (state) => {
  count.bump('render.todoApp');
	// The root app delegates most of it srendering to sub-components
	// (like header, footer and todo components) but does render top
	// level statistics about the TODOs itself.
	//
	// Here we'll compute how many todos are complete.
	const remaining = state.items.filter((item) => !item.complete);
	let toggleAll = "";
	// If items exist in the todo list, render a "toggle all" button to
	// toggle between done and not done. No need to render "toggle all" if
	// no todos exists.
	if (state.items.length) {
		toggleAll = html`
			<input
				id="toggle-all"
				type="checkbox"
				class="toggle-all"
				${remaining.length ? "" : "checked"}
				onclick="toggleAll();"
			/>
			<label for="toggle-all">Mark all as complete</label>`;
	}
	// Compose the app's sub-components together into a single view.
	// Here we make use of the `html` tagged literal that we defined earlier.
	return html`<div class="todoapp">
		${header()}
		<section class="main" ${state.items.length ? "" : 'style="display: none;"'}>
			${toggleAll}
			<ul class="todo-list">
				${state.items.map(todo)}
			</ul>
			${footer(remaining, state.items)}
		</section>
	</div>`;
};
// ## Header
const header = () => {
  count.bump('render.header');
	return html`<header class="header">
		<h1>todos</h1>
		<input
			type="text"
			class="new-todo"
			id="todoInput"
			placeholder="What needs to be done?"
			onkeydown="onCreate(event)"
			autofocus
			value="${state.newTodo}"
		/>
	</header>`;
};
// ## Todo
const todo = (item, i) => {
  count.bump('render.todo');
	if (state.filter === "completed" && !item.complete) return "";
	if (state.filter === "active" && item.complete) return "";
	let body = "";
	if (item._editing) {
		body = html`
			<input
				type="text"
				class="edit"
				autofocus
				value="${item.name}"
				onkeydown="onSave(event, ${i})"
				onblur="onSave(event, ${i})"
			/>
		`;
	} else {
		body = html`
			<div class="view">
				<input
					type="checkbox"
					class="toggle"
					${item.complete ? "checked" : ""}
					onclick="toggle(${i});"
				/>
				<label ondblclick="startEditing(${i})">${item.name}</label>
				<button class="destroy" onClick="remove(${i})" />
			</div>
		`;
	}
	return html`
		<li class="${item.complete ? "completed" : ""} ${item._editing ? "editing" : ""}">
			${body}
		</li>
	`;
};
// ## Footer
const footer = (remaining, items) => {
  count.bump('render.footer');
	let clearCompleted = "";
	if (remaining.length !== items.length) {
		clearCompleted = html`
		<button
			class="clear-completed"
			onClick="clearCompleted()">
			Clear completed
		</button>`;
	}
	return html`<footer class="footer">
		<span class="todo-count">
			<strong>
				${remaining.length ? remaining.length : "0"}
			</strong>
			${remaining.length === 1 ? "item" : "items"} left
		</span>
		<ul class="filters">
			<li>
				<a class="${state.filter === "" ? "selected" : ""}" onClick="updateFilter('')">
					All
				</a>
			</li>
			<li>
				<a class="${state.filter === "active" ? "selected" : ""}" onClick="updateFilter('active')">Active</a>
			</li>
			<li>
				<a class="${state.filter === "completed" ? "selected" : ""}" onClick="updateFilter('completed')">
					Completed
				</a>
			</li>
		</ul>
		${clearCompleted}
	</footer>`;
};
// ## Actions
// ### Toggle All
window.toggleAll = () => {
  count.bump('event.toggleAll');
	const hasRemaining = state.items.filter((i) => !i.complete).length != 0;
	state.items.forEach((i) => (i.complete = hasRemaining));
	turnTheCrank();
}
// ### Clear Completed
window.clearCompleted = () => {
  count.bump('event.clearCompleted');
	state.items = state.items.filter((i) => !i.complete);
	turnTheCrank();
}
// ### Toggle
window.toggle = (i) => {
  count.bump('event.toggle');
	state.items[i].complete = !state.items[i].complete;
	turnTheCrank();
}
// ### Remove
window.remove = (i) => {
  count.bump('event.remove');
	state.items.splice(i, 1);
	turnTheCrank();
}
// ### Start Editing
window.startEditing = (i) => {
  count.bump('event.startEditing');
	state.items[i]._editing = true;
	turnTheCrank();
}
// ### Update Filter
window.updateFilter = (filter) => {
  count.bump('event.updateFilter');
	window.location.hash = filter;
}
// ## Events
// ### On Create
window.onCreate = (e) => {
  count.bump('event.onCreate');
	const text = getFinalText(e);
	if (text) {
		state.items.push({
			name: text,
			complete: false,
		});
		state.newTodo = "";
		turnTheCrank("todoInput");
	}
}
// ### On Save
window.onSave = (e, i) => {
  count.bump('event.onSave');
	if (e.which === 27) {
		state.items[i]._editing = false;
		e.target.value = state.items[i].name;
		turnTheCrank();
		return;
	}
	const text = getFinalText(e);
	if (text) {
		state.items[i].name = text;
		state.items[i]._editing = false;
		setItems();
		turnTheCrank();
	} else if (text !== null && state.items[i] && state.items[i]._editing) {
		state.items[i]._editing = false;
		state.items.splice(i, 1);
		setItems();
		turnTheCrank();
	}
}
// ### Hash Change
window.onhashchange = function () {
  count.bump('event.onHashChange');
	state.filter = window.location.hash.split("#")[1] || "";
	turnTheCrank();
};
const getFinalText = (e) =>
	e.which === 13 || e.type === "blur" ? e.target.value.trim() : null;
let state;
let container;
window.onload = () => {
  count.bump('event.onLoad');
	container = document.getElementById("container");
	const prevState = window.localStorage.getItem("todos-vanilla-slim");
	state = {
		filter: window.location.hash.split("#")[1] || "",
		newTodo: "",
		items: (prevState && JSON.parse(prevState)) || [],
	};
	turnTheCrank(null, () => {
		document.querySelectorAll(".new-todo")[0].focus();
		setItems(); // apprently TodoMVC tests need this line
	});
}
// ## Re-Render
function turnTheCrank(refocus, cb) {
  count.bump('render.turnTheCrank');
	requestAnimationFrame(() => {
    count.bump('render.turnTheCrank.inAnimationFrame');
		container.innerHTML = todoApp(state).__html__;
		if (refocus) document.getElementById(refocus).focus();
		if (cb) cb();
	});
}
const setItems = (window.onbeforeunload = () => {
  count.bump('storage.setItems');
	window.localStorage.setItem("todos-vanilla-slim", JSON.stringify(state.items));
});

counterUiLauncher(new URL(window.location.origin + '/counter.ui/src'));