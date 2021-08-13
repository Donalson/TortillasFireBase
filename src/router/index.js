import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'Inicio',
    component: () => import(/* webpackChunkName: "Inicio" */ '../views/Inicio.vue')
  },

  {
    path: '/Clientes',
    name: 'Clientes',
    component: () => import(/* webpackChunkName: "Clientes" */ '../views/Clientes.vue')
  },

  {
    path: '/Tortillas',
    name: 'Tortillas',
    component: () => import(/* webpackChunkName: "Tortillas" */ '../views/Tortillas.vue')
  },

  {
    path: '/Pedidos',
    name: 'Pedidos',
    component: () => import(/* webpackChunkName: "Pedidos" */ '../views/Pedidos.vue')
  },

  {
    path: '/Ventas',
    name: 'Ventas',
    component: () => import(/* webpackChunkName: "Ventas" */ '../views/Ventas.vue')
  },

  {
    path: '/Reportes',
    name: 'Reportes',
    component: () => import(/* webpackChunkName: "Reportes" */ '../views/Reportes.vue')
  },
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
