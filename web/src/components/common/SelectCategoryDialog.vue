<template>
    <vs-dialog
        v-model="isShow"
        blur
    >
        <template #header>
            <h3>カテゴリー選択</h3>
        </template>

        <p class="explanation">あなたが興味のあるカテゴリーを５つ選択してください</p>

        <v-container>
            <v-row>
                <v-col cols='4'>
                    <vs-card type='2'>
                        <template #title>
                            <h4>Work</h4>
                        </template>
                        <template #text>
                            <p>あなたの仕事を管理しましょう</p>
                        </template>
                        <template #img>
                            <img src="@/assets/img/work.jpg" alt="">
                        </template>
                        <template #interactions>
                            <vs-checkbox val='work' v-model="categorys"/>
                        </template>
                    </vs-card>
                </v-col>
                <v-col cols='4'>
                    <vs-card type='2'>
                        <template #title>
                            <h4>Sleep</h4>
                        </template>
                        <template #text>
                            <p>あなたの仕事を管理しましょう</p>
                        </template>
                        <template #img>
                            <img src="@/assets/img/sleep.jpg" alt="">
                        </template>
                        <template #interactions>
                            <vs-checkbox val='sleep' v-model="categorys"/>
                        </template>
                    </vs-card>
                </v-col>
                <v-col cols='4'>
                    <vs-card type='2'>
                        <template #title>
                            <h4>Family</h4>
                        </template>
                        <template #text>
                            <p>あなたの仕事を管理しましょう</p>
                        </template>
                        <template #img>
                            <img src="@/assets/img/family.jpg" alt="">
                        </template>
                        <template #interactions>
                            <vs-checkbox val='family' v-model="categorys"/>
                        </template>
                    </vs-card>
                </v-col>
            </v-row>
            <v-row>
                <v-col cols='4'>
                    <vs-card type='2'>
                        <template #title>
                            <h4>Motion</h4>
                        </template>
                        <template #text>
                            <p>あなたの仕事を管理しましょう</p>
                        </template>
                        <template #img>
                            <img src="@/assets/img/motion.jpg" alt="">
                        </template>
                        <template #interactions>
                            <vs-checkbox val='motion' v-model="categorys"/>
                        </template>
                    </vs-card>
                </v-col>
                <v-col cols='4'>
                    <vs-card type='2'>
                        <template #title>
                            <h4>Friend</h4>
                        </template>
                        <template #text>
                            <p>あなたの仕事を管理しましょう</p>
                        </template>
                        <template #img>
                            <img src="@/assets/img/friend.jpg" alt="">
                        </template>
                        <template #interactions>
                            <vs-checkbox val='friend' v-model="categorys"/>
                        </template>
                    </vs-card>
                </v-col>
                <v-col cols='4'>
                    <vs-card type='2'>
                        <template #title>
                            <h4>Love</h4>
                        </template>
                        <template #text>
                            <p>あなたの仕事を管理しましょう</p>
                        </template>
                        <template #img>
                            <img src="@/assets/img/love.jpg" alt="">
                        </template>
                        <template #interactions>
                            <vs-checkbox val='love' v-model="categorys"/>
                        </template>
                    </vs-card>
                </v-col>
            </v-row>
            <v-row>
                <v-col cols='4'>
                    <vs-card type='2'>
                        <template #title>
                            <h4>Health</h4>
                        </template>
                        <template #text>
                            <p>あなたの仕事を管理しましょう</p>
                        </template>
                        <template #img>
                            <img src="@/assets/img/health.jpg" alt="">
                        </template>
                        <template #interactions>
                            <vs-checkbox val='health' v-model="categorys"/>
                        </template>
                    </vs-card>
                </v-col>
                <v-col cols='4'>
                    <vs-card type='2'>
                        <template #title>
                            <h4>Hobby</h4>
                        </template>
                        <template #text>
                            <p>あなたの仕事を管理しましょう</p>
                        </template>
                        <template #img>
                            <img src="@/assets/img/hobby.jpg" alt="">
                        </template>
                        <template #interactions>
                            <vs-checkbox val='hobby' v-model="categorys"/>
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
    export default {
        name: 'SelectCategoryDialog',
        data: () => ({
            isShow: false,
            id: null,
            name: null,
            valid: true,
            categorys: [],
        }),
        created () {
        },
        watch: {
            categorys: function (val) {
                this.valid = (val.length === 5) ? false : true
            }
        },
        methods: {
            open (id, name) {
                this.isShow = true
                this.id = id
                this.name = name
            },
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
            check () {
                this.categorys.push('work')
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
</style>