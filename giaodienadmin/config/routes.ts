
export default [
  {
    path: '/user',
    layout: false,
    routes: [
      {
        path: '/user/login',
        layout: false,
        name: 'login',
        component: './user/Login',
      },
      {
        path: '/user',
        redirect: '/user/login',
      },
      {
        name: 'register-result',
        icon: 'smile',
        path: '/user/register-result',
        component: './user/register-result',
      },
      {
        name: 'register',
        icon: 'smile',
        path: '/user/register',
        component: './user/register',
      },
      {
        component: '404',
      },
    ],
  },
  {
    path: '/dashboard',
    name: 'dashboard',
    icon: 'dashboard',
    component: './Dashboard',
  },
  {
    path: '/devices',
    name: 'devices',
    icon: 'laptop',
    routes: [
      {
        path: '/devices',
        redirect: '/devices/list',
      },
      {
        path: '/devices/list',
        name: 'list',
        component: './Devices/List',
      },
      {
        path: '/devices/add',
        name: 'add',
        component: './Devices/Form',
      },
      {
        path: '/devices/edit/:id',
        name: 'edit',
        component: './Devices/Form',
        hideInMenu: true,
      },
    ],
  },
  {
    path: '/borrow-requests',
    name: 'borrow-requests',
    icon: 'file-text',
    routes: [
      {
        path: '/borrow-requests',
        redirect: '/borrow-requests/pending',
      },
      {
        path: '/borrow-requests/pending',
        name: 'pending',
        component: './BorrowRequests/Pending',
      },
      {
        path: '/borrow-requests/approved',
        name: 'approved',
        component: './BorrowRequests/Approved',
      },
      {
        path: '/borrow-requests/rejected',
        name: 'rejected',
        component: './BorrowRequests/Rejected',
      },
      {
        path: '/borrow-requests/detail/:id',
        name: 'detail',
        component: './BorrowRequests/Detail',
        hideInMenu: true,
      },
    ],
  },
  {
    path: '/borrow-records',
    name: 'borrow-records',
    icon: 'history',
    routes: [
      {
        path: '/borrow-records',
        redirect: '/borrow-records/active',
      },
      {
        path: '/borrow-records/active',
        name: 'active',
        component: './BorrowRecords/Active',
      },
      {
        path: '/borrow-records/overdue',
        name: 'overdue',
        component: './BorrowRecords/Overdue',
      },
      {
        path: '/borrow-records/returned',
        name: 'returned',
        component: './BorrowRecords/Returned',
      },
    ],
  },
  {
    path: '/statistics',
    name: 'statistics',
    icon: 'bar-chart',
    component: './Statistics',
  },
  {
    path: '/',
    redirect: '/dashboard',
  },
  {
    component: './404',
  },
];
