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
                ></vs-input>
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
                ></vs-input>
            </v-col>
        </v-row>
        <v-divider/>
        <v-row>
            <v-col cols='12' class="text-right">
                <vs-button
                    :disabled='disabled'
                    class="d-inline-block"
                    @click="update"
                >保存</vs-button>
            </v-col>
        </v-row>
    </v-container>
</template>

<script>
    import _ from 'lodash'
    import AuthService from '@/auth/AuthService'
    const auth = new AuthService()

    export default {
        name: 'AcountSetting',
        components: {
        },
        data: () => ({
            userProfile: {},
            cloneUserProfile: {},
            disabled: true,
        }),
        created () {
            auth.getManageUserProfile((err, res) => {
                if (err) {
                    console.log(err)
                } else {
                    console.log(res)
                    this.userProfile = res
                    this.cloneUserProfile = _.cloneDeep(this.userProfile)
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
                return data
            }

        },
    }
</script>

<style lang="scss" scoped>
</style>
