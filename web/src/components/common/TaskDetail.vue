<template>
    <div>
        <v-navigation-drawer
            v-model="drawer"
            right
            fixed
            hide-overlay
            mobile-breakpoint=700
        >
            <v-container
                fluid
                class="task_detail_wrap"
            >
                <v-card>
                    <div class="task_detail_header">
                        <TaskDetailHeader
                            :task=task
                            :cloneTask=cloneTask
                        />
                        <TaskDetailLabelArea
                            :cloneTask=cloneTask
                            :selectedLabelList=selectedLabelList
                            @update="selectedLabelList = $event"
                        />
                        <v-divider></v-divider>
                    </div>
                    <TaskDetailSubTaskArea
                        :task=task
                        :cloneTask=cloneTask
                        :completeSubTaskList=completeSubTaskList
                    />
                    <v-divider></v-divider>
                    <TaskDetailUpdateDate
                        :cloneTask=cloneTask
                    />
                </v-card>
            </v-container>
        </v-navigation-drawer>

        <TaskDetailDeleteTaskDialog
            @update="taskDeleteConfirm = $event"
            :taskDeleteConfirm="taskDeleteConfirm"
        />
    </div>
</template>
<script>
    import { Const } from '@/assets/js/const'
    import { mapActions } from 'vuex'
    import _ from 'lodash'
    import moment from 'moment'
    import Datetime from 'vue-ctk-date-time-picker'
    import 'vue-ctk-date-time-picker/dist/vue-ctk-date-time-picker.css'
    import { globalValidateMixins } from '@/mixins/validate'
    import TaskDetailDeleteTaskDialog from '@/components/parts/TaskDetailDeleteTaskDialog'
    import TaskDetailUpdateDate from '@/components/parts/TaskDetailUpdateDate'
    import TaskDetailHeader from '@/components/parts/TaskDetailHeader'
    import TaskDetailLabelArea from '@/components/parts/TaskDetailLabelArea'
    import TaskDetailSubTaskArea from '@/components/parts/TaskDetailSubTaskArea'

    const Con = new Const()

    export default {
        name: 'TaskDetail',
        components: {
            Datetime,
            TaskDetailDeleteTaskDialog,
            TaskDetailUpdateDate,
            TaskDetailHeader,
            TaskDetailLabelArea,
            TaskDetailSubTaskArea
        },
        data: () => ({
            task: {},
            cloneTask: {
                content: '',
                comment: '',
                completed: false,
            },
            drawer: false,
            // 終了したタスクの一括更新用リスト
            completeSubTaskList: [],
            // タスク削除モーダルのv-model
            taskDeleteConfirm: false,
            // 選択したラベルIDリスト
            selectedLabelList: [],
        }),
        created () {
            this.$eventHub.$on('showTaskDetail', this.showTaskDetail)
            this.$eventHub.$on('closeTaskDetail', this.closeTaskDetail)
            this.$eventHub.$on('closeSameTaskDetail', this.closeSameTaskDetail)
            this.$eventHub.$on('deleteTaskConfirm', this.deleteTaskConfirm)
            this.$eventHub.$on('selectPriority', this.selectPriority)
            this.$eventHub.$on('showTaskDeleteConfirm', this.showTaskDeleteConfirm)
            this.$eventHub.$on('cloneTaskAfterUpdateSubTask', this.cloneTaskAfterUpdateSubTask)
        },
        mounted: function () {
        },
        watch: {
            'cloneTask.comment': _.debounce(function (val) {
                if (this.task.comment !== undefined && this.task.comment !== val) {
                    this.updateTaskDetail('comment', val)
                }
            }, 500),
            'cloneTask.start_time': _.debounce(function (val) {
                if (this.task.start_time !== undefined && this.task.start_time !== val) {
                    this.updateTaskDetail('start_time', val)
                }
            }, 500),
            'cloneTask.deadline': _.debounce(function (val) {
                if (this.task.deadline !== undefined && this.task.deadline !== val) {
                    this.updateTaskDetail('deadline', val)
                }
            }, 500),
            'cloneTask.remind': _.debounce(function (val) {
                if (this.task.remind !== undefined && this.task.remind !== val) {
                    this.updateTaskDetail('remind', val)
                }
            }, 500),
        },
        computed: {
            priorityValue () {
                return this.priority.text
            },
        },
        methods: {
            ...mapActions([
                'deleteTaskAction',
                'updateTaskDetailAction',
            ]),
            showTaskDeleteConfirm () {
                this.taskDeleteConfirm = true
            },
            closeTaskDetail () {
                // タスク詳細を閉じる
                this.drawer = false
                this.$eventHub.$emit('change-toggle-drawer', false)
                setTimeout(this.init, 100)
            },
            closeSameTaskDetail (task) {
                // タスクリストのチェックボックスチェック時に、
                // 同じタスクの詳細を開いていたら閉じる。
                if (this.cloneTask.id === task.id) {
                    this.drawer = false
                    this.$eventHub.$emit('change-toggle-drawer', false)
                    setTimeout(this.init, 100)
                }
            },
            showTaskDetail (task) {
                // 何も開いてなかったら開く
                if (this.task.content === undefined) {
                    this.drawer = true
                    this.$eventHub.$emit('change-toggle-drawer', true)
                }
                // 同じタスクをクリックしたら閉じる
                if (this.task.id === task.id) {
                    this.closeTaskDetail()
                }
                // タスク情報セット=>既に詳細開いていたら書き換わる
                this.setTaskDetail(task)
            },
            setTaskDetail (task) {
                // タスクの詳細の情報をセット
                this.completeSubTaskList = _.cloneDeep(task.complete_sub_tasks)
                this.task = task
                this.cloneTask = _.cloneDeep(task)
                this.setSelectedLabelList()
            },
            cloneTaskAfterUpdateSubTask () {
                // タスクの詳細の情報をセット
                this.cloneTask = _.cloneDeep(this.task)
                this.completeSubTaskList = _.cloneDeep(this.task.complete_sub_tasks)
            },
            setSelectedLabelList () {
                this.selectedLabelList = []
                // 選択されているラベルをセット
                for (const i in this.cloneTask.label) {
                    this.selectedLabelList.push(this.cloneTask.label[i].id)
                }
            },
            init () {
                // 詳細の情報を初期化する
                this.task = {}
                this.cloneTask = {
                    content: '',
                    comment: '',
                    completed: false,
                }
                this.completeSubTaskList = []
            },
            updateTaskDetail (key, value) {
                // タスク詳細を個別に更新
                this.updateTaskDetailAction({
                    task_id: this.cloneTask.id,
                    key: key,
                    value: value,
                })
            },
            deleteTaskConfirm () {
                this.deleteTaskAction(this.cloneTask.id)
                this.closeTaskDetail()
                this.taskDeleteConfirm = false
            },
            selectPriority (priority) {
                this.cloneTask.priority = priority
                this.updateTaskDetail('priority', this.cloneTask.priority)
            },
        },
        mixins: [globalValidateMixins],
    }
</script>
<style lang="scss" scoped>
    .v-navigation-drawer {
        width: $task-detail-width !important;
        top: 60px !important;
        height: calc(100% - 60px) !important;
    }

    .task_detail_wrap {
        margin: 0;
        padding: 0;
        .v-subheader {
            height: 12px;
        }
    }
</style>
