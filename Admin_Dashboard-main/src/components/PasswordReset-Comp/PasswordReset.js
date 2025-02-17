import React from "react";
import { sendPasswordResetEmail } from "firebase/auth";
import { auth } from "../Firebase/firebase";

function ForgotPassword(){

    const sendEmail = (e) => {
        e.preventDefault();
        const email = e.target.email.value;
        console.log(email);
        sendPasswordResetEmail(auth, email)
       .then(() => { alert('Check your Email')
        }).catch(error => {
         alert(error.code)
        });


    }

    return (
        <div>
            <h1>Forgot Password</h1>
            <form onSubmit={(e)=> sendEmail(e)}>
                <label>Email:</label>
                <input type="email" name="email" required/>
                <button type="submit">Submit</button>
            </form>
        </div>
    )
}
export default ForgotPassword;