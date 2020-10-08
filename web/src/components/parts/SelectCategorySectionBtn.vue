<template>
    <v-menu
        :close-on-content-click="false"
        bottom
        offset-x
        min-width="250px"
        max-height="400px"
        transition="scroll-y-transition"
        v-model="isShow"
    >
        <template v-slot:activator="{ on, attrs }">
            <v-btn
                icon
                v-bind="attrs"
                v-on="on"
            >
                <v-icon
                >mdi-inbox</v-icon>
            </v-btn>
        </template>
        <v-card>
            <v-card-title>
                <h5>
                    カテゴリーを移動する
                </h5>
            </v-card-title>
            <v-list
                dense
            >
                <vs-input
                    class="px-3 mt-3"
                    size="small"
                    placeholder="カテゴリー名を検索"
                    v-model="filterValue"
                ></vs-input>
                <v-list-item-group>
                    <!-- フィルター絞る前 -->
                    <div v-if="filterValue.length === 0">
                        <div
                            v-for="(category, i) in categories"
                            :key="i"
                        >
                            <v-list-item
                                class="category_name"
                                @click="selectCategory(category)"
                            >
                                <v-icon
                                    class="mr-2"
                                    :color="category.color"
                                >mdi-circle-medium</v-icon>
                                {{ category.name }}
                            </v-list-item>
                            <v-list-item
                                class="pl-8"
                                v-for="(section, i) in category.sections"
                                :key="i"
                                @click="selectSection(section)"
                            >
                                <v-icon
                                    class="mr-2"
                                    color="grey lighten-1"
                                >mdi-rhombus-medium-outline</v-icon>
                                {{ section.name }}
                            </v-list-item>
                        </div>
                    </div>
                    <!-- フィルター絞る前ここまで -->
                    <!-- フィルター絞る -->
                    <div v-else>
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
                                    @click="selectSection(item)"
                                >
                                    <v-icon
                                        class="mr-3"
                                        color="grey lighten-1"
                                    >mdi-square-medium-outline</v-icon>
                                    {{ item.name }}
                                </v-list-item>
                            </div>
                        </div>
                    </div>
                    <!-- フィルター絞るここまで -->
                </v-list-item-group>
            </v-list>
        </v-card>
    </v-menu>
</template>
<script>
    import { Const } from '@/assets/js/const'
    import { mapGetters } from 'vuex'
    const Con = new Const()

    export default {
        name: 'SelectCategorySectionBtn',
        components: {},
        props: {},
        data: () => ({
            filterValue: '',
            filteredItems: [],
            isShow: false,
        }),
        created () {},
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
        },
        computed: {
            ...mapGetters([
                'categories',
            ]),
        },
        methods: {
            filterCategorySectionName (value) {
                // カテゴリー名・セクション名を検索する
                return value.name.indexOf(this.filterValue) === 0
            },
            selectCategory (category) {
                const data = {
                    category_id: category.id,
                    section_id: 0,
                }
                this.$emit('move-category-section', data)
                this.close()
            },
            selectSection (section) {
                const data = {
                    category_id: section.target_category,
                    section_id: section.id,
                }
                this.$emit('move-category-section', data)
                this.close()
            },
            open () {
                this.isShow = true
            },
            close () {
                this.isShow = false
            }
        },
    }
</script>
<style lang="scss" scoped>
    .v-btn {
        width: 0;
        opacity: 0;
        pointer-events: none;
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
