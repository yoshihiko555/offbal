<template>
    <div id='project-list'>
        <h1>{{ project.name }}</h1>
    </div>
</template>

<script>
    export default {
        name: 'DetailProject',
        data: () => ({
        	project: {},
        }),
        created () {
            this.getProject(this.$route.params.id)
        },
        beforeRouteUpdate (to, from, next) {
            if (to.params.id !== from.params.id) this.getProject(to.params.id)
            next()
        },
        computed: {
        },
        methods: {
        	getProject (id) {
                this.$axios({
                    url: `/api/project/${id}/`,
                    method: 'GET'
                })
                .then(res => {
                    console.log('プロジェクト詳細', res)
                    this.project = res.data
                    // Ttile設定
                    this.setTitle(res.data.name)
                })
                .catch(e => {
                    console.log(e)
                })
            },
        },
    }
</script>

<style lang="scss" scoped>
</style>