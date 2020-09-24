<!-- セクションメニューのカテゴリー移動ボタン -->
<template>
    <v-menu
        bottom
        left
        offset-x
        min-width="250px"
        max-height="400px"
        transition="scroll-x-transition"
        v-model="isShow"
    >
        <template v-slot:activator="{ on, attrs }">
            <v-btn
                icon
                v-bind="attrs"
                v-on="on"
            >
                <v-icon
                    :color="category.color"
                >mdi-inbox</v-icon>
            </v-btn>
        </template>
        <v-list>
            <v-list-item-group>
                <div
                    v-for="(category, i) in categorys"
                    :key="i"
                >
                    <v-list-item
                        class="category_name"
                        @click="selectCategory(category)"
                    >
                        <v-icon
                            class="pl-1 mr-2"
                            :color="category.color"
                        >mdi-circle-medium</v-icon>
                        {{ category.name }}
                    </v-list-item>
                </div>
            </v-list-item-group>
        </v-list>
    </v-menu>
</template>
<script>
    import { Const } from '@/assets/js/const'
    import { mapGetters } from 'vuex'
    const Con = new Const()

    export default {
        name: 'MoveSectionBtn',
        data: () => ({
            category: {
                name: '',
                color: Con.NON_ACTIVE_COLOR,
                section: ''
            },
            isShow: false,
        }),
        computed: {
            ...mapGetters([
                'categorys',
            ])
        },
        methods: {
            selectCategory (category) {
                this.$emit('move-section', category)
            },
            open () {
                this.isShow = true
            }
        },
    }
</script>
<style lang='scss' scoped>
    .category_name {
        padding-top: 15px;
        height: 48px;
    }
    .v-btn {
        width: 0;
        opacity: 0;
        pointer-events: none;
    }
</style>
