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

    tableBody.append(`
        <tr>
            <td data-key=${korisnikKey}>${ime}</td>
            <td >${prezime}</td>
            <td >${oib}</td>
            <td >${telefon}</td>
            <td >${adresa}</td>
            <td >${email}</td>
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