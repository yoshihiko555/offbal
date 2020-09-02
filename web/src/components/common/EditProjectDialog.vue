<template>
    <vs-dialog v-model="dialog" width="300px" prevent-close not-close>
        <v-container
            fluid
            class="pb-0"
        >
            <h5
                align="center"
            >
                プロジェクトを編集する
            </h5>
            <ValidationObserver v-slot="{ invalid }" ref='form'>
                <v-row>
                    <v-col cols='12'>
                        <!-- プロジェクト名 -->
                        <ValidationProvider v-slot='{ errors }' name='プロジェクト名' vid='name' rules='required'>
                            <vs-input
                                class="my-6"
                                v-model="project.name"
                                label='プロジェクト名'
                                :loading='loading'
                            >
                                <template #message-danger>
                                    {{ errors[0] }}
                                </template>
                            </vs-input>
                        </ValidationProvider>

                        <!-- プロジェクトカラー -->
                        <ValidationProvider v-slot='{ errors }' name='プロジェクト名' rules='required'>
                            <vs-select
                                v-model="project.color"
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
                            <vs-switch v-model="project.favorite">
                                <template #on>
                                    <i class='bx bxs-star' ></i>
                                </template>
                                <template #off>
                                    <i class='bx bx-star'></i>
                                </template>
                            </vs-switch>
                        </div>

                        <div class="create_project_btn_wrap">
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
        name: 'EditProjectDialog',
        data: () => ({
            dialog: false,
            project: {},
            cloneProject: {},
            colorList: Con.PROJECT_COLOR,
            loading: false,
            initFlg: true,
        }),
        watch: {
            'project.name': function (val) {
				if (val && !this.initFlg) {
					this.loading = true
					this.checkProjetName(val)
				}
            }
        },
        methods: {
            ...mapActions([
                'updateProjectAction',
                'addFavoriteProjectsAction',
                'deleteFavoriteProjectsAction',
            ]),
            open (project) {
                this.project = _.cloneDeep(project)
                // 重複チェックのために変更前の状態を保持する
                this.cloneProject = _.cloneDeep(project)
                this.dialog = true
                setTimeout(() => { this.initFlg  = false }, 0)
            },
            close () {
                this.project = {}
                this.dialog = false
            },
            update () {
                this.$axios({
                    url: `/api/project/${this.project.id}/`,
                    method: 'PUT',
                    data: this.project,
                })
                .then(res => {
                    console.log(res)
                    this.updateProjectAction(res.data)
                    if (res.data.favorite) this.addFavoriteProjectsAction(res.data)
                    else this.deleteFavoriteProjectsAction(res.data)
                    this.close()
                })
                .catch(e => {
                    console.log(e)
                })
            },
            checkProjetName: _.debounce(function checkProjetName (val) {
				this.$axios({
					methods: 'GET',
					url: '/api/project/checkUpdateProjectDuplication/',
					params: {
                        current_name: this.cloneProject.name,
						new_name: val
					}
				})
				.then(res => {
                    console.log(res.data)
                    if (!res.data.result) {
                        this.$refs.form.setErrors({
                            name: ['既にこのプロジェクト名は作成済みです']
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
    .create_project_btn_wrap {
        display: flex;
        justify-content: flex-end;
    }
</style>
