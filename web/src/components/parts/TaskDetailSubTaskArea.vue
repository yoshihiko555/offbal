<template>
    <v-list>
        <v-card-subtitle
            v-if="cloneTask.sub_tasks != undefined && cloneTask.sub_tasks.length > 0"
        >サブタスク一覧</v-card-subtitle>
        <v-list-item
            v-for="(subtask, i) in cloneTask.sub_tasks"
            :key="i"
        >
            <v-container class="ma-0 pa-0">
                <v-row
                    v-if="!isEditSubTask(subtask)"
                    class="sub_task_area_wrap"
                    @mouseover="mouseOverSubTask(subtask)"
                    @mouseleave="mouseLeaveSubTask(subtask)"
                >
                    <v-col cols="10" class="subtask_content_wrap">
                        <!-- <v-list-item-content class="subtask_content_list"> -->
                            <vs-checkbox
                                color="success"
                                v-model="completeSubTaskList"
                                :val="subtask"
                                @change="checkSubTask(subtask)"
                                line-through
                            >
                                <v-list-item-subtitle
                                    class="subtask_content"
                                >{{ subtask.content | truncate(18) }}</v-list-item-subtitle>
                            </vs-checkbox>
                        <!-- </v-list-item-content> -->
                    </v-col>
                    <v-col cols="2">
                        <!-- <v-list-item-action> -->
                            <v-btn
                                v-if="isMouseOverSubTask(subtask)"
                                icon
                                height="33px"
                                color="primary"
                                @click.stop
                                @click="editSubTaskContent(subtask)"
                            >
                                <v-icon>mdi-square-edit-outline</v-icon>
                            </v-btn>
                        <!-- </v-list-item-action> -->
                    </v-col>
                </v-row>
                <v-row
                    v-else
                    class="sub_task_area_wrap"
                >
                    <v-col cols="9">
                        <vs-input
                            v-model="cloneEditSubTaskData.content"
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
                                @click.stop
                                @click="editSubTaskContentBtn(subtask, i)"
                                size="small"
                            >
                                <i class='bx bx-check'></i>
                            </v-btn>
                            <v-btn
                                class="edit_task_content_submit_btn"
                                icon
                                color="danger"
                                @click.stop
                                @click="deleteSubTask(subtask, i)"
                                size="small"
                            >
                                <i class='bx bx-trash' style='color:#e60b0b'></i>
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
                v-model="createSubTaskData.content"
                placeholder="新規サブタスクを追加"
                @keyup.enter="createSubTask"
                @keypress="setCreateSubTask"
            ></vs-input>
        </v-list-item>
    </v-list>
</template>
<script>
    import { mapActions, mapMutations } from 'vuex'
    import _ from 'lodash'

    export default {
        name: 'TaskDetailSubTaskArea',
        components: {},
        props: {
            task: {
                type: Object,
                required: true,
            },
            cloneTask: {
                type: Object,
                required: true,
            },
            completeSubTaskList: {
                type: Array,
                required: true,
            }
        },
        data: () => ({
            mouseOverSubTaskData: {},
            subTaskSubmitValue: false,
            createSubTaskData: {
                target_task: 0,
                content: '',
            },
            editSubTaskSubmitValue: false,
            editSubTaskData: {},
            cloneEditSubTaskData: {},
            localCloneTask: {},
        }),
        created () {
            this.$eventHub.$on('endEditSubTaskContent', this.endEditSubTaskContent)
        },
        mounted: function () {
        },
        watch: {
        },
        computed: {
        },
        methods: {
            ...mapMutations([
                'addSubTask',
                'updateCompleteSubTasks',
                'updateSubTask',
            ]),
            ...mapActions([
                'deleteSubTaskAction',
                'updateCompleteSubTasksAction',
            ]),
            isEditSubTask (subtask) {
                // 編集中のサブタスクかを判定するメソッド
                if (subtask.id === this.editSubTaskData.id) return true
                return false
            },
            setCreateSubTask () {
                // サブタスク簡易追加フィールドの日本語変換でsubmitを防ぐ
                this.subTaskSubmitValue = true
            },
            mouseOverSubTask (subtask) {
                // サブタスクにホバー時にサブタスク情報を保持
                this.mouseOverSubTaskData = _.cloneDeep(subtask)
            },
            mouseLeaveSubTask (subtask) {
                // サブタスクのホバーが終わったら初期化
                this.mouseOverSubTaskData = {}
            },
            checkSubTask: _.debounce(function checkSubTask (subtask) {
                // サブタスクのチェックボックス押下後発火
                this.updateCompleteSubTasksAction({
                    task_id: this.cloneTask.id,
                    compelete_sub_task_list: this.completeSubTaskList,
                })
            }, 400),
            isMouseOverSubTask (subtask) {
                // サブタスクのホバーしている要素のみ表示させる判定メソッド
                if (subtask.id === this.mouseOverSubTaskData.id) return true
                return false
            },
            editSubTaskContent (subtask) {
                // サブタスク編集モードにする。
                this.cloneEditSubTaskData = _.cloneDeep(subtask)
                this.editSubTaskData = subtask
                this.$eventHub.$emit('endEditTaskContent')
                this.$eventHub.$emit('endCreateLabel')
            },
            changeEditSubTaskSubmitValue () {
                // サブタスク編集の日本語変換でのsubmitを防ぐ
                this.editSubTaskSubmitValue = true
            },
            setEditSubTaskContent (subtask, i) {
                // サブタスク編集の入力エリアでenterが押されたら更新
                const length = this.cloneEditSubTaskData.content.length
                if (!this.editSubTaskSubmitValue) return
                if (length === 0) {
                    this.cloneTask.sub_tasks.splice(i, 1)
                    this.deleteSubTaskAction(this.cloneEditSubTaskData.id)
                }
                if (length !== 0 && this.mouseOverSubTaskData.content !== this.cloneEditSubTaskData.content) {
                    this.updateSubTaskDetail(this.cloneEditSubTaskData, i)
                }
                this.endEditSubTaskContent()
            },
            editSubTaskContentBtn (subtask, i) {
                // サブタスク編集時にsubmitボタン押下で更新
                const length = this.cloneEditSubTaskData.content.length
                if (length === 0) {
                    this.cloneTask.sub_tasks.splice(i, 1)
                    this.deleteSubTaskAction(this.cloneEditSubTaskData.id)
                }
                if (this.mouseOverSubTaskData.content !== this.cloneEditSubTaskData.content) {
                    this.updateSubTaskDetail(this.cloneEditSubTaskData, i)
                }
                this.endEditSubTaskContent()
            },
            deleteSubTask (subtask, i) {
                this.cloneTask.sub_tasks.splice(i, 1)
                this.deleteSubTaskAction(subtask.id)
            },
            endEditSubTaskContent () {
                // サブタスク編集モードを終了
                this.editSubTaskData = {}
                this.editSubTaskSubmitValue = false
                this.mouseOverSubTaskData = {}
                this.cloneEditSubTaskData = {}
            },
            updateSubTaskDetail (subtask, i) {
                // サブタスクの内容を更新
                this.$axios({
                    url: `/api/sub_task/${this.cloneEditSubTaskData.id}/`,
                    method: 'PUT',
                    data: {
                        target_task: this.cloneEditSubTaskData.target_task,
                        content: this.cloneEditSubTaskData.content,
                    }
                })
                .then(res => {
                    console.log(res)
                    this.updateSubTask(res.data)
                    this.$eventHub.$emit('cloneTaskAfterUpdateSubTask')
                })
                .catch(e => {
                    console.log(e)
                })
            },
            createSubTask () {
                // サブタスクを作成する
                const length = this.createSubTaskData.content.length
                if (length === 0 || !this.subTaskSubmitValue) return
                this.createSubTaskData.target_task = this.task.id
                this.$axios({
                    url: '/api/sub_task/',
                    method: 'POST',
                    data: this.createSubTaskData
                })
                .then(res => {
                    console.log(res)
                    this.addSubTask(res.data)
                    this.$eventHub.$emit('cloneTaskAfterUpdateSubTask')
                })
                .catch(e => {
                    console.log(e)
                })
                this.createSubTaskData = {
                    target_task: 0,
                    content: '',
                }
                this.subTaskSubmitValue = false
            },
        }
    }
</script>
<style lang="scss" scoped>
    .vs-input-parent::v-deep {
        width: 100%;
        .vs-input {
            width: 100%;
        }
    }
    .sub_task_area_wrap {
        height: 65px;
    }
</style>
