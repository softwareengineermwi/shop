import './style.css'
import './custom-style/custom.css'
// import './scripts.js'

import { initializeApp } from 'firebase/app';
import { getAuth, onAuthStateChanged, signInWithEmailAndPassword } from "firebase/auth";
import { getFirestore, getDoc, addDoc, query, collection, getDocs, doc, updateDoc, serverTimestamp } from 'firebase/firestore'
import shop, { getTotal } from './shop';
import { updateCartDsp, categorise } from './shop';
import { closeDrawer, closeModal, g, openModal, openModal_v2 } from '../../shop-admin/src/js/utils';

const firebaseConfig = {
  apiKey: "AIzaSyCoiz3Po-dElQonM_iHUKYNU4ijwlNHtPY",
  authDomain: "bigbossshopzm.firebaseapp.com",
  projectId: "bigbossshopzm",
  storageBucket: "bigbossshopzm.appspot.com",
  messagingSenderId: "664738796921",
  appId: "1:664738796921:web:fb9645dada2acc0faa8ba8",
  measurementId: "G-3L247TS21Z"
}

initializeApp(firebaseConfig)

const db = getFirestore()

const qString = window.location.search
const urlParams = new URLSearchParams(qString)

if (urlParams.has('category')) {
  const categories = await getDoc(doc(db, `categories/${urlParams.get('category')}`))
  const data = categories.data()

  categorise(data)
  shop(data, 0)
  window.addEventListener("navigate", (e) => { shop(data, parseInt(e.detail, 10)) })
} else {
  console.log("sdfghjk");
}

g("checkout").addEventListener("click", (e) => {
  g("drawer-cart-id").classList.toggle("drawer--is-visible")
  openModal_v2("modal-pPay")
})

g("btnOrder").addEventListener("click", async (e) => {
  e.target.disabled = true
  const phone = g("phone").value
  if (phone !== null) {
    const mCart = (localStorage.getItem("thee_craty_soul") ? JSON.parse(localStorage.getItem("thee_craty_soul")) : {})

    await addDoc(collection(db, "orders"), {
      items: mCart,
      timestamp: serverTimestamp(),
      phone: phone
    }).then((doc) => {
      closeModal("modal-pPay")
      g("transferTotal").innerText = getTotal()
      g("orderId").innerText = doc.id
      openModal_v2("modal-order")
    })
  } else { alert("Phone number required!") }
})

// const querySnapshot = await getDocs(query(collection(db, "categories")))

// const categories = querySnapshot.docs.map((snapshot) => {
//   return {
//     products: snapshot.data(),
//     id: `${snapshot.id}`
//   }
// })

// updateCartDsp("thee_craty_soul")



