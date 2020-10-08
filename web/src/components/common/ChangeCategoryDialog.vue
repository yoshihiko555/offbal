<!-- カテゴリーの変更モーダル -->
<template>
    <vs-dialog
        v-model="isShow"
        blur
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
                            <vs-checkbox :val='category' v-model='selectCategories' @click.stop=''/>
                        </template>
                    </vs-card>
                </v-col>
                <v-col cols='4' class="d-flex align-center justify-center">
                    <vs-button
                        size='xl'
                        :disabled='valid'
                        @click="changeCategories"
                    >
                        カテゴリーを<br>入れ替える
                    </vs-button>
                </v-col>
            </v-row>
        </v-container>
    </vs-dialog>
</template>

<script>
    import AuthService from '@/auth/AuthService'
    import { Const } from '@/assets/js/const'
    import { mapGetters, mapMutations } from 'vuex'
    import _ from 'lodash'
    const auth = new AuthService()
    const Con = new Const()

    export default {
        name: 'ChangeCategoryDialog',
        data: () => ({
            isShow: false,
            id: null,
            valid: true,
            defaultCategories: [],
            selectCategories: [],
        }),
        created () {
        },
        computed: {
            ...mapGetters([
                'categories',
            ]),
        },
        watch: {
        	selectCategories: function (val) {
                this.valid = (val.length === 5) ? false : true
            }
        },
        methods: {
            ...mapMutations([
                'setCategories',
            ]),
            open () {
            	// 初期化
            	this.selectCategories = []

                this.$axios({
                    url: '/api/default-categories/',
                    method: 'GET',
                })
                .then(res => {
                    console.log('デフォルトカテゴリー一覧', res)
                    this.defaultCategories = res.data.default_categories
                    // 初期選択状態を格納
                    this.defaultCategories.forEach(el => {
                    	const idx = this.categories.findIndex(i => i.name === el.name)
                    	if (idx !== -1) this.selectCategories.push(el)
                    })
                    this.id = AuthService.getAuth0Id()
                    this.isShow = true
                })
                .catch(e => {
                    console.log(e)
                })
            },
            changeCategories () {
                // TODO : ここもVuexのActionに任せちゃうようにする
                // 極力store管理しているものでaxiosが絡んでいるものはVuexのActionを通したい
                console.log('選択カテゴリー', this.selectCategories)
                this.$axios({
                    url: '/api/category/change_categories/',
                    method: 'PUT',
                    data: {
                        auth0_id: this.id,
                        categories: this.selectCategories,
                    }
                })
                .then(res => {
                    console.log(res)
                    this.setCategories(res.data)
                    this.isShow = false
                })
                .catch(e => {
                    console.log(e)
                })
            },
            getImgUrl (name) {
            	return require(`@/assets/img/${name}.jpg`)
            },
            togle (category) {
                const idx = this.selectCategories.findIndex(i => i.name === category.name)
                if (idx !== -1) this.selectCategories = this.selectCategories.filter((_, i) => i !== idx)
                else this.selectCategories.push(category)
            },
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
