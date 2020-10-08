<!-- カテゴリー初期選択画面 -->
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
                <v-col v-for='category in defaultCategories' :key='category.id' cols='4'>
                    <vs-card type='2' @click='togle(category)'>
                        <template #title>
                            <h4>{{ category.name }}</h4>
                        </template>
                        <template #text>
                            <p>{{ category.message }}</p>
                        </template>
                        <template #img>
                            <img :src='getImgUrl(category.name)'>
                        </template>
                        <template #interactions>
                            <vs-checkbox :val='category' v-model='categories'/>
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
            isShow: false,
            id: null,
            name: null,
            valid: true,
            defaultCategories: [],
            msgs: Con.DEFAULT_CATEGORY_MSG,
            categories: [],
        }),
        created () {
            // 認証が完了していなければ、HOME画面へ
            if (!auth.isAuthenticated()) return this.$router.push('/')

            this.id = AuthService.getAuth0Id()
            this.name = AuthService.getUserName()
            this.$axios({
            	url: '/api/default-categories/',
            	method: 'GET',
            })
            .then(res => {
                console.log('デフォルトカテゴリー一覧', res)
                if (!res.data.result) {
                	// 初期化未完了
                    this.defaultCategories = res.data.default_categories
                    this.isShow = true
                } else {
                    // 初期化が完了しているので、そのままアプリ画面へ
                    this.toAppPage(this)
                }
            })
            .catch(e => {
            	console.log(e)
            })
        },
        watch: {
        	categories: function (val) {
                this.valid = (val.length === 5) ? false : true
            }
        },
        methods: {
            // ユーザー初期データ作成
            async initUserData () {
                console.log('選択されたカテゴリー', this.categories)
                // 初期データ作成アクション用送信データ
                const options = {
                	url: '/api/signup/',
                	method: 'POST',
                	data: {
                        auth0_id: this.id,
                        auth0_name: this.name,
                        categories: this.categories,
                	}
                }
                // ユーザーメタデータ更新用データ
                const userMetadata = { signup: true }

                try {
                    await this.$axios(options)
                    await auth.updateUserMetadata(userMetadata, (err, res) => {
                        if (err) {
                            console.log(err)
                        } else {
                            console.log(res)
                        }
                    })
                    this.isShow = false
                    await this.toAppPage(this)
                    // 一旦サインアップ時は、リロード処理を入れるように修正
                    this.$router.go({
                        path: this.$router.currentRoute.path, force: true
                    })
                } catch (e) {
                	console.error(e)
                }
            },
            getImgUrl (name) {
            	return require(`@/assets/img/${name}.jpg`)
            },
            togle (category) {
                const idx = this.categories.indexOf(category)
                if (idx !== -1) this.categories = this.categories.filter((_, i) => i !== idx)
                else this.categories.push(category)
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
            padding-bottom: 15px !important;

        }
    }
    p {
        color: #fff;
    }

    .vs-card-content::v-deep .vs-card__text {
        width: 100%;
    }
</style>
