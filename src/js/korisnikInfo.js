import { ref,get,child,push,update,onValue,remove } from "firebase/database";
import { db, korisniciRef,racuniRef,transakcijeRef } from "./firebase.js";

var sUrl = window.location.href ;
var oUrl = new URL(sUrl);
var korisnikKey = oUrl.searchParams.get("korisnik_key");
let racuniVlasnika = []

const oKorisnikRef = ref(db);
get(child(oKorisnikRef, 'korisnici/' + korisnikKey)).then((snapshot) => {
    if(snapshot.exists()){
        const korisnik = snapshot.val();

        let ime = korisnik.ime;
        let prezime = korisnik.prezime;
        let oib = korisnik.oib;
        let telefon = korisnik.telefon;
        let adresa = korisnik.adresa;
        let email = korisnik.email;
    
        let naziv = ime + " " + prezime

        $("#ime").html(naziv)
        $("#oib").html(oib)
        $("#adresa").html(telefon)
        $("#telefon").html(adresa)
        $("#email").html(email)
    }
})

 $("#dodaj-racun").on("click", function () {
        console.log("radi")
                    let ibanInpt = $("#inputIBAN").val()
                    let inputStanje = $("#inputStanje").val()
                    let inputVrsta = $('#inputVrsta').find(":selected").val();
                    let inputValuta = $('#inputValuta').find(":selected").val();

                    let postData = {
                        id_vlasnika: korisnikKey ,
                        iban: ibanInpt,
                        stanje: inputStanje,
                        valuta: inputValuta,
                        vrsta: inputVrsta
                    }

                    const newPostKey = push(child(ref(db), 'racuni')).key
                    const updates = {}

                    updates['racuni/' + newPostKey] = postData

                   
                    update(ref(db), updates)
                })


onValue(racuniRef, (racuniSnapshot) => {
        $(`#tekuci`).empty()
        $(`#ziro`).empty()

        racuniSnapshot.forEach((racunSnapshot) => {
            let racunKey = racunSnapshot.key;



            const racun = racunSnapshot.val()

            let id_vlasnika = racun.id_vlasnika
            let vrsta = racun.vrsta

            if(id_vlasnika == korisnikKey){
                racuniVlasnika.push(racun.iban);
                if(vrsta == "tekući"){
                    $(`#tekuci`).append(`
                        <tr>
                            <td>${racun.iban} </td>
                            <td>${racun.stanje} </td>
                            <td>${racun.valuta} </td>
                            <td><button class="btn btn-danger" id="${racunKey}-delete">Izbrisi</button></td>
                        </tr>
                        `)
                }else{
                    $(`#ziro`).append(`
                        <tr>
                            <td>${racun.iban} </td>
                            <td>${racun.stanje} </td>
                            <td>${racun.valuta} </td>
                            <td><button class="btn btn-danger" id="${racunKey}-delete">Izbrisi</button></td>
                        </tr>
                        `)
                }
                $(`#${racunKey}-delete`).on("click", function() {
                    remove(ref(db,'racuni/' + racunKey))
                })
            }
        })
    })

onValue(transakcijeRef, (transakcijeSnapshot) => {
    transakcijeSnapshot.forEach((transakcijaSnapshot) => {
        let transakcijaKey = transakcijaSnapshot.key
        const transakcija = transakcijaSnapshot.val()

        if(racuniVlasnika.includes(transakcija.iban_racuna)){
            $("#transakcije").append(
                `
                <tr>
                    <td>${transakcija.vrsta}</td>
                    <td>${transakcija.datum}</td>
                    <td>${transakcija.iban_racuna}</td>
                    <td>${transakcija.iznos}</td>
                </tr>
                `
            )
        }
    })
})