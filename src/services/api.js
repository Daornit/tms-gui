export default {
  queryRouteList: '/routes',

  queryUserInfo: '/currentUser',
  logoutUser: '/user/logout',
  loginUser: 'POST /login',
  registerUser: 'POST /register',
  confirmUrl: 'GET /confirm-account',

  queryUser: '/user/:id',
  queryUserList: '/users',
  updateUser: 'Patch /user/:id',
  createUser: 'POST /user',
  removeUser: 'DELETE /user/:id',
  removeUserList: 'POST /users/delete',

  queryPostList: '/posts',

  queryDashboard: '/dashboard',
}
