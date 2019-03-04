const Callback = () => import('./components/LoginCallback.vue')
const Login = () => import('./components/Login.vue')
const Home = () => import('./components/Home.vue')

export const routes = [
  {
    path: '/',
    component: Home,
    name: 'home',
    meta: { requiresAuth: true }
  },
  {
    path: '/callback',
    component: Callback,
    props: (route) => ({ code: route.query.code }),
    name: 'callback'
  },
  {
    path: '/login',
    component: Login,
    name: 'login'
  },
  {
    path: '*',
    redirect: {name: 'home'}
  }
]
