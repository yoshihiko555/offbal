<template>
    <v-menu
        offset-x
        :close-on-content-click="false"
        transition="slide-y-transition"
        width="200p"
        v-model="menu"
    >
        <template #activator="{ attrs, on }">
            <vs-button
                icon
                relief
                v-bind="attrs"
                v-on="on"
            >
                <i class="bx bx-filter"></i>
            </vs-button>
        </template>
        <v-card
            flat
        >
            <v-list>
                <v-list-item v-if="isSearchResult">
                    <v-list-item-content>
                        <v-list-item-subtitle>カテゴリ </v-list-item-subtitle>
                    </v-list-item-content>
                    <v-list-item-action>
                        <vs-select
                            v-model="filterValue.selectedCategory"
                            chips
                            filter
                            :state="isMultipleSelectStateSuccess"
                            :multiple="setting.is_multiple_filter"
                        >
                            <vs-option
                                v-for="(category, i) in categories"
                                :key="i"
                                :label="category.name"
                                :value="category.id"
                                :color="categoryColor(category.color)"
                                filter
                            >{{ category.name }}
                            </vs-option>
                        </vs-select>
                    </v-list-item-action>
                </v-list-item>
                <v-list-item>
                    <v-list-item-content>
                        <v-list-item-subtitle>優先度 </v-list-item-subtitle>
                    </v-list-item-content>
                    <v-list-item-action>
                        <vs-select
                            v-model="filterValue.selectedPriority"
                            chips
                            filter
                            :state="isMultipleSelectStatePrimary"
                            :multiple="setting.is_multiple_filter"
                        >
                            <vs-option
                                v-for="(priority, i) in priorities"
                                :key="i"
                                :label="priority.name"
                                :value="priority.value"
                                :color="priority.color"
                                filter
                            >{{ priority.name }}
                            </vs-option>
                        </vs-select>
                    </v-list-item-action>
                </v-list-item>
                <v-list-item>
                    <v-list-item-content>
                        <v-list-item-subtitle>期限 </v-list-item-subtitle>
                    </v-list-item-content>
                    <v-list-item-action>
                        <vs-select
                            placeholder="指定なし"
                            v-model="filterValue.selectedDeadline"
                            chips
                            :state="'danger'"
                        >
                            <vs-option
                                v-for="(deadline, i) in deadlines"
                                :key="i"
                                :label="deadline.name"
                                :value="deadline.value"
                                :color="deadline.color"
                                filter
                            >{{ deadline.name }}
                            </vs-option>
                        </vs-select>
                    </v-list-item-action>
                </v-list-item>
                <v-list-item>
                    <v-list-item-content>
                        <v-list-item-subtitle>ラベル </v-list-item-subtitle>
                    </v-list-item-content>
                    <v-list-item-action>
                        <v-list-item-subtitle
                            v-if="labels.length === 0"
                        >
                            ラベルが存在しません
                        </v-list-item-subtitle>
                        <vs-select
                            v-else
                            v-model="filterValue.selectedLabelList"
                            multiple
                            filter
                            chips
                        >
                            <vs-option
                                v-for="(label, i) in labels"
                                :key="i"
                                :label="label.name"
                                :value="label.id"
                                filter
                            >{{ label.name }}
                            </vs-option>
                        </vs-select>
                    </v-list-item-action>
                </v-list-item>
                <!-- <v-list-item v-if="isSearchResult">
                    <v-list-item-content>
                        <v-list-item-subtitle>完了状態 </v-list-item-subtitle>
                    </v-list-item-content>
                    <v-list-item-action>
                        <vs-switch v-model="filterValue.isCompletedTask">
                            <template #off>
                                <i class="bx bx-x"></i> 未完了
                            </template>
                            <template #on>
                                <i class="bx bx-check"></i> 完了
                            </template>
                        </vs-switch>
                    </v-list-item-action> -->
                        <!-- <vs-radio v-model="filterValue.isCompletedTask" val="1">
                            完了
                        </vs-radio>
                        <vs-radio v-model="filterValue.isCompletedTask" val="2">
                            未完了
                        </vs-radio> -->
                <!-- </v-list-item> -->
                <v-list-item>
                    <v-spacer></v-spacer>
                        <vs-button
                            flat
                            circle
                            size="small"
                            @click="init"
                        >検索条件リセット
                        </vs-button>
                        <vs-button
                            flat
                            circle
                            size="small"
                            @click="menu = false"
                        >OK
                        </vs-button>
                    <v-spacer></v-spacer>
                </v-list-item>
            </v-list>
        </v-card>
    </v-menu>
</template>

<script>
    import _ from 'lodash'
    import { mapGetters } from 'vuex'
    import { Const } from '@/assets/js/const'
    const Con = new Const()

    export default {
        name: 'FilterBtn',
        props: {
            isSearchResult: {
                type: Boolean,
                required: false,
                default: () => (false)
            }
        },
        data: () => ({
            priorities: Con.FILTER_OPTION_PRIORITIES,
            deadlines: Con.FILTER_OPTION_DEADLINES,
            filterValue: {
                selectedPriority: [],
                selectedCategory: [],
                selectedDeadline: [],
                selectedLabelList: [],
                // isCompletedTask: false,
            },
            menu: false,
        }),
        created () {
        },
        watch: {
            filterValue: {
                handler: function (val) {
                    this.filter(val)
                },
                deep: true,
            },
        },
        computed: {
            ...mapGetters([
                'categories',
                'labels',
            ]),
            ...mapGetters('setting', [
                'setting',
            ]),
            isMultipleSelectStateSuccess () {
                if (!this.setting.is_multiple_filter) return 'success'
                return 'false'
            },
            isMultipleSelectStatePrimary () {
                if (!this.setting.is_multiple_filter) return 'primary'
                return 'false'
            }
        },
        methods: {
            filter: _.debounce(function filter (val) {
                if (this.isSearchResult) {
                    // SearchResultで検索結果を絞る
                    this.$eventHub.$emit('filterSearchResult', val)
                } else {
                    // TaskListでタスクリストを絞る
                    this.$eventHub.$emit('filterTaskList', val)
                }
            }, 200),
            categoryColor (color) {
                for (const i in Con.CATEGORY_COLOR) {
                    if (Con.CATEGORY_COLOR[i].color === color) {
                        return Con.CATEGORY_COLOR[i].code
                    }
                }
            },
            init () {
                this.filterValue.selectedPriority = []
                this.filterValue.selectedCategory = []
                this.filterValue.selectedDeadline = []
                this.filterValue.selectedLabelList = []
                // this.filterValue.isCompletedTask = false
            }
        }
    }
</script>

<style lang='scss' scoped>
    .vs-select-content::v-deep {
        max-width: 100%;
        margin: 0 auto;
        .vs-select__input {
            width: 100%;
        }
        .vs-select__label--label {
            -webkit-transform: translate(-2px, -28px) !important;
            transform: translate(-2px, -28px) !important;
        }
    }
    .uncompleted_check_wrap {
        margin: 0 auto;
        padding: 0;
    }
</style>
