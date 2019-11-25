export default {
  queryRouteList: '/routes',

  queryUserInfo: '/currentUser',
  logoutUser: '/user/logout',
  loginUser: 'POST /login',
  registerUser: 'POST /register',
  confirmUrl: 'GET /confirm-account',

  createWorkSpaceUrl: 'POST /work-space',
  queryWorkSpaceUrl: '/work-space/:id',
  deleteWorkSpace: 'DELETE /work-space/:id',
  updateWorkSpace: 'PUT /work-space/:id',
  workSpaceUsers: 'GET /work-space/:id/users',

  inboxURL: 'GET /inbox',
  notificationUrl: 'GET /notifications',
  inboxReadByCode: 'GET /inbox/:code',


  createWorkPackage: 'POST /work-package',
  queryWorkPackage: '/work-package/:id',
  deleteWorkPackage: 'DELETE /work-package/:id',
  updateWorkPackage: 'PUT /work-package/:id',
  addCommentWorkPackage: 'POST /work-package/:id/comment',

  queryUser: '/user/:id',
  queryUserList: '/team/users',
  queryUserArray: '/team/users/list',
  updateUser: 'Patch /team/user/:id',
  createUser: 'POST /user',
  removeUser: 'DELETE /team/user/:id',
  removeUserList: 'POST /users/delete',

  queryPostList: '/posts',

  queryDashboard: '/dashboard',
}
