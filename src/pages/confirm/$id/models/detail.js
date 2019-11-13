import { pathMatchRegexp } from 'utils'
import api from 'api'

const { confirmUrl } = api

export default {
  namespace: 'confirmDetail',

  state: {
    data: {},
  },

  subscriptions: {
    setup({ dispatch, history }) {
      history.listen(({ pathname }) => {
        const match = pathMatchRegexp('/confirm/:id', pathname)
        if (match) {
          dispatch({ type: 'query', payload: { token: match[1] } })
        }
      })
    },
  },

  effects: {
    *query({ payload }, { call, put }) {
      console.log(confirmUrl);
      const data = yield call(confirmUrl, payload)
      const { success, message, status, ...other } = data
      if (success) {
        yield put({
          type: 'querySuccess',
          payload: {
            data: other,
          },
        })
      } else {
        throw data
      }
    },
  },

  reducers: {
    querySuccess(state, { payload }) {
      const { data } = payload
      return {
        ...state,
        data,
      }
    },
  },
}
