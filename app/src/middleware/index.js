import { toast } from 'react-toastify'
import { generateStore, EventActions } from '@drizzle/store'
import drizzleOptions from '../drizzleOptions'

const contractEventNotifier = store => next => action => {
  if (action.type === EventActions.EVENT_FIRED) {
    const contractEvent = action.event.event
    let display = ""
    if (contractEvent === 'TweetPublished') {
      display = `New tweet updated`
    } else {
      display = `New handle registered`
    }

    toast.success(display, { position: toast.POSITION.TOP_RIGHT, toastId: action.event.id,
      className: 'toast-background', })
  }
  return next(action)
}


const appMiddlewares = [ contractEventNotifier ]

const store = generateStore({
  drizzleOptions,
  appMiddlewares,
  disableReduxDevTools: false  // enable ReduxDevTools!
})

// Use the store with DrizzleProvider
export default store