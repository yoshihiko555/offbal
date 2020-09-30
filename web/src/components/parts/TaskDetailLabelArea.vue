<template>
    <v-card-text>
        <v-chip-group
            v-if="!isCreateLabel"
            column
        >
            <v-chip
                color="teal accent-3"
                text-color="white"
                label
                small
                close
                v-for="(label, i) in cloneTask.label"
                :key="i"
                @click:close="deleteLabel(label)"
            >
                <v-icon
                    left
                    small
                    color="white"
                >mdi-label</v-icon>
                {{ label.name }}
            </v-chip>
        </v-chip-group>
        <!-- ラベル追加ボタンここから -->
        <v-chip
            v-if="!isCreateLabel"
            class="mt-1"
            color="teal accent-3"
            text-color="white"
            small
            @click="addLabelContent"
        >
            <v-icon
                small
                color="white"
            >mdi-pencil</v-icon>
            ラベルを変更する
        </v-chip>
        <!-- ラベル追加ボタンここまで -->
        <!-- ラベル追加ボタン押下後ここから -->
        <div
            v-else
            class="create_label_area_wrap mt-5"
        >
            <div class="create_label_select_area_wrap mt-3">
                <!-- ラベル選択モード -->
                <div v-if="!isCreateNewLabel">
                    <vs-select
                        id="label_vs_select"
                        placeholder='ラベルを選択してください'
                        v-model="localSelectedLabelList"
                        multiple
                        filter
                    >
                        <vs-option
                            id="label_vs_option"
                            v-for='(label, i) in labels'
                            :key='i'
                            :label='label.name'
                            :value='label.id'
                            filter
                        >{{ label.name }}
                        </vs-option>
                    </vs-select>
                    <div
                        class="change_label_btn_wrap mt-1"
                    >
                        <vs-button
                            dark
                            @click="endCreateLabel"
                        >
                            キャンセル
                        </vs-button>
                        <vs-button
                            class="create_label_submit_btn ml-2"
                            color="primary"
                            @click="addLabelBtn"
                        >
                            変更
                            <template #animate>
                                <i class="bx bxs-paper-plane"></i> 送信
                            </template>
                        </vs-button>
                        <v-spacer></v-spacer>
                        <vs-button
                            v-if="!isCreateNewLabel"
                            flat
                            @click="isCreateNewLabel = true"
                        >
                            ラベルを作成
                        </vs-button>
                    </div>
                </div>
                <!-- ラベル作成モード -->
                <div
                    v-else
                    class="create_label_input_area_wrap mt-2"
                >
                    <vs-input
                        label-placeholder="ラベルを新規作成する"
                        v-model="createLabelValue"
                        @keypress.prevent.enter.exact="changeCreateLabelSubmitValue"
                        @keyup.prevent.enter.exact="setCreateLabelName"
                    >
                        <template #icon>
                            <i class='bx bx-label'></i>
                        </template>
                        <template v-if="createLabelDuplicate" #message-danger>
                            既にこのラベルは作成されています。
                        </template>
                    </vs-input>
                    <div
                        class="change_label_btn_wrap mt-1"
                    >
                        <vs-button
                            dark
                            @click="isCreateNewLabel = false"
                        >
                            キャンセル
                        </vs-button>
                        <vs-button
                            class="create_label_submit_btn ml-2"
                            color="success"
                            @click="createLabelBtn"
                            :disabled="createLabelDisabled"
                        >
                            作成
                            <template #animate>
                                <i class="bx bxs-paper-plane"></i> 送信
                            </template>
                        </vs-button>
                    </div>
                </div>
            </div>
        </div>
    </v-card-text>
</template>
<script>
    import { mapGetters, mapActions, mapMutations } from 'vuex'
    import { globalValidateMixins } from '@/mixins/validate'
    import _ from 'lodash'

    export default {
        name: 'TaskDetailLabelArea',
        components: {
        },
        props: {
            cloneTask: {
                type: Object,
                required: true,
            },
            selectedLabelList: {
                type: Array,
                required: true,
            }
        },
        data: () => ({
            isCreateNewLabel: false,
            isCreateLabel: false,
            deleteLabelList: [],
            createLabelSubmitValue: false,
            createLabelValue: '',
            isLoadingUpdateLabel: false,
            createLabelDuplicationCheck: false,
            createLabelDuplicate: false,
        }),
        created () {
            this.$eventHub.$on('endCreateLabel', this.endCreateLabel)
        },
        mounted: function () {
        },
        watch: {
            createLabelValue: _.debounce(function (val) {
                this.createLabelDuplicationCheck = false
                if (this.createLabelValue.length === 0) this.createLabelDuplicate = false
                if (this.createLabelValue.length > 0) this.checkLabelNameDuplication()
            }, 200),
        },
        computed: {
            ...mapGetters([
                'labels'
            ]),
            createLabelDisabled () {
                if (this.createLabelValue.length > 0 &&
                    this.createLabelDuplicationCheck) return false
                return true
            },
            localSelectedLabelList: {
                get: function () {
                    return this.selectedLabelList
                },
                set: function (value) {
                    this.$emit('update', value)
                },
            },
        },
        methods: {
            ...mapMutations([
                'addLabel',
                'updateLabelToTask',
            ]),
            ...mapActions([
                'addLabelsAction',
                'deleteLabelAction',
            ]),
            addLabelContent () {
                // ラベル作成モードにする。
                this.isCreateLabel = true
                this.$eventHub.$emit('endEditTaskContent')
                this.$eventHub.$emit('endEditSubTaskContent')
            },
            deleteLabel (label) {
                for (const i in this.cloneTask.label) {
                    if (this.cloneTask.label[i].id === label.id) {
                        this.cloneTask.label.splice(i, 1)
                        break
                    }
                }
                const index = this.localSelectedLabelList.indexOf(label.id)
                if (index !== -1) this.localSelectedLabelList.splice(index, 1)
                this.deleteLabelList.push(label)
                this.deleteLabelToAction()
            },
            deleteLabelToAction: _.debounce(function deleteLabelToAction () {
                this.deleteLabelAction({
                    task_id: this.cloneTask.id,
                    delete_label_list: this.deleteLabelList
                })
                this.deleteLabelList = []
            }, 400),
            endCreateLabel () {
                // ラベル作成モードを終了
                this.isCreateLabel = false
                this.createLabelSubmitValue = false
                this.createLabelValue = ''
                // this.setSelectedLabelList()
            },
            setSelectedLabelList () {
                this.localSelectedLabelList = []
                // 選択されているラベルをセット
                for (const i in this.cloneTask.label) {
                    this.localSelectedLabelList.push(this.cloneTask.label[i].id)
                }
            },
            addLabelBtn () {
                // ラベルを選択した後送信
                this.isLoadingUpdateLabel = true
                this.$axios({
                    url: '/api/task/change_label_list/',
                    method: 'PUT',
                    data: {
                        task_id: this.cloneTask.id,
                        label_id_list: this.localSelectedLabelList
                    }
                })
                .then(res => {
                    console.log(res)
                    this.cloneTask.label = res.data.label
                    // this.setSelectedLabelList()
                    this.endCreateLabel()
                    this.updateLabelToTask(res.data)
                    this.isLoadingUpdateLabel = false
                })
                .catch(e => {
                    console.log(e)
                })
            },
            createLabelBtn () {
                // ラベル作成の送信ボタンが押されたらラベル作成
                if (this.createLabelValue.length === 0) return
                this.isLoadingUpdateLabel = true
                this.$axios({
                    url: '/api/label/',
                    method: 'POST',
                    data: {
                        name: this.createLabelValue,
                    }
                })
                .then(res => {
                    this.isLoadingUpdateLabel = false
                    this.localSelectedLabelList.push(res.data.id)
                    this.addLabelsAction(res.data)
                    this.isCreateNewLabel = false
                })
                .catch(e => {
                    console.log(e)
                })
                this.createLabelValue = ''
            },
            checkLabelNameDuplication () {
                this.$axios({
                    url: '/api/label/checkDuplication/',
                    method: 'GET',
                    params: {
                        name: this.createLabelValue
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
            changeCreateLabelSubmitValue () {
                // ラベル作成の日本語変換でのsubmitを防ぐ
                this.createLabelSubmitValue = true
            },
            setCreateLabelName () {
                // ラベル作成エリアでenterが押されたら更新
                const length = this.createLabelValue.length
                if (length === 0 || !this.createLabelSubmitValue || this.createLabelDisabled) return
                this.createLabelBtn()
            },
        },
        mixins: [globalValidateMixins],
    }
</script>
<style lang="scss" scoped>
    .vs-input-parent::v-deep {
        width: 100%;
        .vs-input {
            width: 100%;
        }
    }
    .create_label_input_area_wrap {
        width: 100%;
        .vs-input-parent::v-deep {
            width: 100%;
            .vs-input {
                width: 100%;
            }
        }
    }
    .create_label_select_area_wrap {
        // display: flex;
        width: 100%;
        .vs-select-content::v-deep {
            max-width: 100%;
            // max-width: 63%;
            .vs-select__input {
                width: 100%;
            }
        }
    }
    .change_label_btn_wrap {
        display: flex;
    }
</style>
