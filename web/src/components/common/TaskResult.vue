<template>
    <v-container fluid v-if='load'>
        <v-row>
            <v-col cols='6'>
                <v-card>
                    <v-card-title class="py-1">1日のタスク</v-card-title>
                    <ReactiveDoughnut class='pa-4 mx-auto' :chart-data='todayTaskPoint'/>
                </v-card>
            </v-col>
            <v-col cols='6'>
                <v-card>
                    <v-card-title class='pb-0'>状態</v-card-title>
                    <ReactiveDoughnut class='pa-4 mx-auto' :chart-data='taskStatusData' :options='doughnutOptions'/>
                </v-card>
            </v-col>
            <v-col cols='12'>
                <v-card>
                    <v-card-title class='pb-0'>今週のタスク</v-card-title>
                    <ReactiveBar class='pa-4 mx-auto' :chart-data='weekTaskPoint' :height='height'/>
                </v-card>
            </v-col>
            <v-col cols='12'>
                <v-card>
                    <v-card-title class='pb-0'>カテゴリー</v-card-title>
                    <ReactiveBar class='pa-4 mx-auto' :chart-data='categoryTaskData' :height='height'/>
                </v-card>
            </v-col>
            <v-col cols='12'>
                <v-card>
                    <v-card-title class='pb-0'>優先度</v-card-title>
                    <ReactiveBar class='pa-4 mx-auto' :chart-data='priorityTaskData' :height='height'/>
                </v-card>
            </v-col>
        </v-row>
    </v-container>
</template>

<script>
    import ReactiveBar from '@/components/parts/ReactiveBar'
    import ReactiveDoughnut from '@/components/parts/ReactiveDoughnut'
    import _ from 'loadsh'
    import { Const } from '@/assets/js/const'
    const Con = new Const()

    export default {
        name: 'Graph',
        components: {
            ReactiveBar,
            ReactiveDoughnut,
        },
        data: () => ({
            load: false,
            // 棒グラフの最大高さ
            height: 264,
            // ドーナツグラフのカスタムオプション
        	doughnutOptions: {
        		tooltips: {
        			enabled: true,
        		}
            },
            // 一日のタスクポイント
            todayTaskPoint: {
                datasets: [
                    {
                        data: [],
                        backgroundColor: Con.TODAY_TASK_POINT_CONFIG.BACK_GROUND_COLOR,
                        borderColor: 'transparent'
                    },
                ]
            },
            // 現在のタスク完了状況
            taskStatusData: {
            	labels: ['未完了', '完了'],
                datasets: [
                    {
                        data: [],
                        backgroundColor: Con.TASK_STATUS_DATA_CONFIG.BACK_GROUND_COLOR,
                        borderColor: 'transparent'
                    },
                ]
            },
            // 週間タスクポイント
            weekTaskPoint: {
            	labels: Con.WEEK_TASK_POINT_CONFIG.LABELS,
                datasets: [
                    {
                    	label: '週間結果',
                        data: [],
                        backgroundColor: Con.WEEK_TASK_POINT_CONFIG.BACK_GROUND_COLOR,
                    },
                ],
            },
            // カテゴリー別タスクポイント
            categoryTaskData: {
            	labels: [],
            	datasets: [
            		{
            			label: 'カテゴリー',
            			data: [],
                        backgroundColor: Con.CATEGORY_TASK_DATA_CONFIG.BACK_GROUND_COLOR,
            		}
            	],
            },
            // 優先度別タスクポイント
            priorityTaskData: {
                labels: [],
                datasets: [
                    {
                        label: '優先度',
                        data: [],
                        backgroundColor: Con.PRIORITY_TASK_DATA_CONFIG.BACK_GROUND_COLOR,
                    },
                ]
            }
        }),
        created () {
        	this.$axios({
        		url: '/api/task/get_info/',
        		method: 'GET',
        	})
        	.then(res => {
                console.log('タスク情報', res)
                this.setTodayTaskPoint(res.data.today_comp_task_count, res.data.daily_task_number)
                this.setWeekTaskPoint(res.data.week_count_list)
        		this.setTaskStatusData(res.data.incomp_task_count, res.data.comp_task_count)
        		this.setCategoryTaskData(res.data.res_category_tasks)
        		this.setPriorityTaskData(res.data.res_priority_tasks)
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
                for (const i of list) {
                    clone.datasets[0].data.push(i)
                }
                this.weekTaskPoint = clone
            },
        	setTaskStatusData (incomp, comp) {
        	    const clone = _.cloneDeep(this.taskStatusData)
        	    clone.datasets[0].data.push(incomp)
        	    clone.datasets[0].data.push(comp)
        	    this.taskStatusData = clone
        	},
        	setCategoryTaskData (data) {
        		const clone = _.cloneDeep(this.categoryTaskData)
        		for (const [key, val] of Object.entries(data)) {
        			clone.labels.push(key)
        			clone.datasets[0].data.push(val)
        		}
        		this.categoryTaskData = clone
        	},
        	setPriorityTaskData (data) {
        		const clone = _.cloneDeep(this.priorityTaskData)
                for (const [key, val] of Object.entries(data)) {
                    clone.labels.push(`優先度${key}`)
                    clone.datasets[0].data.push(val)
                }
        		this.priorityTaskData = clone
        	}
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
