import { t } from '../../../utils'

export default (product, i) => {
  return t(`<div class="prod-card col-4">
  <span class="prod-card__badge" role="text">New <i class="sr-only">product</i></span>

  <div class="prod-card__img-link" href="#0" aria-label="Description of the link">
    <figure class="prod-card__img ">
      <img id="${i}" class="acc" src="${product.figure}" alt="Product preview image">
    </figure>
  </div>

  <div class="padding-sm text-center">
    <h3><a class="color-inherit" href="#0">Product Name</a></h3>

    <div class="margin-top-xs">
      <span class="prod-card__price">$79</span>
    </div>
  </div>
</div>`)
}