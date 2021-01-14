<template>
    <div class="sort_btn_wrap">
        <v-menu
            offset-y
            transition="slide-y-transition"
        >
            <template #activator='{ attrs, on }'>
                <vs-button
                    icon
                    relief
                    v-bind='attrs'
                    v-on='on'
                >
                    <i class='bx bx-slider-alt'></i>
                </vs-button>
            </template>

            <v-list>
                <v-list-item
                    v-for='(menu, i) in menus'
                    :key='i'
                    @click='readySort(menu)'
                >
                    <v-list-item-icon class="mr-0">
                        <v-icon small v-text='menu.icon'/>
                    </v-list-item-icon>
                    <v-list-item-title>{{ menu.name }}</v-list-item-title>
                </v-list-item>
            </v-list>
        </v-menu>
        <div v-show='isSort' :class="{'d-flex': isSort}" class="ma-0 align-center">
            <i v-if='isAsc' @click="togleSort" class='bx bx-sort-up btn px-2'></i>
            <i v-else @click="togleSort" class='bx bx-sort-down btn px-2'></i>
            <p class="ma-0 d-inline-block">並び替え順:{{ sortDisp }}</p>
            <i @click='cancelSort' class='bx bx-x btn px-2'></i>
        </div>
    </div>
</template>

<script>
    import { mapGetters, mapMutations, mapActions } from 'vuex'
    import _ from 'lodash'
    import { Const } from '@/assets/js/const'
    const Con = new Const()

    export default {
        name: 'SortBtn',
        props: {
            tasks: {
                type: Array,
                required: true,
                default: () => ([])
            },
        },
        data: () => ({
            menus: Con.SORT_BTN_MENU,
            isSort: false,
            isAsc: true,
            sortDisp: '',
            sortType: '',
        }),
        created () {
            this.$eventHub.$off('initSort')
            this.$eventHub.$on('initSort', this.init)
        },
        computed: {
            // ...mapGetters([
            //     'detailCategory',
            // ])
        },
        methods: {
            ...mapMutations([
                'updateSortedTasks'
            ]),
            // ...mapActions([
            //     'updateCategoryAction',
            // ]),
            sort () {
                this.isAsc = true
                this.$emit('sort-tasks', this.cloneTasks.sort(this.sortBy(this.sortType, this.isAsc)))
            },
        	readySort (menu) {
                this.sortDisp = menu.name
                this.sortType = menu.type
                this.isSort = true
                this.cloneTasks = _.cloneDeep(this.tasks)
                this.sort()
                // this.$axios({
                //     url: `/api/category/${this.detailCategory.id}/order_tasks/`,
                //     method: 'GET',
                //     params: {
                //         ordering_type: type,
                //     }
                // })
                // .then(res => {
                //     console.log(res)
                //     this.updateCategoryAction(res.data)
                // })
                // .catch(e => {
                //     console.log(e)
                // })
            },
            sortBy (type, reverse) {
                // タイプと昇順 or 降順をみて、ソート結果を返却する
                return (a, b) => {
                    const orderBy = reverse ? 1 : -1
                    if (a[type] < b[type]) return orderBy
                    if (a[type] > b[type]) return orderBy * -1
                    return 0
                }
            },
            cancelSort () {
                this.sortType = 'id'
                this.sortDisp = ''
                this.isAsc = false
                this.isSort = false
                const taskList = _.cloneDeep(this.cloneTasks)
                this.updateSortedTasks({
                    task: taskList.sort(this.sortBy(this.sortType, this.isAsc)),
                    route: this.$route.name
                })
                // this.sort()
            },
            togleSort () {
                this.isAsc = !this.isAsc
                this.sort()
            },
            init () {
                this.isAsc = true
                this.isSort = false
                this.sortDisp = ''
                this.sortType = ''
            }
        }
    }
</script>

<style lang='scss' scoped>
    .sort_btn_wrap::v-deep {
        display: contents;

        .btn {
            cursor: pointer;
            font-size: 1.4em;
        }
    }
</style>
