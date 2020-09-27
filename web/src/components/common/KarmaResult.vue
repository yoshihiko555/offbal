<!-- カルマの結果を表示する -->
<template>
    <v-container fluid v-if='load'>
        <v-row class="mb-2 graph_wrap">
            <v-col cols='4'>
                <v-card>
                    <v-card-title class='py-1'>次のランク</v-card-title>
                    <ReactiveDoughnut class='pa-4 mx-auto' :chart-data='karmaRankInfo'/>
                </v-card>
            </v-col>
            <v-col cols='8'>
                <v-card>
                    <v-card-title class='py-1'>カルマの傾向</v-card-title>
                    <ReactiveLine class='pa-4 mx-auto' :chart-data='weekKarmaPoint' :height='height'/>
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
                    <router-link to="/setting/karma/">ゴールの設定</router-link>
                    <router-link to="/myapp/karma/">完了したすべてのタスクを見る</router-link>
                </v-card>
            </v-col>
        </v-row>
    </v-container>
</template>

<script>
    import ReactiveLine from '@/components/parts/ReactiveLine'
    import ReactiveDoughnut from '@/components/parts/ReactiveDoughnut'
    import _ from 'loadsh'
    import { Const } from '@/assets/js/const'
    const Con = new Const()

    export default {
        name: 'KarmaResult',
        components: {
        	ReactiveLine,
        	ReactiveDoughnut,
        },
        data: () => ({
            info: {},
            height: 264,
            load: false,
            karmaRankInfo: {
                datasets: [
                    {
                        data: [],
                        backgroundColor: Con.KARMA_RANK_INFO_CONFIG.BACK_GROUND_COLOR,
                        borderColor: 'transparent'
                    },
                ]
            },
            weekKarmaPoint: {
                labels: Con.WEEK_KARMA_POINT_CONFIG.LABELS,
                datasets: [
                    {
                        label: '週間結果',
                        data: [],
                    }
                ]
            }
        }),
        created () {
            this.$axios({
                url: '/api/karma/get_info/',
                method: 'GET',
            })
            .then(res => {
                console.log('カルマ情報', res)
                this.info = res.data
                this.setKarmaRankInfo(res.data.total_point, res.data.next_point)
                this.setWeekKarmaPoint(res.data.week_karma_point)
                this.load = true
            })
            .catch(e => {
                console.log(e)
            })
        },
    	computed: {
    	},
        methods: {
            setKarmaRankInfo (current, next) {
                const clone = _.cloneDeep(this.karmaRankInfo)
                clone.datasets[0].data.push(current)
                clone.datasets[0].data.push(next)
                this.karmaRankInfo = clone
            },
            setWeekKarmaPoint (data) {
                const clone = _.cloneDeep(this.weekKarmaPoint)
                for (const i of data) {
                    clone.datasets[0].data.push(i)
                }
        		this.weekKarmaPoint = clone
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
