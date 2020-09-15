import Home from '@/views/Home'
import InitSelectCategory from '@/views/InitSelectCategory'

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
    	title: 'カテゴリー選択',
    	meta: {
    		description: '素晴らしい一日を始めるために、まずはカテゴリーを選択しましょう',
    	},
    },
]

export default routes