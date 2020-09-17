<template>
    <v-container fluid>
        <v-row>
            <v-col cols='4'>
                <v-card>
                    <v-card-title class='pb-0'>状態</v-card-title>
                    <ReactiveDoughnut v-if='load' class='pa-4 mx-auto' :chart-data='taskStatusData' :options='options'/>
                </v-card>
            </v-col>
            <v-col cols='8'>
                <v-card>
                    <v-card-title class='pb-0'>カテゴリー</v-card-title>
                    <ReactiveBar v-if='load' class='graph pa-4 mx-auto' :chart-data='categoryTaskData'/>
                </v-card>
                <v-card>
                    <v-card-title class='pb-0'>優先度</v-card-title>
                    <ReactiveBar v-if='load' class='graph pa-4 mx-auto' :chart-data='priorityTaskData'/>
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
        name: 'Graph',
        components: {
            ReactiveBar,
            ReactiveDoughnut,
        },
        data: () => ({
        	load: false,
        	options: {
        		tooltips: {
        			enabled: true,
        		}
        	},
            // テスト用データ
            taskStatusData: {
            	labels: ['未完了', '完了'],
                datasets: [
                    {
                        data: [],
                        backgroundColor: [
                            '#e8e8e8',
                            '#376892',
                        ],
                        borderColor: 'transparent'
                    },
                ]
            },
            categoryTaskData: {
            	labels: [],
            	datasets: [
            		{
            			label: 'カテゴリー',
            			data: [],
                        backgroundColor: [
                            '#00BCD4',
                            '#F44336',
                            '#3F51B5',
                            '#009688',
                            '#FF9800',
                        ],
            		}
            	],
            },
            priorityTaskData: {
                labels: [],
                datasets: [
                    {
                        label: '優先度',
                        data: [],
                        backgroundColor: [
                            '#F44336',
                            '#3F51B5',
                            '#FF9800',
                            '#607D8B',
                            '#E91E63',
                        ],
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
        		console.log(res)
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
                    clone.labels.push(key)
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
