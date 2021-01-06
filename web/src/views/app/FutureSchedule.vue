<template>
    <div id='future-scheduled-list' class='main_content_wrap' :class="{ 'is-task-drawer': drawer }">
        <h1 class="mb-4">FutureSchedule</h1>
        <div v-if="isLoading">
            <div ref="loadingContent" class="loading_div">
            </div>
        </div>
        <div v-else>
            <div v-if="Object.keys(futureSchedule).length > 0">
                <div
                    v-for="(data, key) in futureSchedule"
                    :key="key"
                    class="mb-4 future_subtitle"
                >
                    <p class="ma-0 ml-1">{{ key }}</p>
                    <TaskList :tasks='data' />
                    <v-divider />
                </div>
            </div>
            <div
                v-else
            >
                <NoTaskMsgArea
                    :type=2
                />
            </div>
        </div>
    </div>
</template>

<script>
    import TaskList from '@/components/common/TaskList'
    import NoTaskMsgArea from '@/components/parts/NoTaskMsgArea'

    import { mapGetters, mapMutations, mapActions } from 'vuex'

    export default {
        name: 'FutureSchedule',
        components: {
        	TaskList,
            NoTaskMsgArea,
        },
        data: () => ({
            drawer: false,
            isLoading: false,
        }),
        created () {
        	this.$eventHub.$off('changeToggleDrawer', this.changeToggleDrawer)
        	this.$eventHub.$on('changeToggleDrawer', this.changeToggleDrawer)
            this.isLoading = true
            const loading = this.$vs.loading({
                target: this.$refs.loadingContent,
                scale: '0.6',
                text: 'Loading...',
                opacity: '0',
            })
            this.getFutureSchedule()
            .then(res => {
                console.log('来週までのタスク', res.data)
                this.setFutureSchedule(this.toListEachDate(res.data))
                loading.close()
                this.isLoading = false
            })
            .catch(e => {
                console.log(e)
                loading.close()
            })
        },
        destroyed () {
            this.$eventHub.$off('changeToggleDrawer')
        },
        computed: {
            ...mapGetters([
                'futureSchedule',
            ])
        },
        methods: {
            ...mapMutations([
                'setFutureSchedule',
            ]),
            ...mapActions([
                'getFutureSchedule',
            ]),
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
                console.log(re)
                return re
            },
        },
    }
</script>

<style lang="scss" scoped>
    .main_content_wrap {
        padding-left: 5px;

        .future_subtitle {
            padding-left: 6px;
        }
    }
</style>
