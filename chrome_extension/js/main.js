let clock = document.querySelector('.clock');
let promptInput = document.querySelector('.prompt-input');
let mainPrompt = document.querySelector('.prompt-name');
let greetText = document.querySelector('.user-greet');

//======================
// Clock
//======================

function setDate() {
  let date = new Date();
  let seconds = date.getSeconds();
  let minutes = date.getMinutes();
  let hours = date.getHours();
  if (hours < 10) {
    hours = `0${hours}`;
  }
  if (minutes < 10) {
    minutes = `0${minutes}`
  }
  if (seconds < 10) {
    seconds =`0${seconds}`;
  }
  clock.innerText = `${hours}:${minutes}:${seconds}`;
  if (hours < 12) {
    greetText.innerText =  `Good Morning`
  } else if (hours >= 12 && hours <= 16) {
    greetText.innerText = `Good Afternoon`
  } else if (hours > 16 && hours <=20 ) {
    greetText.innerText = `Good Evening`
  } else if (hours <= 24) {
    greetText.innerText = `Good Night`
  }
  // greet(hours);
  setInterval(setDate, 1000);
}

setDate();

//======================
// Greeting
//======================

let userName = (localStorage.getItem('user')) || "";
function greetingText(e) {
  if (!userName) {
    let promptText = (document.querySelector('.prompt-input')).value;
    userName = promptText;
  }
  mainPrompt.innerHTML = `<h1>Welcome ${userName}</h1>`;
  localStorage.setItem('user', (userName));
}
if (userName) {
    greetingText();
}

promptInput.addEventListener('keydown', function(e) {
  if (e.keyCode == 13) {
    greetingText();
  }
})

//======================
// To Do List
//======================

let form = document.querySelector('.form-element')
let itemList = document.querySelector('ul');
let allList = document.querySelector('.all-list')
let itemLeft = document.querySelector('.item-left');
let completed = document.querySelector('.completed');
let active = document.querySelector('.active');
let clearComplete = document.querySelector('.clear-complete');

let arrList = JSON.parse(localStorage.getItem('list')) || [];
// Add List

function addList(e) {
  e.preventDefault();
  const name = (document.querySelector('.form-input')).value;
  let listContainer = {
    name,
    done: false 
  }
  if(!name) return;
  arrList.push(listContainer);
  displayList(arrList, itemList);
  localStorage.setItem('list', JSON.stringify(arrList));
  this.reset();
}

// Display List

function displayList(items = [], itemsList) {
  itemsList.innerHTML = items.map((element, i) => {
    return `
      <li class="todoList" data-id="${i}">
        <input class="check" type = "checkbox" data-index = ${i} data-id = "${i}" ${element.done ? 'checked' : ''}></input>
        <label for = "${i}" class= "${element.done ? 'linethrough' : '' }" >${element.name}</label>
        <button data-id ="${i}" class="edit">+</button>
        <button data-id ="${i}" class="delete">X</button>
      </li>
    `
  }).join('');
  leftCount();
}

// Delete List

function deleteList(e) {
  if (e.target.classList.contains('delete')) {
    let id = e.target.dataset.id;
    arrList.splice(id, 1);
    localStorage.setItem('list', JSON.stringify(arrList));
    displayList(arrList, itemList);
  }
}

// Edit List

function editList(e) {
  if (e.target.classList.contains('edit')) {
    let id = e.target.dataset.id;
    let item = e.target.parentElement;
    item.innerHTML = `
    <form class="edit-form">
      <input type="text" class="editValue" id="${id}" required>
      <button id="submit-edit-val">Submit</button>
    </form>`;
  }
  if(e.target.id === 'submit-edit-val') {
    const editVal = document.querySelector('.editValue')
    arrList[editVal.id].name = editVal.value;
    if(!editVal.value) return;
    localStorage.setItem('list', JSON.stringify(arrList));
    displayList(arrList, itemList);
  }
}

// Toggle

function toggleDone(e) {
  if (!e.target.classList.contains('check')) return;
  const index = e.target.dataset.index;
  arrList[index].done = !arrList[index].done;
  localStorage.setItem('list', JSON.stringify(arrList));
  displayList(arrList, itemList);
}

// All list

function allItem() {
  localStorage.setItem('allLists', JSON.stringify(arrList));
  displayList(JSON.parse(localStorage.getItem('allLists')), itemList);
}

// Completed

function completeItem() {
  let onlyCompleted = arrList.filter(elem => elem.done);
  localStorage.setItem('completedItems', JSON.stringify(onlyCompleted));
  displayList(JSON.parse(localStorage.getItem('completedItems')), itemList);
}

// Active

function activeItem() {
  let onlyActive = arrList.filter(elem => !elem.done);
  localStorage.setItem('activeItems', JSON.stringify(onlyActive));
  displayList(JSON.parse(localStorage.getItem('activeItems')), itemList);
}

// Clear Completed

function clearCompleted(e) {
  e.preventDefault();
  arrList = arrList.filter(elem => !elem.done);
  localStorage.setItem('list', JSON.stringify(arrList));
  displayList(arrList, itemList);
}

// Items left

function leftCount() {
  let leftItem = arrList.filter(v => !v.done).length;
  itemLeft.innerText = `${leftItem} items left`;
}

form.addEventListener('submit', addList);
itemList.addEventListener('click', deleteList);
itemList.addEventListener('click', editList);
itemList.addEventListener('click', toggleDone);
allList.addEventListener('click', allItem);
completed.addEventListener('click', completeItem);
active.addEventListener('click', activeItem);
clearComplete.addEventListener('click', clearCompleted);


displayList(arrList, itemList);
leftCount();
