import MyApp from '@/views/app/MyApp'
import StartApp from '@/views/app/StartApp'
import ToDoList from '@/views/app/ToDoList'
import Activitys from '@/views/app/Activitys'
import DetailProject from '@/views/app/DetailProject'
import Labels from '@/views/app/Labels'
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
			path: 'inbox',
			name: 'Inbox',
			component: ToDoList,
		    meta: {
		    	title: 'Inbox',
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
			path: 'project/:id',
			name: 'DetailProject',
			component: DetailProject,
		},
		{
			path: 'label/:id',
			name: 'Labels',
			component: Labels,
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