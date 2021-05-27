let TC = document.querySelector(".ticket-container");
let allFilters = document.querySelectorAll(".filter");
let CTL = document.querySelector(".completed-task-list");
let modalVisible = false;

function loadTickets(color){
    let allTasks = localStorage.getItem("allTasks");
    if(allTasks != null) {
        allTasks = JSON.parse(allTasks);
        if(color){
            allTasks=allTasks.filter(function(data){
                return data.priority == color;
            })
        }
        for(let i = 0; i < allTasks.length; i++) {
            if(!allTasks[i].completeTask){
                let ticket = document.createElement("div");
                ticket.classList.add("ticket");
                ticket.innerHTML = `<div class="ticket-color ticket-color-${allTasks[i].priority}"></div>
                                <div class="ticket-id">#${allTasks[i].ticketId}</div>
                                <div class="task">${allTasks[i].task}</div>
                                <div class="material-icons complete">done</div>`;
                TC.appendChild(ticket);
                ticket.addEventListener("click", function(e) {
                    if(e.currentTarget.classList.contains("active")) {
                        e.currentTarget.classList.remove("active");
                    } else {
                        e.currentTarget.classList.add("active");
                    }
                });
            }
        }
    }
}

function completeTicket(color){
    let allTasks = localStorage.getItem("allTasks");
    if(allTasks != null) {
        allTasks = JSON.parse(allTasks);
        if(color){
            allTasks=allTasks.filter(function(data){
                return data.priority == color;
            })
        }
        for(let i = 0; i < allTasks.length; i++) {
            if(allTasks[i].completeTask){
                let ticket = document.createElement("div");
                ticket.classList.add("ticket");
                ticket.innerHTML = `<div class="ticket-color ticket-color-${allTasks[i].priority}"></div>
                                <div class="ticket-id">#${allTasks[i].ticketId}</div>
                                <div class="task">${allTasks[i].task}</div>
                                `;
                CTL.appendChild(ticket);
                ticket.addEventListener("click", function(e) {
                    if(e.currentTarget.classList.contains("active")) {
                        e.currentTarget.classList.remove("active");
                    } else {
                        e.currentTarget.classList.add("active");
                    }
                });
            }
        }
    }
}

loadTickets();
completeTicket();

for(let i = 0 ; i < allFilters.length; i++) {
    allFilters[i].addEventListener("click", filterHandler);
}

function filterHandler (e) {
    TC.innerHTML="";
    if(e.currentTarget.classList.contains("active")){
        e.currentTarget.classList.remove("active");
        loadTickets();
        completeTicket();
    }else{
        let activeFIlter=document.querySelector(".filter.active");
        if(activeFIlter){
            activeFIlter.classList.remove("active");
        }
        e.currentTarget.classList.add("active");
        let ticketPriority=e.currentTarget.children[0].classList[0].split("-")[0];
        loadTickets(ticketPriority);
        completeTicket(ticketPriority);
    }
}
let addBtn = document.querySelector(".add");
let deleteBtn = document.querySelector(".delete");
let deleteBtn1 = document.querySelector(".delete-btn");

 function  deleteTask(e){
    let selectedTickets = document.querySelectorAll(".ticket.active");
    let allTasks = JSON.parse(localStorage.getItem("allTasks"));
    for(let i = 0; i < selectedTickets.length; i++) {
        selectedTickets[i].remove();
        let ticketID = selectedTickets[i].querySelector(".ticket-id").innerText;
        allTasks = allTasks.filter(function(data) {
            return (("#" + data.ticketId) != ticketID);
        });
    }
    localStorage.setItem("allTasks", JSON.stringify(allTasks));
};

deleteBtn.addEventListener("click", deleteTask);
deleteBtn1.addEventListener("click", deleteTask);

addBtn.addEventListener("click", showModal);

let selectedPriority;

function showModal(e) {
    if(!modalVisible) {
        let modal = document.createElement("div");
        modal.classList.add("modal");
        modal.innerHTML = `<div class="task-to-be-added" data-typed="false" contenteditable="true">Enter your task here</div>
            <div class="modal-priority-list">
                <div class="modal-red-filter modal-filter active"></div>
                <div class="modal-blue-filter modal-filter"></div>
                <div class="modal-green-filter  modal-filter"></div>
                <div class="modal-yellow-filter  modal-filter"></div>
            </div>`;
        TC.appendChild(modal);
        selectedPriority = "red"; //by default
        let taskModal = document.querySelector(".task-to-be-added");
        taskModal.addEventListener("click", function(e) {
            if(e.currentTarget.getAttribute("data-typed") == "false") {
                e.currentTarget.innerText = "";
                e.currentTarget.setAttribute("data-typed", "true");
            }
        })
        modalVisible = true;
        taskModal.addEventListener("keypress", addTicket.bind(this,taskModal));
        let modalFilters = document.querySelectorAll(".modal-filter");
        for(let i = 0; i < modalFilters.length; i++) {
            modalFilters[i].addEventListener("click", selectPriority.bind(this,taskModal));
        }
    }

}


function selectPriority(taskModal,e) {
    let activeFIlter = document.querySelector(".modal-filter.active");
    activeFIlter.classList.remove("active");
    selectedPriority = e.currentTarget.classList[0].split("-")[1];
    e.currentTarget.classList.add("active");
    taskModal.click();
    taskModal.focus();
}


function addTicket(taskModal,e) {
    console.log(e);
    if(e.key == "Enter" && e.shiftKey == false && taskModal.innerText.trim() != "") {
        let task = taskModal.innerText;
        let id = uid();
        
        document.querySelector(".modal").remove();
        modalVisible = false;

        let allTasks = localStorage.getItem("allTasks");
        TC.innerHTML="";
        if(allTasks == null) {
            let data = [{"ticketId": id, "task": task, "priority": selectedPriority,"completeTask":false}];
            localStorage.setItem("allTasks", JSON.stringify(data));
        } else {
            let data = JSON.parse(allTasks);
            data.push({"ticketId": id, "task": task, "priority": selectedPriority,"completeTask":false});
            localStorage.setItem("allTasks", JSON.stringify(data));
        }
        let activeFIlter=document.querySelector(".filter.active")
        if(activeFIlter){
            let Priority=e.currentTarget.children[0].classList[0].split("-")[0];
            loadTickets(Priority);
            completeTicket(Priority);
        }else{
            loadTickets();
            completeTicket();
            
        }
    } else if(e.key == "Enter" && e.shiftKey == false) {
        e.preventDefault();
        alert("Error! You have not type anything in task.")
    }
}

function addCompleteTicket(){
    let allTasks = localStorage.getItem("allTasks");
        if(allTasks != null) {
            allTasks = JSON.parse(allTasks);
        }
       // console.log(allTasks[0].ticketId);
        allTasks.push({"ticketId": allTasks[0].ticketId, "task": allTasks[0].task, "priority": allTasks[0].priority,"completeTask":true});
        localStorage.setItem("allTasks", JSON.stringify(allTasks));
        completeTicket();
        console.log("allTasks[0].completeTask");
}

let completebtn = document.querySelector(".complete");
    completebtn.addEventListener("click",addCompleteTicket);
     completebtn.addEventListener("click",deleteTask);