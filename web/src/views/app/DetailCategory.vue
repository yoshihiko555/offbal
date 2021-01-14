<!-- アプリカテゴリー詳細画面 -->
<template>
    <div>
        <div id='category-list' class="main_content_wrap" :class="{ 'is-task-drawer': drawer }">
            <div class="detail_category_header">
                <h1 class="category_title">{{ detailCategory.name }}</h1>
                <v-spacer/>
                <div class='operation_btn_wrap pr-2 text-end'>
                    <FilterBtn/>
                    <SortBtn
                        :tasks='detailCategory.tasks'
                        @sort-tasks='sortTasks'
                    />
                </div>
            </div>

            <CreateTaskField
                :category=detailCategory
            />

            <TaskList
                :tasks=detailCategory.tasks
            />

            <!-- <CompleteTaskList
                :complete_tasks=detailCategory.complete_tasks
            /> -->
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
    import TaskList from '@/components/common/TaskList'
    import CreateTaskField from '@/components/parts/CreateTaskField'
    import CompleteTaskList from '@/components/common/CompleteTaskList'
    import TaskDetail from '@/components/common/TaskDetail'
    import TodayTaskCountBtn from '@/components/parts/TodayTaskCountBtn'
    import NoTaskMsgArea from '@/components/parts/NoTaskMsgArea'

    import { mapGetters, mapMutations, mapActions } from 'vuex'

    export default {
        name: 'DetailCategory',
        components: {
            FilterBtn,
            SortBtn,
            TaskList,
            CreateTaskField,
            CompleteTaskList,
            TaskDetail,
            TodayTaskCountBtn,
            NoTaskMsgArea,
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
                this.$eventHub.$emit('cloneCompleteTasks', res.data.complete_tasks)
            })
            .catch(e => {
            })
            this.$eventHub.$off('openEdit', this.openEdit)
            this.$eventHub.$off('changeToggleDrawer', this.changeToggleDrawer)
            this.$eventHub.$off('displayCompleteTask', this.displayCompleteTask)
            this.$eventHub.$on('openEdit', this.openEdit)
            this.$eventHub.$on('changeToggleDrawer', this.changeToggleDrawer)
            this.$eventHub.$on('changeIsCompletedTask', this.changeIsCompletedTask)
        },
        mounted: function () {
        },
        beforeRouteUpdate (to, from, next) {
            if (to.params.name !== from.params.name) {
                this.getDetailCategoryAction(to.params.name)
                .then(res => {
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
            ...mapMutations([
                'updateIsCompletedTask',
                'updateSortedTasks',
            ]),
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
            sortTasks (val) {
                console.log('sortTasks', val)
                this.updateSortedTasks({
                    task: val,
                    route: this.$route.name
                })
            },
            changeIsCompletedTask (isCompletedTask) {
                this.updateIsCompletedTask({
                    route: this.$route.name,
                    isCompletedTask: isCompletedTask
                })
            }
        },
    }
</script>

<style lang="scss" scoped>
    .main_content_wrap {
        padding-left: 5px;
        .detail_category_header {
            height: 60px;
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
