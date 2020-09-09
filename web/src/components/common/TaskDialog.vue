<template>
    <vs-dialog v-model="localTaskDialog" width="600px">
        <v-container
            fluid
            class="task_dialog_wrap"
        >
            <h5
                class="task_dialog_header"
                align="center"
            >
                新規タスクを追加
            </h5>
            <ValidationObserver v-slot="{ invalid }">
                <!-- <v-form
                    @submit.prevent
                > -->
                    <v-row
                        class="task_dialog_task_area_wrap"
                    >
                        <v-col
                            cols="11"
                            class="task_dialog_task_input_area"
                        >
                            <ValidationProvider v-slot="{ errors }" name='タスク' rules="required">
                                <v-textarea
                                    class="mt-3"
                                    outlined
                                    label="例: 英単語、プログラミング、ブログ、読書"
                                    v-model="task.content"
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
                            <DeadLineBtn/>
                            <ProjectBtn
                                :defaultProjectId=detailProject.id
                            />
                            <LabelBtn/>
                            <PriorityBtn/>
                            <ReminderBtn/>
                        </v-col>
                    </v-row>
                    <v-row>
                        <v-col
                            cols="9"
                        >
                            <vs-input
                                class="mt-1"
                                v-model="task.comment"
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
                                @click.prevent="addLocalTask"
                            >タスクを追加</vs-button>
                        </v-col>
                    </v-row>
                <!-- </v-form> -->
            </ValidationObserver>
        </v-container>
    </vs-dialog>
</template>
<script>
    import { mapGetters, mapMutations } from 'vuex'
    import DeadLineBtn from '@/components/parts/DeadLineBtn'
    import ProjectBtn from '@/components/parts/ProjectBtn'
    import LabelBtn from '@/components/parts/LabelBtn'
    import PriorityBtn from '@/components/parts/PriorityBtn'
    import ReminderBtn from '@/components/parts/ReminderBtn'

    export default {
        name: 'TaskDialog',
        components: {
            DeadLineBtn,
            ProjectBtn,
            LabelBtn,
            PriorityBtn,
            ReminderBtn,
        },
        props: {
            taskDialog: {
                type: Boolean,
                required: true
            }
        },
        data: () => ({
            task: {
                project_id: 0,
                section_id: 0,
                content: '',
                comment: '',
                deadline_str: '',
                remind_str: '',
                priority: '1',
                label_list: [],
            },
        }),
        created () {
            this.$eventHub.$on('create_task_info', this.create_task_info)
        },
        mounted: function () {
        },
        watch: {},
        computed: {
            localTaskDialog: {
                get: function () {
                    this.init()
                    return this.taskDialog
                },
                set: function (value) {
                    this.init()
                    this.$emit('update', value)
                },
            },
            ...mapGetters([
                'detailProject',
            ])
        },
        methods: {
            ...mapMutations([
                'addTask',
            ]),
            addLocalTask () {
                console.log('タスクを追加')
                console.log(this.task)
                this.$axios({
                    url: '/api/task/',
                    method: 'POST',
                    data: this.task,
                })
                .then(res => {
                    console.log(res)
                    this.addTask(res.data)
                })
                .catch(e => {
                    console.log(e)
                })
                this.localTaskDialog = false
                this.init()
            },
            create_task_info (key, value) {
                this.task[key] = value
            },
            init () {
                this.task = {
                    project_id: 0,
                    section_id: 0,
                    content: '',
                    comment: '',
                    deadline_str: '',
                    remind_str: '',
                    priority: '1',
                    label_list: [],
                }
            }
        },
    }

</script>
<style lang='scss' scoped>
    .task_dialog_wrap {
        height: 300px;
        .task_dialog_task_area_wrap {
            height: 185px;
            margin-bottom: 30px;
        }
        .task_dialog_task_input_area {
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
