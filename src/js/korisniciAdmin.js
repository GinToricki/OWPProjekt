import { onValue, ref, push, child, update, remove } from "firebase/database";
import { db, korisniciRef, auth } from "./firebase";
import {getAuth, createUserWithEmailAndPassword, onAuthStateChanged, signInWithEmailAndPassword} from "firebase/auth"

let korisnici = []

dohvatiKorisnike()

function dohvatiKorisnike(){
  onValue(korisniciRef, (korisniciSnapshot) => {
    korisniciSnapshot.forEach((korisnik) => {
      let kljuc = korisnik.key
      let korisnikInfo = korisnik.val();
      korisnikInfo.kljuc = kljuc
      korisnici.push(korisnikInfo)
    })
  })
}

function popuniTablicu(filtriraniKorisnici) {
  let tableBody = $("#korisnici-table");
  tableBody.empty()
  filtriraniKorisnici.forEach(korisnik => {
    
  
    let ime = korisnik.ime;
    let prezime = korisnik.prezime;
    let oib = korisnik.oib;
    let telefon = korisnik.telefon;
    let adresa = korisnik.adresa;
    let email = korisnik.email;
  
    let naziv = ime + " " + prezime
    tableBody.append(`
        <tr>
            <td data-key=${korisnik.kljuc}>${ime}</td>
            <td >${prezime}</td>
            <td >${oib}</td>
            <td >${telefon}</td>
            <td >${adresa}</td>
            <td >${email}</td>
            <td><a href="korisnikInfo.html?korisnik_key=${korisnik.kljuc}">${naziv} </a> </td>
        <tr>
        `)
  })
 
 
}

$("#trazi-korisnika").on("keyup", function() {
  let trazilicaInfo = $("#trazi-korisnika").val()
  let filtriraniKorisnici = korisnici.filter(function(el) {
    return el.ime.toLowerCase().includes(trazilicaInfo.toLowerCase()) ||
           el.prezime.toLowerCase().includes(trazilicaInfo.toLowerCase()) ||
           el.oib.toLowerCase().includes(trazilicaInfo.toLowerCase()) ||
           el.adresa.toLowerCase().includes(trazilicaInfo.toLowerCase()) ||
           el.email.toLowerCase().includes(trazilicaInfo.toLowerCase())
  })
  console.log(filtriraniKorisnici)
  popuniTablicu(filtriraniKorisnici);
})

onValue(korisniciRef, (snapshot) => {
    let tableBody = $("#korisnici-table");
    tableBody.empty()

  snapshot.forEach((childSnapshot) => {
    const korisnikKey = childSnapshot.key
    const korisnik = childSnapshot.val();

    let ime = korisnik.ime;
    let prezime = korisnik.prezime;
    let oib = korisnik.oib;
    let telefon = korisnik.telefon;
    let adresa = korisnik.adresa;
    let email = korisnik.email;

    let naziv = ime + " " + prezime
    tableBody.append(`
        <tr>
            <td data-key=${korisnikKey}>${ime}</td>
            <td >${prezime}</td>
            <td >${oib}</td>
            <td >${telefon}</td>
            <td >${adresa}</td>
            <td >${email}</td>
            <td><a href="korisnikInfo.html?korisnik_key=${korisnikKey}">${naziv} </a> </td>
        <tr>
        `)

  })

})

$("#dodajKorisnika").on("click", function(event) {
  event.preventDefault();

  let ime = $("#imeRegister").val()
  let prezime = $("#prezimeRegister").val()
  let admin = $("#adminRegister").val() == "True" ? true :  false
  let email = $("#emailRegister").val()
  let password = $("#passwordRegister").val()
  let oib = $("#oibRegister").val()
  let telefonRegister = $("#telefonRegister").val()
  let adresa = $("#adressRegister").val()

  if(!validateEmail(email)){
    alert("Email ne valja")
    return false
  }
  if(!isOibValid(oib)){
    alert("oib ne valjas")
    return false;
  }

 
  createUserWithEmailAndPassword(auth,email,password)
  .then((userCredential) => {
      const user = userCredential.user;
      

      var user_data = {
          email: email,
          ime: ime,
          prezime: prezime,
          admin: admin,
          adresa: adresa,
          oib: oib,
          password: password,
          telefon: telefonRegister
      }

      const updates = {}

      updates['korisnici/' + user.uid] = user_data

      update(ref(db), updates)
  })
})

function isOibValid(input) {
  const oib = input.toString();

  if (oib.match(/\d{11}/) === null) {
      return false;
  }

  let calculated = 10;

  for (const digit of oib.substring(0, 10)) {
      calculated += parseInt(digit);

      calculated %= 10;

      if (calculated === 0) {
          calculated = 10;
      }

      calculated *= 2;

      calculated %= 11;
  }

  const check = 11 - calculated;
  
  if (check === 10) {
      check = 0;
  }

  return check === parseInt(oib[10]);
}

const validateEmail = (email) => {
  return String(email)
    .toLowerCase()
    .match(
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    );
};

