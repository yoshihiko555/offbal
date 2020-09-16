<template>
    <v-list>
        <v-list-item
            v-for="task in tasks"
            :key="task.id"
        >
            <v-list-item-action
                class="mr-3 ml-1"
            >
                <vs-checkbox
                    color="primary"
                    v-model="complete_tasks"
                    :val="task.id"
                    @change="checkTask(task)"
                    line-through
                >
                    <!-- <v-list-item-title
                        class="task_content"
                        v-text="task.content"
                    ></v-list-item-title> -->
                </vs-checkbox>
            </v-list-item-action>
            <v-list-item-content>
                <v-list-item-title
                    class="task_content"
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
    </v-list>
</template>

<script>
    import { mapGetters, mapMutations } from 'vuex'
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
            complete_tasks: [],
        }),
        mounted: function () {
        },
    	computed: {
    		...mapGetters([
                'detailCategory',
    		])
    	},
        methods: {
            ...mapMutations([
                'deleteTasks',
                'addCompleteTasks',
            ]),
            checkTask: _.debounce(function checkTask (task) {
                this.$axios({
                    url: '/api/task/complete/',
                    method: 'POST',
                    data: {
                        complete_task_id_list: this.complete_tasks,
                    }
                })
                .then(res => {
                    console.log(res)
                    this.deleteTasks(res.data)
                    this.addCompleteTasks(res.data)
                })
                .catch(e => {
                    console.log(e)
                })
                this.complete_tasks = []
            }, 800),
            showTaskDetail (task) {
                this.$eventHub.$emit('showTaskDetail', task)
            },
            closeTaskDetail () {
                this.$eventHub.$emit('closeTaskDetail')
            },
            restOfSubTasks (task) {
                const subTasks = task.sub_tasks.length
                const completeSubTasks = task.complete_sub_tasks.length
                return completeSubTasks + ' of ' + subTasks + ' task completed.'
            }
        },
    }
</script>

<style lang="scss" scoped>
    .task_content {
        cursor: pointer;
    }
</style>
