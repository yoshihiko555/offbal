<template>
    <div id='future-scheduled-list' class='main_content_wrap' :class="{ 'is-task-drawer': drawer }">
        <h1>FutureScheduled</h1>
        <TaskList :tasks='futureTasks' />
    </div>
</template>

<script>
    import TaskList from '@/components/common/TaskList'
    export default {
        name: 'FutureScheduled',
        components: {
        	TaskList,
        },

        data: () => ({
        	futureTasks: [],
        	drawer: false,
        }),
        created () {
        	this.$eventHub.$on('change-toggle-drawer', this.changeToggleDrawer)
        	this.$axios({
        		url: '/api/task/get_future_tasks',
        		method: 'GET',
        	})
        	.then(res => {
        		console.log('来週までのタスク', res)
        		this.futureTasks = res.data
        	})
        	.catch(e => {
        		console.log(e)
        	})
        },
        computed: {
        },
        methods: {
            changeToggleDrawer (value) {
                this.drawer = value
            }
        },
    }
</script>

<style lang="scss" scoped>
</style>