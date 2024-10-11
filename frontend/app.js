
const textInput = document.getElementById('task-input');
const taskList = document.getElementById('list-container');
const noTaskMessage = document.getElementById('no-tasks-message');
let taskArray = [];
let currTaskId = 0;

const addTask = () => {
    const task = textInput.value;

    if( !task ) {
        alert('Debes ingresar una tarea');
        
        return;
    }

    createTaskElement(task);

    textInput.value = '';
    taskArray.push(task);

    saveToLocalStorage();

    updateTaskMessage();

    return;
}

const createTaskElement = (task) => {
    const listElement = document.createElement('li');
    listElement.setAttribute('id', `task-${currTaskId}` );

    // Crear el div que contiene los datos de la tarea.
    const divElement = document.createElement('div');
    divElement.setAttribute('class', 'list-element');
    divElement.setAttribute('id', `task-${currTaskId}`);

    // Crear el parrafo.
    const pElement = document.createElement('p');
    pElement.innerHTML = task;
    pElement.setAttribute('onclick', `toggleTask('task-${currTaskId}')`);

    // Crear la imagen del boton.
    const imgElement = document.createElement('img');
    imgElement.setAttribute('src', 'assets/6861362.png');
    imgElement.setAttribute('alt', 'delete');
    
    // Crear el boton.
    const deleteButtonElement = document.createElement('button');
    deleteButtonElement.setAttribute('class', 'delete-task');
    deleteButtonElement.setAttribute('onclick', `deleteTask('task-${currTaskId}')`);

    deleteButtonElement.appendChild(imgElement);

    divElement.appendChild(pElement);
    divElement.appendChild(deleteButtonElement);

    listElement.appendChild(divElement);

    taskList.appendChild(listElement);

    currTaskId++;
}

const deleteTask = (id) => {
    const element = document.getElementById(id);
    const task = element.innerText;
    
    element.remove();
    taskArray = taskArray.filter( t => t !== task );

    saveToLocalStorage();
    updateTaskMessage();
}

const saveToLocalStorage = () => {
    localStorage.setItem('tasks', JSON.stringify(taskArray));
}

const toggleTask = (id) => {
    const element = document.getElementById(id);

    if( element.classList.contains('task-completed') ){
        element.classList.remove('task-completed');
    }
    else{
        element.classList.add('task-completed');
    }
}

const updateTaskMessage = () => {
    if( taskArray.length === 0 ) {
        noTaskMessage.style.display = 'block';
        taskList.classList.add('hidden');
    }
    else{
        noTaskMessage.style.display = 'none';
        taskList.classList.remove('hidden');
    }
}

(() => {
    const tasksJSON = localStorage.getItem('tasks');

    if( tasksJSON ){
        taskArray = JSON.parse(tasksJSON);
    }
    
    if( taskArray.length > 0 ) {
        taskArray.forEach( (task) => {
            createTaskElement(task);
        } );
    }
    
    updateTaskMessage();
})();
