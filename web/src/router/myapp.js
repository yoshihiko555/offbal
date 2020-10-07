import { MyApp, StartApp, Activitys, DetailCategory, TodayScheduled, FutureScheduled, Karma, SearchResult } from '@/views/index'

const routes = {
	path: '/myapp',
	component: MyApp,
	children: [
		{
			path: '',
			name: 'StartApp',
			component: StartApp,
		    meta: {
		    	title: 'App',
		    },
		},
		{
			path: 'activity',
			name: 'Activitys',
			component: Activitys,
		    meta: {
		    	title: 'Activity',
		    },
		},
		{
			path: 'category/:name',
			name: 'DetailCategory',
			component: DetailCategory,
		},
		{
			path: 'today',
			name: 'TodayScheduled',
			component: TodayScheduled,
		    meta: {
		    	title: 'Today',
		    },
		},
		{
			path: 'future-scheduled',
			name: 'FutureScheduled',
			component: FutureScheduled,
		    meta: {
		    	title: 'Future',
		    },
		},
		{
			path: 'karma',
			name: 'Karma',
			component: Karma,
		    meta: {
		    	title: 'Karma',
		    },
		},
		{
			path: 'search-result',
			name: 'SearchResult',
			component: SearchResult,
		}
	]
}

export default routes
