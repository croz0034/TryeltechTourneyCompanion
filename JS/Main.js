let pages = ["HomePage", "DarkZone", "PagePrototype", "ParticipantList", "SeededTourney"]

let MasterCode = {
    HomePage : document.querySelector(".HomePage"),
    CurrentPage: "",
    init: ()=>{
        MasterCode.CurrentPage = MasterCode.HomePage;
        
        MasterCode.PageShift();
        NameFiles.init();
        
        document.querySelectorAll("Button").forEach((page)=>{page.addEventListener("click", MasterCode.Intent)})
        
        document.querySelector(".Add").addEventListener("click", MasterCode.DarkShift)
        
        document.querySelectorAll('#SeededTourney').forEach((item)=>{item.addEventListener("click", Tourney.Handler)});
        
        document.querySelector(".StartTimer").addEventListener("click", Tourney.Timer);
        
        document.querySelector(".fighter0").addEventListener("click", Tourney.WinButton);
        document.querySelector(".fighter1").addEventListener("click", Tourney.WinButton);
        document.querySelector(".NextRound").addEventListener("click", Tourney.NextRound);
        document.querySelector(".typeShift").addEventListener("click", MasterCode.typeShift)
      },
    Intent: (ev)=>{
        if(ev.target.id){
            console.log('ping');
        MasterCode.CurrentPage = document.querySelector(`.${ev.target.id}`);
        MasterCode.PageShift()}
    },
    PageShift: ()=>{
        pages.forEach((page)=>{
           document.querySelector(`.${page}`).classList.add("hidden");
        })
        MasterCode.CurrentPage.classList.remove("hidden");
        console.log("PageShift")
    },
    typeShift: (ev)=>{
        console.log("click")
    if(ev.target.textContent == "Dbl-Elim"){
        ev.target.textContent = "Sngl-Elim";
        Tourney.DoubleElim = true;
        document.querySelector(".HomeStyle").textContent = "Double Elimination";
    }else{
        ev.target.textContent = "Dbl-Elim";
        Tourney.DoubleElim = false;
        document.querySelector(".HomeStyle").textContent = "Single Elimination";
    }
}
    
}

document.addEventListener("DOMContentLoaded", MasterCode.init)