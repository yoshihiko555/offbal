<template>
    <v-menu
        offset-x
        :close-on-content-click="false"
        transition="slide-y-transition"
        width="200p"
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
                            placeholder="指定なし"
                            v-model="filterValue.selectedCategory"
                            :state="'success'"
                        >
                            <vs-option
                                v-for="(category, i) in categories"
                                :key="i"
                                :label="category.name"
                                :value="category.name"
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
                            placeholder="指定なし"
                            v-model="filterValue.selectedPriority"
                            chips
                            :state="'primary'"
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
                                :value="label"
                                filter
                            >{{ label.name }}
                            </vs-option>
                        </vs-select>
                    </v-list-item-action>
                </v-list-item>
                <v-list-item v-if="isSearchResult">
                    <v-list-item-content>
                        <v-list-item-subtitle>完了状態 </v-list-item-subtitle>
                    </v-list-item-content>
                    <v-list-item-action>
                        <vs-switch v-model="filterValue.isCompleteTask">
                            <template #off>
                                <i class="bx bx-x"></i> 未完了
                            </template>
                            <template #on>
                                <i class="bx bx-check"></i> 完了
                            </template>
                        </vs-switch>
                    </v-list-item-action>
                </v-list-item>
                <v-list-item>
                    <v-spacer></v-spacer>
                    <v-list-item-action>
                        <vs-button
                            flat
                            circle
                            size="small"
                            @click="init"
                        >検索条件リセット
                        </vs-button>
                    </v-list-item-action>
                    <v-spacer></v-spacer>
                </v-list-item>
            </v-list>
        </v-card>
    </v-menu>
</template>

<script>
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
            priorities: Con.FILTER_OPTION_PRIORIEIES,
            deadlines: Con.FILTER_OPTION_DEADLINES,
            filterValue: {
                selectedPriority: [],
                selectedCategory: [],
                selectedDeadline: [],
                selectedLabelList: [],
                isCompleteTask: false,
            },
        }),
        watch: {
            filterValue: {
                handler: function (val) {
                    this.filter(val)
                },
                deep: true,
            }
        },
        computed: {
            ...mapGetters([
                'categories',
                'labels',
            ]),
        },
        methods: {
            filter (val) {
                if (this.isSearchResult) {
                    this.$eventHub.$emit('filter_search_result', val)
                } else {
                    this.$eventHub.$emit('filter_task_list', val)
                }
            },
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
                this.filterValue.isCompleteTask = ''
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
