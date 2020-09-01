<template>
    <div id="detail-project-menu-wrap">
        <v-menu
            offset-x
            transition="slide-x-transition"
            rounded='lg'
        >
            <template #activator='{ attrs, on }'>
                <v-btn
                    icon
                    v-bind="attrs"
                    v-on.stop='on'
                >
                    <v-icon color="grey">mdi-dots-horizontal</v-icon>
                </v-btn>
            </template>
            <v-list>
                <v-list-item
                    v-for='(menu, i) in menus'
                    :key='i'
                    @click="menu.call"
                >
                    <v-list-item-icon class="mr-0">
                        <v-icon small v-text='menu.icon'/>
                    </v-list-item-icon>
                    <v-list-item-title>{{ menu.name }}</v-list-item-title>
                </v-list-item>

                <v-list-item
                    v-if='!detailProject.favorite'
                    @click='togleFavorite'
                >
                    <v-list-item-icon class='mr-0'>
                        <v-icon small v-text='favoMenu[0].icon'/>
                    </v-list-item-icon>
                    <v-list-item-title>{{ favoMenu[0].name }}</v-list-item-title>
                </v-list-item>
                <v-list-item
                    v-else
                    @click='togleFavorite'
                >
                    <v-list-item-icon class='mr-0'>
                        <v-icon small v-text='favoMenu[1].icon'/>
                    </v-list-item-icon>
                    <v-list-item-title>{{ favoMenu[1].name }}</v-list-item-title>
                </v-list-item>
            </v-list>
        </v-menu>

        <!-- モーダル読み込み -->
        <EditProjectDialog
            ref='project'
        />
    </div>
</template>

<script>
	import EditProjectDialog from '@/components/common/EditProjectDialog'
	import { mapGetters, mapActions } from 'vuex'
	import _ from 'lodash'

    export default {
        name: 'DetailProjectMenuBtn',
        components: {
        	EditProjectDialog,
        },
        props: {
        	project: {
        		type: Object,
        		requied: true,
        	},
        },
        data () {
        	return {
        		cloneProject: {},
                menus: [
                    {
                        name: 'セクションの追加',
                        icon: 'mdi-plus-circle-outline',
                        call: this.open,
                    },
                    {
                        name: 'プロジェクトの編集',
                        icon: 'mdi-pencil-outline',
                        call: this.editProject,
                    },
                    {
                        name: 'プロジェクトを削除',
                        icon: 'mdi-trash-can-outline',
                        call: this.deleteProject,
                    },
                    {
                        name: 'プロジェクトをアーカイブ',
                        icon: 'mdi-package',
                        call: this.test,
                    },
                    {
                        name: '完了したタスクを表示',
                        icon: 'mdi-check-circle-outline',
                        call: this.test,
                    },
                ],
                favoMenu: [
                    {
                        name: 'お気に入りに登録',
                        icon: 'mdi-heart-outline',
                    },
                    {
                        name: 'お気に入りから削除',
                        icon: 'mdi-heart-off-outline',
                    },
                ],
        	}
        },
        computed: {
    		...mapGetters([
                'detailProject',
    		])
    	},
        methods: {
            ...mapActions([
                'deleteProjectAction',
                'updateProjectAction',
                'addFavoriteProjectsAction',
                'deleteFavoriteProjectsAction',
            ]),
            open () {
                this.$emit('open-create')
            },
        	editProject () {
        		this.$refs.project.open(this.detailProject)
        	},
        	deleteProject () {
        		this.deleteProjectAction(this.detailProject)
            },
            togleFavorite () {
        		// propsで来たデータの直更新はNGのため一度deepcopy
        		this.cloneProject = _.cloneDeep(this.detailProject)
        		this.cloneProject.favorite = !this.cloneProject.favorite
        		this.$axios({
        			url: `/api/project/${this.cloneProject.id}/`,
        			method: 'PUT',
        			data: this.cloneProject,
        		})
        		.then(res => {
        			console.log(res)
                    this.updateProjectAction(res.data)
                    if (res.data.favorite) this.addFavoriteProjectsAction(res.data)
                    else this.deleteFavoriteProjectsAction(res.data)
        		})
        		.catch(e => {
        			console.log(e)
        		})
        	},
        	test () {
        		console.log('test')
        	}
        },
    }
</script>

<style lang="scss" scoped>
    #detail-project-menu-wrap {
        display: inline-block;
    }
</style>