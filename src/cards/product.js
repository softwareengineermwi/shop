import { t } from "../../../pickanappApp/src/utils.js"

export default (product, i) => {
  return t(`<div class="prod-card col-3">
  <span class="prod-card__badge" role="text">New <i class="sr-only">product</i></span>

  <a class="prod-card__img-link" href="#0" aria-label="Description of the link">
    <figure class="prod-card__img ">
      <img src="${product.figure}" alt="Product preview image">
    </figure>
  </a>

  <div class="padding-sm text-center">
    <h3><a class="color-inherit" href="#0">Product Name</a></h3>

    <div class="margin-top-xs">
      <span class="prod-card__price">$79</span>
    </div>
  </div>
</div>`)
}