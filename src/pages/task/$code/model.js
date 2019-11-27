import modelExtend from 'dva-model-extend'
import api from 'api'
import { pathMatchRegexp } from 'utils'
import { pageModel } from 'utils/model'
import {notification} from "antd";
import store from "store";

const { createTaskURL, deleteTaskURL, updateTaskURL, queryTask, addCommentTask  } = api

export default modelExtend(pageModel, {
  namespace: 'task',

  state: {
    data: {},
  },

  subscriptions: {
    setup({ dispatch, history }) {
      history.listen(({ pathname }) => {
        const match = pathMatchRegexp('/task/:id', pathname)
        if (match) {
          dispatch({ type: 'query', payload: { id: match[1] } })
        }
      })
    },
  },

  effects: {
    *query({ payload }, { call, put }) {
      const data = yield call(queryTask, payload)
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

    *queryPromise({ payload }, { call, put }) {
      const data = yield call(queryTask, payload)
      const { success, message, status, ...other } = data
      if (success) {
        return data;
      } else {
        throw data
      }
    },

    *delete({ payload }, { call, put, select }) {
      const data = yield call(deleteTaskURL, { id: payload })
      if (data.success) {
        notification.success({message: "Амжилттай устгалаа"})
        store.set('isInit', false);
        yield put({ type: 'app/query' })
      } else {
        throw data
      }
    },

    *update({ payload }, { select, call, put }) {
      const id = payload.id;
      const newWorkPackage = { ...payload, id }
      const data = yield call(updateTaskURL, newWorkPackage)
      if (data.success) {
      } else {
        throw data
      }
    },

    *create({ payload }, { call, put }) {
      console.log(payload);
      const data = yield call( createTaskURL, payload)
      const { success, message, status, ...other } = data
      if (data.success) {
        notification.success({message: "Амжилттай үүслээ", description: "Даалгавар амжилттай үүслээ"})
        store.set('isInit', false);
        yield put({ type: 'app/query' })
      } else {
        throw data
      }
    },

    *addComment({ payload }, { select, call, put }) {
      console.log("payload:: ", payload);
      const id = payload.id;
      const comment = { ...payload, id }
      const data = yield call(addCommentTask, comment)
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
