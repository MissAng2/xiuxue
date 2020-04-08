import index from './pages/index/index.vue';
import SQ from './pages/index/SQ.vue';
import add from './pages/index/add.vue';
import sqdetail from './pages/index/sqdetail.vue';
import draft from './pages/index/draft.vue';
import SH from './pages/index/SH.vue';
import shdetail from './pages/index/shdetail.vue';
export default {
    routes: [
        {
            path: '/',
            component: index
        },
        {
            path: '/SQ',
            component: SQ
        },
        {
            path: '/add',
            component: add
        },
        {
            path: '/sqdetail',
            component: sqdetail
        },
        {
            path: '/draft',
            component: draft
        },
        {
            path: '/SH',
            component: SH
        },
        {
            path: '/shdetail',
            component: shdetail
        },
    ]
};