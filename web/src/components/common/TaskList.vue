<template>
    <v-list>
        <div v-if="tasks.length === 0">
        </div>
        <div v-else>
            <v-list-item
                v-for="task in tasks"
                :key="task.id"
                class="task_content"
            >
                <v-list-item-action
                    class="mr-3 ml-1"
                >
                    <vs-checkbox
                        color="primary"
                        v-model="complete_task_list"
                        :val="task"
                        @change="checkTask(task)"
                    >
                    </vs-checkbox>
                </v-list-item-action>
                <v-list-item-content>
                    <v-list-item-title
                        v-text="task.content"
                        @click="showTaskDetail(task)"
                    ></v-list-item-title>
                    <v-list-item-subtitle
                        v-if="task.sub_tasks.length > 0"
                        @click="showTaskDetail(task)"
                    >
                        {{ restOfSubTasks(task) }}
                    </v-list-item-subtitle>
                </v-list-item-content>
                <TaskMenuBtn
                    :task=task
                />
            </v-list-item>
        </div>
    </v-list>
    <!-- <v-container
        fluid
        class="task_list_wrap"
    >
        <v-card
            flat
        >
            <v-row
                class="task_list_descripion_header"
            >
                <v-col
                    cols="6"
                    class="task_content_description ma-0 pa-0"
                >
                    <v-subheader
                        class="ml-2"
                    >
                        <v-icon>mdi-clipboard-text-outline</v-icon>タスク内容
                    </v-subheader>
                </v-col>
                <v-col
                    cols="3"
                    class="ma-0 pa-0"
                >
                    <v-subheader>
                        <v-icon>mdi-star-outline</v-icon>優先度
                    </v-subheader>
                </v-col>
                <v-col
                    cols="3"
                    class="ma-0 pa-0"
                >
                    <v-subheader>
                        <v-icon>mdi-calendar-clock</v-icon>期限
                    </v-subheader>
                </v-col>
            </v-row>
        </v-card>
        <v-divider></v-divider>
        <v-card
            v-for="task in tasks"
            :key="task.id"
            flat
        >
            <v-row
                class="task_list_row"
                @click="showTaskDetail(task)"
            >
                <v-col
                    cols="6"
                    class="task_content ma-0 pa-0"
                >
                    <vs-checkbox
                        color="primary"
                        v-model="complete_task_list"
                        :val="task"
                        @change="checkTask(task)"
                        class="ma-0 pa-0"
                    >
                    </vs-checkbox>
                    <v-card-text
                        class="ma-0 pa-0"
                    >
                        <v-card-title>
                            {{ task.content }}
                        </v-card-title>
                        <v-card-subtitle
                            v-if="task.sub_tasks.length > 0"
                        >
                            {{ restOfSubTasks(task) }}
                        </v-card-subtitle>
                    </v-card-text>
                </v-col>
                <v-col
                    cols="3"
                >
                    <v-card-text
                        class="ma-0 pa-0"
                    >
                        <v-card-subtitle>
                            優先度{{ task.priority }}
                        </v-card-subtitle>
                    </v-card-text>
                </v-col>
                <v-col
                    cols="3"
                >
                    <v-card-text
                        class="ma-0 pa-0"
                    >
                        <v-card-subtitle>
                            {{ taskDeadline(task) }}
                        </v-card-subtitle>
                    </v-card-text>
                </v-col>
            </v-row>
        </v-card>
    </v-container> -->
</template>

<script>
    import { mapGetters, mapActions } from 'vuex'
    import TaskMenuBtn from '@/components/parts/TaskMenuBtn'
    import _ from 'lodash'

    export default {
        name: 'TaskList',
        components: {
            TaskMenuBtn
        },
        props: [
            'tasks',
        ],
        data: () => ({
            complete_task_list: [],
        }),
        mounted: function () {
        },
    	computed: {
    		...mapGetters([
                'detailCategory',
    		]),
    	},
        methods: {
            ...mapActions([
                'updateCompleteTasksAction',
            ]),
            checkTask: _.debounce(function checkTask (task) {
                this.updateCompleteTasksAction({
                    complete_task_list: this.complete_task_list,
                    completed: 1,
                })
                .then(res => {
                    this.$eventHub.$emit('addCloneCompleteTasks', res.data)
                })
                .catch(e => {
                    console.log(e)
                })
                for (const i in this.complete_task_list) {
                    const completeTask = JSON.stringify(this.complete_task_list[i])
                    const targetTask = JSON.stringify(task)
                    if (completeTask === targetTask) this.closeSameTaskDetail(task)
                }
                this.complete_task_list = []
            }, 400),
            showTaskDetail (task) {
                this.$eventHub.$emit('showTaskDetail', task)
            },
            closeSameTaskDetail (task) {
                this.$eventHub.$emit('closeSameTaskDetail', task)
            },
            restOfSubTasks (task) {
                const subTasks = task.sub_tasks.length
                const completeSubTasks = task.complete_sub_tasks.length
                return completeSubTasks + ' of ' + subTasks + ' task completed.'
            },
            taskDeadline (task) {
                if (task.deadline === '') return '----'
                return task.deadline
            }
        },
    }
</script>

<style lang="scss" scoped>
    .task_content {
        cursor: pointer;
    }
    // .task_list_wrap {
    //     .task_list_descripion_header {
    //         height: 42px;
    //     }
    //     .task_list_row {
    //         cursor: pointer;
    //     }
    //     .task_content {
    //         cursor: pointer;
    //         display: flex;
    //     }
    // }
</style>
