<template>
    <div>
        <v-navigation-drawer
            v-model="drawer"
            right
            fixed
            :style="{ width: '500px', top: '80px'}"
        >
            <v-container
                fluid
                class="task_detail_wrap"
            >
                <v-card>
                    <!-- タスク内容、サブタスク内容ここから -->
                    <!-- タスクヘッダー～ -->
                    <div class="task_detail_header">
                        <v-card-actions>
                            <v-card-subtitle>タスク詳細</v-card-subtitle>
                            <v-spacer></v-spacer>
                            <TaskDetailUpdatePriority
                                :cloneTask=cloneTask
                            />
                        </v-card-actions>
                        <!-- タスク表示モードここから -->
                        <v-card-title v-if="!isEdit"
                            @mouseover="isHover = true"
                            @mouseleave="isHover = false"
                        >
                            <vs-checkbox
                                color="primary"
                                v-model="cloneTask.completed"
                                @change="checkTask()"
                                class="project_complete_checkbox"
                                line-through
                            >
                                <h1>{{ cloneTask.content }}</h1>
                            </vs-checkbox>
                            <v-spacer></v-spacer>
                            <v-btn
                                v-if="isHover"
                                icon
                                color="primary"
                                @click="editTaskContent"
                            >
                                <v-icon>mdi-square-edit-outline</v-icon>
                            </v-btn>
                        </v-card-title>
                        <!-- タスク表示モードここまで -->
                        <!-- タスク編集モードここから -->
                        <v-card-title v-else>
                            <v-card-actions class="edit_task_content_area">
                                <vs-input
                                    v-model="cloneTask.content"
                                    @keypress.prevent.enter.exact="changeEditTaskSubmitValue"
                                    @keyup.prevent.enter.exact="setEditTaskContent"
                                >
                                    <template #icon>
                                        <i class="bx bx-message-alt-detail"></i>
                                    </template>
                                </vs-input>
                                <v-btn
                                    class="edit_task_content_submit_btn"
                                    icon
                                    color="primary"
                                    @click="editTaskContentBtn"
                                    :disabled="isDisabledEditTaskSubmitBtn"
                                >
                                    <i class='bx bx-check'></i>
                                </v-btn>
                            </v-card-actions>
                        </v-card-title>
                        <!-- タスク編集モードここまで -->
                        <!-- ラベルここから -->
                        <v-card-text>
                            <v-chip-group
                                v-if="!isCreateLabel"
                                column
                            >
                                <v-chip
                                    color="teal accent-3"
                                    text-color="white"
                                    label
                                    small
                                    close
                                    v-for="(label, i) in cloneTask.label"
                                    :key="i"
                                    @click:close="deleteLabel(label)"
                                >
                                    <v-icon
                                        left
                                        small
                                        color="white"
                                    >mdi-label</v-icon>
                                    {{ label.name }}
                                </v-chip>
                            </v-chip-group>
                            <!-- ラベル追加ボタンここから -->
                            <v-chip
                                v-if="!isCreateLabel"
                                class="mt-1"
                                color="teal accent-3"
                                text-color="white"
                                small
                                @click="addLabelContent"
                            >
                                <v-icon
                                    small
                                    color="white"
                                >mdi-pencil</v-icon>
                                ラベルを変更する
                            </v-chip>
                            <!-- ラベル追加ボタンここまで -->
                            <!-- ラベル追加ボタン押下後ここから -->
                            <div
                                v-else
                                class="create_label_area_wrap mt-5"
                            >
                                <div class="create_label_select_area_wrap mt-3">
                                    <!-- ラベル選択モード -->
                                    <div v-if="!isCreateNewLabel">
                                        <vs-select
                                            id="label_vs_select"
                                            placeholder='ラベルを選択してください'
                                            v-model="selectedLabelList"
                                            multiple
                                            filter
                                        >
                                            <vs-option
                                                id="label_vs_option"
                                                v-for='(label, i) in labels'
                                                :key='i'
                                                :label='label.name'
                                                :value='label.id'
                                                filter
                                            >{{ label.name }}
                                            </vs-option>
                                        </vs-select>
                                        <div
                                            class="change_label_btn_wrap mt-1"
                                        >
                                            <vs-button
                                                dark
                                                @click="endCreateLabel"
                                            >
                                                キャンセル
                                            </vs-button>
                                            <vs-button
                                                class="create_label_submit_btn ml-2"
                                                color="primary"
                                                @click="addLabelBtn"
                                            >
                                                変更
                                                <template #animate>
                                                    <i class="bx bxs-paper-plane"></i> 送信
                                                </template>
                                            </vs-button>
                                            <v-spacer></v-spacer>
                                            <vs-button
                                                v-if="!isCreateNewLabel"
                                                flat
                                                @click="isCreateNewLabel = true"
                                            >
                                                ラベルを作成
                                            </vs-button>
                                        </div>
                                    </div>
                                    <!-- ラベル作成モード -->
                                    <div
                                        v-else
                                        class="create_label_input_area_wrap mt-2"
                                    >
                                        <vs-input
                                            label-placeholder="ラベルを新規作成する"
                                            v-model="createLabelValue"
                                            @keypress.prevent.enter.exact="changeCreateLabelSubmitValue"
                                            @keyup.prevent.enter.exact="setCreateLabelName"
                                        >
                                            <template #icon>
                                                <i class='bx bx-label'></i>
                                            </template>
                                            <template v-if="createLabelDuplicate" #message-danger>
                                                既にこのラベルは作成されています。
                                            </template>
                                        </vs-input>
                                        <div
                                            class="change_label_btn_wrap mt-1"
                                        >
                                            <vs-button
                                                dark
                                                @click="isCreateNewLabel = false"
                                            >
                                                キャンセル
                                            </vs-button>
                                            <vs-button
                                                class="create_label_submit_btn ml-2"
                                                color="success"
                                                @click="createLabelBtn"
                                                :disabled="createLabelDisabled"
                                            >
                                                作成
                                                <template #animate>
                                                    <i class="bx bxs-paper-plane"></i> 送信
                                                </template>
                                            </vs-button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <!-- ラベル追加ボタン押下後ここまで -->
                        </v-card-text>
                        <v-divider></v-divider>
                        <!-- ラベルここまで -->
                    </div>
                    <!-- ～タスクヘッダー -->
                    <!-- サブタスク～ -->
                    <v-list>
                        <v-list-item
                            v-for="(subtask, i) in cloneTask.sub_tasks"
                            :key="subtask.id"
                        >
                            <v-container class="ma-0 pa-0">
                                <v-row
                                    v-if="!isEditSubTask(subtask)"
                                    class="sub_task_area_wrap"
                                    @mouseover="mouseOverSubTask(subtask)"
                                    @mouseleave="mouseLeaveSubTask(subtask)"
                                >
                                    <v-col cols="10">
                                        <vs-checkbox
                                            color="success"
                                            v-model="complete_sub_task_list"
                                            :val="subtask"
                                            @change="checkSubTask(subtask)"
                                            line-through
                                        >
                                            <v-list-item-title
                                                class="subtask_content"
                                            >{{ subtask.content | truncate(18) }}</v-list-item-title>
                                        </vs-checkbox>
                                    </v-col>
                                    <v-col cols="2">
                                        <v-btn
                                            v-if="isMouseOverSubTask(subtask)"
                                            icon
                                            height="33px"
                                            color="primary"
                                            @click="editSubTaskContent(subtask)"
                                        >
                                            <v-icon>mdi-square-edit-outline</v-icon>
                                        </v-btn>
                                    </v-col>
                                </v-row>
                                <v-row
                                    v-else
                                    class="sub_task_area_wrap"
                                >
                                    <v-col cols="9">
                                        <vs-input
                                            v-model="subtask.content"
                                            @keypress.prevent.enter.exact="changeEditSubTaskSubmitValue"
                                            @keyup.prevent.enter.exact="setEditSubTaskContent(subtask, i)"
                                        >
                                            <template #icon>
                                                <i class="bx bx-message-alt-detail"></i>
                                            </template>
                                        </vs-input>
                                    </v-col>
                                    <v-col cols="3">
                                        <v-card-actions class="pa-0 ma-0">
                                            <v-btn
                                                class="edit_sub_task_content_submit_btn"
                                                icon
                                                color="primary"
                                                @click="editSubTaskContentBtn(subtask, i)"
                                                size="small"
                                            >
                                                <i class='bx bx-check'></i>
                                            </v-btn>
                                            <v-btn
                                                class="edit_task_content_submit_btn"
                                                icon
                                                color="danger"
                                                @click="deleteSubTask(subtask, i)"
                                                size="small"
                                            >
                                                <i class='bx bx-minus'></i>
                                            </v-btn>
                                        </v-card-actions>
                                    </v-col>
                                </v-row>
                            </v-container>
                        </v-list-item>
                        <v-list-item
                            class="create_sub_task_area"
                        >
                            <vs-input
                                v-model="subTask.content"
                                placeholder="新規サブタスクを追加"
                                @keyup.enter="createSubTask"
                                @keypress="setCreateSubTask"
                            ></vs-input>
                        </v-list-item>
                    </v-list>
                    <v-divider></v-divider>
                    <!-- ～サブタスク -->
                    <!-- タスク内容、サブタスク内容ここまで -->
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
    import { mapGetters, mapActions, mapMutations } from 'vuex'
    import _ from 'lodash'
    import moment from 'moment'
    import Datetime from 'vue-ctk-date-time-picker'
    import 'vue-ctk-date-time-picker/dist/vue-ctk-date-time-picker.css'
    import { globalValidateMixins } from '@/mixins/validate'
    import TaskDetailDeleteTaskDialog from '@/components/parts/TaskDetailDeleteTaskDialog'
    import TaskDetailUpdatePriority from '@/components/parts/TaskDetailUpdatePriority'
    import TaskDetailUpdateDate from '@/components/parts/TaskDetailUpdateDate'

    const Con = new Const()

    export default {
        name: 'TaskDetail',
        components: {
            Datetime,
            TaskDetailDeleteTaskDialog,
            TaskDetailUpdatePriority,
            TaskDetailUpdateDate,
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
            complete_sub_task_list: [],
            // 作成するサブタスクの情報
            subTask: {
                target_task: 0,
                content: '',
            },
            // タスクにホバーしているか
            isHover: false,
            // サブタスクの作成フィールドの日本語変換時のsubmit防ぐため
            subTaskSubmitValue: false,
            // タスク編集中
            isEdit: false,
            // ラベル作成中
            isCreateLabel: false,
            // ラベル作成フィールドの日本語変換時のsubmit防ぐため
            createLabelSubmitValue: false,
            // ラベルのフィールドのデータ
            createLabelValue: '',
            // タスクの編集フィールドの日本語変換時のsubmit防ぐため
            editTaskSubmitValue: false,
            // サブタスクの編集フィールドの日本語変換時のsubmit防ぐため
            editSubTaskSubmitValue: false,
            // ホバーしたサブタスクのデータ
            mouseOverSubTaskData: {},
            // 編集するサブタスクのデータ
            editSubTaskData: {},
            // タスク削除モーダルのv-model
            taskDeleteConfirm: false,
            // 削除するラベルリストを一時的に保存
            deleteLabelList: [],
            // 選択したラベルIDリスト
            selectedLabelList: [],
            // label更新中フラグ
            isLoadingUpdateLabel: false,
            // label新規作成フィールドのv-model
            isCreateNewLabel: false,
            createLabelDuplicationCheck: false,
            createLabelDuplicate: false,
        }),
        created () {
            this.$eventHub.$on('showTaskDetail', this.showTaskDetail)
            this.$eventHub.$on('closeTaskDetail', this.closeTaskDetail)
            this.$eventHub.$on('closeSameTaskDetail', this.closeSameTaskDetail)
            this.$eventHub.$on('deleteTaskConfirm', this.deleteTaskConfirm)
            this.$eventHub.$on('selectPriority', this.selectPriority)
            this.$eventHub.$on('showTaskDeleteConfirm', this.showTaskDeleteConfirm)
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
            createLabelValue: _.debounce(function (val) {
                this.createLabelDuplicationCheck = false
                if (this.createLabelValue.length === 0) this.createLabelDuplicate = false
                if (this.createLabelValue.length > 0) this.checkLabelNameDuplication()
            }, 200),
        },
        computed: {
            ...mapGetters([
                'labels',
            ]),
            isDisabledEditTaskSubmitBtn () {
                if (this.cloneTask.content.length > 0) return false
                return true
            },
            priorityValue () {
                return this.priority.text
            },
            createLabelDisabled () {
                if (this.createLabelValue.length > 0 &&
                    this.createLabelDuplicationCheck) return false
                return true
            }
        },
        methods: {
            ...mapMutations([
                'addLabel',
                'addSubTask',
                'deleteTask',
                'addCompleteTask',
                'updateCompleteSubTasks',
                'updateTask',
                'updateSubTask',
                'updateLabelToTask',
            ]),
            ...mapActions([
                'addLabelsAction',
                'deleteTaskAction',
                'deleteSubTaskAction',
                'deleteLabelAction',
            ]),
            showTaskDeleteConfirm () {
                this.taskDeleteConfirm = true
            },
            checkLabelNameDuplication () {
                this.$axios({
                    url: '/api/label/checkDuplication/',
                    method: 'GET',
                    params: {
                        name: this.createLabelValue
                    }
                })
                .then(res => {
                    console.log(res.data)
                    if (res.data.result) {
                        this.createLabelDuplicate = false
                        this.createLabelDuplicationCheck = true
                    } else {
                        this.createLabelDuplicate = true
                    }
                })
                .catch(e => {
                    console.log(e)
                })
            },
            createLabelValidate () {
                // ラベル作成のバリデーション
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
                if (this.task.content === task.content) {
                    this.closeTaskDetail()
                }
                // タスク情報セット=>既に詳細開いていたら書き換わる
                this.setTaskDetail(task)
            },
            setTaskDetail (task) {
                // タスクの詳細の情報をセット
                this.complete_sub_task_list = _.cloneDeep(task.complete_sub_tasks)
                this.task = task
                this.cloneTask = _.cloneDeep(task)
                this.setSelectedLabelList()
                this.endEditTaskContent()
                this.endEditSubTaskContent()
                this.endCreateLabel()
            },
            setSelectedLabelList () {
                this.selectedLabelList = []
                // 選択されているラベルをセット
                for (const i in this.cloneTask.label) {
                    this.selectedLabelList.push(this.cloneTask.label[i].id)
                }
            },
            checkSubTask: _.debounce(function checkSubTask (subtask) {
                // サブタスクのチェックボックス押下後発火
                this.$axios({
                    url: '/api/sub_task/complete/',
                    method: 'PUT',
                    data: {
                        task_id: this.cloneTask.id,
                        compelete_sub_task_list: this.complete_sub_task_list
                    }
                })
                .then(res => {
                    console.log(res)
                    this.updateCompleteSubTasks(res.data)
                })
                .catch(e => {
                    console.log(e)
                })
            }, 400),
            checkTask: _.debounce(function checkTask () {
                // タスクのチェックボックス押下後発火
                if (this.task.completed !== this.cloneTask.completed) {
                    this.$axios({
                        url: '/api/task/complete/',
                        method: 'PUT',
                        data: {
                            complete_task: this.cloneTask,
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
            }, 400),
            setCreateSubTask () {
                // サブタスク簡易追加フィールドの日本語変換でsubmitを防ぐ
                this.subTaskSubmitValue = true
            },
            createSubTask () {
                // サブタスクを作成する
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
                // 詳細の情報を初期化する
                this.task = {}
                this.cloneTask = {
                    content: '',
                    comment: '',
                    completed: false,
                }
                this.complete_sub_task_list = []
                this.subTask = {
                    target_task: 0,
                    content: '',
                }
                this.endEditTaskContent()
                this.endEditSubTaskContent()
                this.endCreateLabel()
            },
            updateTaskDetail (key, value) {
                // タスク詳細を個別に更新
                this.$axios({
                    url: '/api/task/change_task_detail/',
                    method: 'PUT',
                    data: {
                        task_id: this.cloneTask.id,
                        [key]: value
                    }
                })
                .then(res => {
                    console.log(res)
                    this.updateTask(res.data)
                })
                .catch(e => {
                    console.log(e)
                })
            },
            updateSubTaskDetail (subtask) {
                // サブタスクの内容を更新
                this.$axios({
                    url: `/api/sub_task/${subtask.id}/`,
                    method: 'PUT',
                    data: {
                        target_task: subtask.target_task,
                        content: subtask.content,
                    }
                })
                .then(res => {
                    console.log(res)
                    this.updateSubTask(res.data)
                })
                .catch(e => {
                    console.log(e)
                })
            },
            editTaskContent () {
                // タスク編集モードにする。
                this.isEdit = true
                this.endEditSubTaskContent()
                this.endCreateLabel()
            },
            editSubTaskContent (subtask) {
                // サブタスク編集モードにする。
                this.editSubTaskData = subtask
                this.endEditTaskContent()
                this.endCreateLabel()
            },
            addLabelContent () {
                // ラベル作成モードにする。
                this.isCreateLabel = true
                this.endEditTaskContent()
                this.endEditSubTaskContent()
            },
            mouseOverSubTask (subtask) {
                // サブタスクにホバー時にサブタスク情報を保持
                this.mouseOverSubTaskData = _.cloneDeep(subtask)
            },
            mouseLeaveSubTask (subtask) {
                // サブタスクのホバーが終わったら初期化
                this.mouseOverSubTaskData = {}
            },
            isMouseOverSubTask (subtask) {
                // サブタスクのホバーしている要素のみ表示させる判定メソッド
                if (subtask.id === this.mouseOverSubTaskData.id) return true
                return false
            },
            changeEditTaskSubmitValue () {
                // タスク編集の日本語変換でのsubmitを防ぐ
                this.editTaskSubmitValue = true
            },
            changeEditSubTaskSubmitValue () {
                // サブタスク編集の日本語変換でのsubmitを防ぐ
                this.editSubTaskSubmitValue = true
            },
            changeCreateLabelSubmitValue () {
                // ラベル作成の日本語変換でのsubmitを防ぐ
                this.createLabelSubmitValue = true
            },
            setEditTaskContent () {
                // タスク編集の入力エリアでenterが押されたら更新
                const length = this.cloneTask.content.length
                if (length === 0 || !this.editTaskSubmitValue) return
                if (this.task.content !== this.cloneTask.content) {
                    this.updateTaskDetail('content', this.cloneTask.content)
                }
                this.endEditTaskContent()
            },
            setEditSubTaskContent (subtask, i) {
                // サブタスク編集の入力エリアでenterが押されたら更新
                const length = subtask.content.length
                if (!this.editSubTaskSubmitValue) return
                if (length === 0) {
                    this.cloneTask.sub_tasks.splice(i, 1)
                    this.deleteSubTaskAction(subtask.id)
                }
                if (length !== 0 && this.mouseOverSubTaskData.content !== subtask.content) {
                    this.updateSubTaskDetail(subtask)
                }
                this.endEditSubTaskContent()
            },
            setCreateLabelName () {
                // ラベル作成エリアでenterが押されたら更新
                const length = this.createLabelValue.length
                if (length === 0 || !this.createLabelSubmitValue || this.createLabelDisabled) return
                this.createLabelBtn()
            },
            createLabelBtn () {
                // ラベル作成の送信ボタンが押されたらラベル作成
                if (this.createLabelValue.length === 0) return
                this.isLoadingUpdateLabel = true
                this.$axios({
                    url: '/api/label/',
                    method: 'POST',
                    data: {
                        name: this.createLabelValue,
                    }
                })
                .then(res => {
                    this.isLoadingUpdateLabel = false
                    this.selectedLabelList.push(res.data.id)
                    this.addLabelsAction(res.data)
                    this.isCreateNewLabel = false
                })
                .catch(e => {
                    console.log(e)
                })
                this.createLabelValue = ''
            },
            addLabelBtn () {
                // ラベルを選択した後送信
                this.isLoadingUpdateLabel = true
                this.$axios({
                    url: '/api/task/change_label_list/',
                    method: 'PUT',
                    data: {
                        task_id: this.cloneTask.id,
                        label_id_list: this.selectedLabelList
                    }
                })
                .then(res => {
                    console.log(res)
                    this.cloneTask.label = res.data.label
                    this.setSelectedLabelList()
                    this.endCreateLabel()
                    this.updateLabelToTask(res.data)
                    this.isLoadingUpdateLabel = false
                })
                .catch(e => {
                    console.log(e)
                })
            },
            endEditTaskContent () {
                // タスク編集モードを終了
                this.isEdit = false
                this.editTaskSubmitValue = false
            },
            endEditSubTaskContent () {
                // サブタスク編集モードを終了
                this.editSubTaskData = {}
                this.editSubTaskSubmitValue = false
                this.mouseOverSubTaskData = {}
            },
            endCreateLabel () {
                // ラベル作成モードを終了
                this.isCreateLabel = false
                this.createLabelSubmitValue = false
                this.createLabelValue = ''
                this.setSelectedLabelList()
            },
            editTaskContentBtn () {
                // タスク編集時にsubmitボタン押下で更新
                if (this.task.content !== this.cloneTask.content) {
                    this.updateTaskDetail('content', this.cloneTask.content)
                }
                this.endEditTaskContent()
            },
            editSubTaskContentBtn (subtask, i) {
                // サブタスク編集時にsubmitボタン押下で更新
                const length = subtask.content.length
                if (length === 0) {
                    this.cloneTask.sub_tasks.splice(i, 1)
                    this.deleteSubTaskAction(subtask.id)
                }
                if (this.mouseOverSubTaskData.content !== subtask.content) {
                    this.updateSubTaskDetail(subtask)
                }
                this.endEditSubTaskContent()
            },
            isEditSubTask (subtask) {
                // 編集中のサブタスクかを判定するメソッド
                if (subtask.id === this.editSubTaskData.id) return true
                return false
            },
            deleteTaskConfirm () {
                this.deleteTaskAction(this.cloneTask.id)
                this.closeTaskDetail()
                this.taskDeleteConfirm = false
            },
            deleteSubTask (subtask, i) {
                this.cloneTask.sub_tasks.splice(i, 1)
                this.deleteSubTaskAction(subtask.id)
            },
            selectPriority (priority) {
                this.cloneTask.priority = priority
                this.updateTaskDetail('priority', this.cloneTask.priority)
            },
            deleteLabel (label) {
                for (const i in this.cloneTask.label) {
                    if (this.cloneTask.label[i].id === label.id) {
                        this.cloneTask.label.splice(i, 1)
                        break
                    }
                }
                const index = this.selectedLabelList.indexOf(label.id)
                if (index !== -1) this.selectedLabelList.splice(index, 1)
                this.deleteLabelList.push(label)
                this.deleteLabelToAction()
            },
            deleteLabelToAction: _.debounce(function deleteLabelToAction () {
                this.deleteLabelAction({
                    task_id: this.cloneTask.id,
                    delete_label_list: this.deleteLabelList
                })
                this.deleteLabelList = []
            }, 400),
        },
        mixins: [globalValidateMixins],
    }
</script>
<style lang="scss" scoped>
    .vs-input-parent::v-deep {
        width: 100%;
        .vs-input {
            width: 100%;
        }
    }
    .task_detail_wrap {
        margin: 0;
        padding: 0;
        .task_detail_header {
            .v-card__actions {
                padding: 8px 0 0 0;
                height: 40px;
            }
            .v-card__title {
                margin-top: 0px;
            }
        }
        .v-subheader {
            height: 12px;
        }
        .edit_task_content_area {
            width: 100%;
            height: 46px;
        }
        .edit_task_content_submit_btn {
            position: relative;
            left: 10px;
        }
        .sub_task_area_wrap {
            height: 65px;
        }
        .change_label_btn_wrap {
            display: flex;
        }
        .create_label_input_area_wrap {
            width: 100%;
            .vs-input-parent::v-deep {
                width: 100%;
                .vs-input {
                    width: 100%;
                }
            }
        }
        .create_label_select_area_wrap {
            // display: flex;
            width: 100%;
            .vs-select-content::v-deep {
                max-width: 100%;
                // max-width: 63%;
                .vs-select__input {
                    width: 100%;
                }
            }
        }
    }
</style>
