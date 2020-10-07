<template>
    <v-menu
        :close-on-content-click="false"
        offset-x
        transition="slide-y-transition"
        width="600px"
    >
        <template #activator="{ attrs, on }">
            <vs-button
                icon
                relief
                v-bind="attrs"
                v-on="on"
            >
                <i class='bx bx-filter' ></i>
            </vs-button>
        </template>
        <v-card
            flat
        >
            <!--
                カテゴリ選択
                優先度選択
                未完了：タスク、サブタスク
                ラベル検索：選択させる？
            -->
            <!-- <v-container
                fluid
            >
                <v-row>
                    <v-col
                        class="uncompleted_check_wrap"
                        cols="12"
                    >
                        <v-card-actions>
                            <v-card-subtitle
                                class="ml-3"
                            >
                                未完了タスク
                            </v-card-subtitle>
                            <vs-switch
                                class="ml-2"
                                success
                                v-model="isUnCompleted"
                            >
                                <template #off>
                                    <i class='bx bx-x' ></i>
                                </template>
                                <template #on>
                                    <i class='bx bx-check' ></i>
                                </template>
                            </vs-switch>
                        </v-card-actions>
                    </v-col>
                </v-row>
                <v-row>
                    <v-col
                        class="ma-0 pa-0"
                        cols="12"
                    >
                        <v-card-actions>
                            <vs-select
                                placeholder='ラベルを選択してください'
                                v-model='selectedLabelList'
                                multiple
                                filter
                                collapse-chips
                            >
                                <vs-option
                                    v-for='(label, i) in labels'
                                    :key='i'
                                    :label='label.name'
                                    :value='label.id'
                                    filter
                                >{{ label.name }}
                                </vs-option>
                            </vs-select>
                        </v-card-actions>
                    </v-col>
                </v-row>
            </v-container> -->
        </v-card>
    </v-menu>
</template>

<script>
    import { mapGetters } from 'vuex'

    export default {
        name: 'FilterBtn',
        data: () => ({
            selectedLabelList: [],
            isUnCompleted: true,
        }),
        computed: {
            ...mapGetters([
                'labels',
            ]),
        },
        methods: {
            filter () {
                console.log('filter')
            }
        }
    }
</script>

<style lang='scss' scoped>
    .vs-select-content::v-deep {
        max-width: 80%;
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
