import { onValue, ref , get, child, update, push} from "firebase/database";
import { auth, db, korisniciRef, racuniRef, transakcijeRef } from "./firebase";
import { onAuthStateChanged } from "firebase/auth";

let idKorisnika
let racuniKorisnika = []
let ibanRacuna
let rKey
let rInfo

onValue(korisniciRef, (korisniciSnapshot) => {
    korisniciSnapshot.forEach((korisnikSnapshot) => {
        let korisnikId = korisnikSnapshot.key
        let korisnikInfo = korisnikSnapshot.val()
        $("#korisniciDropdown").append(`
                <li><button class="dropdown-item" type="button" data-key="${korisnikId}">${korisnikInfo.ime} ${korisnikInfo.prezime} (${korisnikInfo.oib})</button></li>
            `)
    })
    Array.from(document.getElementsByClassName('dropdown-item')).forEach((element) => {
        element.addEventListener('click', (event) => {
          idKorisnika = element.getAttribute("data-key")
          dohvatiInformacijeKorisnika()
          dodajRacune()
          document.getElementById("table-container").setAttribute("hidden", true)
        });
      });
})

function dodajRacune(){
    let postojiRacun = false
    $("#racuniDropdown").empty()
    onValue(racuniRef, (racuniSnapshot) => {
        racuniSnapshot.forEach((racunSnapshot) => {
            let racunInfo = racunSnapshot.val()
            let racunKey = racunSnapshot.key
            if(racunInfo.id_vlasnika == idKorisnika){
                postojiRacun = true
                racuniKorisnika.push(racunInfo)
                $("#racuniDropdown").append(`
                    <li><button class="dropdown-item racun" type="button" data-key="${racunKey}">${racunInfo.iban}</button></li>
                `)
            }
        })
        Array.from(document.getElementsByClassName('racun')).forEach((element) => {
            element.addEventListener('click', (event) => {
                document.getElementById("table-container").removeAttribute("hidden")
                rKey = element.getAttribute("data-key")
                ibanRacuna = event.target.innerText
                dodajTransakcijeUTablicu()
                dohvatiInformacijeRacuna()
            });
          });
    })
    setTimeout(() => {
        if(!postojiRacun){
            $("#racuniDropdown").append(`
                <li><button class="dropdown-item" type="button" disabled>Nema račun</button></li>
            `)   
        }     
    }, 1000);
   
}

function dodajTransakcijeUTablicu(){
    $("#transakcijeKorisnika").empty()
    $("#racunKorisnika").html(ibanRacuna)
    onValue(transakcijeRef, (transakcijaSnapshot) => {
        transakcijaSnapshot.forEach((transakcija) => {
            let transakcijaInfo = transakcija.val()
            if(ibanRacuna ==(transakcijaInfo.iban_racuna)){
                if(transakcijaInfo.vrsta == "Uplata"){
                    $("#transakcijeKorisnika").append(`
                        <tr>
                            <td class="text-success">${transakcijaInfo.vrsta}</td>
                            <td class="text-success">${transakcijaInfo.iznos}</td>
                            <td>${transakcijaInfo.datum}</td>
                        </tr>
                        `)
                }else
                {
                    $("#transakcijeKorisnika").append(`
                        <tr>
                            <td class="text-danger">${transakcijaInfo.vrsta}</td>
                            <td class="text-danger">${transakcijaInfo.iznos}</td>
                            <td>${transakcijaInfo.datum}</td>
                        </tr>
                        `)
                }
            }
        })
    })
}

function dohvatiInformacijeKorisnika(){
    const oKorisnikRef = ref(db)
    get(child(oKorisnikRef, 'korisnici/' + idKorisnika)).then((snapshot) => {
        if(snapshot.exists()){
            
            const korisnik = snapshot.val();
            let naziv = korisnik.ime + " " + korisnik.prezime
            $("#imeKorisnika").html(naziv)
            return korisnik

        }
    })
}

function dohvatiInformacijeRacuna(){
    const oRacuniRef = ref(db)
    get(child(oRacuniRef, 'racuni/' + rKey)).then((snapshot) => {
        if(snapshot.exists()){
            
            let racun = snapshot.val();
            rInfo = racun
            return racun

        }
    })
}

$("#dodaj-transakciju").on("click", function(event) {
    let datum = $("#inputDatum").val()
    let iznos = $("#inputIznos").val()
    let vrsta = $("#inputVrsta").val()
    let novoStanje = 0
    if(vrsta == "Uplata"){
        novoStanje = parseInt(rInfo.stanje) + parseInt(iznos)
    }else{
        novoStanje = parseInt(rInfo.stanje) - parseInt(iznos)
    }

    let postData = {
        datum: datum,
        iban_racuna: rInfo.iban,
        iznos: iznos,
        vrsta: vrsta
    }

    const newPostKey = push(child(ref(db), 'transakcije')).key

    const updates = {}

    updates['transakcije/' + newPostKey] = postData

    update(ref(db), updates)

    let racunData = {
        iban: rInfo.iban,
        id_vlasnika: rInfo.id_vlasnika,
        stanje: novoStanje,
        valuta: rInfo.valuta,
        vrsta: rInfo.vrsta
    }

    const racunUpdates = {}

    racunUpdates['racuni/' + rKey] = racunData

    update(ref(db), racunUpdates)
})