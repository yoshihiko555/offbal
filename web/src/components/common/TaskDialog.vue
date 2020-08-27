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
            <v-form
                @submit.prevent
            >
                <v-row
                    class="task_dialog_task_area_wrap"
                >
                    <v-col
                        cols="11"
                        class="task_dialog_task_input_area"
                    >
                        <v-textarea
                            class="mt-3"
                            outlined
                            label="例: 英単語、プログラミング、ブログ、読書"
                            v-model="content"
                            rows="5"
                            no-resize
                            :counter="100"
                        ></v-textarea>
                    </v-col>
                    <v-col
                        cols="1"
                    >
                        <DeadLineBtn/>
                        <ProjectBtn/>
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
                            v-model="comment"
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
                            @click="addTask"
                        >タスクを追加</vs-button>
                    </v-col>
                </v-row>
            </v-form>
        </v-container>
    </vs-dialog>
</template>
<script>
    import DeadLineBtn from '@/components/parts/DeadLineBtn'
    import ProjectBtn from '@/components/parts/ProjectBtn'
    import LabelBtn from '@/components/parts/LabelBtn'
    import PriorityBtn from '@/components/parts/PriorityBtn'
    import ReminderBtn from '@/components/parts/ReminderBtn'

    export default {
        name: 'TaskDialog',
        props: {
            taskDialog: {
                type: Boolean,
                required: true
            }
        },
        computed: {
            localTaskDialog: {
                get: function () {
                    return this.taskDialog
                },
                set: function (value) {
                    this.$emit('update', value)
                },
            }
        },
        data: () => ({
            content: '',
            comment: '',
        }),
        components: {
            DeadLineBtn,
            ProjectBtn,
            LabelBtn,
            PriorityBtn,
            ReminderBtn,
        },
        methods: {
            addTask () {
                console.log('addTask')
            }
        }
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
        .task_dialog_add_task_btn {
            width: 100%;
        }
    }
</style>
