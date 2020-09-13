<template>
    <div>
        <v-tooltip
            v-if="isSelected"
            top
            activator="#label_btn"
            z-index=99000
            open-delay=250
        >
            <span>{{ labelValue }}</span>
        </v-tooltip>
        <v-tooltip
            v-else
            top
            activator="#label_btn"
            z-index=99000
            open-delay=250
        >
            <span>ラベルを設定</span>
        </v-tooltip>
        <v-menu
            :close-on-content-click="false"
            offset-x
            rounded="true"
            v-model="menu"
            min-width="350px"
        >
            <template v-slot:activator="{ on, attrs }">
                <div id="label_btn">
                    <v-btn
                        icon
                        v-bind="attrs"
                        v-on="on"
                    >
                        <v-icon
                            :color="labelColor"
                        >mdi-label-multiple-outline</v-icon>
                    </v-btn>
                </div>
            </template>
                <v-card>
                    <v-card-title
                        align="center"
                    >
                        <h5>ラベル設定</h5>
                    </v-card-title>
                    <ValidationObserver v-slot="{ invalid }">
                        <ValidationProvider name="ラベル名" rules="required">
                            <v-row>
                                <v-col cols="8" class="top-left">
                                    <vs-input
                                        v-model="labelData.name"
                                        placeholder="ラベルを追加"
                                        class="add_label_input_area"
                                    >
                                    </vs-input>
                                </v-col>
                                <v-col cols="4" class="top-right">
                                    <vs-button
                                        relief
                                        :disabled="invalid"
                                        class="addLabelBtn"
                                        @click.prevent="create"
                                    >
                                        <i class="bx bxs-paper-plane"></i> 送信
                                    </vs-button>
                                </v-col>
                            </v-row>
                        </ValidationProvider>
                    </ValidationObserver>
                    <v-row>
                        <v-col cols="12" class="middle">
                            <v-card-actions
                                class="label_select_area_wrap"
                            >
                                <vs-select
                                    placeholder='Select Label'
                                    v-model='selectLabelList'
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
                                    >{{ label.name }} {{ label.id }} {{ i }}
                                    </vs-option>
                                </vs-select>
                            </v-card-actions>
                        </v-col>
                    </v-row>
                    <v-row>
                        <v-col cols="12" class="bottom">
                            <v-card-actions>
                                <v-spacer></v-spacer>
                                    <v-btn text @click="close">cancel</v-btn>
                                    <v-btn color="primary" text @click="menu = false">ok</v-btn>
                                <v-spacer></v-spacer>
                            </v-card-actions>
                        </v-col>
                    </v-row>
                </v-card>
        </v-menu>
    </div>
</template>
<script>
    import { mapGetters, mapActions } from 'vuex'
    import { Const } from '@/assets/js/const'
    const Con = new Const()

    export default {
        name: 'LabelBtn',
        components: {},
        props: {
            defaultLabelList: {
                type: Array,
                required: false,
                default: () => ([])
            },
        },
        data: () => ({
            labelColor: Con.NON_ACTIVE_COLOR,
            selectLabelList: [],
            menu: false,
            labelData: {
                name: '',
            }
        }),
        created () {
            for (const i in this.defaultLabelList) {
                this.selectLabelList.push(this.defaultLabelList[i].id)
            }
        },
        mounted: function () {},
        watch: {
            selectLabelList: function (val) {
                this.labelColor = (val.length > 0) ? Con.ACTIVE_COLOR : Con.NON_ACTIVE_COLOR
                this.$eventHub.$emit('create_task_info', 'label_list', val)
            }
        },
        computed: {
            ...mapGetters([
                'labels',
            ]),
            isSelected () {
                return this.selectLabelList.length > 0
            },
            labelValue () {
                // 選択済みのラベルをカンマ区切りで出力
                let res = ''
                let multi = false
                for (const i in this.selectLabelList) {
                    const label = this.labels.filter(label => label.id === this.selectLabelList[i])[0]
                    if (multi) res += ', '
                    res += label.name
                    multi = true
                }
                return res
            }
        },
        methods: {
            ...mapActions([
                'addLabelsAction',
            ]),
            close () {
                this.menu = false
                this.selectLabelList = []
                this.labelData.name = ''
            },
            create () {
                this.$axios({
                	url: '/api/label/',
                	method: 'POST',
                	data: this.labelData,
                })
                .then(res => {
                	console.log(res)
                    this.addLabelsAction(res.data)
                    this.init()
                })
                .catch(e => {
                	console.log(e.response)
                })
            },
            init () {
                this.labelData.name = ''
            }
        },
    }
</script>
<style lang='scss' scoped>
    .vs-select-content::v-deep {
        max-width: initial;
        .vs-select__input {
            width: 100%;
        }
        .vs-select__label--label {
            -webkit-transform: translate(-2px, -28px) !important;
            transform: translate(-2px, -28px) !important;
        }
    }
    .top-left {
        padding: 10px 0 0 30px;
    }
    .top-right {
        padding: 10px 0 0 0;
        position: relative;
        top: -4px;
    }
    .middle {
        padding: 0 20px 0;
    }
    .bottom {
        padding: 0;
    }
    .v-card__title {
        height: 50px;
    }
</style>
