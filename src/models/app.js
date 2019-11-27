/* global window */

import { router } from 'utils'
import { stringify } from 'qs'
import store from 'store'
import { ROLE_TYPE } from 'utils/constant'
import { queryLayout, pathMatchRegexp } from 'utils'
import { CANCEL_REQUEST_MESSAGE } from 'utils/constant'
import api from 'api'
import config from 'config'
import {notification} from "antd";

const { inboxReadByCode, notificationUrl, inboxURL, workSpaceUsers, workPackageUsers, queryRouteList, logoutUser, queryUserInfo, queryUserArray, createWorkSpaceUrl } = api

const goDashboard = () => {
  if (pathMatchRegexp(['/', '/login', '/register', '/confirm', '/home'], window.location.pathname)) {
    router.push({
      pathname: '/to-do',
    })
  }
}

export default {
  namespace: 'app',
  state: {
    routeList: [
    ],
    locationPathname: '',
    locationQuery: {},
    theme: store.get('theme') || 'light',
    collapsed: store.get('collapsed') || false,
    notifications: [],
  },
  subscriptions: {
    setup({ dispatch }) {
      dispatch({ type: 'query' })
      dispatch({ type: 'queryNotification'})
    },
    setupHistory({ dispatch, history }) {
      history.listen(location => {
        dispatch({
          type: 'updateState',
          payload: {
            locationPathname: location.pathname,
            locationQuery: location.query,
          },
        })
      })
    },

    setupRequestCancel({ history }) {
      history.listen(() => {
        const { cancelRequest = new Map() } = window

        cancelRequest.forEach((value, key) => {
          if (value.pathname !== window.location.pathname) {
            value.cancel(CANCEL_REQUEST_MESSAGE)
            cancelRequest.delete(key)
          }
        })
      })
    },
  },
  effects: {
    *queryInbox({ payload = {} }, { call, put }) {
      const data = yield call(inboxURL, payload)
      console.log("INBOX " ,data);
      if (data) {
        return data;
      }
    },
    *queryNotification({ payload = {} }, { call, put }) {
      const data = yield call(notificationUrl, payload)
      if (data) {
        yield put({
          type: 'queryInboxSuccess',
          payload: {
            notifications: data.list,
          }
        });
      }
    },
    *readInboxByCode({ payload }, { call, put }) {
      const data = yield call(inboxReadByCode, payload)
      const { success, message, status, ...other } = data
      if (success) {
        return data;
      } else {
        throw data
      }
    },

    *getWorkSpaceUsers({ payload }, { call, put }) {
      const data = yield call(workSpaceUsers, payload)
      const { success, message, status, ...other } = data
      if (success) {
        return data;
      } else {
        throw data
      }
    },

    *getWorkPackageUsers({ payload }, { call, put }) {
      const data = yield call(workPackageUsers, payload)
      const { success, message, status, ...other } = data
      if (success) {
        return data;
      } else {
        throw data
      }
    },
    *createWorkSpace({ payload }, { call, put }) {
      const data = yield call(createWorkSpaceUrl, payload)
      if (data.success) {
        notification.success({message: "Амжилттай", description: "Ажлын орчин үүслээ."})
      } else {
        throw data
      }
    },

    *queryUserGroup({ payload = {} }, { call, put }) {
      const data = yield call(queryUserArray, payload)
      return data;
    },

    *query({ payload }, { call, put, select }) {
      // store isInit to prevent query trigger by refresh
      const isInit = store.get('isInit')
      if (isInit) {
        goDashboard()
        return
      }
      const { locationPathname } = yield select(_ => _.app)
      const { success, user } = yield call(queryUserInfo, payload)
      if (success && user) {
        const { list } = yield call(queryRouteList)
        const { permissions } = user
        let routeList = list
        if (
          permissions.role === ROLE_TYPE.ADMIN ||
          permissions.role === ROLE_TYPE.MANAGER ||
          permissions.role === ROLE_TYPE.LEADER ||
          permissions.role === ROLE_TYPE.MEMBER
        ) {
          permissions.visit = list.map(item => item.id)
        } else {
          routeList = list.filter(item => {
            const cases = [
              permissions.visit.includes(item.id),
              item.mpid
                ? permissions.visit.includes(item.mpid) || item.mpid === '-1'
                : true,
              item.bpid ? permissions.visit.includes(item.bpid) : true,
            ]
            return cases.every(_ => _)
          })
        }
        store.set('routeList', routeList)
        store.set('permissions', permissions)
        store.set('user', user)
        store.set('isInit', true)
        goDashboard()
      } else if (queryLayout(config.layouts, locationPathname) !== 'public') {

        if(pathMatchRegexp(['/home'], window.location.pathname)) {
          router.push({
            pathname: '/home',
          })
          return;
        }

        if(pathMatchRegexp(['/register'], window.location.pathname)) {
          router.push({
            pathname: '/register',
          })
          return;
        }

        if(pathMatchRegexp(['/confirm/:id'], window.location.pathname)) {
          router.push({
            pathname: window.location.pathname,
          })
          return;
        }

        router.push({
          pathname: '/login',
          search: stringify({
            from: locationPathname,
          }),
        })

      }
    },

    *signOut({ payload }, { call, put }) {
      const data = yield call(logoutUser)
      if (data.success) {
        store.set('routeList', [])
        store.set('token', "")
        store.set('permissions', { visit: [] })
        store.set('user', {})
        store.set('isInit', false)
        yield put({ type: 'query' })
      } else {
        throw data
      }
    },
  },
  reducers: {
    updateState(state, { payload }) {
      return {
        ...state,
        ...payload,
      }
    },

    handleThemeChange(state, { payload }) {
      store.set('theme', payload)
      state.theme = payload
    },

    handleCollapseChange(state, { payload }) {
      store.set('collapsed', payload)
      state.collapsed = payload
    },

    queryInboxSuccess(state, { payload }) {
      state.notifications = payload.notifications;
    },

    updateInboxSuccess(state, { payload }) {
      console.log("payload :::::" ,payload)
      state.notifications = payload.notifications;
    },

    allNotificationsRead(state) {
      state.notifications = []
    },
  },
}
