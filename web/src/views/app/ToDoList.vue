<template>
    <div id='todo-list'>
<!--         今だけInbox専用のコンポーネント -->
<!--         後で、Project毎にコンポーネントが切り替わるようにする -->
        <h1>Inbox</h1>
        <v-btn @click="openCreateProject">open project dialog</v-btn>
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

        <!-- モーダル読み込み -->
        <CreateProjectDialog
            ref='project'
        />
    </div>
</template>

<script>
    import CreateProjectDialog from '@/components/common/CreateProjectDialog'
    import FilterBtn from '@/components/parts/FilterBtn'
    import SortBtn from '@/components/parts/SortBtn'

    export default {
        name: 'Activitys',
        components: {
            CreateProjectDialog,
            FilterBtn,
            SortBtn,
        },
        data: () => ({
        }),
        created () {
        },
        computed: {
        },
        methods: {
            openCreateProject () {
                this.$refs.project.open()
            }
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