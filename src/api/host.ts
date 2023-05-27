import {AES} from "crypto-js";
import CryptoJS from "crypto-js/core";
export const BASE_URL = 'https://no23.lavina.tech';
export const ENCRIPTED_KEY = 'Abdumutalov Sherzod';

export const getKey = () => {
    if(!localStorage.getItem('key')) {
        return '';
    }
    return AES.decrypt(localStorage.getItem('key'), ENCRIPTED_KEY).toString(CryptoJS.enc.Utf8)
}

export const getSecret = () => {
    if(!localStorage.getItem('secret')) {
        return '';
    }
    return AES.decrypt(localStorage.getItem('secret'), ENCRIPTED_KEY).toString(CryptoJS.enc.Utf8)
}
