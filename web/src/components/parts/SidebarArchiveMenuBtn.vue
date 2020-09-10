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
        	category: {
        		type: Object,
        		requied: true,
        	},
        },
        data () {
        	return {
        		cloneCategory: {},
                menus: [
                    {
                        name: 'アンアーカイブ',
                        icon: 'mdi-package',
                        call: this.unarchive,
                    },
                    {
                        name: 'カテゴリーを削除',
                        icon: 'mdi-trash-can-outline',
                        call: this.deleteCategory,
                    },
                ],
        	}
        },
        methods: {
            ...mapMutations([
                'deleteArchivedCategorys',
            ]),
            ...mapActions([
                'deleteCategoryAction',
                'updateCategoryAction',
            ]),
        	deleteCategory () {
        		this.deleteCategoryAction(this.category)
        	},
            unarchive () {
                this.cloneCategory = _.cloneDeep(this.category)
        		this.cloneCategory.is_archived = false
        		this.$axios({
        			url: `/api/category/${this.cloneCategory.id}/`,
        			method: 'PUT',
        			data: this.cloneCategory,
        		})
        		.then(res => {
                    console.log(res)
                    this.updateCategoryAction(res.data)
                    this.deleteArchivedCategorys(res.data)
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