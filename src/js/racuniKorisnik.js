import { onValue } from "firebase/database";
import { auth, korisniciRef, racuniRef } from "./firebase";
import { onAuthStateChanged } from "firebase/auth";

let logedUser

onAuthStateChanged(auth, function(user) {
    if(user){
        logedUser = user
        console.log(user)
    }else{
        console.log("not working")
    }
})

onValue(korisniciRef, (snapshot) => {
    let tekuciTable = $("#racuni-korisnik-tekuci")
    let ziroTable = $("#racuni-korisnik-ziro")


    snapshot.forEach((korisnikSnapshot) => {
        let korisnikKey = korisnikSnapshot.key;

        let korisnikInfo = korisnikSnapshot.val()

        if(korisnikKey == logedUser.uid) {
            onValue(racuniRef, (snapshotRacuni) => {
                snapshotRacuni.forEach((racunSnapshot) => {
                    let racunKey = racunSnapshot.key;

                    let racunInfo = racunSnapshot.val();

                    if(racunInfo.id_vlasnika == korisnikKey){
                        if(racunInfo.vrsta == "žiro"){
                            ziroTable.append(`
                                <tr>
                                    <td>${racunInfo.iban}</td>
                                    <td>${racunInfo.stanje}</td>
                                    <td>${racunInfo.valuta}</td>
                                </tr>
                                `)
                        }else{
                            tekuciTable.append(`
                                <tr>
                                    <td>${racunInfo.iban}</td>
                                    <td>${racunInfo.stanje}</td>
                                    <td>${racunInfo.valuta}</td>
                                </tr>
                                `)
                        }
                    }
                })
            })
        }
    })
})