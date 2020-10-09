<!-- アプリカテゴリー詳細画面 -->
<template>
    <div>
        <div id='category-list' class="main_content_wrap" :class="{ 'is-task-drawer': drawer }">
            <div class="detail_category_header">
                <h1 class="category_title">{{ detailCategory.name }}</h1>
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
<!--             <TaskDetail/> -->
        </div>
        <div
            class='today_todo_count_wrap pr-2'
            :class="{ 'today_todo_count_wrap_clicked': drawer}"
        >
            <TodayTaskCountBtn/>
        </div>
    </div>
</template>

<script>
    import _ from 'lodash'
    import FilterBtn from '@/components/parts/FilterBtn'
    import SortBtn from '@/components/parts/SortBtn'
    import CreateSectionBtn from '@/components/parts/CreateSectionBtn'
    import CreateSectionField from '@/components/parts/CreateSectionField'
    import EditSectionField from '@/components/parts/EditSectionField'
    import TaskList from '@/components/common/TaskList'
    import SectionList from '@/components/common/SectionList'
    import CreateTaskField from '@/components/parts/CreateTaskField'
    import CompleteTaskList from '@/components/common/CompleteTaskList'
    import TaskDetail from '@/components/common/TaskDetail'
    import TodayTaskCountBtn from '@/components/parts/TodayTaskCountBtn'

    import { mapGetters, mapActions } from 'vuex'

    export default {
        name: 'DetailCategory',
        components: {
            FilterBtn,
            SortBtn,
            CreateSectionBtn,
            CreateSectionField,
            EditSectionField,
            TaskList,
            SectionList,
            CreateTaskField,
            CompleteTaskList,
            TaskDetail,
            TodayTaskCountBtn,
        },
        data: () => ({
            isCreateBtn: true,        // セクション追加ボタン
            isCreateField: false,     // セクション追加フィールド
            isEditField: false,       // セクション更新フィールド
            drawer: false,
        }),
        created () {
            this.getDetailCategoryAction(this.$route.params.name)
            .then(res => {
                console.log(res)
                this.$eventHub.$emit('cloneCompleteTasks', res.data.complete_tasks)
            })
            .catch(e => {
                console.log(e)
            })
            this.$eventHub.$on('openEdit', this.openEdit)
            this.$eventHub.$on('changeToggleDrawer', this.changeToggleDrawer)
        },
        mounted: function () {
        },
        beforeRouteUpdate (to, from, next) {
            if (to.params.name !== from.params.name) {
                this.getDetailCategoryAction(to.params.name)
                .then(res => {
                    console.log(res)
                    this.$eventHub.$emit('cloneCompleteTasks', res.data.complete_tasks)
                })
                .catch(e => {
                    console.log(e)
                })
            }
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
            changeToggleDrawer (value) {
                this.drawer = value
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
        position: absolute;
        right: 0;
        bottom: 0;
    }
    .today_todo_count_wrap_clicked::v-deep {
        right: $task-detail-width;
        transition: .2s;
        transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
    }
</style>
