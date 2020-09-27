<template>
    <vs-dialog v-model="dialog" blur>
        <template #header>
            <h4>設定内容が変更されていますが<br>よろしいですか？</h4>
        </template>

        <v-container>
            <v-row>
                <v-col cols='6'>
                    <vs-button class="mx-auto" @click="toPage">
                        はい
                    </vs-button>
                </v-col>
                <v-col cols='6'>
                    <vs-button class="mx-auto" @click='close'>
                        いいえ
                    </vs-button>
                </v-col>
            </v-row>
        </v-container>

    </vs-dialog>
</template>

<script>
    export default {
        name: 'SettingConfirmDialog',
        data: () => ({
            dialog: false,
            path: null,
            next: null,
        }),
        methods: {
            open (path, next) {
                this.dialog = true
                this.path = path
                this.next = next
            },
            close () {
                this.dialog = false
                this.$eventHub.$emit('confirm-cancel-setting')
            },
            toPage () {
                this.dialog = false
                this.$eventHub.$emit('confirm-apply-setting', this.path, this.next)
            }
        }
    }
</script>

<style lang='scss' scoped>
</style>
