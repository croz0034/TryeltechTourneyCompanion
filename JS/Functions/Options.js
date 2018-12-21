let Options = {
    init: ()=>{
        
        document.querySelector("#TwilightZone").addEventListener("click", Options.KingdomOption);
        document.querySelector("#ParkInput").addEventListener("keyup", Options.KingdomFilter);
        document.querySelector(".typeShift").addEventListener("click", Options.EliminationStyle);
        
        if(localStorage.getItem("Options")){
            console.log(localStorage.getItem("Options"))
            NameFiles.Home = localStorage.getItem("Options").homeKingdom;
            Tourney.DoubleElim = localStorage.getItem("Options").DoubleElim;
            if(localStorage.getItem("Options").DoubleElim){
               
            document.querySelector(".typeShift").textContent = "Sngl-Elim";
            Tourney.DoubleElim = true;
            Options.Options.DoubleElim = true;
            document.querySelector(".HomeStyle").textContent = "Double Elimination";
               }
        }
    },
    Options: {
        homeKingdom: 31,
        DoubleElim: false,
        styles: []},
    SaveOptions: ()=>{
        localStorage.setItem("Options", JSON.stringify(Options.Options))
    },
     KingdomOption: (ev)=>{
        if(localStorage.getItem("KingdomList")){
            
           let parksData =  JSON.parse(localStorage.getItem("KingdomList"))
           console.log("KingdomList")
           parksData.forEach((kingdom)=>{
                let additions = document.createElement("li")
                additions.textContent = kingdom[0];
                additions.id = kingdom[1];
                additions.addEventListener("click", Options.KingdomSelect)
                document.getElementById("Parks").appendChild(additions);
                Options.KingdomRoster.push(additions)
            
                
            })
        } else{
        jsork.kingdom.getKingdoms(function (data) {
            let AllKingdoms = []
            data.forEach((kingdom) => {
                console.log(kingdom);
                let additions = document.createElement("li")
                additions.textContent = kingdom.KingdomName;
                additions.id = kingdom.KingdomId;
                AllKingdoms.push([kingdom.KingdomName, kingdom.KingdomId])
                additions.addEventListener("click", Options.KingdomSelect)
                document.getElementById("Parks").appendChild(additions);
                Options.KingdomRoster.push(additions)
            })
            
                localStorage.setItem("KingdomList", JSON.stringify(AllKingdoms))
            
        })
    
        }
}, 
    KingdomSelect: (ev)=>{
    NameFiles.People = []
    console.log(ev.target.id)
    NameFiles.Home = ev.target.id;
    Options.Options.homeKingdom = ev.target.id;
        NameFiles.ParkListings(ev.target.id);
    console.log(ev.target.id);
        MasterCode.CurrentPage = document.querySelector(".Options");
        MasterCode.PageShift();   
        Options.SaveOptions()
},
    KingdomRoster: [],
    KingdomFilter: (ev)=>{
            Options.KingdomRoster.forEach((name) => {
                console.log(name.textContent.toLocaleLowerCase())
                console.log(ev.target.value.toLocaleLowerCase())
                if ((name.textContent.toLocaleLowerCase()).includes(ev.target.value.toLocaleLowerCase()) && name.classList.contains("hidden")) {
                    name.classList.remove("hidden")
                } else if (!(name.id.toLocaleLowerCase()).includes(ev.target.value.toLocaleLowerCase())) {
                    name.classList.add("hidden")
                }
            })
    },
   
    EliminationStyle: (ev) => {
        console.log("click")
        if (ev.target.textContent == "Dbl-Elim") {
            ev.target.textContent = "Sngl-Elim";
            Tourney.DoubleElim = true;
            Options.Options.DoubleElim = true;
            document.querySelector(".HomeStyle").textContent = "Double Elimination";
        } else {
            ev.target.textContent = "Dbl-Elim";
            Tourney.DoubleElim = false;
            Options.Options.DoubleElim = false;
            document.querySelector(".HomeStyle").textContent = "Single Elimination";
        }
        Options.SaveOptions()
    },
    
    FightingStyles: (ev)=>{
    
}
}