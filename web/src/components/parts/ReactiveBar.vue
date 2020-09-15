<script>
    import { Bar, mixins } from 'vue-chartjs'
    const { reactiveProp } = mixins

    export default {
        extends: Bar,
        name: 'ReactiveChart',
        mixins: [reactiveProp],
        data: () => ({
            options: {
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
            this.renderChart(this.chartData, this.options)
        }
    }
</script>

<style lang="scss" scoped>
</style>
