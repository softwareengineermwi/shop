import { t } from "../../pickanappApp/src/utils";
import { g, c, openModal } from "../../shop-admin/src/js/utils";
import accommodation from "./cards/accommodation";
import car from "./cards/car";
import product from "./cards/product";
import profile from "./cards/profile"
import imageZoom from "./components/zoom"

var total = 0

const getTotal = () => total

const cartProduct = (data, key) => {
  console.log(key);
  const listItem = c("li", "dr-cart__product")
  const imageLink = c("a", "dr-cart__img")
  const image = c("img", "dr-cart__img")
  const name = c("h2", "text-sm")
  const holderRight = c("div", "text-right")
  const price = c("p", "text-sm color-contrast-higher")
  const removeBtn = c("button", "dr-cart__remove-btn margin-top-xxxs")

  image.src = data.image
  name.innerText = data.name
  price.innerText = `$${data.price}`
  removeBtn.innerText = "Remove"
  removeBtn.addEventListener("click", () => {
    const mCart = (localStorage.getItem("thee_craty_soul") ? JSON.parse(localStorage.getItem("thee_craty_soul")) : {})
    delete mCart[key]
    localStorage.setItem("thee_craty_soul", JSON.stringify(mCart))
    updateCartDsp("thee_craty_soul")
  })

  imageLink.appendChild(image)
  holderRight.appendChild(price)
  holderRight.appendChild(removeBtn)

  listItem.appendChild(imageLink)
  listItem.appendChild(name)
  listItem.appendChild(holderRight)

  return listItem
}

const updateCartDsp = (cartId) => {
  const cartProducts = g("cartProducts")
  cartProducts.innerHTML = ""
  total = 0

  var pCount = 0

  g("cartProducts").innerHTML = ""

  const mCart = (localStorage.getItem(cartId) ? JSON.parse(localStorage.getItem(cartId)) : {})

  for (const key in mCart) {
    if (Object.hasOwnProperty.call(mCart, key)) {
      const product = mCart[key];
      cartProducts.appendChild(cartProduct(product, key))
      total += parseFloat(product.price)
      pCount += 1
    }
  }

  g("total").innerText = total
  g("cartTotal").innerText = total
  g("checkoutTotal").innerText = total
  g("pCount").innerText = pCount
  g("cartCount").innerText = pCount
}

const cart = (cartId, add, product, productId) => {
  if (add) {
    const mCart = (localStorage.getItem(cartId) ? JSON.parse(localStorage.getItem(cartId)) : {})
    mCart[productId] = product
    localStorage.setItem(cartId, JSON.stringify(mCart))
    updateCartDsp(cartId)
  } else {
    const mCart = (localStorage.getItem(cartId) ? JSON.parse(localStorage.getItem(cartId)) : {})
    delete mCart[productId]
    localStorage.setItem(cartId, JSON.stringify(mCart))
    // updateCartDsp(cartId)
  }
}

const selectable = (product, key) => {
  const card = c("div", "prod-card margin-bottom-md")

  function handler(target) {
    if (target.classList.contains("btn--primary")) {
      // * isSelected
      target.classList.remove("btn--primary")
      target.classList.add("btn--subtle")
      target.innerText = "remove"
      card.classList.toggle("selected")
      cart("thee_craty_soul", true, product, key)
    } else {
      // ! isNotSelected
      target.classList.remove("btn--subtle")
      target.classList.add("btn--primary")
      target.innerText = "add"
      card.classList.toggle("selected")
      cart("thee_craty_soul", false, product, key)
    }
  }

  const badge = c("span", "prod-card__badge")
  const selector = c("button", "product-card__selector btn btn--primary material-icons")
  const a = c("a", "prod-card__img-link")
  const figure = c("figure", "prod-card__img")
  const image = c("img", "prod-card__img")

  const priceNameContainer = c("div", "padding-sm text-center")
  const name = c("h3", "color-inherit")
  const priceContainer = c("div", "margin-top-xs")
  const price = c("span", "prod-card__price")

  badge.innerText = "New"
  selector.innerText = "add"
  selector.value = ""

  selector.addEventListener("click", (e) => handler(e.target))
  image.addEventListener("click", () => handler(selector))

  image.src = product.image
  name.innerText = product.name
  price.innerText = `$${product.price}`

  figure.appendChild(image)
  a.appendChild(figure)

  priceContainer.appendChild(price)
  priceNameContainer.appendChild(name)
  priceNameContainer.appendChild(priceContainer)

  card.appendChild(badge)
  card.appendChild(selector)
  card.appendChild(a)
  card.appendChild(priceNameContainer)

  return card
}

const categoryUi = (key, position) => {
  const category = document.createElement("template")
  category.innerHTML = `<li class="filter-nav__item">
    <button value="${position}" class="reset filter-nav__btn js-filter-nav__btn js-tab-focus" data-filter="${position}">${key}</button>
  </li>`
  return category.content.firstChild
}

const categorise = (category, target) => {
  const categoriesArea = g("categories")
  category.items.forEach((element, i) => {
    categoriesArea.appendChild(categoryUi(element.name, i))
  });
}

const clearColumns = () => {
  g("col1").innerHTML = ""
  g("col2").innerHTML = ""
  g("col3").innerHTML = ""
}

const dsp = (items, card) => {
  switch (card) {
    case "car":
      items.forEach((element, i) => {
        g("shop").appendChild(car(element, i))
      });
      break
    case "accommodation":
      items.forEach((element, i) => {
        g("shop").appendChild(accommodation(element, i))
      });
      break
    case "profile":
      items.forEach((element, i) => {
        g("shop").appendChild(profile(element, i))
      });
      break
  }
}

/************************************************** */
var slideIndex = 1;

function showSlides(n, imgs) {
  g("myimage").src = imgs[n]
  g("i").innerText = n + 1
  g("t").innerText = imgs.length

  // let i;
  // let slides = document.getElementsByClassName("mySlides");
  // // let dots = document.getElementsByClassName("dot");
  // if (n > slides.length) { slideIndex = 1 }
  // if (n < 1) { slideIndex = slides.length }

  // for (i = 0; i < slides.length; i++) {
  //   slides[i].style.display = "none";
  // }

  // for (i = 0; i < dots.length; i++) {
  //   dots[i].className = dots[i].className.replace(" active", "");
  // }

  // slides[slideIndex - 1].style.display = "block";

  // dots[slideIndex - 1].className += " active";
}
/**************************************************/

const dspProduct = (data) => {
  console.log(data);

  g("modal-title").innerText = data.name;
  g("modal-subtitle").innerText = data.name;
  g("d_price").innerText = `$${data.sPrice}`;
  g("description").innerText = data.description;

  console.log(data.images);

  data.images.forEach((e, i) => {
    g("thumbnails").appendChild(t(`<div class="column">
      <img id="${i}" class="demo cursor thumbnail" src="${e}" style="width:100%">
    </div>`))
  });

  document.querySelectorAll(".thumbnail").forEach(element => {
    element.addEventListener("click", (e) => {
      showSlides(parseInt(e.target.id, 10), data.images)
    })
  });

  openModal(g("modal-full-screen"))

  showSlides(0, data.images);
  imageZoom("myimage", "myresult");
}

function activateFilters(category, callback) {
  switch (category) {
    case "Cars":
      g("make").addEventListener("change", (e) => { callback(e.target.id, e.target.value) })
      break;
  }
}

const shop = (data, category) => {
  const shopArea = g('shop')
  shopArea.innerHTML = ''

  switch (category) {
    case "Cars":
      data.forEach((item, i) => {
        console.log(item.data());
        shopArea.appendChild(car(item.data(), i))
      });

      activateFilters(category, (k, v) => {
        shopArea.innerHTML = ""

        data.forEach(item => {
          const itemData = item.data()
          if (itemData[k] == v) {
            shopArea.appendChild(car(itemData, i))
          }
        });
      })
    case "Hotels":
      data.forEach((item, i) => {
        console.log(item.data());
        shopArea.appendChild(accommodation(item.data(), i))
      });

      activateFilters(category, (k, v) => {
        shopArea.innerHTML = ""
        data.forEach(item => {
          const itemData = item.data()

          if (itemData[k] == v) {
            shopArea.appendChild(car(itemData, i))
          }
        });
      })
      break;
    case "Electronics":
      data.forEach((item, i) => {
        console.log(item.data());
        shopArea.appendChild(product(item.data(), i))
      });

      activateFilters(category, (k, v) => {
        shopArea.innerHTML = ""
        data.forEach(item => {
          const itemData = item.data()

          if (itemData[k] == v) {
            shopArea.appendChild(car(itemData, i))
          }
        });
      })
      break;
    case "Maids":
      data.forEach((item, i) => {
        console.log(item.data());
        shopArea.appendChild(profile(item.data(), i))
      });

      activateFilters(category, (k, v) => {
        shopArea.innerHTML = ""
        data.forEach(item => {
          const itemData = item.data()

          if (itemData[k] == v) {
            shopArea.appendChild(car(itemData, i))
          }
        });
      })
      break;
  }

  // const category = data.items[position]

  // switch (data.type) {
  //   case "accommodation":
  //     console.log(category);
  //     dsp(category.items, "accommodation")

  //     document.querySelectorAll(".acc").forEach(element => {
  //       element.addEventListener("click", (e) => {
  //         e.preventDefault()
  //         dspProduct(category.items[parseInt(e.target.id, 10)])
  //       })
  //     })
  //     break
  //   case "vehicle":
  //     console.log(category);
  //     const items = category.items

  //     dsp(items, "car")

  //     document.querySelectorAll(".acc").forEach(element => {
  //       element.addEventListener("click", (e) => {
  //         e.preventDefault()
  //         dspProduct(items[parseInt(e.target.id, 10)])
  //       })
  //     })

  //     document.querySelectorAll(".buy-now-btn").forEach(button => {
  //       button.addEventListener("click", () => {
  //         openModal(g("modal-pPay"))
  //       })
  //     })

  //     g("d_price").style.display = "block"
  //     g("buy-now-btn").style.display = "block"
  //     g("btn-get-quote").style.display = "block"
  //     // g("btn-hire-now").style.display = "block"
  //     break
  //   case "profile":
  //     dsp(category.items, "profile")
  //     document.querySelectorAll(".acc").forEach(element => {
  //       element.addEventListener("click", (e) => {
  //         e.preventDefault()
  //         dspProduct(category.items[parseInt(e.target.id, 10)])
  //       })
  //     })

  //     g("btn-hire-now").style.display = "block"
  //     g("d_price").style.display = "block"
  //     break
  // }
}

g("btn-hire-now").addEventListener("click", () => {
  openModal(g("modal-form"))
})

export { updateCartDsp, categorise, getTotal }
export default shop


















// function plusSlides(n) {
//   showSlides(slideIndex += n);
// }

// function currentSlide(n) {
//   showSlides(slideIndex = n);
// }

    // g("mSlides").appendChild(t(`<div class="mySlides fade">
    //   <div class="numbertext">${i + 1} / ${data.images.length}</div>
    //   <img src="${e}" style="width:100%">
    // </div>`))