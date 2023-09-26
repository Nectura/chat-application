import { RecaptchaVerifier } from "firebase/auth";
import { fireBaseAuth } from "../firebase/firebase";

export const initializeRecaptcha = () => {
    return new RecaptchaVerifier(fireBaseAuth, 'recaptcha-container', {
        size: 'invisible',
    });;
};