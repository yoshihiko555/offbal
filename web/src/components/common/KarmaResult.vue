<template>
    <v-container fluid>
        <v-row class="mb-2 graph_wrap">
            <v-col cols='4'>
                <v-card>
                    <v-card-title class="py-1">1日のタスク</v-card-title>
                    <ReactiveDoughnut v-if='load' class='graph pa-4 mx-auto' :chart-data='todayTaskPoint'/>
                </v-card>
            </v-col>
            <v-col cols='4'>
                <v-card>
                    <v-card-title class='pb-0'>今週のタスク</v-card-title>
                    <ReactiveBar v-if='load' class='pa-4 mx-auto' :chart-data='weekTaskPoint' :height='height'/>
                </v-card>
            </v-col>
            <v-col cols='4'>
                <v-card>
                    <v-card-title class='py-1'>次のランク</v-card-title>
                    <ReactiveDoughnut v-if='load' class='graph pa-4 mx-auto' :chart-data='karmaRankInfo'/>
                </v-card>
            </v-col>
        </v-row>
        <v-divider/>
        <v-row class="karma_info_wrap mt-2">
            <v-col cols='8'>
                <v-card class="pa-0">
                    <v-card-title class='text--white'>あなたの生産性</v-card-title>
                    <v-row class="px-4">
                        <v-col cols='4'>
                            <p>あなたのランク</p>
                        </v-col>
                        <v-col cols='8'>
                            <p>{{ info.rank }}</p>
                            </v-col>
                    </v-row>
                    <v-row class="px-4">
                        <v-col cols='4'>
                            <p>次のランクまでのポイント</p>
                        </v-col>
                        <v-col cols='8'>
                            <p>{{ info.up_to_next_point}}</p>
                            </v-col>
                    </v-row>
                    <v-row class="px-4">
                        <v-col cols='4'>
                            <p>メッセージ</p>
                        </v-col>
                        <v-col cols='8'>
                            <p>{{ info.msg }}</p>
                        </v-col>
                    </v-row>
                    <v-row class="px-4">
                        <v-col cols='4'>
                            <p>合計値</p>
                        </v-col>
                        <v-col cols='8'>
                            <p>{{ info.total_point }}</p>
                        </v-col>
                    </v-row>
                </v-card>
            </v-col>
            <v-col cols='4'>
                <v-card flat class="karma_info_link_wrap pa-0">
                    <router-link to="/myapp/karma/">カルマについて</router-link>
                    <router-link to="/myapp/karma/">ゴールの設定</router-link>
                    <router-link to="/myapp/karma/">完了したすべてのタスクを見る</router-link>
                </v-card>
            </v-col>
        </v-row>
    </v-container>
</template>

<script>
    import ReactiveBar from '@/components/parts/ReactiveBar'
    import ReactiveDoughnut from '@/components/parts/ReactiveDoughnut'
    import _ from 'loadsh'

    export default {
        name: 'KarmaResult',
        components: {
        	ReactiveBar,
        	ReactiveDoughnut,
        },
        data: () => ({
            info: {},
            height: 264,
            load: false,
            todayTaskPoint: {
                datasets: [
                    {
                        data: [],
                        backgroundColor: [
                            '#376892',
                            '#e8e8e8',
                        ],
                        borderColor: 'transparent'
                    },
                ]
            },
            karmaRankInfo: {
                datasets: [
                    {
                        data: [],
                        backgroundColor: [
                            '#009688',
                            '#e8e8e8',
                        ],
                        borderColor: 'transparent'
                    },
                ]
            },
            weekTaskPoint: {
            	labels: ['月', '火', '水', '木', '金', '土', '日'],
                datasets: [
                    {
                    	label: '週間結果',
                        data: [],
                        backgroundColor: [
                            '#00BCD4',
                            '#F44336',
                            '#3F51B5',
                            '#009688',
                            '#FF9800',
                            '#607D8B',
                            '#E91E63',
                        ],
                    },
                ],
            }
        }),
        created () {
            this.init()
            this.$axios({
                url: '/api/karma/get_info/',
                method: 'GET',
            })
            .then(res => {
                console.log(res)
                this.info = res.data
                this.setTodayTaskPoint(res.data.today_comp_task_count, res.data.daily_task_number)
                this.setKarmaRankInfo(res.data.total_point, res.data.next_point)
                this.setWeekTaskPoint(res.data.week_count_list)
                this.load = true
            })
            .catch(e => {
                console.log(e)
            })
        },
    	computed: {
    	},
        methods: {
            setTodayTaskPoint (current, total) {
                const clone = _.cloneDeep(this.todayTaskPoint)
                clone.datasets[0].data.push(current)
                clone.datasets[0].data.push(total)
                this.todayTaskPoint = clone
            },
            setKarmaRankInfo (current, next) {
                const clone = _.cloneDeep(this.karmaRankInfo)
                clone.datasets[0].data.push(current)
                clone.datasets[0].data.push(next)
                this.karmaRankInfo = clone
            },
            setWeekTaskPoint (list) {
                const clone = _.cloneDeep(this.weekTaskPoint)
                for (const i in list) {
                    const cnt = list[i]
                    clone.datasets[0].data.push(cnt)
                }
                this.weekTaskPoint = clone
            },
            init () {
                this.init = {}
                this.todayTaskPoint.datasets[0].data = []
                this.karmaRankInfo.datasets[0].data = []
                this.weekTaskPoint.datasets[0].data = []
            }
        },
    }
</script>

<style lang="scss" scoped>
    .graph_wrap::v-deep {
        .v-card {
            min-height: 344px;
        }
    }
    .graph {
        max-width: 300px;
    }
    .karma_info_wrap::v-deep {
        min-height: 300px;
        &>.col .v-card {
            height: 100%;
        }
        .row {
            width: 100%;
            margin: 0;
            padding: 0 16px;

            .col {
                padding: 0 12px;
            }
        }
    }
    .karma_info_link_wrap::v-deep {
        a {
            display: block;
            color: #333;
            text-decoration: none;
            transition: .3s;

            &:hover {
                color: #777;
            }
        }
    }
</style>
