<template>
    <v-container>
        <!-- カルマの有効化 -->
        <v-row>
            <v-col cols='12'>
                <h4>カルマの有効化</h4>
                <p>カルマを使ってモチベーションを保ちましょう</p>

                <vs-switch v-model="active" />
            </v-col>
        </v-row>

        <!-- 一日のゴール -->
        <v-row>
            <v-col cols='12'>
                <h4>一日のゴール</h4>
                <p>毎日の小さなステップが、あなたを大きく成長させます</p>
            </v-col>
        </v-row>

        <!-- 休日 -->
        <v-row>
            <v-col cols='12'>
                <h4>休日</h4>
                <p>リフレッシュも大切です</p>
            </v-col>
        </v-row>

        <!-- バケーションモード -->
        <v-row>
            <v-col cols='12'>
                <h4>バケーションモード</h4>
                <p>バケーションモードがオンの間は、ゴールを達成していなくてもカルマに影響はありません</p>
                <vs-switch v-model="vacation" />
            </v-col>
        </v-row>
        <v-divider/>
        <v-row>
            <v-col cols='12'>
                <vs-button>保存</vs-button>
            </v-col>
        </v-row>
    </v-container>
</template>

<script>
    export default {
        name: 'KamraSetting',
        components: {
        },
        data: () => ({
            active: true,
            vacation: false,
        }),
        created () {
        },
        computed: {
        },
        methods: {
        },
    }
</script>

<style lang="scss" scoped>
</style>
