<template>
    <div
        class="create_task_field_wrap"
    >
        <ValidationObserver ref="task">
            <v-row
                class="mx-2 mt-5 mb-2"
            >
                <ValidationProvider class="task_input_area" v-slot="{ errors }" name='タスク' rules="max:100">
                    <vs-input
                        v-model="task.content"
                        placeholder="新規タスクを追加"
                        @keyup.enter="create"
                        @keypress="setCreate"
                    >
                        <template #message-danger>
                            {{ errors[0] }}
                        </template>
                    </vs-input>
                </ValidationProvider>
            </v-row>
        </ValidationObserver>
    </div>
</template>

<script>
    import { mapMutations } from 'vuex'
    import DeadLineBtn from '@/components/parts/DeadLineBtn'
    import ReminderBtn from '@/components/parts/ReminderBtn'

    export default {
        name: 'CreateTaskField',
        components: {
            DeadLineBtn,
            ReminderBtn,
        },
        props: {
            category: {
                type: Object,
                required: true
            }
        },
        data: () => ({
            task: {
                category_id: 0,
                section_id: 0,
                content: '',
                comment: '',
                start_time_str: '',
                deadline_str: '',
                remind_str: '',
                priority: '1',
                label_list: [],
            },
            taskSubmitValue: false
        }),
        created () {
            this.$eventHub.$on('initCreateTaskField', this.init)
        },
        methods: {
            ...mapMutations([
                'addTask',
            ]),
            setCreate () {
                this.taskSubmitValue = true
            },
            create () {
                const length = this.task.content.length
                if (length === 0 || length > 100 || !this.taskSubmitValue) return
                this.task.category_id = this.category.id
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
                this.init()
                this.taskSubmitValue = false
            },
            init () {
                this.task = {
                    category_id: 0,
                    section_id: 0,
                    content: '',
                    comment: '',
                    start_time_str: '',
                    deadline_str: '',
                    remind_str: '',
                    priority: '1',
                    label_list: [],
                }
            },
        }
    }
</script>

<style lang='scss' scoped>
    .create_task_field_wrap {
        margin-top: 5px;
        height: 60px;
        .task_input_area {
            width: 100%;
        }
        .vs-input-parent::v-deep {
            width: 100%;
            .vs-input {
                width: 100%;
            }
        }
    }
</style>
