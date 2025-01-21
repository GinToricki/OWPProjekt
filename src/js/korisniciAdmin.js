import { onValue, ref, push, child, update, remove } from "firebase/database";
import { db, korisniciRef } from "./firebase";

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
            <td >${adresa}</td>
            <td >${telefon}</td>
            <td >${email}</td>
        <tr>
        `)

  })

})