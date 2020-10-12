<template>
    <div>
        <v-container
            fluid
            class="ma-0 pa-0 main_content_wrap"
            :class="{ 'is-task-drawer': drawer }"
        >
            <div class="search_result_header_wrap pl-5">
                <v-row>
                    <v-col
                        cols="6"
                        class="ma-0 pa-0"
                    >
                        <h3
                            class="ml-4 search_result_title"
                        >
                            Search Result
                        </h3>
                    </v-col>
                    <v-spacer></v-spacer>
                    <v-col
                        cols="6"
                        class="ma-0 pa-0"
                    >
                        <div class="operation_btn_wrap pl-10">
                            <v-spacer></v-spacer>
                            <FilterBtn
                                :isSearchResult=true
                            />
                            <SortBtn/>
                        </div>
                    </v-col>
                </v-row>
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
                    v-if="!isFilter"
                    :tasks=searchResult
                />
                <TaskList
                    v-else
                    :tasks=filteredSearchResult
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
            searchResult: [],
            isLoading: false,
            drawer: false,
            filteredSearchResult: [],
            isFilter: false,
        }),
        created () {
            // FilterBtnから渡ってきた値で検索結果を絞る
            this.$eventHub.$on('filterSearchResult', this.filterSearchResult)
        },
        mounted: function () {
        	this.$eventHub.$on('changeToggleDrawer', this.changeToggleDrawer)
            this.searchStart(this.$route.query.text)
        },
        watch: {
        },
        computed: {
            taskLength () {
                if (this.isFilter) {
                    return this.filteredSearchResult.length
                }
                return this.searchResult.length
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
            search () {
                this.isLoading = true
                const loading = this.$vs.loading({
                    target: this.$refs.loadingContent,
                    scale: '0.6',
                    text: 'Loading...',
                    opacity: '0',
                })
                this.$axios({
                    url: '/api/search/',
                    method: 'GET',
                    params: {
                        searchText: this.searchText
                    }
                })
                .then(res => {
                    console.log(res)
                    this.searchResult = res.data
                    loading.close()
                    this.isLoading = false
                })
                .catch(e => {
                    console.log(e)
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
                if (this.searchResult.length) {
                    const taskIdList = []
                    for (const i in this.searchResult) {
                        taskIdList.push(this.searchResult[i].id)
                    }
                    queryParams.taskIdList = taskIdList.join()
                }
                console.log(queryParams)
                for (const i in val) {
                    if (val[i] instanceof Array) {
                        if (val[i].length) {
                            queryParams[i] = val[i].join()
                        }
                    } else {
                        queryParams[i] = val[i]
                    }
                }
                this.$axios({
                    url: '/api/task/get_filter_task_list/',
                    method: 'GET',
                    params: {
                        ...queryParams
                    }
                })
                .then(res => {
                    console.log(res)
                    this.filteredSearchResult = res.data
                    this.isFilter = true
                })
                .catch(e => {
                    console.log(e)
                })
            },
            changeToggleDrawer (value) {
                this.drawer = value
            },
        }
    }
</script>
<style lang="scss" scoped>
    .search_result_title {
        padding-top: 18px;
    }
    .operation_btn_wrap::v-deep {
        text-align: end;
        .vs-button {
            display: inline-block;
        }
    }
    .loading_div {
    }
</style>
