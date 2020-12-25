<template>
    <div id='today-list' class='main_content_wrap' :class="{ 'is-task-drawer': drawer }" v-show="loading">
        <h1 class="mb-4 today_title">Today<span class="today_date pl-3">{{ todayDate }}</span></h1>
        <div v-show="expiredTasks.length > 0" class="mb-4">
            <p class="ma-0 ml-1 today_subtitle">期限切れのタスク</p>
            <TaskList :tasks='expiredTasks' />
            <v-divider/>
        </div>
        <div v-if='todayTasks.length > 0'>
            <p class='ma-0 ml-1 today_subtitle'>今日締め切りのタスク</p>
            <TaskList :tasks='todayTasks' />
        </div>
        <div v-else>
            <NoTaskMsgArea
                :type=1
            />
        </div>
    </div>
</template>

<script>
    import moment from 'moment'
    import TaskList from '@/components/common/TaskList'
    import NoTaskMsgArea from '@/components/parts/NoTaskMsgArea'

    export default {
        name: 'TodayScheduled',
        components: {
        	TaskList,
            NoTaskMsgArea,
        },
        data: () => ({
        	drawer: false,
        	todayTasks: [],
            createdAtTodayTasks: [],
            expiredTasks: [],
            todayDate: null,
            loading: false,
        }),
        created () {
        	this.$eventHub.$on('changeToggleDrawer', this.changeToggleDrawer)
            const todayDate = moment()
            this.todayDate = todayDate.format('YYYY-MM-DD')
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
    .main_content_wrap {
        padding-left: 5px;
        .today_date {
            font-size: 0.8em;
        }
        .today_title {
            height: 50px;
        }
    }
</style>
