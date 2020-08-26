<template>
    <vs-dialog v-model="dialog" width="300px" prevent-close not-close>
        <v-container
            fluid
            class="pb-0"
        >
            <h5
                align="center"
            >
                新規プロジェクトを追加
            </h5>
            <ValidationObserver v-slot="{ invalid }">
                <v-row>
                    <v-col cols='12'>
                        <!-- プロジェクト名 -->
                        <ValidationProvider v-slot='{ errors }' name='プロジェクト名' rules='required'>
                            <vs-input
                                class="my-6"
                                v-model="project.name"
                                label='プロジェクト名'
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
                                @click.prevent="create"
                            >
                                <i class="bx bxs-paper-plane"></i> 送信
                            </vs-button>
                        </div>

                    </v-col>
                </v-row>
            </ValidationObserver>
        </v-container>
    </vs-dialog>
</template>

<script>
	import { mapActions } from 'vuex'
    import { Const } from '@/assets/js/const'
    const Con = new Const()

    export default {
        name: 'CreateProjectDialog',
        data: () => ({
            dialog: false,
            project: {
                name: '',
                color: '',
                favorite: false,
            },
            colorList: Con.PROJECT_COLOR,
        }),
        methods: {
            ...mapActions([
                'addProjectsAction',
            ]),
            open () {
            	this.init()
                this.dialog = true
            },
            close () {
                this.dialog = false
            },
            create () {
                console.log(this.project)
                this.$axios({
                	url: '/api/project/',
                	method: 'POST',
                	data: this.project,
                })
                .then(res => {
                	console.log(res)
                	this.addProjectsAction(res.data)
                	this.close()
                })
                .catch(e => {
                	console.log(e.response)
                })
            },
            init () {
            	this.project = {
            			name: '',
            			color: '',
            			favorite: false,
            	}
            }
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
