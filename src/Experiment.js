import React, { useEffect, useState } from "react";
import axios from 'axios';
import CustomButton from './CustomButton';
import { Input } from "@material-ui/core";
export default function Experiment() {
  const [message, setMessage] = useState('');
  const [decrypted, setDecrypted] = useState('');
  const [signed, setSigned] = useState('');
  const [iv, setIv] = useState(null);
  const [salt, setSalt] = useState(null);
  const [privatekey, setPrivatekey] = useState(null);
  const [secret, setSecret] = useState(null);
  /*

    Get some key material to use as input to the deriveKey method.
    The key material is a password supplied by the user.
  */
  function getKeyMaterial() {
    const password = window.prompt("Enter your password");
    const enc = new TextEncoder();
    return window.crypto.subtle.importKey(
      "raw",
      enc.encode(password),
      { name: "PBKDF2" },
      false,
      ["deriveBits", "deriveKey"]
    );
  }

  /*
  Given some key material and some random salt
  derive an AES-KW key using PBKDF2.
  */
  function getKey(keyMaterial, salt, algo) {
    return window.crypto.subtle.deriveKey(
      {
        "name": "PBKDF2",
        "salt": salt,
        "iterations": 100000,
        "hash": "SHA-256"
      },
      keyMaterial,
      { "name": algo, "length": 256 },
      true,
      ["wrapKey", "unwrapKey"]
    );
  }
  /*
  Wrap the given key.
  */
  async function wrapCryptoKey(keyToWrap, algo, format, number) {
    // get the key encryption key
    const keyMaterial = await getKeyMaterial();
    let salt = window.crypto.getRandomValues(new Uint8Array(16));
    setSalt(salt);
    const wrappingKey = await getKey(keyMaterial, salt, algo);
    setSecret(wrappingKey);
    let iv = window.crypto.getRandomValues(new Uint8Array(number));
    setIv(iv);
    return window.crypto.subtle.wrapKey(
      format,
      keyToWrap,
      wrappingKey,
      {
        name: algo,
        iv: iv
      }
    );

  }
  function ab2str(buf) {
    return String.fromCharCode.apply(null, new Uint8Array(buf));
  }

  function str2ab(str) {
    var buf = new ArrayBuffer(str.length); // 2 bytes for each char
    var bufView = new Uint8Array(buf);
    for (var i = 0, strLen = str.length; i < strLen; i++) {
      bufView[i] = str.charCodeAt(i);
    }
    return buf;
  }
  async function exportCryptoKey(key) {
    const exported = await window.crypto.subtle.exportKey(
      "spki",
      key
    );
    const exportedAsString = ab2str(exported);
    const exportedAsBase64 = window.btoa(exportedAsString);

    return exportedAsBase64;
  }
  const getContent = (key)=>{

  }
  const generateKeyPair = async () => {
    if (!window.crypto || !window.crypto.subtle) {
      alert("Your current browser does not support the Web Cryptography API! This page will not work.");

    }
    else {

      let keyPair = await window.crypto.subtle.generateKey(
        {
          name: 'RSA-PSS',
          modulusLength: 4096,
          publicExponent: new Uint8Array([1, 0, 1]),
          hash: { name: "SHA-256" }
        },
        true,
        ['sign', 'verify']
      )
      console.log(keyPair);

      let wrappedPrivateKey = await wrapCryptoKey(keyPair.privateKey, 'AES-GCM', 'pkcs8', 12);
    
      let publicKey = await exportCryptoKey(keyPair.publicKey);
      setPrivatekey(wrappedPrivateKey);
      const stringWrappedKey = ab2str(wrappedPrivateKey);
      const encryptedPrivateKey = window.btoa(stringWrappedKey);


      axios.post('/api/users/storekeys', { publicKey: publicKey, encryptedPrivateKey: encryptedPrivateKey }, { withCredentials: true }).then(
        (data) => {
          console.log(data.data);
        }
      )


    }

  };
  const unwrapCryptoKey = async (wrapped, privateKey) => {
    let key = await window.crypto.subtle.unwrapKey(
      "pkcs8",               // import format
      wrapped,      // ArrayBuffer representing key to unwrap
      privateKey,         // CryptoKey representing key encryption key
      {                      // algorithm params for key encryption key
        name: "AES-GCM",
        iv: iv
      },

      {                      // algorithm params for key to unwrap
        name: "RSA-PSS",

        hash: "SHA-256"
      },
      true,                  // extractability of key to unwrap
      ["sign"]               // key usages for key to unwrap
    );
    return key;

  }
  function equal(buf1, buf2) {
    if (buf1.byteLength != buf2.byteLength) return false;
    var dv1 = new Int8Array(buf1);
    var dv2 = new Int8Array(buf2);
    for (var i = 0; i != buf1.byteLength; i++) {
      if (dv1[i] != dv2[i]) return false;
    }
    return true;
  }
  function bytesToArrayBuffer(bytes) {
    const bytesAsArrayBuffer = new ArrayBuffer(bytes.length);
    const bytesUint8 = new Uint8Array(bytesAsArrayBuffer);
    bytesUint8.set(bytes);
    return bytesAsArrayBuffer;
  }
 
  const sign = async () => {
    let response = await axios.get('/api/users/getkeys', { withCredentials: true })
    let publicKey = response.data.publicKey;
    let encryptedPrivateKey = str2ab(window.atob(response.data.encryptedPrivateKey));

    let keyMaterial = await getKeyMaterial();
    let wrappingKey = await getKey(keyMaterial, salt, "AES-GCM");
    console.log(privatekey, encryptedPrivateKey);
    if (equal(encryptedPrivateKey,privatekey)) {
      console.log("private key is same");
    }
  

    let privateKey = await unwrapCryptoKey(encryptedPrivateKey, wrappingKey);
    console.log(privateKey);

  }
  return (
    <React.Fragment>
      <CustomButton text="Generate Key Pair" onClick={generateKeyPair}></CustomButton>
      <div>

        <Input type="text" onChange={(event) => { setMessage(event.target.value) }} value={message}> </Input>
        <CustomButton onClick={sign} text="Sign"></CustomButton>
      </div>
      <div>
        <p>{signed}</p>
        <p>{decrypted}</p>

      </div>
    </React.Fragment>
  )
}