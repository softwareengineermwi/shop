// const selectable = (product, key) => {
//     const card = c("div", "prod-card margin-bottom-md")

//     function handler(target) {
//         if (target.classList.contains("btn--primary")) {
//             // * isSelected
//             target.classList.remove("btn--primary")
//             target.classList.add("btn--subtle")
//             target.innerText = "remove"
//             card.classList.toggle("selected")
//             cart("thee_craty_soul", true, product, key)
//         } else {
//             // ! isNotSelected
//             target.classList.remove("btn--subtle")
//             target.classList.add("btn--primary")
//             target.innerText = "add"
//             card.classList.toggle("selected")
//             cart("thee_craty_soul", false, product, key)
//         }
//     }

//     const badge = c("span", "prod-card__badge")
//     const selector = c("button", "product-card__selector btn btn--primary material-icons")
//     const a = c("a", "prod-card__img-link")
//     const figure = c("figure", "prod-card__img")
//     const image = c("img", "prod-card__img")

//     const priceNameContainer = c("div", "padding-sm text-center")
//     const name = c("h3", "color-inherit")
//     const priceContainer = c("div", "margin-top-xs")
//     const price = c("span", "prod-card__price")

//     badge.innerText = "New"
//     selector.innerText = "add"
//     selector.value = ""

//     selector.addEventListener("click", (e) => handler(e.target))
//     image.addEventListener("click", () => handler(selector))

//     image.src = product.image
//     name.innerText = product.name
//     price.innerText = `$${product.price}`

//     figure.appendChild(image)
//     a.appendChild(figure)

//     priceContainer.appendChild(price)
//     priceNameContainer.appendChild(name)
//     priceNameContainer.appendChild(priceContainer)

//     card.appendChild(badge)
//     card.appendChild(selector)
//     card.appendChild(a)
//     card.appendChild(priceNameContainer)

//     return card
// }