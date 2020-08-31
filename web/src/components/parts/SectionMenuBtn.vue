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
	import { mapActions, mapMutations } from 'vuex'
	import _ from 'lodash'

    export default {
        name: 'SectionMenuBtn',
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
                        call: this.test,
                    },
                    {
                        name: 'セクションのを削除',
                        icon: 'mdi-trash-can-outline',
                        call: this.deleteSection,
                    },
                    {
                        name: 'セクションの移動',
                        icon: 'mdi-arrow-right-circle-outline',
                        call: this.test,
                    },
                    {
                        name: 'セクションの複製',
                        icon: 'mdi-content-copy',
                        call: this.test,
                    },
                    {
                        name: 'セクションのアーカイブ',
                        icon: 'mdi-package',
                        call: this.test,
                    },
                ],
        	}
        },
        methods: {
            ...mapMutations([
                'updateSection',
            ]),
            ...mapActions([
                'deleteSectionAction',
            ]),
            deleteSection () {
                this.deleteSectionAction(this.section.id)
            },
        	test () {
        		console.log('test')
        	}
        },
    }
</script>

<style lang="scss" scoped>
</style>