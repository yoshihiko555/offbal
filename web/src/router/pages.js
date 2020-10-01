import { Home, InitSelectCategory } from '@/views/index'

const routes = [
    {
        path: '/',
        name: 'Home',
        component: Home,
        meta: {
        	description: 'offbalはあなたの素晴らしい一日を過ごすためのサポートをしています',
        },
    },
    {
    	path: '/init-select-category',
    	name: 'InitSelectCategory',
    	component: InitSelectCategory,
    	meta: {
            title: 'カテゴリー選択',
    		description: '素晴らしい一日を始めるために、まずはカテゴリーを選択しましょう',
    	},
    },
]

export default routes