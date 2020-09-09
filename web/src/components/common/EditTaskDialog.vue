<template>
    <vs-dialog v-model="dialog" width="600px">
        <v-container
            fluid
            class="edit_task_dialog_wrap"
        >
            <h5
                class="edit_task_dialog_header"
                align="center"
            >
                タスクを編集
            </h5>
            <ValidationObserver v-slot="{ invalid }">
                <v-row
                    class="edit_task_dialog_task_area_wrap"
                >
                    <v-col
                        cols="11"
                        class="edit_task_dialog_task_input_area"
                    >
                        <ValidationProvider v-slot="{ errors }" name="タスク" rules="required">
                            <v-textarea
                                class="mt-3"
                                outlined
                                label="例: 英単語、プログラミング、ブログ、読書"
                                v-model="updateTaskData.content"
                                rows="5"
                                no-resize
                                :counter="100"
                            >
                                <template #message-danger>
                                    {{ errors[0] }}
                                </template>
                            </v-textarea>
                        </ValidationProvider>
                    </v-col>
                    <v-col
                        cols="1"
                    >
                        <DeadLineBtn
                            :defaultDeadline=task.deadline
                        />
                        <ProjectBtn
                            :defaultProjectId=task.target_project
                            :defaultProject=task.target_project_name
                            :defaultSection=task.target_section_name
                        />
                        <LabelBtn
                            :defaultLabelList=task.label
                        />
                        <PriorityBtn
                            :defaultPriority=task.priority
                        />
                        <ReminderBtn
                            :defaultRemind=task.remind
                        />
                    </v-col>
                </v-row>
                <v-row>
                    <v-col
                        cols="9"
                    >
                        <vs-input
                            class="mt-1"
                            v-model="updateTaskData.comment"
                            placeholder="コメント"
                        >
                            <template #icon>
                                <v-icon
                                    color="teal accent-3"
                                >mdi-comment-outline</v-icon>
                            </template>
                        </vs-input>
                    </v-col>
                    <v-col
                        cols="3"
                    >
                        <vs-button
                            relief
                            color="#40e0d0"
                            :disabled="invalid"
                            @click.prevent="update"
                        >タスクを更新</vs-button>
                    </v-col>
                </v-row>
            </ValidationObserver>
        </v-container>
    </vs-dialog>
</template>
<script>
    import _ from 'lodash'
    import { mapActions, mapMutations } from 'vuex'
    import DeadLineBtn from '@/components/parts/DeadLineBtn'
    import ProjectBtn from '@/components/parts/ProjectBtn'
    import LabelBtn from '@/components/parts/LabelBtn'
    import PriorityBtn from '@/components/parts/PriorityBtn'
    import ReminderBtn from '@/components/parts/ReminderBtn'

    export default {
        name: 'EditTaskDialog',
        data: () => ({
            dialog: false,
            task: {},
            updateTaskData: {},
        }),
        components: {
            DeadLineBtn,
            ProjectBtn,
            LabelBtn,
            PriorityBtn,
            ReminderBtn,
        },
        created () {
            this.$eventHub.$on('create_task_info', this.create_task_info)
        },
        methods: {
            ...mapActions([
                'updateTaskAction',
            ]),
            ...mapMutations([
                'addTask',
                'deleteTask',
            ]),
            open (task) {
                this.task = _.cloneDeep(task)
                this.createUpdateTaskData(task)
                this.dialog = true
            },
            close () {
                this.task = {}
                this.updateTaskData = {}
                this.dialog = false
            },
            update () {
                const { target_project: targetProject, target_section: targetSection } = this.task
                const { project_id: projectId, section_id: sectionId } = this.updateTaskData
                this.$axios({
                    url: `/api/task/${this.task.id}/`,
                    method: 'PUT',
                    data: this.updateTaskData
                })
                .then(res => {
                    // プロジェクト、セクションを更新したら消すのと追加
                    if (targetProject !== projectId || targetSection !== sectionId) {
                        this.addTask(res.data)
                        this.deleteTask(this.task)
                    // 変わらなければ、更新
                    } else {
                        this.updateTaskAction(res.data)
                    }
                    console.log(res)
                    this.close()
                })
                .catch(e => {
                    console.log(e)
                })
            },
            createUpdateTaskData (task) {
                this.updateTaskData = {
                    project_id: task.target_project,
                    section_id: task.target_section,
                    content: task.content,
                    comment: task.comment,
                    priority: task.priority,
                    label_list: [],
                    deadline_str: task.deadline,
                    remind_str: task.remind,
                }
                for (const i in task.label) {
                    this.updateTaskData.label_list.push(task.label[i].id)
                }
            },
            create_task_info (key, value) {
                this.updateTaskData[key] = value
            }
        }
    }
</script>
<style lang="scss" scoped>
    .edit_task_dialog_wrap {
        height: 300px;
        .edit_task_dialog_task_area_wrap {
            height: 185px;
            margin-bottom: 30px;
        }
        .edit_task_dialog_task_input_area {
            height: 100%;
        }
        .vs-input-parent::v-deep {
            width: 100%;
            .vs-input {
                width: 100%;
            }
        }
    }
</style>
