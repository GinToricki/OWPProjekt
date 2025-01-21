import { auth } from "./firebase"
import { signOut } from "firebase/auth"

$("#logout").on("click", function() {
    signOut(auth).then(() => {
        window.location = "index.html";
    }).catch((error) => {
        console.error("Error during logout ",error)
    })
})