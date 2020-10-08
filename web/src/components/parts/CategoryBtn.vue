<template>
    <div>
        <v-tooltip
            v-if="isSelected"
            top
            activator="#category_btn"
            z-index=99000
            open-delay=250
        >
            <span>{{ categoryName }}</span>
        </v-tooltip>
        <v-tooltip
            v-else
            top
            activator="#category_btn"
            z-index=99000
            open-delay=250
        >
            <span>カテゴリーを選択</span>
        </v-tooltip>
        <v-menu
            :close-on-content-click="false"
            offset-x
            min-width="300px"
            max-height="420px"
            transition="scroll-y-transition"
            v-model="menu"
        >
            <template v-slot:activator="{ on, attrs }">
                <div id="category_btn">
                    <v-btn
                        icon
                        v-bind="attrs"
                        v-on="on"
                    >
                        <v-icon
                            :color="categoryBtnColor"
                        >mdi-inbox</v-icon>
                    </v-btn>
                </div>
            </template>
            <v-card>
                <v-subheader class="description">カテゴリを選択</v-subheader>
                <!-- <v-card-title>
                    <h5>
                        カテゴリー設定
                    </h5>
                </v-card-title> -->
                <!-- <v-divider></v-divider> -->
                <v-list
                    dense
                >
                    <!-- <vs-input
                        class="px-5 mt-3 mb-2"
                        size="small"
                        placeholder="カテゴリー名を検索"
                        v-model="filterValue"
                    ></vs-input> -->
                    <v-list-item-group>
                        <!-- フィルター絞る前 -->
                        <!-- <div v-if="filterValue.length === 0"> -->
                            <div
                                v-for="(category, i) in categories"
                                :key="i"
                            >
                                <v-list-item
                                    class="category_name"
                                    @click="selectCategory(category)"
                                >
                                    <v-icon
                                        class="ml-3 mr-4"
                                        :color="category.color"
                                    >mdi-circle-medium</v-icon>
                                    {{ category.name }}
                                </v-list-item>
                                <v-list-item
                                    class="pl-14"
                                    v-for="(section, i) in category.sections"
                                    :key="i"
                                    @click="selectCategory(section)"
                                >
                                    <v-icon
                                        class="mr-2"
                                        color="grey lighten-1"
                                    >mdi-rhombus-medium-outline</v-icon>
                                    {{ section.name }}
                                </v-list-item>
                            </div>
                        <!-- </div> -->
                        <!-- フィルター絞る前ここまで -->
                        <!-- フィルター絞る -->
                        <!-- <div v-else>
                            <div v-if="filteredItems.length === 0">
                                <v-list-item
                                    class="no_data_available"
                                >
                                    No data available
                                </v-list-item>
                            </div>
                            <div v-else>
                                <div
                                    v-for="(item, i) in filteredItems"
                                    :key="i"
                                >
                                    <v-list-item
                                        v-if="item.isCategory"
                                        class="category_name"
                                        @click="selectCategory(item)"
                                    >
                                        <v-icon
                                            class="mr-2"
                                            :color="item.color"
                                        >mdi-circle-medium</v-icon>
                                        {{ item.name }}
                                    </v-list-item>
                                    <v-list-item
                                        v-else
                                        class="category_name"
                                        @click="selectCategory(item)"
                                    >
                                        <v-icon
                                            class="mr-3"
                                            color="grey lighten-1"
                                        >mdi-square-medium-outline</v-icon>
                                        {{ item.name }}
                                    </v-list-item>
                                </div>
                            </div>
                        </div> -->
                        <!-- フィルター絞るここまで -->
                    </v-list-item-group>
                </v-list>
            </v-card>
        </v-menu>
    </div>
</template>
<script>
    import { Const } from '@/assets/js/const'
    import { mapGetters } from 'vuex'
    const Con = new Const()

    export default {
        name: 'CategoryBtn',
        components: {},
        props: {
            defaultCategoryId: {
                type: Number,
                required: false,
                default: () => (0)
            },
            defaultCategory: {
                type: String,
                required: false,
                default: () => ('')
            },
            defaultSection: {
                type: String,
                required: false,
                default: () => ('')
            },
        },
        data: () => ({
            categoryBtnColor: Con.NON_ACTIVE_COLOR,
            filterValue: '',
            filteredItems: [],
            menu: false,
            category: {
                name: '',
                section: '',
            },
            isSelected: false,
        }),
        created () {
            this.category = {
                name: this.defaultCategory,
                section: this.defaultSection
            }
            this.$eventHub.$emit('create_task_info', 'category_id', this.defaultCategoryId)
        },
        mounted: function () {
        },
        watch: {
            filterValue: function (val) {
                this.filteredItems = []
                if (val.length > 0) {
                    const categoryList = this.categories
                    for (const [k, category] of Object.entries(categoryList)) {
                        if (this.filterCategorySectionName(category)) {
                            this.filteredItems.push(category)
                        }
                        for (const [j, section] of Object.entries(category.sections)) {
                            if (this.filterCategorySectionName(section)) {
                                this.filteredItems.push(section)
                            }
                        }
                    }
                }
            },
            category: {
                handler: function (val) {
                    if (val.name !== '' || val.section !== '') {
                        this.categoryBtnColor = Con.ACTIVE_COLOR
                        this.isSelected = true
                    } else {
                        this.categoryBtnColor = Con.NON_ACTIVE_COLOR
                        this.isSelected = false
                    }
                },
                deep: true
            }
        },
        computed: {
            ...mapGetters([
                'categories',
            ]),
            categoryName () {
                let category = this.category.name
                if (this.category.section !== '') category += '/' + this.category.section
                return category
            }
        },
        methods: {
            selectCategory (value) {
                // カテゴリーを選択
                if (value.isCategory) {
                    this.setCategoryInfo(value)
                    this.$eventHub.$emit('create_task_info', 'category_id', value.id)
                    this.$eventHub.$emit('create_task_info', 'section_id', 0)
                } else {
                    this.setSectionInfo(value)
                    this.selectSection(value)
                }
                this.menu = false
            },
            selectSection (value) {
                // セクションを選択
                if (value.target_category_name !== 'インボックス') {
                    this.$eventHub.$emit('create_task_info', 'category_id', value.target_category)
                }
                this.$eventHub.$emit('create_task_info', 'section_id', value.id)
            },
            filterCategorySectionName (value) {
                // カテゴリー名・セクション名を検索する
                return value.name.indexOf(this.filterValue) === 0
            },
            setCategoryInfo (value) {
                // カテゴリー選択時情報をセット
                this.category = {
                    name: value.name,
                    section: ''
                }
            },
            setSectionInfo (value) {
                // セクション選択時情報をセット
                this.category = {
                    name: value.target_category_name,
                    section: value.name
                }
            }
        },
    }
</script>
<style lang='scss' scoped>
    .description {
        position: relative;
        top: 10px;
    }
    .vs-input-parent::v-deep {
        .vs-input {
            width: 100%;
        }
    }
    .category_name {
        height: 48px;
    }
    .v-card__title {
        height: 50px;
    }
    .no_data_available {
        display: block;
        text-align: center;
        margin: 20px auto 0;
    }
</style>
