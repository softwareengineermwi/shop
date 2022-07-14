import { t } from '../../../pickanappApp/src/utils'

export default (data, i) => {
  return t(`<div class="col-12 grid gap-md border-bottom margin-bottom-xs">
    <div class="col-3">
      <img src="${data.figure}" class="radius-lg acc" id="${i}">
    </div>

    <div class="col-9">
      <a href="#0">
        <h4>${data.name}</h4>
      </a>

      <ul class="flex gap-md margin-top-xs border-bottom padding-bottom-xs">
        <li>
          <span>Age</span>
          <h5 class="margin-top-xxs text-bold">97</h5>
        </li>
        <li>
          <span>Tribe</span>
          <h5 class="margin-top-xxs text-bold">Chipata</h5>
        </li>
        <li>
          <span>Location</span>
          <h5 class="margin-top-xxs text-bold">Lusaka</h5>
        </li>
      </ul>

      <div class="flex gap-md padding-y-sm">
        <i class="material-icons md-48">star</i>
        <i class="material-icons md-48">star</i>
        <i class="material-icons md-48">star</i>
        <i class="material-icons md-48">star</i>
        <i class="material-icons md-48">star</i>
      </div>

      <div class="hide">
        <button class="width-100% btn btn--primary btn--sm hire-now-btn">Hire now</button>
      </div>
    </div>
  </div>`)
}