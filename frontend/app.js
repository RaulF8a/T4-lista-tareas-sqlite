
const textInput = document.getElementById('task-input');
const taskList = document.getElementById('list-container');
const noTaskMessage = document.getElementById('no-tasks-message');
let taskArray = [];

const loadFromDatabase = async () => {
    try{
        const response = await fetch('http://localhost:3000/tasks');

        taskArray = await response.json();

        if( taskArray.length !== 0 ) {
            taskArray.forEach((task) => {
                createTaskElement(task);
            });
        }
    }
    catch(err){
        console.error(err);
    }

    updateTaskMessage();
}

const addTask = async () => {
    const descripcion = textInput.value;

    if( !descripcion ) {
        alert('Debes ingresar una tarea');
        
        return;
    }

    try {
        const response = await fetch('http://localhost:3000/tasks', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ descripcion }),
        });

        const { task } = await response.json();

        createTaskElement(task);

        textInput.value = '';
        taskArray.push(task);

        updateTaskMessage();

        return;
        
    }
    catch(err){
        console.error(err);
    }
}

const createTaskElement = (task) => {
    const { id, descripcion, completada } = task;

    const listElement = document.createElement('li');
    listElement.setAttribute('id', `${id}` );

    // Crear el div que contiene los datos de la tarea.
    const divElement = document.createElement('div');
    divElement.setAttribute('class', 'list-element');
    divElement.setAttribute('id', `${id}`);

    // Crear el parrafo.
    const pElement = document.createElement('p');
    pElement.innerHTML = descripcion;
    pElement.setAttribute('onclick', `toggleTask('${id}')`);

    // Crear la imagen del boton.
    const imgElement = document.createElement('img');
    imgElement.setAttribute('src', 'assets/6861362.png');
    imgElement.setAttribute('alt', 'delete');
    
    // Crear el boton.
    const deleteButtonElement = document.createElement('button');
    deleteButtonElement.setAttribute('class', 'delete-task');
    deleteButtonElement.setAttribute('onclick', `deleteTask('${id}')`);

    if( completada ) {
        pElement.classList.add('task-completed');
    }

    deleteButtonElement.appendChild(imgElement);

    divElement.appendChild(pElement);
    divElement.appendChild(deleteButtonElement);

    listElement.appendChild(divElement);

    taskList.appendChild(listElement);
}

const deleteTask = async (id) => {
    const element = document.getElementById(id);
    
    try{
        const response = await fetch(`http://localhost:3000/tasks/${id}`,{ 
            method: 'DELETE',
        });

        const data = await response.json();

        if( !data.ok ) throw new Error('Could not delete record from DB');
        
        element.remove();
        taskArray = taskArray.filter( t => t.id !== id );
    
        updateTaskMessage();
    }
    catch(err){
        console.error(err);
    }

}

const toggleTask = async (id) => {
    const element = document.getElementById(id);
    const isCompleted = element.classList.contains('task-completed');

    const body = {
        completada: 0,
    }

    if( isCompleted ){
        body.completada = 0;
        element.classList.remove('task-completed');
    }
    else{
        body.completada = 1;
        element.classList.add('task-completed');
    }

    try{
        const response = await fetch(`http://localhost:3000/tasks/${id}`,{ 
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(body),
        });
    }
    catch(err){
        console.error(err);
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

loadFromDatabase();
