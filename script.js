//Add button functionality
const addBtn = document.querySelector(".action-add-btn");
const removeBtn = document.querySelector(".action-remove-btn");
const modal = document.querySelector(".modal-container");
const priorityColorCOntainer = document.querySelector(".color-container");
const priorityColorAll = document.querySelectorAll(".priority-color");
const textareaContainer = document.querySelector(".textarea-container");
const tasksCont = document.querySelector(".tasks-cont");
const toolboxColorCont = document.querySelector(".toolbox-color-container");
let addTaskFlag = false;
let removeTaskFlag = false;
let lockFlag = true;
let selectedColor = "black";
let taskArr = [];

document.addEventListener("DOMContentLoaded", function() {
    let storedTasks = localStorage.getItem("tasks");
    taskArr = storedTasks ? JSON.parse(storedTasks) : [];
    taskArr.forEach(task => {
        createTask(task.taskColor, task.taskDesc, task.taskId);
    });
    
})
addBtn.addEventListener("click", function(){
    addTaskFlag = !addTaskFlag;
    if (addTaskFlag) {
        modal.style.display = "flex";
    }else{
        modal.style.display = "none";
    }
    
})

removeBtn.addEventListener("click", function(){
    removeTaskFlag=!removeTaskFlag;
    if (removeTaskFlag) {
        removeBtn.style.color = "red";
        removeBtn.style.fontSize = "24px";
    }else{
        removeBtn.style.color = "white";
        removeBtn.style.fontSize = "30px";
    }
})

toolboxColorCont.addEventListener("click", function(e){
    if(e.target.classList.contains("color")){
        let selectedColor = e.target.classList[0];
        //console.log(e.target.classList[0])
        let colors = document.querySelectorAll(`.task-color`)
        colors.forEach(color => {
            if(selectedColor!=color.classList[0]){
                color.parentElement.style.display = "none";
            }else{
                color.parentElement.style.display = "block";
            }
        })
    }
})

toolboxColorCont.addEventListener("dblclick", function(e){
    if(e.target.classList.contains("color")){
        let selectedColor = e.target.classList[0];
        //console.log(e.target.classList[0])
        let colors = document.querySelectorAll(`.task-color`)
        colors.forEach(color => {
            color.parentElement.style.display = "block";
        })
    }
})

priorityColorAll.forEach(color => {
    color.addEventListener("click", function(){
        priorityColorAll.forEach(activeColor => {
            if(activeColor.classList.contains("active")){
                activeColor.classList.remove("active");
            }
        })
        color.classList.add("active");
        selectedColor = color.classList[0];
    })
});

modal.addEventListener("keydown", function(e){
    let key = e.key;
    //console.log(key);
    let taskdesc = textareaContainer.value;
    if(key === "Enter"){
        //console.log(selectedColor, textareaContainer.value)
        let id =  shortid();
        modal.style.display = "none";
        textareaContainer.value = "";
        createTask(selectedColor, taskdesc, id);
        taskArr.push({taskColor:selectedColor, taskDesc:taskdesc, taskId: id});
        storeLocally(taskArr);
        
    }
    
})

function createTask(selectedColor, taskDesc, id) {
    //console.log(typeof(id));
    let taskDiv = document.createElement("div");
    taskDiv.setAttribute("class","task-detail");
    taskDiv.innerHTML = `
        <div class="${selectedColor} task-color"></div>
        <div class="task-id">${id}</div>
        <div class="task-desc">${taskDesc}</div>
        <div class="lock"><i class="fa-solid fa-lock"></i></div>
    `;
    tasksCont.appendChild(taskDiv);
    handleLock(taskDiv, id);
    handleRemoval(taskDiv,id);
}

function handleRemoval(task, id) {
    task.addEventListener("click", function(){
        if(!removeTaskFlag){return;}
        task.remove();
        taskArr = taskArr.filter(task => task.taskId !== id);
        // Update local storage after removing the task
        storeLocally(taskArr);
    })
}

function handleLock(task, id) {
    let icon = task.children[3];
    icon.addEventListener("click", function(){
        if(lockFlag){
            lockFlag = false;
            icon.children[0].classList.remove("fa-lock");
            icon.children[0].classList.add("fa-lock-open");
            task.children[2].contentEditable = true;
            task.children[2].focus();
        }
        else{ 
            lockFlag  = true;
            icon.children[0].classList.remove("fa-lock-open");
            icon.children[0].classList.add("fa-lock");
            task.children[2].contentEditable = false;
            taskArr.map(t => {
                if(t.taskId === id){
                    t.taskDesc = task.children[2].innerText;
                    //console.log(t.taskDesc);
                }
            })
            storeLocally(taskArr);
        }
    })
}

function storeLocally(taskArr){
    let task = JSON.stringify(taskArr);
    localStorage.setItem("tasks", task);
}
