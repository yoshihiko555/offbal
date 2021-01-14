<template>
    <div>
        <v-list>
            <v-list-item
                v-for="task in tasks"
                :key="task.id"
                class="task_content"
            >
                <v-list-item-action
                    class="mr-3 ml-1"
                >
                    <vs-checkbox
                        color="primary"
                        v-model="complete_task_list"
                        :val="task"
                        @change="checkTask(task)"
                    >
                    </vs-checkbox>
                </v-list-item-action>
                <v-list-item-content
                    @click="showTaskDetail(task)"
                >
                    <v-list-item-title
                        v-text="task.content"
                    ></v-list-item-title>
                    <v-list-item-subtitle
                        v-if="task.sub_tasks.length > 0"
                    >
                        {{ restOfSubTasks(task) }}
                    </v-list-item-subtitle>
                    <v-list-item-subtitle
                        v-else
                    >no subtasks</v-list-item-subtitle>
                </v-list-item-content>
                <TaskMenuBtn
                    :task=task
                />
            </v-list-item>
        </v-list>
        <!-- タスク詳細画面読み込み -->
        <TaskDetail/>
    </div>
</template>

<script>
    import { mapGetters, mapMutations, mapActions } from 'vuex'
    import TaskMenuBtn from '@/components/parts/TaskMenuBtn'
    import TaskDetail from '@/components/common/TaskDetail'
    import _ from 'lodash'

    export default {
        name: 'TaskList',
        components: {
            TaskMenuBtn,
            TaskDetail,
        },
        props: {
            tasks: {
                type: Array,
                required: true,
                default: () => ([])
            },
        },
        data: () => ({
            complete_task_list: [],
        }),
        created () {
        },
        mounted () {
            this.$eventHub.$off('updateTaskListCompleteTasks', this.updateCompleteTasks)
            this.$eventHub.$on('updateTaskListCompleteTasks', this.updateCompleteTasks)
            this.$eventHub.$off('filterTaskList')
            this.$eventHub.$on('filterTaskList', this.filterTaskList)
            window.removeEventListener('click', this.onClickTaskDetailOuter)
            window.addEventListener('click', this.onClickTaskDetailOuter)
        },
    	computed: {
    		...mapGetters([
                'detailCategory',
    		]),
    	},
        methods: {
            ...mapMutations([
                'updateTasks',
            ]),
            ...mapActions([
                'updateCompleteTasksAction',
                'updateCompleteTaskAction',
            ]),
            checkTask: _.debounce(function checkTask (task) {
                this.updateCompleteTaskAction({
                    complete_task: task,
                    route: this.$route.name
                })
                .then(res => {
                })
                .catch(e => {
                    console.log(e)
                })
                // this.updateCompleteTasksAction({
                //     complete_task_list: this.complete_task_list,
                //     completed: 1,
                //     route: this.$route.name
                // })
                // .then(res => {
                //     this.$eventHub.$emit('addCloneCompleteTasks', res.data)
                // })
                // .catch(e => {
                //     console.log(e)
                // })
                for (const i in this.complete_task_list) {
                    const completeTask = JSON.stringify(this.complete_task_list[i])
                    const targetTask = JSON.stringify(task)
                    if (completeTask === targetTask) this.closeSameTaskDetail(task)
                }
                if (this.isDetailCategory()) {
                    if (!this.detailCategory.is_completed_task) {
                        this.complete_task_list = []
                    }
                }
            }, 400),
            showTaskDetail (task) {
                this.$eventHub.$emit('showTaskDetail', task)
            },
            closeSameTaskDetail (task) {
                this.$eventHub.$emit('closeSameTaskDetail', task)
            },
            restOfSubTasks (task) {
                const subTasks = task.sub_tasks.length
                const completeSubTasks = task.complete_sub_tasks.length
                return completeSubTasks + ' of ' + subTasks + ' subtask completed.'
            },
            taskDeadline (task) {
                if (task.deadline === '') return '----'
                return task.deadline
            },
            filterTaskList (val) {
                // FilterBtnから渡ってきた値で検索結果を絞る
                console.log('filterTaskList', val)
                this.$eventHub.$emit('changeIsCompletedTask', val.isCompletedTask)
                const queryParams = {
                    categoryId: this.detailCategory.id
                }
                const filterValueList = [
                    'selectedPriority',
                    'selectedDeadline',
                    'selectedLabelList',
                    'isCompletedTask',
                ]
                for (const i in val) {
                    if (filterValueList.includes(i)) {
                        if (val[i] instanceof Array) {
                            if (val[i].length) {
                                queryParams[i] = val[i].join()
                            }
                        } else {
                            queryParams[i] = val[i]
                        }
                    }
                }
                this.$axios({
                    url: '/api/task/get_filter_task_list/',
                    method: 'GET',
                    params: {
                        ...queryParams
                    }
                })
                .then(res => {
                    console.log(res)
                    this.updateTasks(res.data)
                    this.updateCompleteTasks(res.data)
                })
                .catch(e => {
                    console.log(e)
                })
            },
            onClickTaskDetailOuter (e) {
                // タスク詳細の外側をクリックしたときに、タスク詳細を閉じる
                if (!e.target.parentNode.contains(e.target)) {
                    console.log('タスク詳細の外側クリック', e.target)
                    console.log(this.$el)
                    console.log(e.target.parentNode.contains(e.target))
                    this.$eventHub.$emit('closeTaskDetail')
                }
            },
            updateCompleteTasks (tasks) {
                this.complete_task_list = []
                for (const i in tasks) {
                    if (tasks[i].completed) {
                        this.complete_task_list.push(tasks[i])
                    }
                }
            },
            isDetailCategory () {
                return this.$route.name === 'DetailCategory'
            },
        },
    }
</script>

<style lang="scss" scoped>
    .task_content {
        cursor: pointer;
    }
    // .task_list_wrap {
    //     .task_list_descripion_header {
    //         height: 42px;
    //     }
    //     .task_list_row {
    //         cursor: pointer;
    //     }
    //     .task_content {
    //         cursor: pointer;
    //         display: flex;
    //     }
    // }
</style>
