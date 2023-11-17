import CryptoJS from 'crypto-js';


export function getTime() {
  var timestamp = Math.round(new Date().getTime() / 1000);
  return timestamp;
}

export function getNonce() {
  let nonce = Math.random().toString(36).substr(2);
  return nonce;
}

export function getCalcSign(timestamp, nonce, appSecret) {
  var str = "time:" + timestamp + ",nonce:" + nonce + ",appSecret:" + appSecret;
  var sign = CryptoJS.MD5(str).toString();
  return sign;
}