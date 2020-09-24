<template>
    <div>
        <vs-button
            icon
            relief
            size="large"
            to='/myapp/karma/'
        >
            <i class='bx bx-list-check'></i>{{ currentCnt }}/{{ totalCnt}}
        </vs-button>
    </div>
</template>
<script>
    export default {
        name: 'TodayTaskCountBtn',
        components: {
        },
        data: () => ({
            currentCnt: 0,
            totalCnt: 0,
        }),
        created () {
            this.$axios({
                url: '/api/task/get_info/',
                method: 'GET',
            })
            .then(res => {
                console.log('現在のタスク情報', res)
                this.currentCnt = res.data.today_comp_task_count
                this.totalCnt = res.data.daily_task_number
            })
            .catch(e => {
                console.log(e)
            })
        },
        methods: {
        }
    }
</script>
<style lang="scss" scoped>
</style>
