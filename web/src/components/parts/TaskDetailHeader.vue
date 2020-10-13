<template>
    <div>
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
                @click.stop
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
                @click.stop
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
                    @click.stop
                    @click="editTaskContentBtn"
                    :disabled="isDisabledEditTaskSubmitBtn"
                >
                    <i class='bx bx-check'></i>
                </v-btn>
            </v-card-actions>
        </v-card-title>
    </div>
</template>
<script>
    import { mapActions } from 'vuex'
    import TaskDetailUpdatePriority from '@/components/parts/TaskDetailUpdatePriority'
    import _ from 'lodash'

    export default {
        name: 'TaskDetailHeader',
        components: {
            TaskDetailUpdatePriority
        },
        props: {
            task: {
                type: Object,
                required: true,
            },
            cloneTask: {
                type: Object,
                required: true,
            }
        },
        data: () => ({
            isHover: false,
            isEdit: false,
            editTaskSubmitValue: false,
        }),
        created () {
            this.$eventHub.$on('endEditTaskContent', this.endEditTaskContent)
        },
        watch: {
        },
        computed: {
            isDisabledEditTaskSubmitBtn () {
                if (this.cloneTask.content.length > 0) return false
                return true
            },
        },
        methods: {
            ...mapActions([
                'deleteTaskAction',
                'updateCompleteTaskAction',
                'updateTaskDetailAction',
            ]),
            checkTask: _.debounce(function checkTask () {
                this.updateCompleteTaskAction({
                    complete_task: this.cloneTask,
                })
                this.$eventHub.$emit('closeTaskDetail')
            }, 600),
            editTaskContent () {
                // タスク編集モードにする。
                this.isEdit = true
                this.$eventHub.$emit('endEditSubTaskContent')
                this.$eventHub.$emit('endCreateLabel')
            },
            changeEditTaskSubmitValue () {
                // タスク編集の日本語変換でのsubmitを防ぐ
                this.editTaskSubmitValue = true
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
            editTaskContentBtn () {
                // タスク編集時にsubmitボタン押下で更新
                if (this.task.content !== this.cloneTask.content) {
                    this.updateTaskDetail('content', this.cloneTask.content)
                }
                this.endEditTaskContent()
            },
            endEditTaskContent () {
                // タスク編集モードを終了
                this.isEdit = false
                this.editTaskSubmitValue = false
            },
            updateTaskDetail (key, value) {
                // タスク詳細を個別に更新
                this.updateTaskDetailAction({
                    task_id: this.cloneTask.id,
                    key: key,
                    value: value,
                })
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
    .v-card__actions {
        padding: 8px 0 0 0;
        height: 40px;
    }
    .v-card__title {
        margin-top: 0px;
    }
    .edit_task_content_area {
        width: 100%;
        height: 46px;
    }
    .edit_task_content_submit_btn {
        position: relative;
        left: 10px;
    }
</style>
