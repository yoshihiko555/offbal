<template>
    <div>
        <v-menu
            offset-x
            left
            transition="slide-x-transition"
            rounded="lg"
        >
            <template #activator="{ attrs, on }">
                <v-btn
                    icon
                    v-bind="attrs"
                    v-on="on"
                >
                    <v-icon color="grey">mdi-dots-horizontal</v-icon>
                </v-btn>
            </template>
            <v-list>
                <v-list-item
                    v-for="(menu, i) in menus"
                    :key="i"
                    @click="menu.call"
                >
                    <v-list-item-icon class="mr-0">
                        <v-icon small v-text="menu.icon"/>
                    </v-list-item-icon>
                    <v-list-item-title>{{ menu.name }}</v-list-item-title>
                </v-list-item>
            </v-list>
        </v-menu>

        <SelectProjectSectionBtn
            @move-project-section='moveProjectSection'
            ref='selectProjectSection'
        />

        <EditTaskDialog
            ref='taskEdit'
        />

    </div>
</template>
<script>
    import { mapActions, mapMutations } from 'vuex'
    import EditTaskDialog from '@/components/common/EditTaskDialog'
    import SelectProjectSectionBtn from '@/components/parts/SelectProjectSectionBtn'

    export default {
        name: 'TaskMenuBtn',
        components: {
            EditTaskDialog,
            SelectProjectSectionBtn,
        },
        props: {
            task: {
                type: Object,
                requied: true,
            },
        },
        data () {
            return {
                menus: [
                    {
                        name: 'タスクを編集',
                        icon: 'mdi-pencil-outline',
                        call: this.showEditTaskDialog,
                    },
                    {
                        name: 'プロジェクトの移動',
                        icon: 'mdi-arrow-right-circle-outline',
                        call: this.showMoveProjectDialog,
                    },
                    {
                        name: 'タスクの複製',
                        icon: 'mdi-content-copy',
                        call: this.copyTask,
                    },
                    {
                        name: 'タスクの削除',
                        icon: 'mdi-package',
                        call: this.deleteLocalTask,
                    }
                ],
                cloneTask: {},
            }
        },
        created () {
            this.init()
        },
        methods: {
            ...mapMutations([
                'addTask',
                'deleteTask',
            ]),
            ...mapActions([
                'deleteTaskAction',
            ]),
            showEditTaskDialog () {
                this.$refs.taskEdit.open(this.task)
            },
            showMoveProjectDialog () {
                this.$refs.selectProjectSection.open()
            },
            cloneTaskData () {
                const task = this.task
                this.cloneTask = {
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
                    this.cloneTask.label_list.push(task.label[i].id)
                }
            },
            copyTask () {
                this.cloneTaskData()
                this.$axios({
                    url: '/api/task/',
                    method: 'POST',
                    data: this.cloneTask
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
            deleteLocalTask () {
                this.deleteTaskAction(this.task.id)
            },
            init () {
                this.cloneTask = {
                    project_id: 0,
                    section_id: 0,
                    content: '',
                    comment: '',
                    deadline_str: '',
                    remind_str: '',
                    priority: '1',
                    label_list: [],
                }
            },
            createMoveProjectSectionTaskData (projectId, sectionId) {
                this.cloneTask = {
                    project_id: projectId,
                    section_id: sectionId,
                    content: this.task.content,
                    comment: this.task.comment,
                    priority: this.task.priority,
                    label_list: [],
                    deadline_str: this.task.deadline,
                    remind_str: this.task.remind,
                }
                for (const i in this.task.label) {
                    this.cloneTask.label_list.push(this.task.label[i].id)
                }
            },
            moveProjectSection (value) {
                const { target_project: targetProject, target_section: targetSection } = this.task
                const { project_id: projectId, section_id: sectionId } = value
                if (targetProject === projectId && targetSection === sectionId) return
                this.createMoveProjectSectionTaskData(projectId, sectionId)
                this.$axios({
                    url: `/api/task/${this.task.id}/`,
                    method: 'PUT',
                    data: this.cloneTask
                })
                .then(res => {
                    console.log(res)
                    this.addTask(res.data)
                    this.deleteTask(this.task)
                })
                .catch(e => {
                    console.log(e)
                })
                this.init()
            }
        }
    }
</script>
<style lang="scss" scoped>
</style>
