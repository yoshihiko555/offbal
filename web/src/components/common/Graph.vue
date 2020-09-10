<template>
    <v-container fluid>
        <v-row>
            <v-col cols='4'>
                <v-card>
                    <v-card-title class='pb-0'>状態</v-card-title>
                    <ReactiveDoughnut class='pa-4 mx-auto' :chart-data='todayKarmaPoint'/>
                </v-card>
            </v-col>
            <v-col cols='8'>
                <v-card>
                    <v-card-title class='pb-0'>カテゴリー</v-card-title>
                    <ReactiveBar class='graph pa-4 mx-auto' :chart-data='weekKarmaPoint'/>
                </v-card>
                <v-card>
                    <v-card-title class='pb-0'>優先度</v-card-title>
                    <ReactiveBar class='graph pa-4 mx-auto' :chart-data='weekKarmaPoint'/>
                </v-card>
            </v-col>
        </v-row>
    </v-container>
</template>

<script>
    import ReactiveBar from '@/components/parts/ReactiveBar'
    import ReactiveDoughnut from '@/components/parts/ReactiveDoughnut'

    export default {
        name: 'Graph',
        components: {
            ReactiveBar,
            ReactiveDoughnut,
        },
        data: () => ({
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
                ]
            }
        }),
        created () {
        },
    	computed: {
    	},
        methods: {
        },
    }
</script>

<style lang="scss" scoped>
    .graph {
        position: relative;
        width: 35%;
        margin: 15px 0;
    }
</style>
