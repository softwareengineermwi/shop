import {t} from "../../../pickanappApp/src/utils.js"

export default (car, i)=> {
  return t(`<div class="bg-light inner-glow shadow-md margin-bottom-md">
  <div class="grid">
    <div class="flex items-center col-6@md order-2@md">
      <div class="padding-md padding-x-lg@lg padding-y-xxl@lg">
        <div class="text-sm color-contrast-medium margin-bottom-xxs">${car.label}</div>

        <div class="text-component">
          <h1>${car.name}</h1>
        </div>

        <div class="margin-top-sm">
          <div class="flex flex-wrap gap-sm items-center">
            <div><span class="text-xxl">ZMW${car.sPrice}</span></div>
          </div>
        </div>
      </div>
    </div>

    <figure class="col-6@md">
      <img id="${i}" class="block width-100% height-100% object-cover order-1@md acc"
        src="${car.figure}"
        alt="Image description">
    </figure>
  </div>
</div>`)
}