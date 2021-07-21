const select = document.querySelector("select");
const mem=document.querySelector(".members");
select.addEventListener("change",()=>{
    var x= select.options[select.selectedIndex].text;
    for(var i=0;i<x;i++)
    {
        var ids=document.querySelectorAll(`#team_mem${i+1}`);
    }
    ids[0].style.visibility="visible";
    mem.style.visibility="visible";
    
})

document.getElementsByClassName(".sub").addEventListener("submit",x);
function x(){
    alert("form submitted");
}
