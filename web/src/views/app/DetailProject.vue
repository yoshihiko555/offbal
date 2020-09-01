<template>
    <div id='project-list'>
        <div class="detail_project_header">
            <h1 class="project_title">{{ detailProject.name }}</h1>
            <DetailProjectMenuBtn
                @open-create='isCreate = true'
            />
        </div>

        <TaskList/>

        <SectionList/>

        <CreateSectionBtn
            v-show="!isCreate"
            @open-create='isCreate = true'
        />
        <CreateSectionField
            v-show="isCreate"
            @close-create='isCreate = false'
        />
        <EditSectionField
            v-show="isEdit"
            @close-edit='closeEdit'
        />

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
    import CreateSectionBtn from '@/components/parts/CreateSectionBtn'
    import CreateSectionField from '@/components/parts/CreateSectionField'
    import EditSectionField from '@/components/parts/EditSectionField'
    import DetailProjectMenuBtn from '@/components/parts/DetailProjectMenuBtn'
    import TaskList from '@/components/common/TaskList'
    import SectionList from '@/components/common/SectionList'
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
        },
        data: () => ({
            isCreate: false,
            isEdit: false,
        }),
        created () {
            this.getDetailProjectAction(this.$route.params.id)
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
            closeEdit () {
                this.isCreate = false
                this.isEdit = false
            }
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