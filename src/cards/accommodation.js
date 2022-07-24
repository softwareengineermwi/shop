import { t } from '../../../utils'

export default (data, i) => {
  return t(`<div class="card-v10 card-v10--featured margin-bottom-md">
    <a class="card-v10__img-link radius-lg shadow-lg" href="javascript:void()"">
      <img id="${i}" src="${data.figure}" class="acc" alt="Image description">
    </a>

    <div class="card-v10__content-wrapper">
      <div class="card-v10__content">
        <div class="card-v10__body">
          <p class="card-v10__label text-uppercase color-primary letter-spacing-md">Hotel</p>

          <div class="text-component">
            <h1 class="card-v10__title">${data.name}</h1>
            <p class="card-v10__excerpt color-contrast-medium">Lorem ipsum dolor sit amet consectetur
              adipisicing elit. Magni libero quisquam aliquid.</p>
          </div>
        </div>

        <footer class="card-v10__footer"></footer>
      </div>
    </div>
  </div>`)
}