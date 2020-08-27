<template>
    <div id="sidebar">
		<v-navigation-drawer
			v-model="drawer"
			:mini-variant="!drawer"
			permanent
			fixed
			hide-overlay
			class='main'
		>
            <!-- ハンバーガーメニュ -->
	    	<div class='pa-2 menu_open_btn_wrap'>
				<v-btn icon @click='togleDrawer'>
					<v-icon>mdi-menu</v-icon>
				</v-btn>
			</div>

            <!-- メニュー一覧 -->
			<v-list nav dense>
                <template v-for='(menu, i) in menus'>

                    <!-- ネスト有 -->
                    <v-list-group
                        v-if='menu.isNest'
                        :key='i'
                        :prepend-icon="menu.icon"
                    >
                        <template #activator>
                            <v-list-item-title>
                                {{ menu.title }}
                            </v-list-item-title>
                        </template>

                        <!-- プロジェクト -->
                        <div v-if="menu.title === 'Project'">
                            <v-list-item
                                v-for='project in projects'
                                :key='project.id'
                                @click='menu.call(menu.url)'
                            >
                                <v-icon x-small :color="project.color">mdi-circle</v-icon>
                                <v-list-item-title class="ml-2">{{ project.name }}</v-list-item-title>
                                <v-list-item-action class="ml-0">
                                    <v-menu
                                        offset-x
                                        transition="slide-x-transition"
                                        rounded='lg'
                                    >
                                        <template #activator='{ attrs, on }'>
                                            <v-btn
                                                icon
                                                v-bind="attrs"
                                                v-on='on'
                                                @click.stop="test"
                                            >
                                                <v-icon color="grey">mdi-dots-horizontal</v-icon>
                                            </v-btn>
                                        </template>
                                        <v-list>
                                            <v-list-item
                                                v-for='(proMenu, i) in projectMenus'
                                                :key='i'
                                                @click="proMenu.call(project)"
                                            >
                                                <v-list-item-icon class="mr-0">
                                                    <v-icon small v-text='proMenu.icon'/>
                                                </v-list-item-icon>
                                                <v-list-item-title>{{ proMenu.name }}</v-list-item-title>
                                            </v-list-item>
                                        </v-list>
                                    </v-menu>
                                </v-list-item-action>
                            </v-list-item>
                        </div>

                        <!-- ラベル -->
                        <div v-else>
                            <v-list-item
                                v-for='(label, i) in labels'
                                :key='i'
                                @click='menu.call(menu.url)'
                            >
                                <v-list-item-title>{{ label.name }}</v-list-item-title>
                            </v-list-item>
                        </div>

                    </v-list-group>

                    <!-- ネスト無 -->
                    <v-list-item
                        v-else
                        :key='i'
                        @click='menu.call(menu.url)'
                    >
                        <v-list-item-icon>
                            <v-icon v-text='menu.icon'/>
                        </v-list-item-icon>

                        <v-list-item-title>
                            {{ menu.title }}
                        </v-list-item-title>
                    </v-list-item>

                </template>
	 		</v-list>
		</v-navigation-drawer>

        <!-- モーダル読み込み -->
        <EditProjectDialog
            ref='project'
        />
    </div>
</template>

<script>
import EditProjectDialog from '@/components/common/EditProjectDialog'

import { mapGetters, mapActions } from 'vuex'
import AuthService from '@/auth/AuthService'
const auth = new AuthService()

export default {
    name: 'Sidebar',
    components: {
        EditProjectDialog,
    },
    data () {
        return {
            drawer: true,
            menus: [
                {
                    title: 'Inbox',
                    call: this.toPage,
                    icon: 'mdi-inbox',
                    isNest: false,
                    url: '/myapp/inbox'
                },
                {
                    title: 'Today',
                    call: this.toPage,
                    icon: 'mdi-calendar-today',
                    isNest: false,
                    url: '/myapp/today'
                },
                {
                    title: 'Coming soon',
                    call: this.toPage,
                    icon: 'mdi-calendar-month-outline',
                    isNest: false,
                    url: '/myapp/future-scheduled'
                },
                {
                    title: 'Favorite',
                    call: this.toPage,
                    icon: 'mdi-star',
                    isNest: false,
                    url: '/myapp'
                },
                {
                    title: 'Project',
                    call: this.toPage,
                    icon: 'mdi-format-list-checkbox',
                    isNest: true,
                    url: '/myapp/project'
                },
                {
                    title: 'Label',
                    call: this.toPage,
                    icon: 'mdi-label-multiple-outline',
                    isNest: true,
                    url: '/myapp/label'
                },
                {
                    title: 'Activity',
                    call: this.toPage,
                    icon: 'mdi-bell-ring',
                    isNest: false,
                    url: '/myapp/activity'
                },
                {
                    title: 'Signout',
                    call: this.signout,
                    icon: 'mdi-account-arrow-right-outline',
                    isNest: false,
                    url: '/myapp'
                },
            ],
            // テスト用
            labels: [
            	{
            		name: 'Label1',
            	},
            	{
            		name: 'Label2',
            	},
            	{
            		name: 'Label3',
            	},
            ],
            projectMenus: [
                {
                    name: 'プロジェクトの編集',
                    icon: 'mdi-pencil-outline',
                    call: this.projectOpen,
                },
                {
                    name: 'プロジェクトを削除',
                    icon: 'mdi-trash-can-outline',
                    call: this.projectDelete,
                },
                {
                    name: 'プロジェクトをアーカイブ',
                    icon: 'mdi-package',
                    call: this.test,
                },
            ]
        }
    },
	created () {
	},
	computed: {
		...mapGetters([
			'projects',
		])
	},
    methods: {
        ...mapActions([
            'deleteProjectAction',
        ]),
        togleDrawer () {
            this.drawer = !this.drawer
            this.$emit('togleDrawer')
        },
    	signout () {
            auth.logout()
        },
        toPage (url) {
        	this.$router.push(url)
        },
        test () {
            console.log('test')
        },
        projectOpen (project) {
            this.$refs.project.open(project)
        },
        projectDelete (project) {
            this.deleteProjectAction(project)
        },
    }
}
</script>

<style lang="scss" scoped>
	.menu_open_btn_wrap > button {
		margin-left: 1px;
	}
    .v-list-group__items {
        .v-list-item {
            height: 40px;
        }
    }
</style>