<template>
    <vs-dialog
        v-model="localTaskDialog"
    >
        <v-container
            fluid
            class="ma-0 pa-0"
        >
            <h5
                class="task_dialog_header mt-2"
                align="center"
            >
                タスクを削除しますか？
            </h5>
            <v-row>
                <v-col cols="6">
                    <vs-button
                        class="task_delete_confirm_btn"
                        size="l"
                        @click="deleteTaskConfirm"
                    >
                        <!-- <i class='bx bx-trash'></i> -->
                        はい
                    </vs-button>
                </v-col>
                <v-col cols="6">
                    <vs-button
                        dark
                        class="task_delete_confirm_btn"
                        size="l"
                        @click="localTaskDialog = false"
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
        name: 'TaskDetailDeleteTaskDialog',
        components: {},
        props: {
            taskDeleteConfirm: {
                type: Boolean,
                required: true
            }
        },
        computed: {
            localTaskDialog: {
                get: function () {
                    return this.taskDeleteConfirm
                },
                set: function (value) {
                    this.$emit('update', value)
                },
            },
        },
        methods: {
            deleteTaskConfirm () {
                this.$eventHub.$emit('deleteTaskConfirm')
            }
        },
    }
</script>
<style lang="scss" scoped>
    .task_delete_confirm_btn {
        margin: 0 auto;
        .vs-button__content::v-deep {
            width: 75px;
        }
    }
</style>
