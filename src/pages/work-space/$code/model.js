import modelExtend from 'dva-model-extend'
import store from 'store'
import api from 'api'
import { pathMatchRegexp } from 'utils'
import { pageModel } from 'utils/model'
import {notification} from "antd";

const { queryWorkSpaceUrl, deleteWorkSpace, updateWorkSpace, createWorkPackage, queryWorkPackages, deleteWorkPackage, updateWorkPackage, queryWorkPackage} = api

export default modelExtend(pageModel, {
  namespace: 'spaceDetail',

  state: {
    currentItem: {},
    data: {},
    list: [],
    modalVisible: false,
    modalType: 'createWorkPackage',
    selectedRowKeys: [],
  },

  subscriptions: {
    setup({ dispatch, history }) {
      history.listen(({ pathname }) => {
        const match = pathMatchRegexp('/work-space/:id', pathname)
        if (match) {
          dispatch({ type: 'query', payload: { id: match[1] } })
        }
      })
    },
  },

  effects: {
    *query({ payload }, { call, put }) {
      const data = yield call(queryWorkSpaceUrl, payload)
      const { success, message, status, ...other } = data
      if (success) {
        yield put({
          type: 'querySuccess',
          payload: {
            data: other,
            list: other.workPackages,
          },
        })
      } else {
        throw data
      }
    },
    *delete({ payload }, { call, put, select }) {
      console.log("payload :: " , payload);
      const data = yield call(deleteWorkSpace, { id: payload.id })
      if (data.success) {
        store.set('isInit', false);
        yield put({ type: 'app/query' })
      } else {
        throw data
      }
    },

    *update({ payload }, { select, call, put }) {
      const newSpace = { ...payload }
      const data = yield call(updateWorkSpace, newSpace)
      if (data.success) {
        store.set('isInit', false);
        yield put({ type: 'app/query' })
        return data;
      }
    },

    *deleteWorkPackage({ payload }, { call, put, select }) {
      const data = yield call(deleteWorkPackage, { id: payload })
      if (data.success) {
        notification.success({message: "Амжилттай устгалаа"})
        store.set('isInit', false);
        yield put({ type: 'app/query' })
      } else {
        throw data
      }
    },

    *createWorkPackage({ payload }, { call, put }) {
      console.log(payload);
      const data = yield call(createWorkPackage, payload)
      if (data.success) {
        notification.success({message: "Амжилттай үүслээ", description: "Төсөл амжилттай үүслээ"})
        store.set('isInit', false);
        yield put({ type: 'app/query' })
        yield put({ type: 'hideModal' })
      } else {
        throw data
      }
    },

    *updateWorkPackage({ payload }, { select, call, put }) {
      const id = payload.id;
      const newWorkPackage = { ...payload, id }
      const data = yield call(updateWorkPackage, newWorkPackage)
      if (data.success) {
        notification.success({message: "Амжилттай заслаа"})
        store.set('isInit', false);
        yield put({ type: 'app/query' })
        yield put({ type: 'hideModal' })
      } else {
        throw data
      }
    },
  },

  reducers: {
    showModal(state, { payload }) {
      return { ...state, ...payload, modalVisible: true }
    },

    hideModal(state) {
      return { ...state, modalVisible: false }
    },

    querySuccess(state, { payload }) {
      const { data } = payload
      return {
        ...state,
        data,
      }
    },
  },
})
