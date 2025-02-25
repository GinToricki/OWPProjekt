import { ref,get,child,push,update,onValue,remove } from "firebase/database";
import { db, korisniciRef,racuniRef,transakcijeRef } from "./firebase.js";

var sUrl = window.location.href ;
var oUrl = new URL(sUrl);
var rKey = oUrl.searchParams.get("racun_key");
let racunInfo

onValue(racuniRef, (racuni) => {
 
    racuni.forEach((racun) => {
        let racunKey = racun.key;
        if(racunKey == rKey){
            racunInfo = racun.val()
            $("#iban-rac").html(racunInfo.iban)
            $("#stanje-rac").html(racunInfo.stanje)
        }
    })
})


onValue(transakcijeRef, (transakcije) => {
    let tableBody = $("#transakcije-tijelo")
    tableBody.empty();

    transakcije.forEach((transakcijaSnapshot) => {
        let transakcijaKey = transakcijaSnapshot.key;
        const transakcija = transakcijaSnapshot.val()
      
        if(racunInfo.iban == transakcija.iban_racuna){
            if(transakcija.vrsta == "Uplata"){
                tableBody.append(`
                    <tr>
                        <td class="text-success">${transakcija.vrsta}</td>
                        <td>${transakcija.datum}</td>
                        <td class="text-success">${transakcija.iznos}</td>
                    </tr>
                    `)
            }else{
                tableBody.append(`
                    <tr>
                        <td class="text-danger">${transakcija.vrsta}</td>
                        <td>${transakcija.datum}</td>
                        <td class="text-danger">${transakcija.iznos}</td>
                    </tr>
                    `)
            }
            
        }
    })
})

$("#dodaj-transakciju").on("click", function(event) {
    let datum = $("#inputDatum").val()
    let iznos = $("#inputIznos").val()
    let vrsta = $("#inputVrsta").val()
    let novoStanje = 0
    if(vrsta == "Uplata"){
        novoStanje = parseInt(racunInfo.stanje) + parseInt(iznos)
    }else{
        novoStanje = parseInt(racunInfo.stanje) - parseInt(iznos)
        if(novoStanje < (-1000)){
            alert("Transakcija će prekoračiti dopušteni limit")
            return false;
        }
    }

    let postData = {
        datum: datum,
        iban_racuna: racunInfo.iban,
        iznos: iznos,
        vrsta: vrsta
    }

    const newPostKey = push(child(ref(db), 'transakcije')).key

    const updates = {}

    updates['transakcije/' + newPostKey] = postData

    update(ref(db), updates)

    let racunData = {
        iban: racunInfo.iban,
        id_vlasnika: racunInfo.id_vlasnika,
        stanje: novoStanje,
        valuta: racunInfo.valuta,
        vrsta: racunInfo.vrsta
    }

    const racunUpdates = {}

    racunUpdates['racuni/' + rKey] = racunData

    update(ref(db), racunUpdates)
})