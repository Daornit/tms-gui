import modelExtend from 'dva-model-extend'
import api from 'api'
import { pageModel } from 'utils/model'
import {notification} from "antd";
import store from "store";

const { deleteTaskURL, updateTaskURL, toAssignUrl  } = api

export default modelExtend(pageModel, {
  namespace: 'toAssign',

  state: {
    data: {},
  },

  subscriptions: {
    setup({ dispatch }) {
      dispatch({ type: 'query', payload: {} })
    },
  },

  effects: {
    *query({ payload }, { call, put }) {
      const data = yield call(toAssignUrl, payload)
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

    *updateTask({ payload }, { select, call, put }) {
      const id = payload.id;
      const newWorkPackage = { ...payload, id }
      const data = yield call(updateTaskURL, newWorkPackage)
      if (data.success) {
        notification.success({message: "Амжилттай заслаа"})
      } else {
        throw data
      }
    },

    *deleteTask({ payload }, { call, put, select }) {
      const data = yield call(deleteTaskURL, { id: payload })
      if (data.success) {
        notification.success({message: "Амжилттай устгалаа"})
        store.set('isInit', false);
        yield put({ type: 'app/query' })
        return data
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
