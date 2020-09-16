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
                <v-col v-for='category in defaultCategorys' :key='category.id' cols='4'>
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
                            <vs-checkbox :val='category' v-model='selectCategorys' @click.stop=''/>
                        </template>
                    </vs-card>
                </v-col>
                <v-col cols='4' class="d-flex align-center justify-center">
                    <vs-button
                        size='xl'
                        :disabled='valid'
                        @click="changeCategorys"
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
        name: 'InitSelectCategory',
        data: () => ({
            isShow: false,
            id: null,
            valid: true,
            defaultCategorys: [],
            selectCategorys: [],
        }),
        created () {
        },
        computed: {
            ...mapGetters([
                'categorys',
            ]),
        },
        watch: {
        	selectCategorys: function (val) {
                this.valid = (val.length === 5) ? false : true
            }
        },
        methods: {
            ...mapMutations([
                'setCategorys',
            ]),
            open () {
            	// 初期化
            	this.selectCategorys = []

                this.$axios({
                    url: '/api/default-categorys/',
                    method: 'GET',
                })
                .then(res => {
                    console.log('デフォルトカテゴリー一覧', res)
                    this.defaultCategorys = res.data.default_categorys
                    // 初期選択状態を格納
                    this.defaultCategorys.forEach(el => {
                    	const idx = this.categorys.findIndex(i => i.name === el.name)
                    	if (idx !== -1) this.selectCategorys.push(el)
                    })
                    this.id = AuthService.getAuth0Id()
                    this.isShow = true
                })
                .catch(e => {
                    console.log(e)
                })
            },
            changeCategorys () {
                console.log('選択カテゴリー', this.selectCategorys)
                this.$axios({
                    url: '/api/category/change_categorys/',
                    method: 'PUT',
                    data: {
                        auth0_id: this.id,
                        categorys: this.selectCategorys,
                    }
                })
                .then(res => {
                    console.log(res)
                    this.setCategorys(res.data)
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
                const idx = this.selectCategorys.findIndex(i => i.name === category.name)
                if (idx !== -1) this.selectCategorys = this.selectCategorys.filter((_, i) => i !== idx)
                else this.selectCategorys.push(category)
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