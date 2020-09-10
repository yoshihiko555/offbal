<template>
    <div
        class="create_task_field_wrap"
    >
        <v-form
            @submit.prevent
        >
            <v-row
                class="mx-5 mt-5 mb-2"
            >
                <vs-input
                    v-model="task.content"
                    placeholder="新規タスクを追加"
                    @keyup.enter="create"
                >
                </vs-input>
            </v-row>
        </v-form>
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
                deadline_str: '',
                remind_str: '',
                priority: '1',
                label_list: [],
            },
        }),
        created () {
        },
        methods: {
            ...mapMutations([
                'addTask',
            ]),
            create () {
                if (this.task.content.length === 0) return
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
            },
            init () {
                this.task = {
                    category_id: 0,
                    section_id: 0,
                    content: '',
                    comment: '',
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
        .vs-input-parent::v-deep {
            width: 100%;
            .vs-input {
                width: 100%;
            }
        }
    }
</style>
