<template>
    <v-container fluid>
        <v-row class="mb-2">
            <v-col cols='4'>
                <v-card>
                    <v-card-title class="py-1">次のランク</v-card-title>
                    <ReactiveDoughnut class='graph pa-4 mx-auto' :chart-data='todayKarmaPoint'/>
                </v-card>
            </v-col>
            <v-col cols='4'>
                <v-card>
                    <v-card-title class='pb-0'>今週のタスク</v-card-title>
                    <ReactiveBar class='pa-4 mx-auto' :chart-data='weekKarmaPoint' :height='height'/>
                </v-card>
            </v-col>
            <v-col cols='4'>
                <v-card>
                    <v-card-title class='py-1'>1日のタスク</v-card-title>
                    <ReactiveDoughnut class='graph pa-4 mx-auto' :chart-data='todayKarmaPoint' :height='height'/>
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
                            <p>90</p>
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
                            <p>{{ info.totalPoint }}</p>
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

    export default {
        name: 'KarmaResult',
        components: {
        	ReactiveBar,
        	ReactiveDoughnut,
        },
        data: () => ({
            info: {
                rank: '',
                msg: '',
                totalPoint: 0,
            },
            // テスト用データ
            todayKarmaPoint: {
                datasets: [
                    {
                        data: [2, 5],
                        backgroundColor: [
                            '#376892',
                            '#e8e8e8',
                        ],
                        borderColor: 'transparent'
                    },
                ]
            },
            height: 264,
            weekKarmaPoint: {
            	labels: ['月', '火', '水', '木', '金', '土', '日'],
                datasets: [
                    {
                    	label: '週間結果',
                        data: [10, 5, 3, 4, 5, 10, 9],
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
            this.$axios({
                url: '/api/karma/info/',
                method: 'GET',
            })
            .then(res => {
                console.log(res)
                this.info = res.data
            })
            .catch(e => {
                console.log(e)
            })
        },
    	computed: {
    	},
        methods: {
        },
    }
</script>

<style lang="scss" scoped>
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
