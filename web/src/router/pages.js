import Home from '@/views/Home'
import MyApp from '@/views/MyApp'

const routes = [
    {
        path: '/',
        name: 'Home',
        component: Home
    },
    {
        path: '/myapp',
        name: 'MyApp',
        component: MyApp
    },
]

export default routes