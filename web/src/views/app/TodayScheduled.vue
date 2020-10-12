<template>
    <div id='today-list' class='main_content_wrap' :class="{ 'is-task-drawer': drawer }" v-show="loading">
        <h1 class="mb-4">Today<span class="today_date pl-3">{{ todayDate }}</span></h1>
        <div v-show="expiredTasks.length > 0" class="mb-4">
            <p class="ma-0 ml-1">期限切れのタスク</p>
            <TaskList :tasks='expiredTasks' />
            <v-divider/>
        </div>
        <div v-if='todayTasks.length > 0'>
            <p class='ma-0 ml-1'>今日のタスク</p>
            <TaskList :tasks='todayTasks' />
        </div>
        <div v-else>
            <p>今日のタスクはありません。</p>
        </div>
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
        	drawer: false,
        	todayTasks: [],
            expiredTasks: [],
            todayDate: null,
            loading: false,
        }),
        created () {
        	this.$eventHub.$on('changeToggleDrawer', this.changeToggleDrawer)
            const date = new Date()
            this.todayDate = `${date.getMonth() + 1}/${date.getDate()}`
        	this.$axios({
        		url: '/api/task/get_today_tasks/',
        		method: 'GET',
        	})
        	.then(res => {
        		console.log('今日のタスク', res)
        		this.todayTasks = res.data.today_tasks
                this.expiredTasks = res.data.expired_tasks
                this.loading = true
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
    .today_date {
        font-size: 0.8em;
    }
</style>
