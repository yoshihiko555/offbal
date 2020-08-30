<template>
    <div id='project-list'>
        <h1>{{ project.name }}</h1>
        <CreateSectionField/>
        <div class='operation_btn_wrap pr-2'>
            <FilterBtn/>
            <SortBtn/>
        </div>

        <div class='today_todo_count_wrap pr-2'>
            <vs-button
                icon
                relief
                size="large"
            >
                <i class='bx bx-list-check'></i>2/5
            </vs-button>
        </div>
    </div>
</template>

<script>
    import FilterBtn from '@/components/parts/FilterBtn'
    import SortBtn from '@/components/parts/SortBtn'
    import CreateSectionField from '@/components/parts/CreateSectionField'

    export default {
        name: 'DetailProject',
        components: {
            FilterBtn,
            SortBtn,
            CreateSectionField,
        },
        data: () => ({
            project: {},
            isShow: false,
        }),
        created () {
            this.getProject(this.$route.params.id)
        },
        beforeRouteUpdate (to, from, next) {
            if (to.params.id !== from.params.id) this.getProject(to.params.id)
            next()
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
    .operation_btn_wrap::v-deep {
        position: absolute;
        top: 0;
        right: 0;
        .vs-button {
            display: inline-block;
        }
    }
    .today_todo_count_wrap::v-deep {
        position: absolute;
        right: 0;
        bottom: 0;
    }
</style>