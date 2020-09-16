<template>
    <v-navigation-drawer
        v-model="drawer"
        right
        fixed
        :style="{ width: '500px', top: '80px' }"
    >
        <v-container
            fluid
            class="task_detail_wrap"
        >
            <v-card
                flat
            >
                <v-card class="mb-0">
                    <!-- <v-subheader class="pt-5 mb-3">タスク詳細</v-subheader> -->
                    <div class="task_detail_header">
                        <v-card-title>
                            <vs-checkbox
                                color="primary"
                                v-model="cloneTask.completed"
                                @change="checkTask()"
                                class="project_complete_checkbox"
                                line-through
                            >
                                <h1>{{ cloneTask.content }}</h1>
                            </vs-checkbox>
                        </v-card-title>
                        <v-divider></v-divider>
                    </div>
                    <v-list>
                        <v-list-item
                            v-for="subtask in cloneTask.sub_tasks"
                            :key="subtask.id"
                        >
                            <v-list-item-action
                                class="mr-3 ml-1"
                            >
                                <vs-checkbox
                                    color="success"
                                    v-model="complete_sub_tasks"
                                    :val="subtask.id"
                                    @change="checkSubTask(subtask)"
                                    line-through
                                >
                                    <v-list-item-title
                                        class="subtask_content"
                                        v-text="subtask.content"
                                    ></v-list-item-title>
                                </vs-checkbox>
                            </v-list-item-action>
                        </v-list-item>
                        <v-list-item>
                            <!-- <v-form
                                @submit.prevent
                            > -->
                                <vs-input
                                    v-model="subTask.content"
                                    placeholder="新規サブタスクを追加"
                                    @keyup.enter="createSubTask"
                                    @keypress="setCreateSubTask"
                                ></vs-input>
                            <!-- </v-form> -->
                        </v-list-item>
                    </v-list>
                </v-card>
                <v-list>
                    <v-tooltip
                        top
                        activator="#start_time_btn"
                        z-index=99000
                    >
                        <span>タスク開始時刻を変更する</span>
                    </v-tooltip>
                    <v-tooltip
                        top
                        activator="#deadline_btn"
                        z-index=99000
                    >
                        <span>期限を変更する</span>
                    </v-tooltip>
                    <v-tooltip
                        top
                        activator="#remind_btn"
                        z-index=99000
                    >
                        <span>リマインドを変更する</span>
                    </v-tooltip>
                    <v-card class="mb-2 py-2">
                        <v-list-item>
                            <v-list-item-icon id="start_time_btn" class="mr-5">
                                <v-btn
                                    icon
                                >
                                    <v-icon>mdi-clock-start</v-icon>
                                </v-btn>
                            </v-list-item-icon>
                            <v-list-item-content>
                                <v-list-item-title v-if="cloneTask.start_time !== ''">{{ cloneTask.start_time }} に開始</v-list-item-title>
                                <v-list-item-title v-else>{{ cloneTask.created_at }} に開始</v-list-item-title>
                            </v-list-item-content>
                        </v-list-item>
                        <v-divider></v-divider>
                        <v-list-item>
                            <v-list-item-icon id="deadline_btn" class="mr-5">
                                <v-btn
                                    icon
                                >
                                    <v-icon>mdi-calendar-clock</v-icon>
                                </v-btn>
                            </v-list-item-icon>
                            <v-list-item-content>
                                <v-list-item-title v-if="cloneTask.deadline !== ''">{{ cloneTask.deadline }} まで</v-list-item-title>
                                <v-list-item-title v-else>期限を設定する</v-list-item-title>
                            </v-list-item-content>
                        </v-list-item>
                        <v-divider></v-divider>
                        <v-list-item>
                            <v-list-item-icon id="remind_btn" class="mr-5">
                                <v-btn
                                    icon
                                >
                                    <v-icon>mdi-alarm</v-icon>
                                </v-btn>
                            </v-list-item-icon>
                            <v-list-item-content>
                                <v-list-item-title v-if="cloneTask.remind !== ''">{{ cloneTask.remind }} に通知</v-list-item-title>
                                <v-list-item-title v-else>リマインダーを設定する</v-list-item-title>
                            </v-list-item-content>
                        </v-list-item>
                    </v-card>
                    <v-card>
                        <v-list-item>
                            <v-list-item-content>
                                <v-text-field
                                    v-model="cloneTask.comment"
                                    placeholder="コメントを追加"
                                ></v-text-field>
                            </v-list-item-content>
                        </v-list-item>
                    </v-card>
                </v-list>
            </v-card>
        </v-container>
    </v-navigation-drawer>
</template>
<script>
    import { mapMutations } from 'vuex'
    import _ from 'lodash'

    export default {
        name: 'TaskDetail',
        components: {},
        data () {
            return {
                task: {},
                cloneTask: {
                    content: '',
                    comment: '',
                    completed: false,
                },
                drawer: false,
                complete_sub_tasks: [],
                subTask: {
                    target_task: 0,
                    content: '',
                },
                subTaskSubmitValue: false
            }
        },
        created () {
            this.$eventHub.$on('showTaskDetail', this.showTaskDetail)
            this.$eventHub.$on('closeTaskDetail', this.closeTaskDetail)
        },
        watch: {
            'cloneTask.comment': _.debounce(function (val) {
                if (this.task.comment !== undefined && this.task.comment !== val) {
                    this.changeCommentAction(val)
                }
            }, 500),
        },
        computed: {},
        methods: {
            ...mapMutations([
                'addSubTask',
                'deleteTask',
                'addCompleteTask',
                'addCompleteSubTasks',
                'changeComment',
            ]),
            closeTaskDetail () {
                this.drawer = false
                this.$eventHub.$emit('change-toggle-drawer', false)
                setTimeout(this.init, 100)
            },
            showTaskDetail (task) {
                // 何も開いてなかったら開く
                if (this.task.content === undefined) {
                    this.drawer = true
                    this.$eventHub.$emit('change-toggle-drawer', true)
                }
                // 同じタスクをクリックしたら閉じる
                if (this.task.content === task.content) {
                    this.closeTaskDetail()
                }
                // タスク情報セット=>既に詳細開いていたら書き換わる
                this.setTaskDetail(task)
            },
            setTaskDetail (task) {
                this.task = task
                this.cloneTask = _.cloneDeep(task)
                this.complete_sub_tasks = _.cloneDeep(task.complete_sub_tasks)
            },
            checkSubTask: _.debounce(function checkSubTask (subtask) {
                this.$axios({
                    url: '/api/sub_task/complete/',
                    method: 'POST',
                    data: {
                        task_id: this.cloneTask.id,
                        compelete_sub_task_id_list: this.complete_sub_tasks
                    }
                })
                .then(res => {
                    console.log(res)
                    this.addCompleteSubTasks(res.data)
                })
                .catch(e => {
                    console.log(e)
                })
            }, 800),
            checkTask: _.debounce(function checkTask () {
                if (this.task.completed !== this.cloneTask.completed) {
                    console.log('完了状態変更 : ' + this.task.completed + ' -> ' + this.cloneTask.completed)
                    this.$axios({
                        url: '/api/task/complete/',
                        method: 'POST',
                        data: {
                            complete_task_id: this.cloneTask.id,
                        }
                    })
                    .then(res => {
                        console.log(res)
                        this.deleteTask(res.data)
                        this.addCompleteTask(res.data)
                    })
                    .catch(e => {
                        console.log(e)
                    })
                    this.closeTaskDetail()
                }
            }, 800),
            setCreateSubTask () {
                this.subTaskSubmitValue = true
            },
            createSubTask () {
                const length = this.subTask.content.length
                if (length === 0 || !this.subTaskSubmitValue) return
                this.subTask.target_task = this.task.id
                this.$axios({
                    url: '/api/sub_task/',
                    method: 'POST',
                    data: this.subTask
                })
                .then(res => {
                    console.log(res)
                    this.addSubTask(res.data)
                    this.cloneTask.sub_tasks.push(res.data)
                    // console.log('push')
                    // console.log('cloneTask.sub_tasks : ')
                    // console.log(this.cloneTask.sub_tasks)
                    // console.log('res.data : ')
                    // console.log(res.data)
                })
                .catch(e => {
                    console.log(e)
                })
                this.subTask = {
                    target_task: 0,
                    content: '',
                }
                this.subTaskSubmitValue = false
            },
            init () {
                this.task = {}
                this.cloneTask = {
                    content: '',
                    comment: '',
                    completed: false,
                }
                this.complete_sub_tasks = []
                this.subTask = {
                    target_task: 0,
                    content: '',
                }
            },
            changeCommentAction (comment) {
                console.log(comment)
                this.$axios({
                    url: '/api/task/change_comment/',
                    method: 'POST',
                    data: {
                        task_id: this.cloneTask.id,
                        comment: comment
                    }
                })
                .then(res => {
                    console.log(res)
                    this.changeComment(res.data)
                })
                .catch(e => {
                    console.log(e)
                })
            }
        },
    }
</script>
<style lang="scss" scoped>
    .task_detail_wrap {
        .v-subheader {
            height: 12px;
        }
        .add_subtask_btn {
            margin: 0 auto;
            display: block;
        }
    }
    .vs-input-parent::v-deep {
        width: 100%;
        .vs-input {
            width: 100%;
        }
    }
</style>
