<template>
    <div id='project-list'>
        <div class="detail_project_header">
            <h1 class="project_title">{{ detailProject.name }}</h1>
            <DetailProjectMenuBtn
                @open-create='openCreate'
            />
            <v-spacer/>
            <div class='operation_btn_wrap pr-2'>
                <FilterBtn/>
                <SortBtn/>
            </div>
        </div>

        <CreateTaskField
            :project=detailProject
        />

        <TaskList
            :tasks=detailProject.tasks
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
    import CreateSectionBtn from '@/components/parts/CreateSectionBtn'
    import CreateSectionField from '@/components/parts/CreateSectionField'
    import EditSectionField from '@/components/parts/EditSectionField'
    import DetailProjectMenuBtn from '@/components/parts/DetailProjectMenuBtn'
    import TaskList from '@/components/common/TaskList'
    import SectionList from '@/components/common/SectionList'
    import CreateTaskField from '@/components/parts/CreateTaskField'

    import { mapGetters, mapActions } from 'vuex'

    export default {
        name: 'DetailProject',
        components: {
            FilterBtn,
            SortBtn,
            CreateSectionBtn,
            CreateSectionField,
            EditSectionField,
            DetailProjectMenuBtn,
            TaskList,
            SectionList,
            CreateTaskField,
        },
        data: () => ({
            isCreateBtn: true,        // セクション追加ボタン
            isCreateField: false,     // セクション追加フィールド
            isEditField: false,       // セクション更新フィールド
        }),
        created () {
            this.getDetailProjectAction(this.$route.params.id)
            this.$eventHub.$on('open-edit', this.openEdit)
        },
        beforeRouteUpdate (to, from, next) {
            if (to.params.id !== from.params.id) this.getDetailProjectAction(to.params.id)
            next()
        },
    	computed: {
    		...mapGetters([
                'detailProject',
    		])
    	},
        methods: {
            ...mapActions([
                'getDetailProjectAction',
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
    .detail_project_header {
        display: flex;
        align-items: center;

        .project_title {
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
</style>
