import Setting from '@/views/setting/Setting'
import GeneralSetting from '@/views/setting/GeneralSetting'
import ThemeSetting from '@/views/setting/ThemeSetting'
import AcountSetting from '@/views/setting/AcountSetting'
import KarmaSetting from '@/views/setting/KarmaSetting'

const routes = {
	path: '/setting',
	component: Setting,
	children: [
		{
			path: '',
			name: 'General',
			component: GeneralSetting,
		    meta: {
		    	title: '一般設定',
		    },
		},
		{
			path: 'theme',
			name: 'Theme',
			component: ThemeSetting,
		    meta: {
		    	title: 'テーマ設定',
		    },
		},
		{
			path: 'acount',
			name: 'Acount',
			component: AcountSetting,
		    meta: {
		    	title: 'アカウント設定',
		    },
		},
		{
			path: 'karma',
			name: 'Karma',
			component: KarmaSetting,
		    meta: {
		    	title: 'カルマ設定',
		    },
		},
	]
}

export default routes