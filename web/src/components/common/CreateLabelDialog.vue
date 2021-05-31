<template>
    <vs-dialog v-model="dialog" width="300px" prevent-close not-close>
        <v-container
            fluid
            class="pb-0"
        >
            <h5
                align="center"
            >
                新規ラベルを追加
            </h5>
            <ValidationObserver v-slot="{ invalid }">
                <v-row>
                    <v-col cols='12'>
                        <!-- ラベル名 -->
                        <ValidationProvider v-slot='{ errors }' name='ラベル名' rules='required'>
                            <vs-input
                                class="my-6"
                                v-model="label.name"
                                label='ラベル名'
                            >
                                <template #message-danger>
                                    {{ errors[0] }}
                                </template>
                            </vs-input>
                        </ValidationProvider>

                        <div class="create_label_btn_wrap">
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
        name: 'CreateLabelDialog',
        data: () => ({
            dialog: false,
            label: {
                name: '',
                color: '',
            },
            colorList: Con.CATEGORY_COLOR,
        }),
        methods: {
            ...mapActions([
                'addLabelAction',
            ]),
            open () {
            	this.init()
                this.dialog = true
            },
            close () {
                this.dialog = false
            },
            create () {
                console.log(this.label)
                this.$axios({
                	url: '/api/label/',
                	method: 'POST',
                	data: this.label,
                })
                .then(res => {
                	console.log(res)
                    this.addLabelAction(res.data)
                    this.close()
                })
                .catch(e => {
                	console.log(e.response)
                })
            },
            init () {
            	this.label = {
            		name: '',
            		color: ''
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
    .create_label_btn_wrap {
        display: flex;
        justify-content: flex-end;
    }
</style>
