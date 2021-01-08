<template>
    <vs-dialog
        v-model="isShow"
        class="pa-0 edit_label_dialog_wrap"
        scroll
        width="520px"
    >
        <template #header>
            <h3>ラベル編集</h3>
        </template>
        <v-container>
            <v-list
                class="label_list_wrap"
            >
                <v-list-item
                    v-for="(label, i) in labels"
                    :key="i"
                    class="label_display_area_wrap"
                >
                    <v-row
                        v-if="!isEditLabel(label)"
                    >
                        <v-col cols="10">
                            <v-list-item-content>
                                <v-list-item-title
                                    class="label_name"
                                >
                                    {{ label.name }}
                                </v-list-item-title>
                            </v-list-item-content>
                        </v-col>
                        <v-col cols="2">
                            <vs-button
                                @click.stop
                                @click="editLabelContent(label)"
                                floating
                            >
                                <i class='bx bxs-pencil'></i> edit
                            </vs-button>
                        </v-col>
                    </v-row>
                    <v-row
                        v-else
                    >
                        <v-col cols="9">
                            <vs-input
                                v-model="cloneEditLabelData.name"
                                @keypress.prevent.enter.exact="changeEditLabelSubmitValue"
                                @keyup.prevent.enter.exact="setEditLabelName"
                            >
                                <template #icon>
                                    <i class="bx bx-label"></i>
                                </template>
                                <template
                                    v-if="editLabelDuplicate"
                                    #message-danger
                                >既にこのラベルは作成されています。
                                </template>
                                <template
                                    v-else-if="editLabelOverLength"
                                    #message-danger
                                >ラベル名は20文字以内にしてください。
                                </template>
                            </vs-input>
                        </v-col>
                        <v-col cols="3">
                            <v-card-actions class="pa-0 ma-0">
                                <v-btn
                                    v-if="labelEditInvalid == false"
                                    class="edit_label_content_submit_btn"
                                    icon
                                    color="primary"
                                    @click.stop
                                    @click="editLabelContentBtn(label, i)"
                                    size="small"
                                >
                                    <i class='bx bx-check'></i>
                                </v-btn>
                                <v-btn
                                    v-else
                                    class="edit_label_content_submit_btn"
                                    icon
                                    color="primary"
                                    @click.stop
                                    @click="endEditLabelContent()"
                                    size="small"
                                >
                                    <i class='bx bx-x'></i>
                                </v-btn>
                                <v-btn
                                    class="edit_label_content_submit_btn"
                                    icon
                                    color="danger"
                                    @click.stop
                                    @click="deleteLabel(label, i)"
                                    size="small"
                                >
                                    <i class='bx bx-trash' style='color:#e60b0b'></i>
                                </v-btn>
                            </v-card-actions>
                        </v-col>
                    </v-row>
                </v-list-item>
                <v-list-item
                    class="label_input_area_wrap"
                >
                    <v-row>
                        <v-col cols="12" class="pb-0 mb-0">
                            <vs-input
                                v-model="labelContent"
                                placeholder="新規ラベルを追加"
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
                                    v-else-if="createLabelOverLength"
                                    #message-danger
                                >ラベル名は20文字以内にしてください。
                                </template>
                            </vs-input>
                        </v-col>
                    </v-row>
                </v-list-item>
            </v-list>
        </v-container>
    </vs-dialog>
</template>
<script>
    import { mapGetters, mapActions } from 'vuex'
    import _ from 'lodash'

    export default {
        name: 'EditLabelDialog',
        data: () => ({
            isShow: false,
            labelContent: '',
            createLabelSubmitValue: false,
            editLabelSubmitValue: false,
            createLabelDuplicate: false,
            createLabelDuplicationCheck: false,
            createLabelOverLength: false,
            editLabelDuplicate: false,
            editLabelDuplicationCheck: false,
            editLabelOverLength: false,
            editLabelData: {},
            cloneEditLabelData: {},
            isLoadingUpdateLabel: false,
        }),
        created () {
        },
        computed: {
            ...mapGetters([
                'labels',
            ]),
            labelEditInvalid () {
                if (this.cloneEditLabelData.name === undefined) return false
                const length = this.cloneEditLabelData.name.length
                if (this.editLabelDuplicate || this.editLabelOverLength ||
                    this.cloneEditLabelData.name === this.editLabelData.name ||
                    length === 0
                ) {
                    return true
                }
                return false
            },
        },
        watch: {
            labelContent: _.debounce(function (val) {
                this.createLabelDuplicationCheck = false
                this.createLabelOverLength = false
                const length = this.labelContent.length
                if (length === 0) {
                    this.createLabelDuplicate = false
                } else if (length > 20) {
                    this.createLabelOverLength = true
                    this.createLabelDuplicate = false
                } else {
                    this.checkCreateLabelNameDuplication()
                }
            }, 100),
            'cloneEditLabelData.name': _.debounce(function (val) {
                this.editLabelDuplicationCheck = false
                this.editLabelOverLength = false
                if (this.cloneEditLabelData.name === undefined) return
                const length = this.cloneEditLabelData.name.length
                if (length === 0) {
                    this.editLabelDuplicate = false
                } else if (length > 20) {
                    this.editLabelOverLength = true
                    this.editLabelDuplicate = false
                } else {
                    this.checkEditLabelNameDuplication()
                }
            }, 200)
        },
        methods: {
            ...mapActions([
                'addLabelAction',
                'updateLabelAction',
                'deleteLabelAction',
            ]),
            open () {
                this.isShow = true
                this.init()
            },
            changeCreateLabelSubmitValue () {
                this.createLabelSubmitValue = true
            },
            changeEditLabelSubmitValue () {
                this.editLabelSubmitValue = true
            },
            setCreateLabelName () {
                const length = this.labelContent.length
                if (length === 0 || length > 20 || !this.createLabelSubmitValue) return
                this.createLabelBtn()
            },
            setEditLabelName () {
                const length = this.cloneEditLabelData.name.length
                if (length === 0 || length > 20 || !this.editLabelSubmitValue) return
                this.updateLabel()
            },
            createLabelBtn () {
                const length = this.labelContent.length
                if (!this.createLabelDuplicationCheck || this.createLabelDuplicate) return
                this.isLoadingUpdateLabel = true
                this.addLabelAction({
                    name: this.labelContent
                })
                .then(res => {
                    this.isLoadingUpdateLabel = false
                    this.init()
                })
            },
            updateLabel () {
                if (!this.editLabelDuplicationCheck || this.editLabelDuplicate) return
                if (this.editLabelData.name !== this.cloneEditLabelData.name) {
                    this.updateLabelAction({
                        ...this.cloneEditLabelData
                    })
                    this.initEditData()
                }
            },
            checkCreateLabelNameDuplication () {
                this.checkLabelNameDuplication(this.labelContent)
                .then(res => {
                    this.createLabelDuplicate = !res.data.result
                    this.createLabelDuplicationCheck = true
                })
            },
            checkEditLabelNameDuplication () {
                if (this.cloneEditLabelData.name === undefined) return
                if (this.editLabelData.name !== this.cloneEditLabelData.name) {
                    this.checkLabelNameDuplication(this.cloneEditLabelData.name)
                    .then(res => {
                        this.editLabelDuplicate = !res.data.result
                        this.editLabelDuplicationCheck = true
                    })
                }
            },
            checkLabelNameDuplication (labelName) {
                return new Promise((resolve, reject) => {
                    this.$axios({
                        url: '/api/label/checkDuplication/',
                        method: 'GET',
                        params: {
                            name: labelName
                        }
                    })
                    .then(res => {
                        console.log(res.data)
                        resolve(res)
                    })
                    .catch(e => {
                        console.log(e)
                        reject(e)
                    })
                })
            },
            init () {
                this.labelContent = ''
                this.createLabelSubmitValue = false
                this.editLabelSubmitValue = false
                this.isCreateNewLabel = false
                this.createLabelDuplicate = false
                this.createLabelOverLength = false
                this.isLoadingUpdateLabel = false
                this.editLabelData = {}
                this.cloneEditLabelData = {}
            },
            initEditData () {
                this.editLabelSubmitValue = false
                this.editLabelData = {}
            },
            editLabelContent (label) {
                this.cloneEditLabelData = _.cloneDeep(label)
                this.editLabelData = label
            },
            isEditLabel (label) {
                if (label.id === this.editLabelData.id) return true
                return false
            },
            endEditLabelContent () {
                this.editLabelData = {}
                this.editLabelSubmitValue = false
                this.cloneEditLabelData = {}
            },
            deleteLabel (label, i) {
                this.deleteLabelAction({
                    ...label
                })
            },
            editLabelContentBtn (label, i) {
                const length = this.cloneEditLabelData.name.length
                this.updateLabel()
                this.endEditLabelContent()
            },
        }
    }
</script>
<style lang="scss" scoped>
    .edit_label_dialog_wrap {
        .label_list_wrap {
            .label_name {
                margin-top: 4px;
            }
        }
        .label_display_area_wrap {
            height: 72px;
        }
        .label_input_area_wrap {
            margin-top: 30px;
            height: 72px;
        }
        .vs-input-parent::v-deep {
            width: 100%;
            height: 100%;
            .vs-input {
                width: 100%;
            }
        }
    }
</style>
