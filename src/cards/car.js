import { t } from "../../../pickanappApp/src/utils.js"

export default (car, i) => {
  return t(`<div class="col-12 grid gap-md border-bottom margin-bottom-xs">
    <div class="col-3">
      <img id="${i}" src="${car.figure}" class="acc" alt="">
    </div>

    <div class="col-7">
      <a href="#0">
        <h4>${car.name}</h4>
      </a>

      <ul class="flex gap-md margin-top-xs border-bottom padding-bottom-xs margin-bottom-xs">
        <li>
          <span>Mileage</span>
          <h5 class="margin-top-xxs text-bold">183,510 km</h5>
        </li>
        <li>
          <span>Year</span>
          <h5 class="margin-top-xxs text-bold">2032</h5>
        </li>
        <li>
          <span>Engine</span>
          <h5 class="margin-top-xxs text-bold">4,600cc</h5>
        </li>
        <li>
          <span>Transmission</span>
          <h5 class="margin-top-xxs text-bold">Automatic</h5>
        </li>
        <li>
          <span>Location</span>
          <h5 class="margin-top-xxs text-bold">Lusaka</h5>
        </li>
      </ul>

      <ul class="flex gap-sm padding-bottom-xs display@lg">
        <li>
          <span>Steering</span>
          <h5 class="margin-top-xxs text-bold">Right</h5>
        </li>
        <li>
          <span>Fuel</span>
          <h5 class="margin-top-xxs text-bold">Petrol</h5>
        </li>
        <li>
          <span>Color</span>
          <h5 class="margin-top-xxs text-bold">Grey</h5>
        </li>
        <li>
          <span>Drive</span>
          <h5 class="margin-top-xxs text-bold">4WD</h5>
        </li>
        <li>
          <span>Seats</span>
          <h5 class="margin-top-xxs text-bold">5</h5>
        </li>
        <li>
          <span>Doors</span>
          <h5 class="margin-top-xxs text-bold">5</h5>
        </li>
      </ul>
    </div>

    <div class="col-2">
      <div class="margin-bottom-md">
        <h5 class="text-bold text-lg">$13,230</h5>
      </div>
      <div class="">
        <button value="${i}" class="width-100% btn btn--accent buy-now-btn">Buy now</button>
      </div>
    </div>
  </div>`)
}