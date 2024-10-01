import { Notify } from 'quasar'
// import ImageSpinner from 'src/ui-library/ImageSpinner.vue'

// Loading.setDefaults({
//   spinner: ImageSpinner
// })

Notify.setDefaults({
  badgeStyle: 'opacity: 0',
  classes: 'text-h6',
  timeout: 2000,
  position: 'center'
})

export function successNotify(msg: string): void {
  Notify.create({
    message: msg,
    type: 'positive'
  })
}

export function failureNotify(msg: string): void {
  Notify.create({
    message: msg,
    type: 'negative'
  })
}

export function warningNotify(msg: string): void {
  Notify.create({
    message: msg,
    type: 'warning'
  })
}

export function ongoingNotify() {
  Notify.create({
    message: 'Please wait while application is still loading!',
    type: 'ongoing'
  })
}

export default { successNotify, failureNotify, warningNotify, ongoingNotify }
