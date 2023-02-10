import {legacy_createStore as createStore,combineReducers} from 'redux'
import { CollApsedReducer } from './reducers/CollapsedReducer'
import {SpiningReducer} from './reducers/SpiningReducer'

const reducer = combineReducers({
    CollApsedReducer,
    SpiningReducer
})
const store = createStore(reducer)

export default store