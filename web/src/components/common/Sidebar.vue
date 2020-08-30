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
                            <v-list-item>
                                <v-list-item-title>新規プロジェクト追加</v-list-item-title>
                                <v-list-item-action>
                                    <v-btn icon @click='createProject'><v-icon>mdi-plus</v-icon></v-btn>
                                </v-list-item-action>
                            </v-list-item>

                            <v-list-item
                                v-for='project in projects'
                                :key='project.id'
                                @click='toPage(menu.route, project)'
                            >
                                <v-icon x-small :color="project.color">mdi-circle</v-icon>
                                <v-list-item-title class="ml-2">{{ project.name }}</v-list-item-title>
                                <v-list-item-action class="ml-0">
                                    <SidebarProjectMenuBtn :project='project'/>
                                </v-list-item-action>
                            </v-list-item>
                        </div>

                        <!-- ラベル -->
                        <div v-else>
                            <v-list-item
                                v-for='(label, i) in labels'
                                :key='i'
                                @click='toPage(menu.route, label)'
                            >
                                <v-list-item-title>{{ label.name }}</v-list-item-title>
                            </v-list-item>
                        </div>

                    </v-list-group>

                    <!-- ネスト無 -->
                    <div v-else :key='i'>
                        <!-- お気に入り以外 -->
                        <v-list-item
                            v-if='menu.title !== "Favorite"'
                            @click='toPage(menu.route)'
                        >
                            <v-list-item-icon>
                                <v-icon v-text='menu.icon'/>
                            </v-list-item-icon>
                            <v-list-item-title>{{ menu.title }}</v-list-item-title>
                        </v-list-item>

                        <!-- お気に入りプロジェクト -->
                        <v-list-item
                            v-else
                            v-for="favo in favoriteProjects"
                            :key='favo.id'
                            @click="toPage(menu.route, favo)"
                        >
                            <v-list-item-icon>
                                <v-icon :color="favo.color" small class="mx-auto">mdi-circle</v-icon>
                            </v-list-item-icon>
                            <v-list-item-title>{{ favo.name }}</v-list-item-title>
                        </v-list-item>
                    </div>

                </template>
	 		</v-list>
		</v-navigation-drawer>

        <!-- モーダル読み込み -->
        <CreateProjectDialog
            ref='project'
        />
    </div>
</template>

<script>
	import CreateProjectDialog from '@/components/common/CreateProjectDialog'
    import SidebarProjectMenuBtn from '@/components/parts/SidebarProjectMenuBtn'

    import { mapGetters } from 'vuex'
    import { Const } from '@/assets/js/const'
    const Con = new Const()

    export default {
        name: 'Sidebar',
        components: {
        	CreateProjectDialog,
            SidebarProjectMenuBtn,
        },
        data () {
            return {
                drawer: true,
                menus: Con.SIDEBAR_MENU,
                // テスト用
                labels: [
                	{
                		id: 1,
                		name: 'Label1',
                	},
                	{
                		id: 2,
                		name: 'Label2',
                	},
                	{
                		id: 3,
                		name: 'Label3',
                	},
                ],
            }
        },
    	computed: {
    		...mapGetters([
                'projects',
                'favoriteProjects',
    		])
    	},
        methods: {
            togleDrawer () {
                this.drawer = !this.drawer
                this.$emit('togleDrawer')
            },
            toPage (route, param) {
            	// プロジェクト or ラベルならparamを格納する
            	const params = param || ''
            	this.$router.push({
            		name: route,
            		params: {
            			id: params.id,
            		}
            	})
            },
            createProject () {
            	this.$refs.project.open()
            }
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