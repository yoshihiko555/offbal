<template>
    <v-container>
        <h4>アカウント</h4>
        <!-- ユーザー名 -->
        <v-row>
            <v-col cols='3'>
                <p>ユーザー名</p>
            </v-col>
            <v-col cols='9'>
                <vs-input
                    v-model="cloneUserProfile.nickname"
                    v-if='!isSocial'
                ></vs-input>
                <!-- SSOの場合は、名前の編集は不可 -->
                <p v-else>{{ cloneUserProfile.name }}</p>
            </v-col>
        </v-row>
        <!-- メールアドレス -->
        <v-row>
            <v-col cols='3'>
                <p>メールアドレス</p>
            </v-col>
            <v-col cols='9'>
                <vs-input
                    v-model="cloneUserProfile.email"
                    v-if='!isSocial'
                ></vs-input>
                <!-- SSOの場合はメールアドレスの変更不可 -->
                <p v-else>{{ cloneUserProfile.email }}</p>
            </v-col>
        </v-row>
        <!-- パスワード変更メール送信 -->
        <v-row v-show='!isSocial'>
            <v-col cols='3'>
                <p>パスワード変更</p>
            </v-col>
            <v-col cols='9'>
                <vs-button @click='sendResetPasswordMail'>変更メールを送信する</vs-button>
            </v-col>
        </v-row>
        <v-divider/>
        <!-- ユーザー削除 -->
        <v-row>
            <v-col cols='3'>
                <p>アカウントの削除</p>
            </v-col>
            <v-col cols='9'>
                <vs-button @click='deleteUser' danger>削除</vs-button>
            </v-col>
        </v-row>
        <v-row>
            <v-col cols='12' class="text-right">
                <vs-button
                    :disabled='disabled'
                    class="d-inline-block"
                    @click="update"
                >保存</vs-button>
            </v-col>
        </v-row>

        <!-- モーダル読み込み -->
        <delete-user-confirm-dialog
            ref='deleteConfirm'
        />
    </v-container>
</template>

<script>
    import DeleteUserConfirmDialog from '@/components/parts/DeleteUserConfirmDialog'
    import _ from 'lodash'
    import AuthService from '@/auth/AuthService'
    const auth = new AuthService()

    export default {
        name: 'AcountSetting',
        components: {
        	DeleteUserConfirmDialog,
        },
        data: () => ({
            userProfile: {},
            cloneUserProfile: {},
            disabled: true,
            isSocial: true,
        }),
        created () {
            auth.getManageUserProfile((err, res) => {
                if (err) {
                    console.log(err)
                } else {
                    console.log(res)
                    this.userProfile = res
                    this.cloneUserProfile = _.cloneDeep(this.userProfile)
                    this.isSocial = this.cloneUserProfile.identities[0].isSocial
                }
            })
        },
        watch: {
            cloneUserProfile: {
                handler (val) {
                    this.disabled = _.isEqual(val, this.userProfile)
                    this.$emit('update-is-change', this.disabled)
                },
                deep: true,
            }
        },
        computed: {
        },
        methods: {
            update () {
                const sendData = this.conversionData(this.cloneUserProfile)
                auth.updateUserProfile(sendData, (err, res) => {
                    if (err) {
                        console.log(err)
                    } else {
                        console.log(res)
                        this.disabled = true
                        this.userProfile = res
                        this.cloneUserProfile = _.cloneDeep(this.userProfile)
                    }
                })
            },
            // 送信データで不必要なプロパティを削除して返却
            conversionData (data) {
                delete data.user_id
                delete data.logins_count
                delete data.last_login
                delete data.last_ip
                delete data.updated_at
                delete data.created_at
                delete data.identities
                delete data.last_password_reset
                return data
            },
            sendResetPasswordMail () {
            	auth.sendResetPasswordMail(this.cloneUserProfile.identities[0].connection, this.cloneUserProfile.email)
                this.$vs.notification({
                    color: 'primary',
                    classNotification: 'category_sort',
                    text: 'メールを送信しました。'
                })
            },
            deleteUser () {
            	this.$refs.deleteConfirm.open(this.cloneUserProfile)
            }
        },
    }
</script>

<style lang="scss" scoped>
</style>
