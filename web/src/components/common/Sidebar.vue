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

                            <draggable
                                :list='localProjects'
                                animation='200'
                                chosen-class="chosen"
                                drag-class="drag"
                                @end='end'
                            >
                                <v-list-item
                                    v-for='project in localProjects'
                                    :key='project.id'
                                    v-show="!project.archived"
                                    @click='toPage(menu.route, project)'
                                >
                                    <v-icon x-small :color="project.color">mdi-circle</v-icon>
                                    <v-list-item-title class="ml-2">{{ project.name }}</v-list-item-title>
                                    <v-list-item-action class="ml-0">
                                        <SidebarProjectMenuBtn :project='project'/>
                                    </v-list-item-action>
                                </v-list-item>
                            </draggable>

                            <!-- アーカイブプロジェクト -->
                            <v-expansion-panels
                                flat
                                tile
                                hover
                                accordion
                                v-show='archivedProjects.length > 0'
                            >
                                <v-expansion-panel>
                                    <v-expansion-panel-header hide-actions>
                                        <span class='archived_title'>アーカイブ</span>
                                    </v-expansion-panel-header>
                                    <v-expansion-panel-content>
                                        <v-list-item
                                            v-for="archived in archivedProjects"
                                            :key='archived.name'
                                            @click='toPage(menu.route, archived)'
                                        >
                                            <v-list-item-title>{{ archived.name }}</v-list-item-title>
                                            <v-list-item-action class="ml-0">
                                                <SidebarArchiveMenuBtn :project='archived'/>
                                            </v-list-item-action>
                                        </v-list-item>
                                    </v-expansion-panel-content>
                                </v-expansion-panel>
                            </v-expansion-panels>
                        </div>

                        <!-- ラベル -->
                        <div v-else>
                            <v-list-item>
                                <v-list-item-title>新規ラベル追加</v-list-item-title>
                                <v-list-item-action>
                                    <v-btn icon @click='createLabel'><v-icon>mdi-plus</v-icon></v-btn>
                                </v-list-item-action>
                            </v-list-item>

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

        <CreateLabelDialog
            ref='label'
        />
    </div>
</template>

<script>
	import CreateProjectDialog from '@/components/common/CreateProjectDialog'
    import SidebarProjectMenuBtn from '@/components/parts/SidebarProjectMenuBtn'
    import CreateLabelDialog from '@/components/common/CreateLabelDialog'
    import SidebarArchiveMenuBtn from '@/components/parts/SidebarArchiveMenuBtn'
    import draggable from 'vuedraggable'

    import { mapGetters, mapMutations } from 'vuex'
    import _ from 'lodash'
    import { Const } from '@/assets/js/const'
    const Con = new Const()

    export default {
        name: 'Sidebar',
        components: {
        	CreateProjectDialog,
            SidebarProjectMenuBtn,
            CreateLabelDialog,
            SidebarArchiveMenuBtn,
            draggable,
        },
        data () {
            return {
                drawer: true,
                menus: Con.SIDEBAR_MENU,
                local: [],
            }
        },
        created () {
        	this.localProjects = _.cloneDeep(this.projects)
        },
        watch: {
        	projects: {
        	    deep: true,
        	    handler (val, old) {
        	    	this.localProjects = _.cloneDeep(val)
        	    },
        	},
        },
    	computed: {
    		...mapGetters([
                'projects',
                'favoriteProjects',
                'archivedProjects',
                'labels',
            ]),
            localProjects: {
                get () {
                    return this.local
                },
                set (val) {
                    this.local = val
                }
            },
    	},
        methods: {
            ...mapMutations([
               'updateProjectIndex',
            ]),
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
            },
            createLabel () {
                this.$refs.label.open()
            },
            end: _.debounce(function end (e) {
                this.$axios({
                    url: '/api/project/updateProjectIndex/',
                    method: 'PUT',
                    data: {
                        projects: this.localProjects,
                    }
                })
                .then(res => {
                    console.log(res)
                    this.updateProjectIndex(res.data)
                    this.$vs.notification({
                    	position: 'bottom-center',
                    	color: 'primary',
                    	buttonClose: false,
                    	classNotification: 'project_sort',
                    	text: 'プロジェクトの並び順を移動しました。'
                    })
                })
                .catch(e => {
                    console.log(e)
                })
            }, 1000),
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
    .chosen {
        opacity: 0.7;
        background: #03A9F4;
    }
    .drag {
        opacity: 0;
    }
    .v-expansion-panel--active > .v-expansion-panel-header {
        min-height: 40px;
    }

    .v-expansion-panel-header > *:not(.v-expansion-panel-header__icon) {
        flex: initial;
    }

    .v-expansion-panel-header::v-deep {
        min-height: 40px;
        justify-content: center;
        color: #777;
        transition: 0.3s all ease-in-out;

        &:hover {
            color: #333;

            &::before {
                opacity: 1 !important;
                background-color: #333;
            }
        }

        &::before {
            height: 1px;
            width: 100%;
            top: 50%;
            opacity: 1;
            background-color: #777;
        }

        .archived_title {
            position: relative;
            padding: 0 1em;
            display: inline-block;
            background-color: #fff;
            text-align: center;
            font-size: 14px;
        }
    }
</style>

<style lang='scss'>
    /* Vuesax通知パーツ用デザイン */
    .project_sort {
        .vs-notification__content__text p {
            color: #fff !important;
        }
    }
</style>
