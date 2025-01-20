import { auth } from "./firebase";
import { signInWithEmailAndPassword,onAuthStateChanged } from "firebase/auth";

onAuthStateChanged(auth, (user) => {
    if(user) {
        window.location.href = 'homepage.html'
    }else {
        
    }
})



$("#login").on("click" ,async function()  {

    const emailLogin = $("#emailLogin").val();
    const passwordLogin = $("#passwordLogin").val();
    

    try {
        const userCredential = await signInWithEmailAndPassword(auth, emailLogin, passwordLogin);
        const user = userCredential.user;

        console.log(user)
    }catch(error){

    }
})