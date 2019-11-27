import { router, pathMatchRegexp } from 'utils'
import store from 'store'
import api from 'api'

const { loginUser } = api

export default {
  namespace: 'login',

  state: {},

  effects: {
    *login({ payload }, { put, call, select }) {
      const data = yield call(loginUser, payload)
      const { locationQuery } = yield select(_ => _.app)
      if (data.success) {
        store.set('token', data.token)
        const { from } = locationQuery
        yield put({ type: 'app/query' })
        if (!pathMatchRegexp('/login', from)) {
          if (['', '/'].includes(from)) router.push('/to-do')
          else router.push(from)
        } else {
          router.push('/to-do')
        }
      } else {
        throw data
      }
    },
  },
}
