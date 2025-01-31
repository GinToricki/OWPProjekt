import { onValue } from "firebase/database";
import { auth,korisniciRef } from "./firebase";
import { signInWithEmailAndPassword,onAuthStateChanged } from "firebase/auth";

onAuthStateChanged(auth, (user) => {
    if(user) {
        onValue(korisniciRef, (snapshot) => {
            snapshot.forEach((korisnikSnapshot) =>{
                let korisnikKey = korisnikSnapshot.key;
                if(korisnikKey == user.uid){
                   const korisnik = korisnikSnapshot.val();
                   if(korisnik.admin){
                    console.log("Admin")
                    window.location = "homepageAdmin.html"
                   }else{
                    console.log("Korisnik")
                    window.location = "homepage.html"
                   }
                }
            })
        })
    }else {
        
    }
})



$("#login").on("click" ,async function (event)  {
    

    const emailLogin = $("#loginEmail").val();
    const passwordLogin = $("#loginPassword").val();

    try {
        const userCredential = await signInWithEmailAndPassword(auth, emailLogin, passwordLogin);
        const user = userCredential.user;

        console.log(user)
    }catch(error){

    }
})
