import { auth } from "./firebase.js";

document.getElementById("submitbtn").addEventListener("click", () => {
    const homeTeamName = document.getElementById("homeTeamName").textContent;
    const homeTeamResult = document.getElementById("homeTeamResult").value;

    const awayTeamName = document.getElementById("awayTeamName").textContent;
    const awayTeamResult = document.getElementById("awayTeamResult").value;
    const currentUser = auth.currentUser;
    if (currentUser) {
        const uid = currentUser.uid;

        console.log(homeTeamName)
        console.log(homeTeamResult)
        console.log(awayTeamName)
        console.log(awayTeamResult)
        console.log(uid)

    }else{
        console.log("Kein Benutzer aktuell angemeldet.");
    }


})
