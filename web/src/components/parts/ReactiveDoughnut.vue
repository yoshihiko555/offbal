<script>
    import { Doughnut, mixins } from 'vue-chartjs'
    import Chart from 'chart.js'
    const { reactiveProp } = mixins

    export default {
        extends: Doughnut,
        name: 'ReactiveDoughnut',
        mixins: [reactiveProp],
        data: () => ({
            options: {
            	responsive: true,
            	tooltips: {
            		enabled: false,
            	}
            }
        }),
        mounted () {
        	const self = this
        	this.addPlugin({
        		afterDraw (chart, go) {
            		const ctx = chart.ctx
                    const fontsize = 20
                    const fontstyle = 'normal'
                    const fontFamily = 'Helvetica Neue'
                    ctx.fillStyle = '#000'
                    ctx.font = Chart.helpers.fontString(fontsize, fontstyle, fontFamily)
                    ctx.textAlign = 'center'
                    ctx.textBaseline = 'middle'
                    ctx.fillText(
                    		`${self.chartData.datasets[0].data[0]}/${self.chartData.datasets[0].data[1]}`,
                    		chart.width / 2,
                    		chart.height / 2
                    )
        		}
        	})
            this.renderChart(this.chartData, this.options)
        }
    }
</script>

<style lang="scss" scoped>
</style>
