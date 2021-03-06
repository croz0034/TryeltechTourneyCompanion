let NameFiles = {
    NetStatus: "online",
//    NetStatus: "onlitne",
    // Home area set to the NE
    Home: 31,
    // Filled out by ParkListings. Will allow for parks to be called by name rather than number
    Parks: {},
    // People in the selected area
    People: {},
    init: () => {
        // Convenience shortcut
        let c = NameFiles

        if (localStorage.getItem("PlayerList")) {
            
            NameFiles.People = JSON.parse(localStorage.getItem("PlayerList"));

            let PlayerList = JSON.parse(localStorage.getItem("PlayerList"))
            Object.keys(PlayerList).forEach((person) => {
                let additions = document.createElement("li")
                additions.textContent = person;
                additions.id = person
                additions.addEventListener("click", NameFiles.PersonSelect)
                document.getElementById("People").appendChild(additions);
                NameFiles.ElementRoster.push(additions);

            })
        } else {
            c.ParkListings(c.Home)
        }


        document.querySelector(".RosterDelete").addEventListener("click", c.PersonRemove)
        document.getElementById("inputField").addEventListener("keyup", c.RosterFilter);
        document.querySelector(".DarkZone").addEventListener("click", c.ReturnToList)
        document.getElementById("inputField").addEventListener("click", c.nullClick);

    },
    ParkListings: async function (Kingdom) {
        // Convenience shortcut
        let c = NameFiles
        await jsork.kingdom.getParks(Kingdom, (data) => {
            data.forEach((park) => {
                c.Parks[park.Name] = park.ParkId;
                c.PeopleListings(park);
            })
        })
        NameFiles.BuildRoster()
    },
    PeopleListings: (Park) => {
        // Convenience shortcut
        let c = NameFiles
        jsork.park.getPlayers(Park.ParkId, 0, function (data) {
            data.forEach((Player) => {
                c.People[Player.Persona] = Player.MundaneId
            })
        })
    },
    BuildRoster: () => {

        setTimeout(() => {
            let SaveList = {};
                document.getElementById("People").innerHTML = "";
            Object.keys(NameFiles.People).forEach((person) => {
                let additions = document.createElement("li")
                additions.textContent = person;
                additions.id = person
                additions.addEventListener("click", NameFiles.PersonSelect)
                document.getElementById("People").appendChild(additions);
                NameFiles.ElementRoster.push(additions);
                SaveList[person] = NameFiles.People[person]
            });
            console.log(JSON.stringify(SaveList))
                localStorage.setItem("PlayerList", JSON.stringify(SaveList))
        }, 2000)
    },
    RosterFilter: (ev) => {
        console.log(ev.keyCode)
        if (ev.keyCode == 13 && ev.target.value) {
            console.log("go!")
            let newPerson = {
                target: {
                    id: ev.target.value
                }
            }
            NameFiles.PersonSelect(newPerson);
            NameFiles.ReturnToList();
        } else {
            NameFiles.ElementRoster.forEach((name) => {
                if ((name.id.toLocaleLowerCase()).includes(ev.target.value.toLocaleLowerCase()) && name.classList.contains("hidden")) {
                    name.classList.remove("hidden")
                } else if (!(name.id.toLocaleLowerCase()).includes(ev.target.value.toLocaleLowerCase())) {
                    name.classList.add("hidden")
                }
            })
        }
        console.log(ev.target.value)
    },
    ////////////// Player Adder
    currentTarget: "",
    ElementRoster: [],
    PersonSelect: (ev) => {
        NameFiles.nullClick(ev)
        let id = NameFiles.People[ev.target.id];
        console.log('click')

        if (NameFiles.NetStatus == "online") {
            jsork.player.getAwards(id, jsork.awardIDs.ORDER_OF_THE_WARRIOR, function (data) {
                if (data.length >= 11) {
                    data.length = 0
                }
                NameFiles.Participants.push({
                    name: ev.target.id,
                    orders: data.length,
                    longest: 0,
                    current: 0,
                    score: 0,
                    comboBreak: 0
                });
                console.log(`${ev.target.id}: ${data.length} orders`);
                NameFiles.ReturnToList()
            });
        } else {
            NameFiles.Participants.push({
                name: ev.target.id,
                orders: 0,
                longest: 0,
                current: 0,
                score: 0,
                comboBreak: 0
            });


        }
        console.log(NameFiles.Participants)
    },
    PersonHighlight: (ev)=>{
        if(ev.target.nodeName == "INPUT"){
            NameFiles.signup(ev)} else {
            console.log(ev.target.nodeName)
        if(NameFiles.currentTarget){NameFiles.currentTarget.classList.remove("active")}
        ev.target.classList.add("active");
        NameFiles.currentTarget = ev.target;
        }
        
    },
    //////////////// PlayerRemove
    PersonRemove: (ev) =>{
        NameFiles.Participants.splice(NameFiles.currentTarget, 1);
        NameFiles.ReturnToList();
    },
    ///////////// Tourney Functions
    Participants: [],
    SortByOrders: () => {
        let Unsorted = NameFiles.Participants;
        Unsorted = Unsorted.sort((a, b) => {
            return b.orders - a.orders
        })

    },
    ReturnToList: () => {
        let updateTarget = document.querySelector(".SignedUpPlayers")
        updateTarget.innerHTML = "";

        NameFiles.SortByOrders()
        let x = 0 
        console.log(NameFiles.Participants)
        NameFiles.Participants.forEach((person) => {
            let additions = document.createElement('li');
            additions.id = x;
            additions.textContent = ` ${person.name} : ${person.orders} Orders of the warrior`
            additions.addEventListener('click', NameFiles.PersonHighlight);
            updateTarget.appendChild(additions)
            x ++;
            
            
                //////////// Tourney Types
                console.log(Options.FightingStyles)
                Options.FightingStyles.forEach((Tstyle)=>{
                let TourneyStyles = document.createElement("input");
                    TourneyStyles.type = "checkbox";
                    TourneyStyles.checked = person[Tstyle];
                    TourneyStyles.id = Tstyle;
                    additions.appendChild(TourneyStyles);
                })
        })
        MasterCode.CurrentPage = document.querySelector(".ParticipantList");
        MasterCode.PageShift();
    },
    nullClick: (ev) => {
        ev.preventDefault();
        ev.stopPropagation();
        console.log("ping")
    },
    signup: (ev) => {
        console.log(ev.target.id);
        console.log(ev.target.checked)
        console.log(ev.target.parentElement.id)
        console.log(NameFiles.Participants[ev.target.parentElement.id])
        NameFiles.Participants[ev.target.parentElement.id][ev.target.id] = ev.target.checked
    }
};

let DeadNet = (ev) => {
    NameFiles.NetStatus = "offline";
    console.log("ded")
}
let ActiveNet = (ev) => {
    NameFiles.NetStatus = "online";
    console.log("live")
}

document.addEventListener("online", ActiveNet)
document.addEventListener("offline", DeadNet)



    