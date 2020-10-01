<template>
    <vs-dialog
        v-model='localCreateLabelConfirm'
        overflow-hidden
    >
        <v-container
            fluid
            class="ma-0 pa-0"
        >
            <h5
                class="task_dialog_header mb-3"
                align="center"
            >
                ラベルを作成しますか？
            </h5>
            <v-row>
                <v-col cols="12">
                    <h4 class="label_content">
                        {{ labelContent }}
                    </h4>
                </v-col>
            </v-row>
            <v-row>
                <v-col cols="6">
                    <vs-button
                        class="create_label_confirm_btn"
                        size="l"
                        @click="createLabel"
                    >
                        <!-- <i class='bx bx-trash'></i> -->
                        はい
                    </vs-button>
                </v-col>
                <v-col cols="6">
                    <vs-button
                        dark
                        class="create_label_confirm_btn"
                        size="l"
                        @click="localCreateLabelConfirm = false"
                    >
                        いいえ
                    </vs-button>
                </v-col>
            </v-row>
        </v-container>
    </vs-dialog>
</template>
<script>
    export default {
        name: 'CreateLabelDialog',
        components: {},
        props: {
            createLabelConfirm: {
                type: Boolean,
                required: true,
            },
            labelContent: {
                type: String,
                required: true,
            }
        },
        computed: {
            localCreateLabelConfirm: {
                get: function () {
                    return this.createLabelConfirm
                },
                set: function (value) {
                    this.$emit('update', value)
                },
            },
        },
        methods: {
            createLabel () {
                this.$eventHub.$emit('confirmCreateLabelContent')
            }
        },
    }
</script>
<style lang="scss" scoped>
    .create_label_confirm_btn {
        margin: 0 auto;
    }
    .label_content {
        text-align: center;
        word-break: break-all;
    }
</style>
