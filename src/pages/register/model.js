import { router, pathMatchRegexp } from 'utils'
import api from 'api'
import { notification } from 'antd';

const { registerUser } = api

export default {
  namespace: 'register',

  state: {},

  effects: {
    *register({ payload }, { put, call, select }) {
      const data = yield call(registerUser, payload)
      const { locationQuery } = yield select(_ => _.app)
      if (data.success) {
        notification.success({message: "Та амжилттай бүртгүүллээ", description: "Өөрийн бүртгүүлсэн email хаягаараа орж баталгаажуулана уу."})
        const { from } = locationQuery
        if (!pathMatchRegexp('/register', from)) {
          if (['', '/'].includes(from)) router.push('/login')
          else router.push(from)
        } else {
          router.push('/login')
        }
      } else {
        notification.error("Бүргүүлэх үйл ажиллагаа амжилтгүй боллоо.");
        throw data
      }
    },
  },
}
