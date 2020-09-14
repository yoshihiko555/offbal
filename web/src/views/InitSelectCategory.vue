<template>
    <vs-dialog
        v-model="isShow"
        blur
        prevent-close
        not-close
        class='pa-0'
    >
        <template #header>
            <h3>カテゴリー選択</h3>
        </template>

        <p class="explanation">あなたが興味のあるカテゴリーを５つ選択してください</p>

        <v-container>
            <v-row>
                <v-col v-for='category in defaultCategorys' :key='category.id' cols='4'>
                    <vs-card type='2' @click='togle(category)'>
                        <template #title>
                            <h4>{{ category.name }}</h4>
                        </template>
                        <template #text>
                            <p>{{ msgs[category.id] }}</p>
                        </template>
                        <template #img>
                            <img :src='getImgUrl(category.name)'>
                        </template>
                        <template #interactions>
                            <vs-checkbox :val='category' v-model='categorys'/>
                        </template>
                    </vs-card>
                </v-col>
                <v-col cols='4' class="d-flex align-center justify-center">
                    <vs-button
                        size='xl'
                        :disabled='valid'
                        @click="initUserData"
                    >
                        offbalを始める
                    </vs-button>
                </v-col>
            </v-row>
        </v-container>
    </vs-dialog>
</template>

<script>
    import AuthService from '@/auth/AuthService'
    import { Const } from '@/assets/js/const'
    const auth = new AuthService()
    const Con = new Const()

    export default {
        name: 'InitSelectCategory',
        data: () => ({
            isShow: true,
            id: null,
            name: null,
            valid: true,
            defaultCategorys: [],
            msgs: Con.DEFAULT_CATEGORY_MSG,
            categorys: [],
        }),
        created () {
            // 認証が完了していなければ、HOME画面へ
            if (!auth.isAuthenticated()) return this.$router.push('/')

            this.id = AuthService.getAuth0Id()
            this.name = AuthService.getUserName()
            this.$axios({
            	url: '/api/default-categorys/',
            	method: 'GET',
            })
            .then(res => {
                console.log('デフォルトカテゴリー一覧', res)
                if (res.data.result) {
                    this.defaultCategorys = res.data.default_categorys
                } else {
                    // 初期化が完了しているので、そのままアプリ画面へ
                    this.$router.push('/myapp')
                }
            })
            .catch(e => {
            	console.log(e)
            })
        },
        watch: {
        	categorys: function (val) {
                this.valid = (val.length === 5) ? false : true
            }
        },
        methods: {
            // ユーザー初期データ作成
            initUserData () {
                console.log(this.categorys)
                this.$axios({
                    url: '/api/signup/',
                    method: 'POST',
                    data: {
                        auth0_id: this.id,
                        auth0_name: this.name,
                        categorys: this.categorys,
                    }
                })
                .then(res => {
                    console.log(res)
                    this.isShow = false
                    this.$router.push('/myapp')
                })
                .catch(e => {
                    console.log(e)
                })
            },
            getImgUrl (name) {
            	return require(`@/assets/img/${name}.jpg`)
            },
            togle (category) {
                const idx = this.categorys.indexOf(category)
                if (idx !== -1) this.categorys = this.categorys.filter((_, i) => i !== idx)
                else this.categorys.push(category)
            }
        }
    }
</script>

<style lang="scss" scoped>
    .explanation {
        color: #555;
    }
    .vs-card__title {
        h4 {
            color: #fff;
        }
    }
    p {
        color: #fff;
    }

    .vs-card-content::v-deep .vs-card__text {
        width: 100%;
    }
</style>