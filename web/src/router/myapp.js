import MyApp from '@/views/app/MyApp'
import StartApp from '@/views/app/StartApp'
import ToDoList from '@/views/app/ToDoList'
import Activitys from '@/views/app/Activitys'
import Projects from '@/views/app/Projects'
import Labels from '@/views/app/Labels'
import TodayScheduled from '@/views/app/TodayScheduled'
import FutureScheduled from '@/views/app/FutureScheduled'

const routes = {
	path: '/myapp',
	component: MyApp,
	children: [
		{
			path: '',
			name: 'StartApp',
			component: StartApp,
		},
		{
			path: 'inbox',
			name: 'Inbox',
			component: ToDoList,
		},
		{
			path: 'activity',
			name: 'Activitys',
			component: Activitys,
		},
		{
			path: 'project',
			name: 'Projects',
			component: Projects,
		},
		{
			path: 'label',
			name: 'Labels',
			component: Labels,
		},
		{
			path: 'today',
			name: 'TodayScheduled',
			component: TodayScheduled,
		},
		{
			path: 'future-scheduled',
			name: 'FutureScheduled',
			component: FutureScheduled,
		},
	]
}

export default routes