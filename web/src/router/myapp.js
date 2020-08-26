import MyApp from '@/views/app/MyApp'
import StartApp from '@/views/app/StartApp'
import ToDoList from '@/views/app/ToDoList'
import Activitys from '@/views/app/Activitys'
import Projects from '@/views/app/Projects'

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
		}
	]
}

export default routes