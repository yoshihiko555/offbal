<template>
    <v-container fluid>
        <v-row>
            <v-col cols='6'>
                <v-card>
                    <v-card-title class='pb-0'>1日のタスク</v-card-title>
                    <ReactiveDoughnut class='graph pa-4 mx-auto' :chart-data='todayKarmaPoint'/>
                </v-card>
            </v-col>
            <v-col cols='6'>
                <v-card>
                    <v-card-title class='pb-0'>今週のタスク</v-card-title>
                    <ReactiveBar class='pa-4 mx-auto' :chart-data='weekKarmaPoint' :height='height'/>
                </v-card>
            </v-col>
        </v-row>
        <v-row>
            <v-col cols='12'>
                <v-card class='pa-4'>
                    <v-row>
                        <v-col cols='4'>
                            <p>あなたのランク</p>
                        </v-col>
                        <v-col cols='8'>
                            <p>{{ info.rank }}</p>
                            </v-col>
                    </v-row>
                    <v-row>
                        <v-col cols='4'>
                            <p>メッセージ</p>
                        </v-col>
                        <v-col cols='8'>
                            <p>{{ info.msg }}</p>
                        </v-col>
                    </v-row>
                    <v-row>
                        <v-col cols='4'>
                            <p>合計値</p>
                        </v-col>
                        <v-col cols='8'>
                            <p>{{ info.totalPoint }}</p>
                        </v-col>
                    </v-row>
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
                            '#90aac1'
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
                            '#376892',
                            '#90aac1',
                            '#90aac1',
                            '#90aac1',
                            '#90aac1',
                            '#90aac1',
                            '#90aac1',
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

</style>
