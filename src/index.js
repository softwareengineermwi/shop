import './css/style.css'

import { initializeApp } from 'firebase/app';
import { getAuth, onAuthStateChanged, signInWithEmailAndPassword } from "firebase/auth";
import { getFirestore, addDoc, query, collection, getDocs, doc, updateDoc, serverTimestamp } from 'firebase/firestore'
import shop, { getTotal } from './shop';
import { updateCartDsp, categorise } from './shop';
import { closeDrawer, closeModal, g, openModal, openModal_v2 } from '../../shop-admin/src/js/utils';
import { async } from '@firebase/util';

const firebaseConfig = {
  apiKey: "AIzaSyAOoPVb11afNm662MKAbX5IfFsXf-0LRss",
  authDomain: "theecraftysoul-6efc7.firebaseapp.com",
  projectId: "theecraftysoul-6efc7",
  storageBucket: "theecraftysoul-6efc7.appspot.com",
  messagingSenderId: "81244087155",
  appId: "1:81244087155:web:c695e6403393eae483db06",
  measurementId: "G-CY91DEXG3D"
};


initializeApp(firebaseConfig);

const db = getFirestore()

const querySnapshot = await getDocs(query(collection(db, "categories")))
const categories = querySnapshot.docs.map((snapshot) => {
  return {
    products: snapshot.data(),
    id: `${snapshot.id}`
  }
})

window.addEventListener("navigate", (e) => {
  g("category").innerText = e.detail
  if (e.detail == "All Products") {
    shop(categories)
    return
  }

  const filtered = categories.filter(category => category.id.trim() == e.detail)
  shop(filtered)
})

categorise(categories)
shop(categories)
updateCartDsp("thee_craty_soul")

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