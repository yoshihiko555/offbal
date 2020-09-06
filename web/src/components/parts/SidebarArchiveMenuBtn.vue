<template>
    <div>
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
            </v-list>
        </v-menu>
    </div>
</template>

<script>
	import { mapMutations, mapActions } from 'vuex'
	import _ from 'lodash'

    export default {
        name: 'SidebarArchiveMenuBtn',
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
                        name: 'アンアーカイブ',
                        icon: 'mdi-package',
                        call: this.unarchive,
                    },
                    {
                        name: 'プロジェクトを削除',
                        icon: 'mdi-trash-can-outline',
                        call: this.deleteProject,
                    },
                ],
        	}
        },
        methods: {
            ...mapMutations([
                'deleteArchivedProjects',
            ]),
            ...mapActions([
                'deleteProjectAction',
                'updateProjectAction',
            ]),
        	deleteProject () {
        		this.deleteProjectAction(this.project)
        	},
            unarchive () {
                this.cloneProject = _.cloneDeep(this.project)
        		this.cloneProject.is_archived = false
        		this.$axios({
        			url: `/api/project/${this.cloneProject.id}/`,
        			method: 'PUT',
        			data: this.cloneProject,
        		})
        		.then(res => {
                    console.log(res)
                    this.updateProjectAction(res.data)
                    this.deleteArchivedProjects(res.data)
        		})
        		.catch(e => {
        			console.log(e)
        		})
            },
        },
    }
</script>

<style lang="scss" scoped>
</style>