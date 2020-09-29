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
                        v-model="selectedLabelList"
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
        <!-- ラベル追加ボタン押下後ここまで -->
    </v-card-text>
</template>
