import modelExtend from 'dva-model-extend'
import api from 'api'
import { pathMatchRegexp } from 'utils'
import { pageModel } from 'utils/model'
import {notification} from "antd";

const { addCommentWorkPackage, queryWorkPackage, deleteWorkPackage, updateWorkPackage  } = api

export default modelExtend(pageModel, {
  namespace: 'workPackageDetail',

  state: {
    data: {},
  },

  subscriptions: {
    setup({ dispatch, history }) {
      history.listen(({ pathname }) => {
        const match = pathMatchRegexp('/work-package/:id', pathname)
        if (match) {
          dispatch({ type: 'query', payload: { id: match[1] } })
        }
      })
    },
  },

  effects: {
    *query({ payload }, { call, put }) {
      const data = yield call(queryWorkPackage, payload)
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

    *queryWorkPackage({ payload }, { call, put }) {
      const data = yield call(queryWorkPackage, payload)
      const { success, message, status, ...other } = data
      if (success) {
        return data;
      } else {
        throw data
      }
    },

    *delete({ payload }, { call, put, select }) {
      const data = yield call(deleteWorkPackage, { id: payload })
      if (data.success) {
        notification.success({message: "Амжилттай устгалаа"})
      } else {
        throw data
      }
    },

    *update({ payload }, { select, call, put }) {
      const id = payload.id;
      const newWorkPackage = { ...payload, id }
      const data = yield call(updateWorkPackage, newWorkPackage)
      if (data.success) {
        notification.success({message: "Амжилттай заслаа"})
      } else {
        throw data
      }
    },

    *addComment({ payload }, { select, call, put }) {
      console.log("payload:: ", payload);
      const id = payload.id;
      const comment = { ...payload, id }
      const data = yield call(addCommentWorkPackage, comment)
      if (data.success) {
        return data;
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
})
