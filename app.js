import { initializeApp } from "https://www.gstatic.com/firebasejs/10.13.1/firebase-app.js";
import {
  getFirestore,
  collection,
  addDoc,
  getDocs,
  deleteDoc,
  doc,
  updateDoc,
  serverTimestamp,
} from "https://www.gstatic.com/firebasejs/10.13.1/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyCQh4pFrOy-pburjoxZ5QorBfQKM00OmmM",
  authDomain: "todo-app-8977c.firebaseapp.com",
  projectId: "todo-app-8977c",
  storageBucket: "todo-app-8977c.appspot.com",
  messagingSenderId: "745701610638",
  appId: "1:745701610638:web:30f727121aab78ef20a5df",
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const todoInput = document.getElementById("todo-input");
const addBtn = document.getElementById("add-btn");
const todoList = document.querySelector(".todo-list");

function displayTodo(id, title) {
  const li = document.createElement("li");
  li.setAttribute("data-id", id);
  li.innerHTML = `
    <span>${title}</span>
    <div class="actions">
      <button class="edit-btn"><i class="far fa-edit" style="color: #0c680d"></i></button>
      <button class="delete-btn"><i class="far fa-trash-alt" style="color: red"></i></button>
    </div>
  `;

  const editBtn = li.querySelector(".edit-btn");
  const deleteBtn = li.querySelector(".delete-btn");

  editBtn.addEventListener("click", () => editTodo(id, li));
  deleteBtn.addEventListener("click", () => deleteTodo(id));

  todoList.appendChild(li);
}

async function loadTodos() {
  const querySnapshot = await getDocs(collection(db, "todos"));
  querySnapshot.forEach((doc) => {
    displayTodo(doc.id, doc.data().title);
  });
}

addBtn.addEventListener("click", async () => {
  const title = todoInput.value.trim();
  if (title) {
    const docRef = await addDoc(collection(db, "todos"), {
      title,
      timestamp: serverTimestamp(),
    });
    displayTodo(docRef.id, title);
    todoInput.value = "";
  }
});

async function editTodo(id, listItem) {
  const newTitle = prompt(
    "Edit your todo:",
    listItem.querySelector("span").innerText
  );
  if (newTitle) {
    await updateDoc(doc(db, "todos", id), {
      title: newTitle,
      timestamp: serverTimestamp(),
    });
    listItem.querySelector("span").innerText = newTitle;
  }
}

async function deleteTodo(id) {
  await deleteDoc(doc(db, "todos", id));
  const listItem = document.querySelector(`li[data-id="${id}"]`);
  todoList.removeChild(listItem);
}

window.addEventListener("DOMContentLoaded", loadTodos);
