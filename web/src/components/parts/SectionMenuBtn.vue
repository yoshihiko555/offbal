<template>
    <div>
        <v-menu
            offset-x
            left
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

                <!-- アーカイブ登録 -->
                <v-list-item
                    v-if='!section.archived'
                    @click='togleArchived'
                >
                    <v-list-item-icon class='mr-0'>
                        <v-icon small v-text='archivedMenu[0].icon'/>
                    </v-list-item-icon>
                    <v-list-item-title>{{ archivedMenu[0].name }}</v-list-item-title>
                </v-list-item>

                <!-- アーカイブ削除 -->
                <v-list-item
                    v-else
                    @click='togleArchived'
                >
                    <v-list-item-icon class='mr-0'>
                        <v-icon small v-text='archivedMenu[1].icon'/>
                    </v-list-item-icon>
                    <v-list-item-title>{{ archivedMenu[1].name }}</v-list-item-title>
                </v-list-item>
            </v-list>
        </v-menu>
        <SelectCategoryBtn
            @move-section='moveSection'
            ref='categoryBtn'
        />
    </div>
</template>

<script>
    import SelectCategoryBtn from '@/components/parts/SelectCategoryBtn'
	import { mapActions, mapMutations } from 'vuex'
	import _ from 'lodash'

    export default {
        name: 'SectionMenuBtn',
        components: {
            SelectCategoryBtn,
        },
        props: {
        	section: {
        		type: Object,
        		requied: true,
        	},
        },
        data () {
        	return {
                cloneSection: {},
                menus: [
                    {
                        name: 'セクションの編集',
                        icon: 'mdi-pencil-outline',
                        call: this.open,
                    },
                    {
                        name: 'セクションを削除',
                        icon: 'mdi-trash-can-outline',
                        call: this.deleteLocalSection,
                    },
                    {
                        name: 'セクションの移動',
                        icon: 'mdi-arrow-right-circle-outline',
                        call: this.openSelectCategory,
                    },
                    {
                        name: 'セクションの複製',
                        icon: 'mdi-content-copy',
                        call: this.copySection,
                    },
                ],
                archivedMenu: [
                    {
                        name: 'セクションのアーカイブ',
                        icon: 'mdi-package',
                    },
                    {
                        name: 'セクションのアーカイブ削除',
                        icon: 'mdi-package',
                    },
                ]
        	}
        },
        methods: {
            ...mapMutations([
                'addSection',
                'updateSection',
                'deleteSection',
            ]),
            ...mapActions([
                'deleteSectionAction',
            ]),
            open () {
                this.$eventHub.$emit('open-edit', this.section)
            },
            deleteLocalSection () {
                this.deleteSectionAction(this.section.id)
            },
            openSelectCategory () {
                this.$refs.categoryBtn.open()
            },
            moveSection (category) {
                this.cloneSection = _.cloneDeep(this.section)
                this.cloneSection.target_category = category.id
                this.$axios({
                    url: `/api/section/${this.section.id}/`,
                    method: 'PUT',
                    data: this.cloneSection,
                })
                .then(res => {
                    console.log(res)
                    this.deleteSection(this.section.id)
                })
                .catch(e => {
                    console.log(e)
                })
            },
            copySection () {
                this.$axios({
                    url: '/api/section/',
                    method: 'POST',
                    data: {
                        target_category: this.$route.params.id,
                        name: this.section.name,
                    }
                })
                .then(res => {
                    console.log(res)
                    this.addSection(res.data)
                })
                .catch(e => {
                    console.log(e)
                })
            },
            togleArchived () {
                this.cloneSection = _.cloneDeep(this.section)
                this.cloneSection.archived = !this.cloneSection.archived
                this.$axios({
                    url: `/api/section/${this.section.id}/`,
                    method: 'PUT',
                    data: this.cloneSection
                })
                .then(res => {
                    console.log(res)
                    this.updateSection(res.data)
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
