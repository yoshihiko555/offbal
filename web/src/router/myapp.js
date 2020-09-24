import MyApp from '@/views/app/MyApp'
import StartApp from '@/views/app/StartApp'
import Activitys from '@/views/app/Activitys'
import DetailCategory from '@/views/app/DetailCategory'
import TodayScheduled from '@/views/app/TodayScheduled'
import FutureScheduled from '@/views/app/FutureScheduled'
import Karma from '@/views/app/Karma'

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
			path: 'category/:id',
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
	]
}

export default routes