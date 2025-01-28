import { auth } from "./firebase";
import { createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    sendPasswordResetEmail,
    sendEmailVerification,
    updatePassword,
    signInWithPopup,
    GoogleAuthProvider,
    confirmPasswordReset,
 } from "firebase/auth";

 export const doCreateUserWithEmailAndPassword = async (email, password) => {
    return createUserWithEmailAndPassword(auth, email, password);
};

export const doSignInWithEmailAndPassword = async (email, password) =>{
    return signInWithEmailAndPassword(auth, email, password);
};



export const doSignOut = () => {
    return auth.signOut();
}

export const doPasswordReset = (email) => {
    return sendPasswordResetEmail(auth, email);
}

export const doEmailVerification = () => {
    return sendEmailVerification(auth.currentUser);
}

export const doUpdatePassword = (password) => {
    return updatePassword(auth.currentUser, password);
}

export const doSignInWithPopup = (provider) => {
    return signInWithPopup(auth, provider);
}

export const doGoogleSignIn = () => {
    const provider = new GoogleAuthProvider();
    return doSignInWithPopup(provider);
}

export const doSendPasswordResetEmail = (email) => {
    return sendPasswordResetEmail(auth, email);
}

export const doConfirmPasswordReset = (code, password) => {
    return confirmPasswordReset(auth, code, password);
}



