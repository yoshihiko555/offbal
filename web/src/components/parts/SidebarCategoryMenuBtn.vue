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

                <v-list-item
                    v-if='!category.favorite'
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
        <EditCategoryDialog
            ref='category'
        />
    </div>
</template>

<script>
	import EditCategoryDialog from '@/components/common/EditCategoryDialog'
	import { mapMutations, mapActions } from 'vuex'
	import _ from 'lodash'

    export default {
        name: 'SidebarCategoryMenuBtn',
        components: {
        	EditCategoryDialog,
        },
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
                        name: 'カテゴリーの編集',
                        icon: 'mdi-pencil-outline',
                        call: this.editCategory,
                    },
                    {
                        name: 'カテゴリーを削除',
                        icon: 'mdi-trash-can-outline',
                        call: this.deleteCategory,
                    },
                    {
                        name: 'カテゴリーをアーカイブ',
                        icon: 'mdi-package',
                        call: this.archive,
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
        methods: {
            ...mapMutations([
                'addArchivedCategorys',
            ]),
            ...mapActions([
                'deleteCategoryAction',
                'updateCategoryAction',
                'addFavoriteCategorysAction',
                'deleteFavoriteCategorysAction',
            ]),
        	editCategory () {
        		this.$refs.category.open(this.category)
        	},
        	deleteCategory () {
        		this.deleteCategoryAction(this.category)
        	},
        	togleFavorite () {
        		// propsで来たデータの直更新はNGのため一度deepcopy
        		this.cloneCategory = _.cloneDeep(this.category)
        		this.cloneCategory.is_favorite = !this.cloneCategory.favorite
        		this.$axios({
        			url: `/api/category/${this.cloneCategory.id}/`,
        			method: 'PUT',
        			data: this.cloneCategory,
        		})
        		.then(res => {
        			console.log(res)
                    this.updateCategoryAction(res.data)
                    if (res.data.favorite) this.addFavoriteCategorysAction(res.data)
                    else this.deleteFavoriteCategorysAction(res.data)
        		})
        		.catch(e => {
        			console.log(e)
        		})
            },
            archive () {
                this.cloneCategory = _.cloneDeep(this.category)
        		this.cloneCategory.is_favorite = false
        		this.cloneCategory.is_archived = true
        		this.$axios({
        			url: `/api/category/${this.cloneCategory.id}/`,
        			method: 'PUT',
        			data: this.cloneCategory,
        		})
        		.then(res => {
                    console.log(res)
                    this.updateCategoryAction(res.data)
                    this.deleteFavoriteCategorysAction(res.data)
                    this.addArchivedCategorys(res.data)
        		})
        		.catch(e => {
        			console.log(e.response)
        		})
            },
        },
    }
</script>

<style lang="scss" scoped>
</style>