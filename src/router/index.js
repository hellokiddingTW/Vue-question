//官方的元件
import Vue from 'vue'
import VueRouter from 'vue-router'


//自訂的元件
import Dashboard from'@/components/dashboard';
import Login from'@/components/pages/login';
import Products from'@/components/pages/products';
import Coupon from'@/components/pages/coupon';
import CustomerOrder from'@/components/pages/customerOrder';





Vue.use(VueRouter);



export default new VueRouter({
    linkActiveClass:"active",
    routes: [
        {
            path:'*',
            redirect:'login'

        },
        {
            name: '登入',
            path: '/login',
            component: Login,
        },
        {
            name: '後台首頁',
            path: '/admin',
            component: Dashboard,
            children:[
                {
                    name: '產品列表',
                    path: 'products',
                    component: Products,
                    meta: { requiresAuth: true },
                },
                {
                    name: '優惠卷',
                    path: 'coupon',
                    component: Coupon,
                    meta: { requiresAuth: true },
                },
            ]
        },
        {
            name: '模擬首頁',
            path: '/front',
            component: Dashboard,
            children:[
                {
                    name: '模擬訂單',
                    path: 'customer_order',
                    component: CustomerOrder,
                },
            ]
        },
    ]
})