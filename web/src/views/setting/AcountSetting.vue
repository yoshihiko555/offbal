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
                    v-model="userProfile.nickname"
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
                    v-model="userProfile.email"
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
    import AuthService from '@/auth/AuthService'
    const auth = new AuthService()

    export default {
        name: 'AcountSetting',
        components: {
        },
        data: () => ({
            userProfile: {},
            disabled: true,
        }),
        created () {
            // auth.getUser((err, res) => {
            //     if (err) {
            //         console.log(err)
            //     } else {
            //         console.log(res)
            //     }
            // })
            // auth.getUserProfile((err, res) => {
            //     if (err) {
            //         console.log(err)
            //     } else {
            //         console.log(res)
            //         this.userProfile = res
            //     }
            // })
        },
        computed: {
        },
        methods: {
            update () {
                console.log('user update')
            }
        },
    }
</script>

<style lang="scss" scoped>
</style>
