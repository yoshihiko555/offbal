<!-- ユーザー削除時の確認モーダル -->
<template>
    <vs-dialog v-model='active'>
        <template #header>
            <h4>アカウントを削除しますか？</h4>
        </template>

        <v-container>
            <v-row>
                <v-col cols='12' class='confirm_btn_wrap'>
                    <vs-button danger @click='deleteUser'>削除</vs-button>
                    <vs-button @click='active = false'>キャンセル</vs-button>
                </v-col>
            </v-row>
        </v-container>
    </vs-dialog>
</template>

<script>
    import _ from 'lodash'
    import { mapMutations } from 'vuex'
    import AuthService from '@/auth/AuthService'
    const auth = new AuthService()

    export default {
        name: 'DeleteUserConfirmDialog',
        components: {
        },
        data: () => ({
        	active: false,
        	cloneProfile: {},
        }),
        created () {
        },
        watch: {
        },
        computed: {
        },
        methods: {
            ...mapMutations([
                'destroySession',
            ]),
        	open (profile) {
        		this.active = true
        		this.cloneProfile = _.cloneDeep(profile)
        	},
            deleteUser () {
                this.$axios({
                	url: `/api/user/${this.cloneProfile.user_id}`,
                	method: 'DELETE',
                })
                .then(res => {
                	console.log(res)
                	auth.deleteUser(this.cloneProfile.user_id)
	                const body = document.body
                    body.removeAttribute('vs-theme')
                    this.$vuetify.theme.isDark = false
                    auth.logout()
                    this.destroySession()
                })
                .catch(e => {
                	console.log(e)
                })
            }
        },
    }
</script>

<style lang="scss" scoped>
    .confirm_btn_wrap {
        display: flex;
        justify-content: space-around;
    }
</style>
