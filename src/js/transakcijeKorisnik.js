import { onValue } from "firebase/database";
import { auth, korisniciRef, racuniRef, transakcijeRef } from "./firebase";
import { onAuthStateChanged } from "firebase/auth";

let logedUser
let racuniKorisnika = []

onAuthStateChanged(auth, function(user) {
    if(user){
        logedUser = user
        console.log(user)
        console.log(user.uid)
    }else{
        console.log("not working")
    }
})

onValue(racuniRef, (snapshotRacuni) => {
    snapshotRacuni.forEach(racun => {
        let racunInfo = racun.val()
        if(racunInfo.id_vlasnika == logedUser.uid){
           racuniKorisnika.push(racunInfo.iban)
        }
    })
})

onValue(transakcijeRef, (transakcijaSnapshot) => {
    transakcijaSnapshot.forEach((transakcija) => {
        let transakcijaInfo = transakcija.val()
        if(racuniKorisnika.includes(transakcijaInfo.iban_racuna)){
            if(transakcijaInfo.vrsta == "Uplata"){
                $("#transakcijeKorisnik").append(`
                    <tr>
                        <td>${transakcijaInfo.iban_racuna}</td>
                        <td class="text-success">${transakcijaInfo.vrsta}</td>
                        <td class="text-success">${transakcijaInfo.iznos}</td>
                        <td>${transakcijaInfo.datum}</td>
                    </tr>
                    `)
            }else
            {
                $("#transakcijeKorisnik").append(`
                    <tr>
                        <td>${transakcijaInfo.iban_racuna}</td>
                        <td class="text-danger">${transakcijaInfo.vrsta}</td>
                        <td class="text-danger">${transakcijaInfo.iznos}</td>
                        <td>${transakcijaInfo.datum}</td>
                    </tr>
                    `)
            }
        }
    })
})
