<template>
    <div>
        <v-container
            fluid
            class="ma-0 pa-0 main_content_wrap"
            :class="{ 'is-task-drawer': drawer }"
        >
            <div class="search_result_header_wrap pl-5">
                <div class="search_result_header">
                <!-- <v-row class="search_result_header">
                    <v-col
                        cols="9"
                        class="ma-0 pa-0"
                    > -->
                        <h3 class="search_result_title">Search Result</h3>
                    <!-- </v-col>
                    <v-spacer></v-spacer>
                    <v-col
                        cols="3"
                        class="ma-0 pa-0"
                    > -->
                        <v-spacer/>
                        <div class="operation_btn_wrap pr-2 text-end">
                            <!-- <v-spacer></v-spacer> -->
                            <FilterBtn
                                :isSearchResult=true
                            />
                            <SortBtn
                                :tasks=searchResult.tasks
                                @sort-tasks='sortTasks'
                            />
                        </div>
                    <!-- </v-col>
                </v-row> -->
                </div>
                <v-row>
                    <v-col
                        cols="12"
                        class="ma-0 pa-0"
                    >
                        <v-subheader>
                            {{ taskLength }} tasks
                        </v-subheader>
                    </v-col>
                </v-row>
                <div class="pb-2"></div>
                <v-divider></v-divider>
                <div class="pb-2"></div>
            </div>
            <div v-if="isLoading">
                <div ref="loadingContent" class="loading_div">
                </div>
            </div>
            <div v-else>
                <TaskList
                    :tasks=searchResult.tasks
                />
            </div>
        </v-container>
    </div>
</template>
<script>
    import TaskList from '@/components/common/TaskList'
    import FilterBtn from '@/components/parts/FilterBtn'
    import SortBtn from '@/components/parts/SortBtn'
    import Loading from '@/components/parts/Loading'

    import { mapGetters, mapMutations, mapActions } from 'vuex'

    export default {
        name: 'SearchResult',
        props: {
        },
        components: {
            TaskList,
            FilterBtn,
            SortBtn,
            Loading,
        },
        data: () => ({
            searchText: '',
            // searchResult: [],
            isLoading: false,
            drawer: false,
        }),
        created () {
            // FilterBtnから渡ってきた値で検索結果を絞る
            this.$eventHub.$off('filterSearchResult')
            this.$eventHub.$on('filterSearchResult', this.filterSearchResult)
        },
        mounted: function () {
        	this.$eventHub.$off('changeToggleDrawer')
        	this.$eventHub.$on('changeToggleDrawer', this.changeToggleDrawer)
            this.searchStart(this.$route.query.text)
        },
        watch: {
        },
        computed: {
            ...mapGetters([
                'searchResult',
            ]),
            taskLength () {
                // ロード中は0件を返す
                if (this.isLoading || this.searchResult.tasks === undefined) return 0
                return this.searchResult.tasks.length
            }
        },
        beforeRouteUpdate (to, from, next) {
            this.searchStart(to.query.text)
            next()
        },
        destroyed () {
            this.$eventHub.$off('filterSearchResult')
        },
        methods: {
            ...mapMutations([
                'setSearchResult',
                'updateIsCompletedTask',
                'updateSortedTasks',
            ]),
            ...mapActions([
                'getSearchResultAction',
                'getFilteredSearchResult',
            ]),
            search () {
                this.isLoading = true
                const loading = this.$vs.loading({
                    target: this.$refs.loadingContent,
                    scale: '0.6',
                    text: 'Loading...',
                    opacity: '0',
                })
                this.getSearchResultAction(this.searchText)
                .then(res => {
                    console.log('検索結果', res.data)
                    this.setSearchResult(res.data)
                    loading.close()
                    this.isLoading = false
                })
                .catch(e => {
                    loading.close()
                })
            },
            searchStart (text) {
                this.searchText = text
                this.search()
            },
            filterSearchResult (val) {
                // FilterBtnから渡ってきた値で検索結果を絞る
                const queryParams = {}
                this.changeSearchIsCompletedTask(val.isCompletedTask)
                queryParams.searchText = this.searchText
                for (const i in val) {
                    if (val[i] instanceof Array) {
                        if (val[i].length) {
                            queryParams[i] = val[i].join()
                        }
                    } else {
                        queryParams[i] = val[i]
                    }
                }
                this.getFilteredSearchResult(queryParams)
                .then(res => {
                    this.$eventHub.$emit('updateTaskListCompleteTasks', res.data)
                })
            },
            changeToggleDrawer (value) {
                this.drawer = value
            },
            changeSearchIsCompletedTask (isCompletedTask) {
                this.updateIsCompletedTask({
                    route: this.$route.name,
                    isCompletedTask: isCompletedTask
                })
            },
            sortTasks (val) {
                console.log('sortTasks', val)
                this.updateSortedTasks({
                    task: val,
                    route: this.$route.name
                })
            },
        }
    }
</script>
<style lang="scss" scoped>
    .search_result_header {
        height: 60px;
        display: flex;
        // align-items: center;
        // width: 100%;
        margin: 0;
        padding: 0;
    }
    .search_result_title {
        padding-top: 10px;
        display: inline-block;
    }
    .operation_btn_wrap::v-deep {
        // text-align: end;
        .vs-button {
            display: inline-block;
        }
    }
    .loading_div {
    }
</style>
