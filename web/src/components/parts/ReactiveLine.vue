<script>
    // リアクティブな折れ線グラフ
    import { Line, mixins } from 'vue-chartjs'
    const { reactiveProp } = mixins

    export default {
        extends: Line,
        name: 'ReactiveLine',
        mixins: [reactiveProp],
        props: ['options'],
        data: () => ({
            defaultOptions: {
                responsive: true,
                maintainAspectRatio: false,
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
