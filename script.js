// import { nanoid } from 'nanoid'
// model.id = nanoid() //=> "V1StGXR8_Z5jdHi6B-myT"
// localStorage.clear();
const addbtn=document.querySelector('.add-btn');
const rmvbtn=document.querySelector('.rmv-btn');
// console.log(addbtn)
let addFlag=false;
let rmvFlag=false;
let modalCont=document.querySelector('.modal-cont');
let mainCont=document.querySelector('.main-cont');
let textAreaCont=document.querySelector('.textarea-container');

let allProirityColors=document.querySelectorAll('.priority-color') //from modal not toolbar
let colors=['lightpink','lightblue','lightgreen','black'];
let modalPriorityColor=colors[colors.length-1]; //simpli -1 won't work in js

let lockEle=document.querySelector('.tkt-lock');
let lockClass='fa-lock'//fontAwesome
let unlockClass='fa-lock-open'//fontAwesome

let toolBoxColors=document.querySelectorAll('.color')//sabke pas .color class hai
// console.log(toolBoxColors);

let tickets=[];//array of tickets{tktColor,tktTask,tktID}
// when we create a ticket simply append this.Also when we click that
// color of toolbar , we destroy all tkt and 


// console.log(localStorage.getItem('jira-tickets'))
//on reload . data is still there in local storage
if(localStorage.getItem('jira-tickets')){
    //retreeve and display tickets
    tickets=JSON.parse(localStorage.getItem('jira-tickets'));
    tickets.forEach((tkt)=>{
        createTicket(tkt.tktColor,tkt.tktTask,tkt.tktID)
    })
}



allProirityColors.forEach((colorEle,idx)=>{
    colorEle.addEventListener('click',(e)=>{ // jispe click kia uspe border lagana hai
        allProirityColors.forEach((priorityColorEle,idx)=>{// saare elements se border hata do
            priorityColorEle.classList.remove('border');// saare clor se border remove
        });
        colorEle.classList.add('border') // current wale pe ab dal do  
        //abhi to bas border dali hai ab us ticket ka priority color bhi wahi ho
        modalPriorityColor=colorEle.classList[0];//0- lightpink, 1-priority-color
        // console.log(colorEle.classList[0]);
    });
});


//modal priority eventlistener while creation


// add button event listener..
addbtn.addEventListener('click',(e)=>{
    // console.log("clicked");
    // display modal addflag=>true=>display and vice versa
    addFlag=!addFlag;
    // console.log(addFlag);
    if(addFlag){
        modalCont.style.display='flex';
        addbtn.style.backgroundColor="#485460";
    }else{
        modalCont.style.display='none';
        addbtn.style.backgroundColor="#3d3d3d";
    }
    //generate ticket
    // createTicket(); 
});

// remove button(x) event Listener...
rmvbtn.addEventListener('click',(e)=>{
    rmvFlag=!rmvFlag;
    if(rmvFlag){
        rmvbtn.style.backgroundColor="#485460";
    }else{
        rmvbtn.style.backgroundColor="#3d3d3d"
    }
});

//event listener for creating ticket by pressing shift in modalContainer
modalCont.addEventListener('keydown',(e)=>{//when a key is pressed
    //keydown, keypress then keyup.
    // console.log(e);
    let key=e.key;    
    if(key=="Shift"){
        createTicket(modalPriorityColor,textAreaCont.value);//Not passing tkt id
        addFlag=false;
        //written below code modularly in different function
        // modalCont.style.display='none'; 
        //          // textAreaCont.innerText=""; won't work
        // textAreaCont.value='';
        setModalTODefault();
    }

});


//Create ticket(object)
function createTicket(tktColor,tktTask,tktID){
    let id=tktID || Math.floor(Math.random() * 10000000000);;
    let tktCont=document.createElement("div")
    // console.log(tktCont);
    // console.log(tktColor)
    tktCont.setAttribute("class","ticket-cont")
    // console.log(tktCont);
    tktCont.innerHTML=`
            <div class="tkt-color ${tktColor}"></div>
            <div class="tkt-id">#${id}</div>
            <div class="task-area">${tktTask}</div>
            <div class="tkt-lock"><i class="fa-solid fa-lock"></i></div>
    `;
    // console.log(tktCont);
    mainCont.appendChild(tktCont);//display to karan hi hai. bhae pehele se ho ya na ho
    if(!tktID){//agar tkt id undefined hai ie pass nhi ki hai(already does'nt exist)
        tickets.push({tktColor,tktTask,tktID : id});//tkt id ki value id hai like kwargs
        localStorage.setItem("jira-tickets",JSON.stringify(tickets))//har baar naya ticket create karne ke baad local storage update.
        //store string format me hota hai.
    } //tktID ki value id hai. tktID key hai not variable 


    handleRemoval(tktCont,id);//ticket create hone ke baad hi remove ho.
    
    //ticket create hone ke baad lock ho sakta he. isliye is me likha hai.
    handleLock(tktCont,id);

    //ticket ke color pe click karne se priority-color change ho.
    handleColor(tktCont,id); //id is for storage module.
}
//common funtion to be use in handleRemoval, handleLock and handlecolor
function getTicketIndex(id){
    let tktidx=tickets.findIndex((tkt)=>{
        return tkt.tktID==id;
    });
    return tktidx;
}


// remove ticket
function handleRemoval(tkt,id){
    // console.log(tkt);
    tkt.addEventListener('click',(e)=>{
        if(rmvFlag){
            // console.log(tkt)
            tkt.remove(); //ui removal

            //LOCAL STORAGE removal
            let currTktIdx=getTicketIndex(id); 
            tickets.splice(currTktIdx,1);//idx se leke ek value remove karni hai
            localStorage.setItem('jira-tickets',JSON.stringify(tickets));


        }
    });
}

//eventListener for lock unlock button and editable or not
function handleLock(tkt,id){
    let tktLockEle=tkt.querySelector('.tkt-lock');//tkt.q not document.querySelector
    //document wala poore document me dekhega. tkt wala us tkt me dekhega
    let tktLock=tktLockEle.children[0];
    // console.log(tktLock)
    let tktTaskArea=tkt.querySelector('.task-area');
    tktLock.addEventListener('click',(e)=>{
         if(tktLock.classList.contains(lockClass)){
            //locked hai unlock karna hai and should be able to edit div content
            tktLock.classList.remove(lockClass);
            tktLock.classList.add(unlockClass);
            tktTaskArea.setAttribute('contenteditable','true');
         }else{
            //unlock hai lock karo
            tktLock.classList.remove(unlockClass);
            tktLock.classList.add(lockClass);
            tktTaskArea.setAttribute('contenteditable','false');
         }


         //modify LOCAL STAAGE task area
         let currTktColorIdx=getTicketIndex(id);
         tickets[currTktColorIdx].tktTask=tktTaskArea.innerText;
        //  console.log(currTktColorIdx); 
         localStorage.setItem('jira-tickets',JSON.stringify(tickets));
         
    });
}



//eventListener for changing priority color of ticket by click 
function handleColor(tkt,id){
    let tktColor=tkt.querySelector('.tkt-color');

    
    tktColor.addEventListener('click',(e)=>{
        let currTktColor=tktColor.classList[1] ; //0=>tkt-color, 1=>lightpink
        //now from colors array, find the next color to current color
        let currTktColorIdx=colors.findIndex((color)=>{
            return currTktColor===color;//see docs of findIndex,it will reurn idx
        });
        let newTktColorIdx=(currTktColorIdx+1)%colors.length;
        let newTktColor=colors[newTktColorIdx];
        //above few lines could be written in 1 line
        //seedha function se next color return karado using maybe forEach

        //Now remove current color ans add new color
        tktColor.classList.remove(currTktColor);
        tktColor.classList.add(newTktColor);
        // console.log(currTktColor,newTktColor); 


         //MODIFY LOCAL STORAGE (Priority color change)
        let currTktIdx=getTicketIndex(id)
        //  console.log(currTktIdx);
        tickets[currTktIdx].tktColor=newTktColor;
        localStorage.setItem('jira-tickets',JSON.stringify(tickets));
    });
}



//event listener for priorityColors on toolbar 
//display all tickets of that color on click and all tickets on double click
toolBoxColors.forEach((color,idx)=>{//simple for loop bhi laga sakte the
    color.addEventListener('click',(e)=>{
        //print toolboxColors or see classes in toolbox-piority-container in html to understand
        // console.log(color); 
        let currToolboxColor=color.classList[0];  
        // console.log(currToolboxColor)
        let filteredTkts=tickets.filter((tktObj,idx)=>{//overloaded,idx not mandatory
            // console.log(tktObj)
            return tktObj.tktColor===currToolboxColor;
        });
        
        // console.log(filteredTkts)=>[{ticktclr,id,text},{},{}]

        //remove previous tkts
        let allTktCont=document.querySelectorAll('.ticket-cont');
        allTktCont.forEach((tkt)=>{
            // console.log(tkt)
            tkt.remove();//removes this element from html
        });
        //display new filtered tkts
        filteredTkts.forEach((tkt)=>{
            createTicket(tkt.tktColor,tkt.tktTask,tkt.tktID)//tkt already exists to id pass kardi
        });
    });

        
        //double click wala eventListener click ke bad hi
        
    color.addEventListener('dblclick',(e)=>{
        //remove all current tickets and and display all tkts of tickets[]
        // console.log(color)

        //remove previous tkts same code as written 10 lines above
        let allTktCont=document.querySelectorAll('.ticket-cont');
        allTktCont.forEach((tkt)=>{
            // console.log(tkt)
            tkt.remove();//removes this element from html
        })

        // console.log(tickets)
        //display all tickets of array . thats why it was needed
        tickets.forEach((tkt,idx)=>{//idx nor needed
            //here I don't know why tkt.tktcolor is not working
            // console.log(idx)
            createTicket(tickets[idx].tktColor,tickets[idx].tktTask,tickets[idx].tktID)
        });
    });
});

//Note tickets array me add tabhi ho raha hai jab modal se create hua hai.
//Baki kisi bhi tarike se create hua wo already array me hoga hi.
//modal se create hone pe id undefined hogi aur hum create karenge

//also mujhe pata nhi chl raha ki tickets[] containing object{color,tsk}
//cha gya pata=>tickets [] arrya hai isliye indexing se access hoga na ki key se jo ki me pehle try kar raha tha..

function setModalTODefault(){//defaut me border wapas black wale ke pas aa jaye
    modalCont.style.display='none';
    textAreaCont.value='';
    allProirityColors.forEach((color)=>{ //sabse remove
        color.classList.remove('border');
    });
    allProirityColors[allProirityColors.length-1].classList.add("border") //black pe border add change in ui only
    modalPriorityColor=allProirityColors[allProirityColors.length-1].classList[0];//change in actual backend

}