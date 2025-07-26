
console.log("script.js has started executing.");

const taskInput = document.getElementById("taskInput");
const priorityRadios = document.querySelectorAll('.priority-selection input[name="priority"]');
const addBtn = document.getElementById("addBtn");
const taskList = document.getElementById("taskList");
const emptyMsg = document.getElementById("emptyMsg");



const editModal = document.getElementById("editModal");
const editTaskInput = document.getElementById("editTaskInput");
const editPriorityRadios = document.querySelectorAll('.modal .priority-selection input[name="editPriority"]');
const saveEditBtn = document.getElementById("saveEditBtn");
const closeModalBtn = document.querySelector(".close-button");

let tasks = []; 

let currentEditIndex = -1;


window.onload = loadTasks;
addBtn.onclick = addTask;

closeModalBtn.onclick = () => {
    editModal.style.display = "none";
    console.log("Edit modal closed.");
};
window.onclick = (event) => {
  if (event.target == editModal) {
    editModal.style.display = "none";
    console.log("Edit modal closed by clicking outside.");
  }
};
saveEditBtn.onclick = saveEditedTask;


let draggedItem = null;

function loadTasks() {
  console.log("loadTasks() called. Current tasks array length:", tasks.length);
  taskList.innerHTML = ""; 

  if (tasks.length === 0) {
    emptyMsg.style.display = "block";
    console.log("No tasks found. Displaying empty message.");
  } else {
    emptyMsg.style.display = "none";
    console.log(`Attempting to render ${tasks.length} tasks.`);
  }

 

  tasks.forEach((task, index) => renderTask(task, index));
  console.log("loadTasks() finished.");
}

function addTask() {
  const text = taskInput.value.trim();
  if (!text) {
    console.log("Add task attempted with empty text.");
    return;
  }

  let selectedPriority = "medium";
  for (const radio of priorityRadios) {
    if (radio.checked) {
      selectedPriority = radio.value;
      break;
    }
  }

  const newTask = {
    text,
    
    timestamp: new Date().toLocaleString(),
    priority: selectedPriority
  };

  tasks.push(newTask);
  console.log("Task added:", newTask);
  taskInput.value = "";
  const defaultPriorityRadio = document.querySelector('.priority-selection input[value="medium"]');
  if (defaultPriorityRadio) {
      defaultPriorityRadio.checked = true;
  }
  loadTasks();
}

function renderTask(task, index) {
  console.log(`renderTask() called for task at index ${index}:`, task);

  const li = document.createElement("li");
  li.setAttribute("draggable", "true");
  li.dataset.index = index;

  

  
  li.addEventListener("dragstart", handleDragStart);
  li.addEventListener("dragover", handleDragOver);
  li.addEventListener("dragleave", handleDragLeave);
  li.addEventListener("drop", handleDrop);
  li.addEventListener("dragend", handleDragEnd);

  const taskLeft = document.createElement("div");
  taskLeft.className = "task-left";

  const text = document.createElement("p");
  text.className = "task-text";
  text.innerText = task.text;

  const prioritySpan = document.createElement("span");
  prioritySpan.className = `task-priority`; // Removed ${task.priority} as no color needed
  prioritySpan.innerText = `Priority: ${task.priority.charAt(0).toUpperCase() + task.priority.slice(1)}`;

  const time = document.createElement("div");
  time.className = "timestamp";
  time.innerText = `Added on: ${task.timestamp}`;

  taskLeft.appendChild(text);
  taskLeft.appendChild(prioritySpan);
  taskLeft.appendChild(time);

  const actions = document.createElement("div");
  actions.className = "actions";

  

  const editBtn = document.createElement("button");
  editBtn.className = "edit";
  editBtn.innerText = "Edit";
  editBtn.onclick = () => openEditModal(index);

  const deleteRadio = document.createElement("input");
  deleteRadio.type = "radio";
  deleteRadio.className = "delete-radio";
  deleteRadio.name = "deleteTaskRadio_" + index;
  deleteRadio.id = "deleteTaskRadio_" + index;
  deleteRadio.onchange = () => {
    if (confirm("Are you sure you want to delete this task?")) {
      deleteTask(index);
    } else {
      deleteRadio.checked = false;
    }
  };

  
  actions.appendChild(editBtn);
  actions.appendChild(deleteRadio);

  li.appendChild(taskLeft);
  li.appendChild(actions);
  taskList.appendChild(li);
  console.log(`Task ${index} (${task.text}) successfully appended to taskList.`);
}



function openEditModal(index) {
  currentEditIndex = index;
  const taskToEdit = tasks[index];
  editTaskInput.value = taskToEdit.text;

  for (const radio of editPriorityRadios) {
    if (radio.value === taskToEdit.priority) {
      radio.checked = true;
    } else {
      radio.checked = false;
    }
  }

  editModal.style.display = "flex";
  console.log(`Opening edit modal for task ${index}.`);
}

function saveEditedTask() {
  const newText = editTaskInput.value.trim();
  if (!newText) {
    alert("Task cannot be empty!");
    return;
  }

  let newPriority = "medium";
  for (const radio of editPriorityRadios) {
    if (radio.checked) {
      newPriority = radio.value;
      break;
    }
  }

  tasks[currentEditIndex].text = newText;
  tasks[currentEditIndex].priority = newPriority;
  editModal.style.display = "none";
  console.log(`Task ${currentEditIndex} saved. New text: ${newText}, Priority: ${newPriority}`);
  loadTasks();
}

function deleteTask(index) {
  if (index > -1 && index < tasks.length) {
      tasks.splice(index, 1);
      console.log(`Task at original index ${index} deleted.`);
      loadTasks();
  } else {
      console.warn(`Attempted to delete task at invalid index: ${index}`);
  }
}


function handleDragStart(e) {
  draggedItem = this;
  e.dataTransfer.effectAllowed = "move";
  e.dataTransfer.setData("text/html", this.innerHTML);
  this.classList.add('dragging');
  console.log("Drag start for:", this.dataset.index);
}

function handleDragOver(e) {
  e.preventDefault();
  e.dataTransfer.dropEffect = "move";
  const targetItem = this;
  if (draggedItem !== targetItem && targetItem.tagName === 'LI') {
    const bounding = targetItem.getBoundingClientRect();
    const offset = bounding.y + (bounding.height / 2);
    if (e.clientY > offset) {
      targetItem.style.borderBottom = '2px solid #007bff';
      targetItem.style.borderTop = '';
    } else {
      targetItem.style.borderTop = '2px solid #007bff';
      targetItem.style.borderBottom = '';
    }
  }
}

function handleDragLeave() {
  this.style.borderBottom = '';
  this.style.borderTop = '';
}

function handleDrop(e) {
  e.preventDefault();
  this.style.borderBottom = '';
  this.style.borderTop = '';
  console.log("Drop event occurred.");

  if (draggedItem !== this && this.tagName === 'LI') {
    const draggedIndex = parseInt(draggedItem.dataset.index);
    const targetIndex = parseInt(this.dataset.index);
    console.log(`Dragging from ${draggedIndex} to ${targetIndex}`);

    const [removed] = tasks.splice(draggedIndex, 1);
    tasks.splice(targetIndex, 0, removed);

    console.log("Tasks array reordered:", tasks);
    loadTasks();
  }
}

function handleDragEnd() {
  if (draggedItem) {
    draggedItem.classList.remove('dragging');
  }
  draggedItem = null;
  taskList.querySelectorAll('li').forEach(item => {
      item.style.borderBottom = '';
      item.style.borderTop = '';
  });
  console.log("Drag end.");
}