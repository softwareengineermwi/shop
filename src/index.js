import './style.css';
import './custom.css';
import { colorSwatches, modalWindow } from './js/scripts';

import { initializeApp } from 'firebase/app'
import { getAuth, onAuthStateChanged, signInWithEmailAndPassword } from "firebase/auth"
import { getFirestore, getDoc, where, addDoc, query, collection, getDocs, doc, updateDoc, serverTimestamp } from 'firebase/firestore'
import shop, { getTotal } from './shop'
import { updateCartDsp, categorise } from './shop'
import { g } from '../../utils/index'

import { MDCSlider } from '@material/slider';
const slider = new MDCSlider(g('maid_age_range'));
const eSlider = new MDCSlider(g('electronics_price_range'));
const hSlider = new MDCSlider(g('houses_price_range'));
const dSlider = new MDCSlider(g('distance_to_tarmac'));

slider.listen("MDCSlider:change", (e) => {
  console.log(slider.getValueStart());
})

// slider.initialize()

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
  const category = urlParams.get('category')

  g(`${category}_filters`).style.display = "block"
  g(`${category}_details`).style.display = "block"

  const coll = collection(db, "products")
  const q = query(coll, where("category", "==", category))

  const querySnapshot = await getDocs(q)

  const products = []

  querySnapshot.forEach((doc) => {
    // doc.data() is never undefined for query doc snapshots
    console.log(doc.id, " => ", doc.data());
    products.push(doc)
  });

  shop(products, category)

  modalWindow();
  colorSwatches();
} else { console.log("sdfghjk"); }


// g("btnOrder").addEventListener("click", async (e) => {
//   e.target.disabled = true
//   const phone = g("phone").value
//   if (phone !== null) {
//     const mCart = (localStorage.getItem("thee_craty_soul") ? JSON.parse(localStorage.getItem("thee_craty_soul")) : {})

//     await addDoc(collection(db, "orders"), {
//       items: mCart,
//       timestamp: serverTimestamp(),
//       phone: phone
//     }).then((doc) => {
//       closeModal("modal-pPay")
//       g("transferTotal").innerText = getTotal()
//       g("orderId").innerText = doc.id
//       openModal_v2("modal-order")
//     })
//   } else { alert("Phone number required!") }
// })

// const querySnapshot = await getDocs(query(collection(db, "categories")))

// const categories = querySnapshot.docs.map((snapshot) => {
//   return {
//     products: snapshot.data(),
//     id: `${snapshot.id}`
//   }
// })

// updateCartDsp("thee_craty_soul")
