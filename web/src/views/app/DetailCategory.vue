<template>
    <div id='category-list' class="detail_category_wrap" :class="{ 'is-task-drawer': drawer }">
        <div class="detail_category_header">
            <h1 class="category_title">{{ detailCategory.name }}</h1>
            <!-- <DetailCategoryMenuBtn
                @open-create='openCreate'
            /> -->
            <v-spacer/>
            <div class='operation_btn_wrap pr-2'>
                <FilterBtn/>
                <SortBtn/>
            </div>
        </div>

        <CreateTaskField
            :category=detailCategory
        />

        <TaskList
            :tasks=detailCategory.tasks
        />

        <SectionList/>

        <CreateSectionBtn
            v-show="isCreateBtn"
            @open-create='openCreate'
        />
        <CreateSectionField
            v-show="isCreateField"
            @close-create='closeCreate'
        />
        <EditSectionField
            v-show="isEditField"
            ref='edit'
            @close-edit='closeEdit'
        />
        <CompleteTaskList
            :complete_tasks=detailCategory.complete_tasks
        />
        <v-row>
            <v-spacer></v-spacer>
            <div class='today_todo_count_wrap pr-2'>
                <vs-button
                    icon
                    relief
                    size="large"
                    to='/myapp/karma/'
                >
                    <i class='bx bx-list-check'></i>2/5
                </vs-button>
            </div>
        </v-row>
        <TaskDetail
            @toggleDrawer='drawer = !drawer'
        />
    </div>
</template>

<script>
    import FilterBtn from '@/components/parts/FilterBtn'
    import SortBtn from '@/components/parts/SortBtn'
    import CreateSectionBtn from '@/components/parts/CreateSectionBtn'
    import CreateSectionField from '@/components/parts/CreateSectionField'
    import EditSectionField from '@/components/parts/EditSectionField'
    import DetailCategoryMenuBtn from '@/components/parts/DetailCategoryMenuBtn'
    import TaskList from '@/components/common/TaskList'
    import SectionList from '@/components/common/SectionList'
    import CreateTaskField from '@/components/parts/CreateTaskField'
    import CompleteTaskList from '@/components/common/CompleteTaskList'
    import TaskDetail from '@/components/common/TaskDetail'

    import { mapGetters, mapActions } from 'vuex'

    export default {
        name: 'DetailCategory',
        components: {
            FilterBtn,
            SortBtn,
            CreateSectionBtn,
            CreateSectionField,
            EditSectionField,
            DetailCategoryMenuBtn,
            TaskList,
            SectionList,
            CreateTaskField,
            CompleteTaskList,
            TaskDetail,
        },
        data: () => ({
            isCreateBtn: true,        // セクション追加ボタン
            isCreateField: false,     // セクション追加フィールド
            isEditField: false,       // セクション更新フィールド
            drawer: false,
        }),
        created () {
            this.getDetailCategoryAction(this.$route.params.id)
            this.$eventHub.$on('open-edit', this.openEdit)
        },
        beforeRouteUpdate (to, from, next) {
            if (to.params.id !== from.params.id) this.getDetailCategoryAction(to.params.id)
            next()
        },
    	computed: {
    		...mapGetters([
                'detailCategory',
    		])
    	},
        methods: {
            ...mapActions([
                'getDetailCategoryAction',
            ]),
            openCreate () {
                this.isCreateBtn = false
                this.isCreateField = true
            },
            closeCreate () {
                this.isCreateBtn = true
                this.isCreateField = false
            },
            openEdit (section) {
                this.isCreateBtn = false
                this.isEditField = true
                this.$refs.edit.open(section)
            },
            closeEdit () {
                this.isCreateBtn = true
                this.isEditField = false
            },
        },
    }
</script>

<style lang="scss" scoped>
    .detail_category_header {
        display: flex;
        align-items: center;

        .category_title {
            display: inline-block;
        }
    }
    .operation_btn_wrap::v-deep {
        .vs-button {
            display: inline-block;
        }
    }
    .today_todo_count_wrap::v-deep {
        // position: absolute;
        // right: 0;
        // bottom: 0;
    }
    .detail_category_wrap {
        max-width: calc(100% - 10px);
        position: relative;
        transition: .2s;
        transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
    }
    .is-task-drawer {
        margin-right: 500px;
        max-width: calc(100% - 500px);
    }
</style>
