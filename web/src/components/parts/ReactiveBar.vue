<script>
    // リアクティブな棒グラフ
    import { Bar, mixins } from 'vue-chartjs'
    const { reactiveProp } = mixins

    export default {
        extends: Bar,
        name: 'ReactiveChart',
        mixins: [reactiveProp],
        props: ['options'],
        data: () => ({
            defaultOptions: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    yAxes: [{
                        ticks: {
                            min: 0,
                            max: 20,
            			}
            		}],
                    xAxes: [{
                    }]
    		    },
		    }
        }),
        mounted () {
            const mergeOptions = { ...this.defaultOptions, ...this.options }
            this.renderChart(this.chartData, mergeOptions)
        }
    }
</script>

<style lang="scss" scoped>
</style>
