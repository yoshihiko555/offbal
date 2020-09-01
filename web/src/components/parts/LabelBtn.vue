<template>
    <v-menu
        bottom
        offset-y
        mix-width="250px"
        max-height="400px"
        transition="scroll-y-transition"
    >
        <template v-slot:activator="{ on, attrs }">
            <v-btn
                icon
                v-bind="attrs"
                v-on="on"
            >
                <v-icon
                    :color="label.color"
                >mdi-label-multiple-outline</v-icon>
            </v-btn>
        </template>
        <v-list>
            <v-list-item-group>
                <v-list-item
                    v-for="(label, i) in labels"
                    :key="i"
                    @click="selectLabel(label)"
                >
                    {{ label.name }}
                </v-list-item>
            </v-list-item-group>
        </v-list>
    </v-menu>
</template>
<script>
    import { mapGetters } from 'vuex'
    import { Const } from '@/assets/js/const'
    const Con = new Const()

    export default {
        name: 'LabelBtn',
        components: {},
        props: {},
        data: () => ({
            label: {
                name: '',
                color: Con.NON_ACTIVE_COLOR
            }
        }),
        created () {},
        mounted: function () {},
        watch: {
            'label.name': function (val) {
                this.label.color = (val.length > 0) ? Con.ACTIVE_COLOR : Con.NON_ACTIVE_COLOR
                this.$eventHub.$emit('create_task_info', 'label_list', [val])
            }
        },
        computed: {
            ...mapGetters([
                'labels',
            ])
        },
        methods: {
            selectLabel (label) {
                this.label.name = label.name
            }
        },
    }
</script>
<style lang='scss'>
</style>
