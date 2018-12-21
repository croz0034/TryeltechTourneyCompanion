let pages = ["HomePage", "DarkZone", "ParticipantList", "SeededTourney", "Options", "TwilightZone"]

let MasterCode = {
    HomePage: document.querySelector(".HomePage"),
    CurrentPage: "",
    init: () => {
        MasterCode.CurrentPage = MasterCode.HomePage;
        MasterCode.PageShift();
        Options.init()
        Tourney.init()
        NameFiles.init();
        document.querySelectorAll("Button").forEach((page) => {
            page.addEventListener("click", MasterCode.Intent)
        })
    },
    Intent: (ev) => {
        if (ev.target.id) {
            console.log('ping');
            MasterCode.CurrentPage = document.querySelector(`.${ev.target.id}`);
            MasterCode.PageShift()
        }
    },
    PageShift: () => {
        pages.forEach((page) => {
            document.querySelector(`.${page}`).classList.add("hidden");
        })
        MasterCode.CurrentPage.classList.remove("hidden");
    }

}

document.addEventListener("DOMContentLoaded", MasterCode.init)
