<template>
    <div v-if="complete_tasks.length === 0">
    </div>
    <div v-else>
        <v-list>
            <v-list-group>
                <template #activator>
                    <v-list-item-icon class="mr-2 ml-0">
                        <v-icon>mdi-file-check-outline</v-icon>
                    </v-list-item-icon>
                    <v-list-item-content>
                        <v-list-item-title>
                            完了タスク一覧
                        </v-list-item-title>
                    </v-list-item-content>
                </template>
                <v-list-item
                    v-for="(task, i) in complete_tasks"
                    :key="i"
                    class="ml-3"
                >
                    <vs-checkbox
                        v-model="localCompleteTasks"
                        :val="task"
                        success
                        @change="unCheckTask($event, task)"
                        line-through
                    >
                        <v-list-item-content>
                            <v-list-item-title
                                class="ml-3"
                            >
                                {{ task.content }}
                            </v-list-item-title>
                            <!-- <v-list-item-subtitle
                                v-if="task.sub_tasks.length > 0"
                                class="ml-3"
                            >
                                {{ restOfSubTasks(task) }}
                            </v-list-item-subtitle> -->
                        </v-list-item-content>
                    </vs-checkbox>
                    <!-- <v-list-item-content>
                        <v-list-item-title
                            class="ml-3"
                        >
                            {{ task.content }}
                        </v-list-item-title>
                        <v-list-item-subtitle
                            v-if="task.sub_tasks.length > 0"
                            class="ml-3"
                        >
                            {{ restOfSubTasks(task) }}
                        </v-list-item-subtitle>
                    </v-list-item-content> -->
                </v-list-item>
                <!-- <v-container
                    fluid
                    class="complete_task_list_wrap"
                >
                    <v-card
                        flat
                    >
                        <v-row
                            class="complete_task_list_descripion_header"
                        >
                            <v-col
                                cols="8"
                                class="complete_task_content_description ma-0 pa-0"
                            >
                                <v-subheader
                                    class="ml-1"
                                >
                                    <v-icon>mdi-clipboard-text-outline</v-icon>内容
                                </v-subheader>
                            </v-col>
                            <v-col
                                cols="4"
                                class="ma-0 pa-0"
                            >
                                <v-subheader
                                >
                                    <v-icon>mdi-calendar</v-icon>完了日時
                                </v-subheader>
                            </v-col>
                        </v-row>
                    </v-card>
                    <v-divider></v-divider>
                    <v-card
                        v-for="(task, i) in complete_tasks"
                        :key="i"
                        flat
                    >
                        <v-row
                            class="complete_task_list_row"
                        >
                            <v-col
                                cols="8"
                                class="complete_task_content ma-0 pa-0"
                            >
                                <vs-checkbox
                                    color="primary"
                                    v-model="localCompleteTasks"
                                    :val="task"
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
                                cols="4"
                            >
                                <v-card-text
                                    class="ma-0 pa-0"
                                >
                                    <v-card-subtitle>
                                        {{ task.completed_at }}
                                    </v-card-subtitle>
                                </v-card-text>
                            </v-col>
                        </v-row>
                        <v-divider></v-divider>
                    </v-card>
                </v-container> -->
            </v-list-group>
        </v-list>
    </div>
</template>
<script>
    import { globalMixins } from '@/mixins'
    import _ from 'lodash'
    import { mapActions } from 'vuex'

    export default {
        name: 'CompleteTaskList',
        components: {},
        props: {
            complete_tasks: {
                type: Array,
                required: false,
                default: () => ([])
            },
        },
        data: () => ({
            beforeCompleteTasks: [],
            localCompleteTasks: [],
        }),
        created () {
            this.$eventHub.$off('cloneCompleteTasks', this.cloneCompleteTasks)
            this.$eventHub.$off('addCloneCompleteTasks', this.addCloneCompleteTasks)
            this.$eventHub.$on('cloneCompleteTasks', this.cloneCompleteTasks)
            this.$eventHub.$on('addCloneCompleteTasks', this.addCloneCompleteTasks)
        },
        mounted: function () {
        },
        computed: {
        },
        methods: {
            ...mapActions([
                'updateCompleteTasksAction',
            ]),
            unCheckTask: _.debounce(function unCheckTask (e, task) {
                const sortedBeforeCompleteTasks = this.objectArraySort(this.beforeCompleteTasks, 'id', 'asc')
                const sortedLocalCompleteTasks = this.objectArraySort(this.localCompleteTasks, 'id', 'asc')
                const beforeCompleteTasks = JSON.stringify(sortedBeforeCompleteTasks)
                const nowCompleteTasks = JSON.stringify(sortedLocalCompleteTasks)
                const deleteCompleteTasks = []
                if (beforeCompleteTasks !== nowCompleteTasks) {
                    for (const i in sortedBeforeCompleteTasks) {
                        let isExists = false
                        const beforeCompleteTask = sortedBeforeCompleteTasks[i]
                        for (const j in sortedLocalCompleteTasks) {
                            if (beforeCompleteTask.id === sortedLocalCompleteTasks[j].id) isExists = true
                        }
                        if (!isExists) deleteCompleteTasks.push(beforeCompleteTask)
                    }
                }
                this.updateCompleteTasksAction({
                    complete_task_list: deleteCompleteTasks,
                    completed: 0,
                    route: this.$route.name
                })
                this.beforeCompleteTasks = _.cloneDeep(this.localCompleteTasks)
            }, 400),
            cloneCompleteTasks (tasks) {
                this.beforeCompleteTasks = _.cloneDeep(tasks)
                this.localCompleteTasks = _.cloneDeep(tasks)
            },
            addCloneCompleteTasks (tasks) {
                for (const i in tasks) {
                    this.beforeCompleteTasks.push(tasks[i])
                    this.localCompleteTasks.push(tasks[i])
                }
            },
            restOfSubTasks (task) {
                const subTasks = task.sub_tasks.length
                const completeSubTasks = task.complete_sub_tasks.length
                return completeSubTasks + ' of ' + subTasks + ' task completed.'
            }
        },
        mixins: [globalMixins]
    }
</script>
<style lang="scss" scoped>
    .complete_task_list_wrap {
        .complete_task_list_descripion_header {
            height: 42px;
        }
        .complete_task_list_row {
            cursor: pointer;
        }
        .complete_task_content {
            display: flex;
        }
    }
</style>
