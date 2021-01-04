<template>
    <div id='today-list' class='main_content_wrap' :class="{ 'is-task-drawer': drawer }">
        <h1 class="mb-4 today_title">Today<span class="today_date pl-3">{{ todayDate }}</span></h1>
        <div v-if="isLoading">
            <div ref="loadingContent" class="loading_div">
            </div>
        </div>
        <div v-else>
            <div v-show="todaySchedule.expired_tasks.length > 0" class="mb-4">
                <p class="ma-0 ml-1 today_subtitle">期限切れのタスク</p>
                <TaskList :tasks='todaySchedule.expired_tasks' />
                <v-divider/>
            </div>
            <div v-if='todaySchedule.today_tasks.length > 0'>
                <p class='ma-0 ml-1 today_subtitle'>今日締め切りのタスク</p>
                <TaskList :tasks='todaySchedule.today_tasks' />
            </div>
            <div v-else>
                <NoTaskMsgArea
                    :type=1
                />
            </div>
        </div>
    </div>
</template>

<script>
    import moment from 'moment'
    import TaskList from '@/components/common/TaskList'
    import NoTaskMsgArea from '@/components/parts/NoTaskMsgArea'

    import { mapGetters, mapMutations, mapActions } from 'vuex'

    export default {
        name: 'TodaySchedule',
        components: {
        	TaskList,
            NoTaskMsgArea,
        },
        data: () => ({
        	drawer: false,
            createdAtTodayTasks: [],
            todayDate: null,
            isLoading: false,
        }),
        created () {
            this.isLoading = true
            const loading = this.$vs.loading({
                target: this.$refs.loadingContent,
                scale: '0.6',
                text: 'Loading...',
                opacity: '0',
            })
        	this.$eventHub.$off('changeToggleDrawer', this.changeToggleDrawer)
        	this.$eventHub.$on('changeToggleDrawer', this.changeToggleDrawer)
            const todayDate = moment()
            this.todayDate = todayDate.format('YYYY-MM-DD')
            this.getTodaySchedule()
            .then(res => {
                loading.close()
                this.isLoading = false
            })
            .catch(e => {
                loading.close()
            })
        },
        destroyed () {
            this.$eventHub.$off('changeToggleDrawer')
        },
        computed: {
            ...mapGetters([
                'todaySchedule',
            ]),
        },
        methods: {
            ...mapMutations([
            ]),
            ...mapActions([
                'getTodaySchedule',
            ]),
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
