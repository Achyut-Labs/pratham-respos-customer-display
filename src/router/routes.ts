import { RouteRecordRaw } from 'vue-router';

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    component: () => import('layouts/StartLayout.vue'),
    meta: { protected: true },
    children: [
      {
        path: '',
        name: 'start',
        component: () => import('pages/StartPage.vue'),
        meta: { protected: false },
      },
    ],
  },
  {
    path: '/start',
    component: () => import('layouts/MainLayout.vue'),
    children: [{ path: '', component: () => import('pages/IndexPage.vue') }],
  },

  // Always leave this as last one,
  // but you can also remove it
  {
    path: '/:catchAll(.*)*',
    component: () => import('pages/ErrorNotFound.vue'),
  },
];

export default routes;
