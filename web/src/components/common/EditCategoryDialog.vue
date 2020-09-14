<template>
    <vs-dialog v-model="dialog" width="300px" prevent-close not-close>
        <v-container
            fluid
            class="pb-0"
        >
            <h5
                align="center"
            >
                カテゴリーを編集する
            </h5>
            <ValidationObserver v-slot="{ invalid }" ref='form'>
                <v-row>
                    <v-col cols='12'>
                        <!-- カテゴリー名 -->
                        <ValidationProvider v-slot='{ errors }' name='カテゴリー名' vid='name' rules='required'>
                            <vs-input
                                class="my-6"
                                v-model="category.name"
                                label='カテゴリー名'
                                :loading='loading'
                            >
                                <template #message-danger>
                                    {{ errors[0] }}
                                </template>
                            </vs-input>
                        </ValidationProvider>

                        <!-- カテゴリーカラー -->
                        <ValidationProvider v-slot='{ errors }' name='カテゴリー名' rules='required'>
                            <vs-select
                                v-model="category.color"
                                label="カラー"
                                class="my-3"
                            >
                                <template #message-danger>
                                    {{ errors[0] }}
                                </template>

                                <vs-option
                                    v-for="(color, i) in colorList"
                                    :key="i"
                                    :label='color.color'
                                    :value='color.color'
                                    :color='color.code'
                                >
                                    {{ color.color }}
                                </vs-option>
                            </vs-select>
                        </ValidationProvider>

                        <!-- お気に入りフラグ -->
                        <div class="favorite_wrap">
                            <p>お気に入り</p>
                            <vs-switch v-model="category.is_favorite">
                                <template #on>
                                    <i class='bx bxs-star' ></i>
                                </template>
                                <template #off>
                                    <i class='bx bx-star'></i>
                                </template>
                            </vs-switch>
                        </div>

                        <div class="create_category_btn_wrap">
                            <vs-button
                                dark
                                relief
                                @click.prevent="close"
                            >
                                キャンセル
                            </vs-button>
                            <vs-button
                                relief
                                :disabled='invalid'
                                @click.prevent="update"
                            >
                                <i class="bx bxs-paper-plane"></i> 更新
                            </vs-button>
                        </div>

                    </v-col>
                </v-row>
            </ValidationObserver>
        </v-container>
    </vs-dialog>
</template>

<script>
    import _ from 'lodash'
    import { mapActions } from 'vuex'
    import { Const } from '@/assets/js/const'
    const Con = new Const()

    export default {
        name: 'EditCategoryDialog',
        data: () => ({
            dialog: false,
            category: {},
            cloneCategory: {},
            colorList: Con.CATEGORY_COLOR,
            loading: false,
            initFlg: true,
        }),
        watch: {
            'category.name': function (val) {
				if (val && !this.initFlg) {
					this.loading = true
					this.checkCategoryName(val)
				}
            }
        },
        methods: {
            ...mapActions([
                'updateCategoryAction',
                'addFavoriteCategorysAction',
                'deleteFavoriteCategorysAction',
            ]),
            open (category) {
                this.initFlg = true
                this.category = _.cloneDeep(category)
                this.category.is_favorite = category.favorite
                // 重複チェックのために変更前の状態を保持する
                this.cloneCategory = _.cloneDeep(category)
                this.dialog = true
                setTimeout(() => { this.initFlg  = false }, 0)
            },
            close () {
                this.category = {}
                this.dialog = false
            },
            update () {
                console.log(this.category)
                this.$axios({
                    url: `/api/category/${this.category.id}/`,
                    method: 'PUT',
                    data: this.category,
                })
                .then(res => {
                    console.log(res)
                    this.updateCategoryAction(res.data)
                    if (res.data.favorite) this.addFavoriteCategorysAction(res.data)
                    else this.deleteFavoriteCategorysAction(res.data)
                    this.close()
                })
                .catch(e => {
                    console.log(e.response)
                })
            },
            checkCategoryName: _.debounce(function checkCategoryName (val) {
				this.$axios({
					methods: 'GET',
					url: '/api/category/checkUpdateCategoryDuplication/',
					params: {
                        current_name: this.cloneCategory.name,
						new_name: val
					}
				})
				.then(res => {
                    console.log(res.data)
                    if (!res.data.result) {
                        this.$refs.form.setErrors({
                            name: ['既にこのカテゴリー名は作成済みです']
                        })
                    }
					this.loading = false
				})
				.catch(e => {
					console.log(e)
					this.loading = false
				})
			}, 1000),
        }
    }
</script>

<style lang='scss' scoped>
    .vs-input-parent::v-deep{
        .vs-input {
            width: 100%;
        }
    }
    .vs-select-content::v-deep {
        max-width: initial;
        .vs-select__input {
            width: 100%;
        }
        .vs-select__label--label {
            -webkit-transform: translate(-2px, -28px) !important;
            transform: translate(-2px, -28px) !important;
        }
    }
    .favorite_wrap::v-deep {
        &>p {
            margin: 0;
            margin-left: 3%;
            margin-bottom: 1%;
            font-size: 0.75rem;
            color: #626f7e
        }
        .vs-switch{
            width: 20%;
        }
    }
    .create_category_btn_wrap {
        display: flex;
        justify-content: flex-end;
    }
</style>
