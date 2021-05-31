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
                <v-card class="label_btn_wrap">
                    <v-subheader
                        class="description"
                    >ラベルを設定</v-subheader>
                <!-- ラベル選択モード -->
                <div v-if="!isCreateNewLabel && !nonLabel">
                    <v-row class="label_input_area">
                        <v-spacer></v-spacer>
                        <v-col cols="10" class="pa-0">
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
                        <v-col cols="10" class="pa-0">
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
                    <ValidationObserver ref="label" v-slot="{ invalid }">
                        <v-row class="label_input_area">
                            <v-spacer></v-spacer>
                            <v-col cols="10" class="pa-0">
                                <ValidationProvider v-slot="{ errors }" name="ラベル" rules="max:20">
                                    <vs-input
                                        placeholder="ラベルを新規作成する"
                                        v-model="labelData.name"
                                        @keypress.prevent.enter.exact="changeCreateLabelSubmitValue"
                                        @keyup.prevent.enter.exact="setCreateLabelName"
                                    >
                                        <template #icon>
                                            <i class="bx bx-label"></i>
                                        </template>
                                        <template
                                            v-if="createLabelDuplicate"
                                            #message-danger
                                        >既にこのラベルは作成されています。
                                        </template>
                                        <template
                                            v-else
                                            #message-danger
                                        >{{ errors[0] }}
                                        </template>
                                    </vs-input>
                                </ValidationProvider>
                            </v-col>
                            <v-spacer></v-spacer>
                        </v-row>
                        <v-row>
                            <v-spacer></v-spacer>
                            <v-col cols="10" class="pa-0">
                                <v-card-actions>
                                    <vs-button
                                        dark
                                        @click="endCreateNewLabel"
                                    >キャンセル</vs-button>
                                    <vs-button
                                        color="success"
                                        @click="createLabelBtn"
                                        :disabled="createLabelDisabled || invalid"
                                    >作成</vs-button>
                                </v-card-actions>
                            </v-col>
                            <v-spacer></v-spacer>
                        </v-row>
                    </ValidationObserver>
                </div>
            </v-card>
        </v-menu>
        <!-- <CreateLabelDialog
            @update="createLabelConfirm = $event"
            :createLabelConfirm="createLabelConfirm"
            :labelContent="labelData.name"
        /> -->
    </div>
</template>
<script>
    import { mapGetters, mapActions } from 'vuex'
    import { Const } from '@/assets/js/const'
    import _ from 'lodash'
    import CreateLabelDialog from '@/components/parts/CreateLabelDialog'
    const Con = new Const()

    export default {
        name: 'LabelBtn',
        components: {
            CreateLabelDialog,
        },
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
            createLabelConfirm: false,
        }),
        created () {
            for (const i in this.defaultLabelList) {
                this.selectedLabelList.push(this.defaultLabelList[i].id)
            }
            this.$eventHub.$off('confirmCreateLabelContent', this.confirmCreateLabelContent)
            this.$eventHub.$on('confirmCreateLabelContent', this.confirmCreateLabelContent)
        },
        mounted: function () {
        },
        watch: {
            selectedLabelList: function (val) {
                this.labelColor = (val.length > 0) ? Con.ACTIVE_COLOR : Con.NON_ACTIVE_COLOR
                this.$eventHub.$emit('createTaskInfo', 'label_list', val)
            },
            'labelData.name': _.debounce(function (val) {
                this.createLabelDuplicationCheck = false
                if (this.labelData.name.length === 0) this.createLabelDuplicate = false
                if (this.labelData.name.length > 0) this.checkLabelNameDuplication()
            }, 200),
            menu: function (val) {
                if (!val) setTimeout(this.init, 150)
            }
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
            },
            nonLabel () {
                if (this.labels.length === 0) return true
                return false
            },
        },
        methods: {
            ...mapActions([
                'addLabelAction',
            ]),
            confirmCreateLabelContent () {
                this.createLabelBtn()
                this.createLabelConfirm = false
            },
            showConfirmCreateLabelDialog () {
                this.createLabelConfirm = true
            },
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
                    this.addLabelAction(res.data)
                    this.init()
                })
                .catch(e => {
                	console.log(e.response)
                })
            },
            init () {
                this.labelData.name = ''
                this.isCreateNewLabel = false
            },
            endCreateNewLabel () {
                if (this.nonLabel) {
                    this.menu = false
                } else {
                    this.isCreateNewLabel = false
                }
                this.init()
            },
            createLabelBtn () {
                // ラベル作成の送信ボタンが押されたらラベル作成
                const length = this.labelData.name.length
                if (length === 0 || length > 20) return
                this.isLoadingUpdateLabel = true

                this.addLabelAction({
                    name: this.labelData.name
                })
                .then(res => {
                    this.isLoadingUpdateLabel = false
                    this.init()
                    this.selectedLabelList.push(res.data.id)
                })
                .catch(e => {
                    console.log(e)
                })
            },
            changeCreateLabelSubmitValue () {
                this.createLabelSubmitValue = true
            },
            setCreateLabelName () {
                const length = this.labelData.name.length
                if (length === 0 || !this.createLabelSubmitValue || this.createLabelDisabled) return
                this.createLabelBtn()
                // this.showConfirmCreateLabelDialog()
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
        height: 100%;
        .vs-input {
            width: 100%;
        }
    }
    .label_btn_wrap {
        height: 180px;
        .label_input_area {
            height: 55px;
        }
        .v-card__title {
            height: 50px;
        }
    }
</style>
