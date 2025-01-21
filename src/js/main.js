
import { onValue, ref, push, child, update, remove } from "firebase/database";
import { db, korisniciRef } from "./firebase";

onValue(korisniciRef, (snapshot) => {

  snapshot.forEach((childSnapshot) => {
    const korisnik = childSnapshot.val();

    console.log(korisnik)
  })

})