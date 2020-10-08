<template>
    <div id='today-list' class='main_content_wrap' :class="{ 'is-task-drawer': drawer }">
        <h1>Today</h1>
        <TaskList :tasks='todayTasks' />
    </div>
</template>

<script>
    import TaskList from '@/components/common/TaskList'
    export default {
        name: 'TodayScheduled',
        components: {
        	TaskList,
        },
        data: () => ({
        	todayTasks: [],
        	drawer: false,
        }),
        created () {
        	this.$eventHub.$on('change-toggle-drawer', this.changeToggleDrawer)
        	this.$axios({
        		url: '/api/task/get_today_tasks/',
        		method: 'GET',
        	})
        	.then(res => {
        		console.log('今日のタスク', res)
        		this.todayTasks = res.data
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
            },
        },
    }
</script>

<style lang="scss" scoped>
</style>