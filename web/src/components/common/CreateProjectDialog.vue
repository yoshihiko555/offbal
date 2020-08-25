<template>
    <vs-dialog v-model="dialog" width="300px">
        <v-container
            fluid
            class="pb-0"
        >
            <h5
                align="center"
            >
                新規プロジェクトを追加
            </h5>
            <v-form @submit.prevent>
                <v-row>
                    <v-col cols='12'>
                        <!-- プロジェクト名 -->
                        <vs-input
                            class="my-6"
                            v-model="project.name"
                            label='プロジェクト名'
                        />

                        <!-- プロジェクトカラー -->
                        <vs-select
                            v-model="project.color"
                            label="カラー"
                            class="my-3"
                        >
                            <vs-option
                                v-for="(color, i) in colorList"
                                :key="i"
                                :label='color.color'
                                :value='i'
                                :color='color.code'
                            >
                                {{ color.color }}
                            </vs-option>
                        </vs-select>

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
                                @click.prevent="create"
                            >
                                <i class="bx bxs-paper-plane"></i> 送信
                            </vs-button>
                        </div>

                    </v-col>
                </v-row>
            </v-form>
        </v-container>
    </vs-dialog>
</template>
<script>
    import { Const } from '@/assets/js/const'
    const Con = new Const()
    export default {
        name: 'CreateProjectDialog',
        components: {
        },
        props: {
        },
        data: () => ({
            dialog: false,
            project: {
                name: '',
                color: '',
                favorite: false,
            },
            colorList: Con.PROJECT_COLOR,
        }),
        computed: {
        },
        methods: {
            open () {
                this.project = {
                    name: '',
                    color: '',
                    favorite: false,
                }
                this.dialog = true
            },
            close () {
                this.dialog = false
            },
            create () {
                console.log(this.project)
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
