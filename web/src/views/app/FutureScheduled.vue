<template>
    <div id='future-scheduled-list' class='main_content_wrap' :class="{ 'is-task-drawer': drawer }">
        <h1>FutureScheduled</h1>
        <div
            v-for="(data, key) in futureTasks"
            :key="key"
        >
            <p>{{ key }}</p>
            <TaskList :tasks='data' />
        </div>
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
        		this.futureTasks = this.toListEachDate(res.data)
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
            toListEachDate (data) {
                // 近日中タスクの結果を日付をキーにソートして返却
                // TODO : やり方がダサいので後でリファクタリング
                const res = {}
                for (const d of data) {
                    const date = d.deadline.substr(0, 10)
                    if (!res[date]) res[date] = []
                    res[date].push(d)
                }

                const keys = Object.keys(res)
                keys.sort()
                const re = {}
                for (const key of keys) {
                    re[key] = res[key]
                }
                return re
            },
        },
    }
</script>

<style lang="scss" scoped>
</style>