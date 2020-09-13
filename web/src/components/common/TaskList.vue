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
                    @change="checkTask(task)"
                ></vs-checkbox>
            </v-list-item-action>
            <v-list-item-content>
                <v-list-item-title
                    v-text="task.content"
                ></v-list-item-title>
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
                'deleteTask',
                'addCompleteTask',
            ]),
            checkTask (task) {
                this.$axios({
                    url: '/api/task/complete/',
                    method: 'POST',
                    data: {
                        task_id: task.id,
                    }
                })
                .then(res => {
                    console.log(res)
                    setTimeout(this.deleteTask, 600, res.data)
                    setTimeout(this.addCompleteTask, 600, res.data)
                })
                .catch(e => {
                    console.log(e)
                })
            },
        },
    }
</script>

<style lang="scss" scoped>
</style>
