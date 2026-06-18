# Task Overview

A fully interactive Task Manager Application built with pure HTML, CSS, and Vanilla JavaScript — no frameworks, no libraries.

🔗 **Live Demo:** [sheryians-workdir-task-overview.vercel.app](https://sheryians-workdir-task-overview.vercel.app/)

---

## Screenshots

### Dark Mode
![Task Overview Dark Mode](./screenshots/dark.png)

### Light Mode
![Task Overview Light Mode](./screenshots/light.png)

---

## Features

- Add, edit, delete, and complete tasks
- Filter tasks by category and status
- Search tasks in real time
- Task counters — Total, Pending, In Progress, Completed
- Dark / Light mode toggle (saved in localStorage)
- Tasks saved in localStorage (persist on refresh)
- Clear all tasks with confirmation modal
- Attributes vs Properties demo
- Event Propagation demo (Bubbling & Capturing)
- Browser Rendering Pipeline visual section
- Fully responsive — works on mobile and desktop

---

## Concepts Covered

### Parsing
When the browser receives HTML, it reads it character by character and converts it into tokens. This process is called **parsing**. The parser identifies tags, attributes, and text nodes from the raw HTML string.

### Tokenization
During parsing, the HTML is broken down into individual units called **tokens** — start tags, end tags, attributes, and text content. These tokens are the building blocks used to construct the DOM Tree.

### DOM Tree
After tokenization, the browser builds the **DOM (Document Object Model) Tree** — a structured, in-memory representation of all the HTML elements and their relationships (parent, child, sibling). JavaScript interacts with the page through this tree.

### CSSOM Tree
While the DOM is being built, the browser separately parses all CSS and constructs the **CSSOM (CSS Object Model) Tree**. This tree holds all the style rules and which elements they apply to.

### Render Tree
The browser combines the DOM Tree and the CSSOM Tree to create the **Render Tree**. This tree only includes visible elements with their computed styles — hidden elements like `display: none` are excluded. The browser uses this tree to calculate layout and paint the page.

### Event Bubbling
When an event is triggered on a child element, it **bubbles up** through the DOM — first the child handler runs, then the parent, then the grandparent, all the way to the root.

```
Child → Parent → Grandparent
```

### Event Capturing
The opposite of bubbling. The event starts at the top and **captures down** to the target element first.

```
Grandparent → Parent → Child
```

To use capturing, pass `true` as the third argument to `addEventListener`:
```js
element.addEventListener('click', handler, true)
```

### Event Delegation
Instead of attaching separate listeners to every child element, a **single listener is placed on the parent**. It uses `event.target` to figure out which child was clicked. This is more performant and works for dynamically added elements too.

```js
taskGrid.addEventListener('click', (e) => {
  if (e.target.closest('.js-delete-btn')) {
    // handle delete
  }
})
```

---

## Tech Stack

- HTML
- CSS
- Vanilla JavaScript

---

## Project Structure

```
task-overview/
├── index.html
├── style.css
├── responsive.css
└── script.js
```

---

Built as part of **Sheryians Coding School — Cohort 3.0**
