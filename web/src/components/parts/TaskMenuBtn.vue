<template>
    <v-menu
        offset-x
        left
        transition="slide-x-transition"
        rounded="lg"
    >
        <template #activator="{ attrs, on }">
            <v-btn
                icon
                v-bind="attrs"
                v-on="on"
            >
                <v-icon color="grey">mdi-dots-horizontal</v-icon>
            </v-btn>
        </template>
        <v-list>
            <v-list-item
                v-for="(menu, i) in menus"
                :key="i"
                @click="menu.call"
            >
                <v-list-item-icon class="mr-0">
                    <v-icon small v-text="menu.icon"/>
                </v-list-item-icon>
                <v-list-item-title>{{ menu.name }}</v-list-item-title>
            </v-list-item>
        </v-list>
    </v-menu>
</template>
<script>
    import { mapActions, mapMutations } from 'vuex'

    export default {
        name: 'TaskMenuBtn',
        components: {
        },
        props: {
            task: {
                type: Object,
                requied: true,
            },
        },
        data () {
            return {
                cloneTask: {},
                menus: [
                    {
                        name: 'タスクを編集',
                        icon: 'mdi-pencil-outline',
                        call: '',
                    },
                    {
                        name: 'プロジェクトへ移動',
                        icon: 'mdi-arrow-right-circle-outline',
                        call: ''
                    },
                    {
                        name: 'タスクの複製',
                        icon: 'mdi-content-copy',
                        call: '',
                    },
                    {
                        name: 'タスクの削除',
                        icon: 'mdi-package',
                        call: this.deleteLocalTask,
                    }
                ]
            }
        },
        methods: {
            ...mapMutations([
                'addTask',
                'deleteTask',
            ]),
            ...mapActions([
                'deleteTaskAction',
            ]),
            deleteLocalTask () {
                this.deleteTaskAction(this.task.id)
            },
        }
    }
</script>
<style lang="scss" scoped>
</style>
