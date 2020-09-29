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
                    <v-subheader
                        class="description"
                    >ラベルを設定</v-subheader>
                    <!-- <v-card-title
                        class="mb-3"
                    >
                        <h5>ラベル設定</h5>
                    </v-card-title> -->
                    <!-- <v-divider></v-divider> -->
                    <!-- <v-row>
                        <v-spacer></v-spacer>
                        <v-col cols="7" class="top-left">
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
                                class="addLabelBtn"
                                :disabled="isDisabled"
                                @click="create"
                            >
                                作成
                                <template #animate>
                                    <i class="bx bxs-paper-plane"></i> 送信
                                </template>
                            </vs-button>
                        </v-col>
                    </v-row> -->
                <!-- ラベル選択モード -->
                <div v-if="!isCreateNewLabel">
                    <v-row>
                        <v-spacer></v-spacer>
                        <v-col cols="10" class="middle">
                            <v-card-actions
                                class="label_select_area_wrap"
                            >
                                <vs-select
                                    placeholder='ラベルを選択してください'
                                    v-model='selectedLabelList'
                                    multiple
                                    filter
                                    chips
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
                        <v-spacer></v-spacer>
                    </v-row>
                    <v-row>
                        <v-spacer></v-spacer>
                        <v-col cols="10" class="bottom">
                            <v-card-actions>
                                <vs-button
                                    dark
                                    @click="close"
                                >キャンセル</vs-button>
                                <vs-button
                                    color="primary"
                                    @click="menu = false"
                                >設定</vs-button>
                                <v-spacer></v-spacer>
                                <vs-button
                                    flat
                                    @click="isCreateNewLabel = true"
                                >新規追加</vs-button>
                            </v-card-actions>
                        </v-col>
                        <v-spacer></v-spacer>
                    </v-row>
                </div>
                <!-- ラベル作成モード -->
                <div v-else>
                    <v-row>
                        <v-spacer></v-spacer>
                        <v-col cols="10">
                            <vs-input
                                placeholder="ラベルを新規作成する"
                                v-model="labelData.name"
                                @keypress.prevent.enter.exact="changeCreateLabelSubmitValue"
                                @keyup.prevent.enter.exact="setCreateLabelName"
                            >
                                <template #icon>
                                    <i class="bx bx-label"></i>
                                </template>
                                <template v-if="createLabelDuplicate" #message-danger>
                                    既にこのラベルは作成されています。
                                </template>
                            </vs-input>
                        </v-col>
                        <v-spacer></v-spacer>
                    </v-row>
                    <v-row>
                        <v-spacer></v-spacer>
                        <v-col cols="10" class="bottom">
                            <v-card-actions>
                                <v-spacer></v-spacer>
                                <vs-button
                                    dark
                                    @click="endCreateNewLabel"
                                >キャンセル</vs-button>
                                <vs-button
                                    color="success"
                                    @click="createLabelBtn"
                                    :disabled="createLabelDisabled"
                                >作成</vs-button>
                                <v-spacer></v-spacer>
                            </v-card-actions>
                        </v-col>
                        <v-spacer></v-spacer>
                    </v-row>
                </div>
            </v-card>
        </v-menu>
    </div>
</template>
<script>
    import { mapGetters, mapActions } from 'vuex'
    import { Const } from '@/assets/js/const'
    import _ from 'lodash'
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
            selectedLabelList: [],
            menu: false,
            labelData: {
                name: '',
            },
            isCreateNewLabel: false,
            isLoadingUpdateLabel: false,
            createLabelDuplicationCheck: false,
            createLabelDuplicate: false,
            createLabelSubmitValue: false,
        }),
        created () {
            for (const i in this.defaultLabelList) {
                this.selectedLabelList.push(this.defaultLabelList[i].id)
            }
        },
        mounted: function () {},
        watch: {
            selectedLabelList: function (val) {
                this.labelColor = (val.length > 0) ? Con.ACTIVE_COLOR : Con.NON_ACTIVE_COLOR
                this.$eventHub.$emit('create_task_info', 'label_list', val)
            },
            'labelData.name': _.debounce(function (val) {
                this.createLabelDuplicationCheck = false
                if (this.labelData.name.length === 0) this.createLabelDuplicate = false
                if (this.labelData.name.length > 0) this.checkLabelNameDuplication()
            }, 200),
        },
        computed: {
            ...mapGetters([
                'labels',
            ]),
            isSelected () {
                return this.selectedLabelList.length > 0
            },
            labelValue () {
                // 選択済みのラベルをカンマ区切りで出力
                let res = ''
                let multi = false
                for (const i in this.selectedLabelList) {
                    const label = this.labels.filter(label => label.id === this.selectedLabelList[i])[0]
                    if (multi) res += ', '
                    res += label.name
                    multi = true
                }
                return res
            },
            createLabelDisabled () {
                if (this.labelData.name.length > 0 &&
                    this.createLabelDuplicationCheck) return false
                return true
            }
        },
        methods: {
            ...mapActions([
                'addLabelsAction',
            ]),
            close () {
                this.menu = false
                this.selectedLabelList = []
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
            },
            endCreateNewLabel () {
                this.init()
                this.isCreateNewLabel = false
            },
            createLabelBtn () {
                // ラベル作成の送信ボタンが押されたらラベル作成
                if (this.labelData.name.length === 0) return
                this.isLoadingUpdateLabel = true
                this.$axios({
                    url: '/api/label/',
                    method: 'POST',
                    data: {
                        name: this.labelData.name,
                    }
                })
                .then(res => {
                    this.isLoadingUpdateLabel = false
                    this.selectedLabelList.push(res.data.id)
                    this.addLabelsAction(res.data)
                    this.isCreateNewLabel = false
                })
                .catch(e => {
                    console.log(e)
                })
                this.init()
            },
            changeCreateLabelSubmitValue () {
                this.createLabelSubmitValue = true
            },
            setCreateLabelName () {
                const length = this.labelData.name.length
                if (length === 0 || !this.createLabelSubmitValue || this.createLabelDisabled) return
                this.createLabelBtn()
            },
            checkLabelNameDuplication () {
                this.$axios({
                    url: '/api/label/checkDuplication/',
                    method: 'GET',
                    params: {
                        name: this.labelData.name
                    }
                })
                .then(res => {
                    console.log(res.data)
                    if (res.data.result) {
                        this.createLabelDuplicate = false
                        this.createLabelDuplicationCheck = true
                    } else {
                        this.createLabelDuplicate = true
                    }
                })
                .catch(e => {
                    console.log(e)
                })
            },
        },
    }
</script>
<style lang='scss' scoped>
    .description {
        position: relative;
        top: 4px;
    }
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
    .vs-input-parent::v-deep {
        width: 100%;
        .vs-input {
            width: 100%;
        }
    }
    .top-left {
    }
    .top-right {
        position: relative;
        top: -4px;
    }
    .middle {
        padding: 0;
    }
    .bottom {
        padding: 0;
    }
    .v-card__title {
        height: 50px;
    }
</style>
