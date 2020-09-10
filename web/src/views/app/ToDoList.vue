<template>
    <div id='todo-list'>
<!--         今だけInbox専用のコンポーネント -->
<!--         後で、Category毎にコンポーネントが切り替わるようにする -->
        <h1>Inbox</h1>
        <v-btn @click="openCreateCategory">open category dialog</v-btn>
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
        <CreateCategoryDialog
            ref='category'
        />
    </div>
</template>

<script>
    import CreateCategoryDialog from '@/components/common/CreateCategoryDialog'
    import FilterBtn from '@/components/parts/FilterBtn'
    import SortBtn from '@/components/parts/SortBtn'

    export default {
        name: 'Activitys',
        components: {
            CreateCategoryDialog,
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
            openCreateCategory () {
                this.$refs.category.open()
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