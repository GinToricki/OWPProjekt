import { onValue, ref, push, child, update, remove } from "firebase/database";
import { db, korisniciRef,racuniRef } from "./firebase";


onValue(korisniciRef, (snapshot) => {
    let accordionBody = $("#racuni")

    snapshot.forEach((childSnapshot) => {
        let korisnikKey = childSnapshot.key

        const korisnik = childSnapshot.val()

        let ime = korisnik.ime;
        let prezime = korisnik.prezime;
        let oib = korisnik.oib;
        let telefon = korisnik.telefon;
        let adresa = korisnik.adresa;
        let email = korisnik.email;
        console.log(korisnik)
        accordionBody.append(`
            <div class="accordion-item>
                <h2 class="accordion-header">
                    <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#${korisnikKey}" aria-expanded="true" aria-controls="collapseOne">
                        ${ime} ${prezime}
                    </button>
                </h2>
                <div id="${korisnikKey}" class="accordion-collapse collapse" data-bs-parent="#racuni">
                     <button class="btn btn-primary mt-4" data-bs-toggle="modal" data-bs-target="#dodajRacunModal" id="${korisnikKey}-dodajRacun">
                        Dodaj Racun
                    </button>
                    <div class="accordion-body" id="${korisnikKey}-body">
                        <div class="container">
                            <h2>
                            Tekući
                            </h2>
                            <table class="table">
                                <thead>
                                    <tr>
                                        <th>IBAN</th>
                                        <th>Stanje</th>
                                        <th>Valuta</th>
                                    </tr>
                                </thead>
                                <tbody id="${korisnikKey}-tekuci">

                                <tbody>
                            </table>
                            <h2>
                            Žiro
                            </h2>
                            <table class="table">
                                <thead>
                                    <tr>
                                        <th>IBAN</th>
                                        <th>Stanje</th>
                                        <th>Valuta</th>
                                    </tr>
                                </thead>
                                <tbody id="${korisnikKey}-ziro">

                                <tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
            `)
            $(`#${korisnikKey}-dodajRacun`).on("click", function() {
                $("#dodaj-racun").attr(`data-key`, `${korisnikKey}`)
                $("#dodajRacunModalLabel").html("Dodaj račun - " + ime + " " + prezime)

                
                $("#dodaj-racun").on("click", function () {
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
            })
            onValue(racuniRef, (racuniSnapshot) => {
                $(`#${korisnikKey}-tekuci`).empty()
                $(`#${korisnikKey}-ziro`).empty()

                racuniSnapshot.forEach((racunSnapshot) => {
                    let racunKey = racunSnapshot.key;



                    const racun = racunSnapshot.val()

                    let id_vlasnika = racun.id_vlasnika
                    let vrsta = racun.vrsta

                    if(id_vlasnika == korisnikKey){

                        if(vrsta == "tekući"){
                            $(`#${korisnikKey}-tekuci`).append(`
                                <tr>
                                    <td>${racun.iban} </td>
                                    <td>${racun.stanje} </td>
                                    <td>${racun.valuta} </td>
                                </tr>
                                `)
                        }else{
                            $(`#${korisnikKey}-ziro`).append(`
                                <tr>
                                    <td>${racun.iban} </td>
                                    <td>${racun.stanje} </td>
                                    <td>${racun.valuta} </td>
                                </tr>
                                `)
                        }
                       
                    }
                })
            })
    })
})