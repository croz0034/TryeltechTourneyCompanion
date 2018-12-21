let Tourney = {
    init: ()=>{
        
        document.querySelector(".StartTimer").addEventListener("click", Tourney.Timer);
        document.querySelector(".fighter0").addEventListener("click", Tourney.WinButton);
        document.querySelector(".fighter1").addEventListener("click", Tourney.WinButton);
        document.querySelector(".NextRound").addEventListener("click", Tourney.NextRound);
        document.querySelectorAll('#SeededTourney').forEach((item) => {
            item.addEventListener("click", Tourney.Handler)
        });
    },
    ///////////////////
    Prelim: false,
    PrelimElim: [],
    DoubleElim: false,
    LoseBracket: false,
    Handler: (ev) => {
        document.querySelector(".SeededTourney").querySelector('h3').textContent = ev.target.classList[1] + " Tourney";
        document.querySelector('.BracketPlace').innerHTML = "";
        Tourney[ev.target.classList[1]]();

        if (ev.target.classList[1] == "WLS") {
            document.querySelector(".FightBanner").classList.add("hidden");
            document.querySelector(".WLSBanner").classList.remove("hidden");
        } else {
            document.querySelector(".WLSBanner").classList.add("hidden");
            document.querySelector(".FightBanner").classList.remove("hidden");

        }
    },
    ///////////////// Types: 
    Seeded: () => {
        Tourney.Winners = NameFiles.Participants.slice(0);
        let x = 0;
        Tourney.Winners.forEach((Contestant) => {
            Contestant.PlayerNumber = x;
            x++
        })
        Tourney.Prelims();

    },
    Unseeded: () => {
        Tourney.Winners = NameFiles.Participants.sort(function (a, b) {
            return 0.5 - Math.random()
        }).slice(0);
        let x = 0;
        Tourney.Winners.forEach((Contestant) => {
            Contestant.PlayerNumber = x;
            x++
        })

        Tourney.Prelims();
    },
    WLS: () => {
        let total = NameFiles.Participants.length
        let stage = document.querySelector(".SeededTourney").querySelector('.BracketPlace');
        let additions;
        let x = 0;
        Tourney.Winners.forEach((Contestant) => {
            Contestant.PlayerNumber = x;
            x++
        })
        for (i = 0; i < total; i++) {
            additions = document.createElement('div');
            additions.textContent = i + 1;
            additions.classList.add("WLB")
            additions.id = i;
            additions.addEventListener('click', Tourney.IronManPoint)
            stage.appendChild(additions);
        }
    },
    //////////// Participants
    Winners: [],
    Eliminated: [],
    /////////// WLS
    IronManPoint: (ev) => {
        console.log(ev.target.id)
        if (Tourney.Point[ev.target.id]) {
            Tourney.Point[ev.target.id]++;
            console.log(Tourney.Point[ev.target.id])
        } else {
            Tourney.Point[ev.target.id] = 1;
            console.log("added")
            console.log(Tourney.Point)
        }
    },
    Point: {},
    Timer: (ev) => {
        let duration;
        if (document.querySelector('.TimeDelay').value) {
            duration = document.querySelector('.TimeDelay').value;
        } else {
            duration = 15
        }
        document.querySelector(".Time").textContent = `${duration}:00`;
        let minutes = duration;
        let seconds = 0
        let pocketwatch = setInterval(() => {
            let timerbase = document.querySelector(".Time")
            if (seconds == 0 && duration > 0) {
                duration--;
                seconds = 59;
                timerbase.textContent = `${duration} : ${seconds}`
            } else if (seconds > 0) {
                seconds--;
                timerbase.textContent = `${duration} : ${seconds}`
            } else {
                console.log(Tourney.Point);
                clearInterval(pocketwatch);
                Tourney.TotalUpPoints();
            }
        }, 1000)
    },
    TotalUpPoints: () => {
        console.log("PointTally")
        let winners = Tourney.Winners.length
        let NewGuy = {
            name: "Starter",
            orders: 0,
            longest: 0,
            current: 0,
            score: 0
        }
        let hit = ""
        for (i = 0; i < NameFiles.Participants.length; i++) {
            let contestant = NameFiles.Participants[i]
            if (Tourney.Point[i] > NewGuy.orders) {
                NewGuy = contestant;
                NewGuy.orders = Tourney.Point[i];
                hit = i
            }
        }
        Tourney.Point[hit] = 0;
        Tourney.Winners.push(NewGuy);
        if (Tourney.Winners.length < 8) {
            Tourney.TotalUpPoints();
        } else {
            console.log('RoundNow')
            document.querySelector('.BracketPlace').innerHTML = "";
            NameFiles.SortByOrders(Tourney.Winners);
            TourneyGetContestants(Tourney.Winners);
            document.querySelector(".WLSBanner").classList.add("hidden");
            document.querySelector(".FightBanner").classList.remove("hidden");
            Tourney.Winners = [];
        }
    },
    /////////// Generic generator:

    GetContestants: (PeopleArray) =>{ 
        let participants = PeopleArray.slice(0);
    console.log(participants);
    console.log(participants.length);
        if(PeopleArray.length > 1){
        let Morphed = []
        do {
                Morphed.push([PeopleArray.pop(), PeopleArray.shift()])
        } while (PeopleArray.length > 0)
        Tourney.PostBrackets(Morphed, document.querySelector(".BracketPlace"))
        } else if (Tourney.Eliminated.length == 1){
            Tourney.LoseBracket = true;
            Tourney.GetContestants([Tourney.Winners[0], Tourney.Eliminated[0]]);
            Tourney.Winners = [];
            Tourney.Eliminated = [];
        } else {Tourney.DisplayResults()}
    },
    PostBrackets: (BracketArray, ParentElement) => {
        if (BracketArray.length != 0) {
            let additions
            if (Array.isArray(BracketArray)) {
                if (Array.isArray(BracketArray[0])) {
                    BracketArray.forEach((entry) => {
                        Tourney.PostBrackets(entry, ParentElement)
                    })
                } else {
                    additions = document.createElement("p");
                    additions.textContent = `${BracketArray[0].name} VS ${BracketArray[1].name}`;
                    additions.info = BracketArray;
                    additions.addEventListener("click", Tourney.OnDeck);
                    ParentElement.appendChild(additions);
                }
            } else {
                additions = document.createElement("li");
                additions.textContent = `${BracketArray.name}`;
                ParentElement.appendChild(additions)
            }
        }
    },
    DisplayResults: () => {
        let stage = document.querySelector(".BracketPlace")

        NameFiles.Participants = NameFiles.Participants.sort((a, b) => {
            return b.current - a.current
        })

        NameFiles.Participants.forEach((person) => {
            stage.innerHTML += `<p>${person.name} <br /> longest streak: ${person.longest}<br /> longest combo broken: ${person.comboBreak} </br></p>`
        })
    },
    ////////////////// Prelims
    Prelims: () => {
        let participants = Tourney.Winners.slice(0);
        let bracketPeople = 1;
        for (let x = 1; x <= participants.length; x = (x * 2)) {
            bracketPeople = x;
            console.log(x);
        }
        let discrepency = participants.length - bracketPeople
        let prelims = []
        for (x = 0; x < discrepency; x++) {
            let newFight = []
            newFight.push(participants.pop())
            newFight.push(participants.pop())
            prelims.push(newFight)
            console.log(prelims);
        }
        console.log(prelims);
        console.log(participants);
        if (prelims.length > 0) {
            Tourney.Prelim = true;
            Tourney.GetContestants(prelims);
            Tourney.Winners = participants;

        } else {
            Tourney.GetContestants(Tourney.Winners);
            Tourney.Winners = [];
        }
    },
    ///////////////// FightField
    FightHighlight: "",
    OnDeck: (ev) => {
        if (Tourney.FightHighlight) {
            Tourney.FightHighlight.classList.remove("active")
        }
        ev.target.classList.add("active");
        Tourney.FightHighlight = ev.target;
        document.querySelector(".FightZone").textContent = `${ev.target.info[0].name} VS ${ev.target.info[1].name}`;
    },
    WinButton: (ev) => {
        let p1 = Tourney.FightHighlight.info[1];
        let p0 = Tourney.FightHighlight.info[0];
        let i = ev.target.className[ev.target.className.length - 1];
        if (i == 1) {
            if (p0.current > p1.comboBreak) {
                p1.comboBreak = p0.current
            };
            p1.current++;
            if (p1.current >= p1.longest) {
                p1.longest++
            }

            if (!Tourney.LoseBracket) {
                Tourney.Winners.push(p1)
                p0.current = 0;
                if (Tourney.Prelim) {
                    Tourney.PrelimElim.push(p0)
                } else {
                    Tourney.Eliminated.push(p0)
                }

            } else {
                p0.current = 0;
            }
        } else {
            if (p1.current > p0.comboBreak) {
                p0.comboBreak = p1.current
            };
            p0.current++
            if (p0.current >= p0.longest) {
                p0.longest++
            }

            if (!Tourney.LoseBracket) {
                Tourney.Winners.push(p0);
                p1.current = 0;
                if (Tourney.Prelim) {
                    Tourney.PrelimElim.push(p1)
                } else {
                    Tourney.Eliminated.push(p1);
                }

            } else {
                p1.current = 0
            }
        }
        Tourney.FightHighlight.parentNode.removeChild(Tourney.FightHighlight);
        Tourney.FightHighlight = "";
    },
    NextRound: (ev) => {
        
        let stage = document.querySelector(".BracketPlace");
        if (stage.firstChild) {} else {
            
            
        if(!Tourney.Prelim){
        if (Tourney.DoubleElim && !Tourney.LoseBracket) {
            Tourney.LoseBracket = true;
        } else {
            Tourney.LoseBracket = false
        }}
            
if(Tourney.DoubleElim){ 
    Tourney.NextRoundDouble(ev);}
            else{
                Tourney.NextRoundSingle(ev)}
            Tourney.Prelim = false;

        }
    },
    NextRoundDouble:(ev)=>{
            if (Tourney.PrelimElim.length > 0) {
                alert("Prelim")
                let Bracket = [];
                Tourney.PrelimElim.forEach((person) => {
                    Bracket.push([person, Tourney.Eliminated[Math.floor((Math.random() * Tourney.Eliminated.length))]])
                });

                Tourney.GetContestants(Bracket);
                Tourney.PrelimElim = []
            } else{
                    if (Tourney.LoseBracket) {
                        Tourney.GetContestants(Tourney.Winners);
                        Tourney.Winners = [];
                    } else {
                        Tourney.GetContestants(Tourney.Eliminated);
                        Tourney.Eliminated = [];
                    }
                }
            
        
    },
    NextRoundSingle: (ev) =>{
        if (Tourney.Winners.length > 1) {
            Tourney.GetContestants(Tourney.Winners)
            Tourney.Winners = [];
        } else {
            Tourney.DisplayResults()
        }
    }


}
