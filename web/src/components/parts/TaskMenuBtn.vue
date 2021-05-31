<template>
    <div>
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

        <SelectCategoryBtn
            @move-category-section='moveCategorySection'
            ref='selectCategorySection'
        />

        <EditTaskDialog
            ref='taskEdit'
        />

    </div>
</template>
<script>
    import { mapActions, mapMutations } from 'vuex'
    import EditTaskDialog from '@/components/common/EditTaskDialog'
    import SelectCategoryBtn from '@/components/parts/SelectCategoryBtn'

    export default {
        name: 'TaskMenuBtn',
        components: {
            EditTaskDialog,
            SelectCategoryBtn,
        },
        props: {
            task: {
                type: Object,
                requied: true,
            },
        },
        data () {
            return {
                menus: [
                    {
                        name: 'タスクを編集',
                        icon: 'mdi-pencil-outline',
                        call: this.showEditTaskDialog,
                    },
                    {
                        name: 'カテゴリーの移動',
                        icon: 'mdi-arrow-right-circle-outline',
                        call: this.showMoveCategoryDialog,
                    },
                    {
                        name: 'タスクの複製',
                        icon: 'mdi-content-copy',
                        call: this.copyTask,
                    },
                    {
                        name: 'タスクの削除',
                        icon: 'mdi-package',
                        call: this.deleteLocalTask,
                    }
                ],
                cloneTask: {},
            }
        },
        created () {
            this.init()
        },
        methods: {
            ...mapMutations([
                'addTask',
                'deleteTask',
                'updateTaskEachRoute',
                'addTaskEachRoute',
            ]),
            ...mapActions([
                'deleteTaskAction',
            ]),
            showEditTaskDialog () {
                this.$refs.taskEdit.open(this.task)
            },
            showMoveCategoryDialog () {
                this.$refs.selectCategorySection.open()
            },
            cloneTaskData () {
                const task = this.task
                this.cloneTask = {
                    category_id: task.target_category,
                    content: task.content,
                    comment: task.comment,
                    priority: task.priority,
                    label_list: [],
                    start_time_str: task.start_time,
                    deadline_str: task.deadline,
                    remind_str: task.remind,
                }
                for (const i in task.label) {
                    this.cloneTask.label_list.push(task.label[i].id)
                }
            },
            copyTask () {
                this.cloneTaskData()
                this.$axios({
                    url: '/api/task/',
                    method: 'POST',
                    data: this.cloneTask
                })
                .then(res => {
                    console.log(res)
                    this.addTask(res.data)
                    if (!this.isDetailCategory()) {
                        this.addTaskEachRoute({
                            task: res.data,
                            route: this.$route.name
                        })
                    }
                })
                .catch(e => {
                    console.log(e)
                })
                this.init()
            },
            isDetailCategory () {
                return this.$route.name === 'DetailCategory'
            },
            deleteLocalTask () {
                this.deleteTaskAction({
                    id: this.task.id,
                    route: this.$route.name
                })
            },
            init () {
                this.cloneTask = {
                    category_id: 0,
                    content: '',
                    comment: '',
                    start_time_str: '',
                    deadline_str: '',
                    remind_str: '',
                    priority: '1',
                    label_list: [],
                }
            },
            createMoveCategorySectionTaskData (categoryId) {
                this.cloneTask = {
                    category_id: categoryId,
                    content: this.task.content,
                    comment: this.task.comment,
                    priority: this.task.priority,
                    label_list: [],
                    start_time_str: this.task.start_time,
                    deadline_str: this.task.deadline,
                    remind_str: this.task.remind,
                }
                for (const i in this.task.label) {
                    this.cloneTask.label_list.push(this.task.label[i].id)
                }
            },
            moveCategorySection (value) {
                const { target_category: targetCategory } = this.task
                const { category_id: categoryId } = value
                if (targetCategory === categoryId) return
                this.createMoveCategorySectionTaskData(categoryId)
                this.$axios({
                    url: `/api/task/${this.task.id}/`,
                    method: 'PUT',
                    data: this.cloneTask
                })
                .then(res => {
                    console.log(res)
                    console.log(this.$route)
                    console.log(this.$router)
                    const route = this.$route.name
                    this.addTask(res.data)
                    if (this.isDetailCategory()) {
                        this.deleteTask({
                            task: this.task,
                            route: route
                        })
                    } else {
                        this.updateTaskEachRoute({
                            task: res.data,
                            route: route
                        })
                    }
                })
                .catch(e => {
                    console.log(e)
                })
                this.init()
            },
        }
    }
</script>
<style lang="scss" scoped>
</style>
