import { onValue, ref, push, child, update, remove } from "firebase/database";
import { db, korisniciRef, auth } from "./firebase";
import {getAuth, createUserWithEmailAndPassword, onAuthStateChanged, signInWithEmailAndPassword} from "firebase/auth"


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
  if(CheckOib(oib)){
    return false;
  }
  if(!isValidPhoneNumber(telefonRegister)){
    alert("Broj mobitela ne valja")
    return false
  }

  console.log(admin)
  createUserWithEmailAndPassword(auth,email,password)
  .then((userCredential) => {
      const user = userCredential.user;
      console.log(user.uid)

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

function CheckOib(oibInfo) {
  if(oibInfo.length != 11){
    alert("Oib nema 11 znamenaka")
    return false
  }

  let ostatak = 10

  for(let i = 0; i < 10; i++){
    let currentDigit = Number(oibInfo[0])

    let zbroj = currentDigit + ostatak

    let meduOstatak = zbroj % 10

    if(meduOstatak == 0){
      meduOstatak = 10
    }

    let umnozak = meduOstatak * 2

    ostatak = umnozak % 11
  }
  let kontrolnaZnamenka = 0
  if(ostatak == 1)
  {
    kontrolnaZnamenka = 0
  }else {
    kontrolnaZnamenka = 11 - ostatak
  }

  if(Number(oibInfo[10]) == kontrolnaZnamenka){
    return true
  }
  alert("oib ne valja")
  return false
}

const validateEmail = (email) => {
  return String(email)
    .toLowerCase()
    .match(
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    );
};

