function path(root, sublink) {
    return `${root}${sublink}`;
  }

  const ROOTS_AUTH = '/auth';
  const ROOTS_DASHBOARD = '/dashboard';
  // ----------------------------------------------------------------------

export const PATH_AUTH = {
    root: ROOTS_AUTH,
    login: path(ROOTS_AUTH, '/login'),

    loginUnprotected: path(ROOTS_AUTH, '/login-unprotected'),

    verify: path(ROOTS_AUTH, '/verify'),
 };

 export const PATH_DASHBOARD = {
    root: ROOTS_DASHBOARD,
    general:{
        app: path(ROOTS_DASHBOARD, '/app'),
    },
    user: {
      root: path(ROOTS_DASHBOARD, '/user'),
      new: path(ROOTS_DASHBOARD, '/user/new'),
      list: path(ROOTS_DASHBOARD, '/user/list'),
      cards: path(ROOTS_DASHBOARD, '/user/cards'),
      profile: path(ROOTS_DASHBOARD, '/user/profile'),
      account: path(ROOTS_DASHBOARD, '/account'),
      edit: (name) => path(ROOTS_DASHBOARD, `/user/${name}/edit`),
      demoEdit: path(ROOTS_DASHBOARD, `/user/reece-chung/edit`),
    },    
    resource: {
      root: path(ROOTS_DASHBOARD, '/resource'),
      new: path(ROOTS_DASHBOARD, '/resource/new'),
      list: path(ROOTS_DASHBOARD, '/resource/list'),
      edit: (name) => path(ROOTS_DASHBOARD, `/resource/${name}/edit`),
    },
    reference: {
      root: path(ROOTS_DASHBOARD, '/reference'),
      new: path(ROOTS_DASHBOARD, '/reference/new'),
      list: path(ROOTS_DASHBOARD, '/reference/list'),
      edit: (name) => path(ROOTS_DASHBOARD, `/reference/${name}/edit`),
    },
    vehicle: {
      root: path(ROOTS_DASHBOARD, '/vehicle'),
      new: path(ROOTS_DASHBOARD, '/vehicle/new'),
      list: path(ROOTS_DASHBOARD, '/vehicle/list'),
      edit: (name) => path(ROOTS_DASHBOARD, `/vehicle/${name}/edit`),
    },
    test:{
      root: path(ROOTS_DASHBOARD, '/test'),
      new: path(ROOTS_DASHBOARD, '/test/new'),
      list: path(ROOTS_DASHBOARD, '/test/list'),
      edit: (name) => path(ROOTS_DASHBOARD, `/test/${name}/edit`),
      testWorkflow: (name) => path(ROOTS_DASHBOARD, `/test/${name}/test-workflow`),
      //testWorkflow: path(ROOTS_DASHBOARD, '/test/test-workflow'),
    },

 }

 export const PATH_PAGE = {
  page404: '/404',
};