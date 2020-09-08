<template>
    <div>
        <h1>KarmaResult</h1>
        <p>あなたのランク : {{ info.rank }}</p>
        <p>{{ info.msg }}</p>
        <p>カルマ合計値 : {{ info.totalPoint }}</p>
    </div>
</template>

<script>
    export default {
        name: 'KarmaResult',
        components: {
        },
        data: () => ({
            info: {
                rank: '',
                msg: '',
                totalPoint: 0,
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
</style>
