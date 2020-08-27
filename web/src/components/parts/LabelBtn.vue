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
                    :color="selectedLabelColor"
                >mdi-label-multiple-outline</v-icon>
            </v-btn>
        </template>
        <v-list>
            <v-list-item-group>
                <v-list-item
                    v-for="(label, i) in labelList"
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
    import { Const } from '@/assets/js/const'
    const Con = new Const()

    export default {
        name: 'LabelBtn',
        props: {
        },
        data: () => ({
            labelList: [
                {
                    name: 'programming'
                },
                {
                    name: 'english'
                },
                {
                    name: 'music'
                }
            ],
            selectedLabel: '',
            selectedLabelColor: Con.NON_ACTIVE_COLOR
        }),
        created () {
        },
        mounted: function () {
        },
        methods: {
            selectLabel (value) {
                this.selectedLabel = value.name
            }
        },
        watch: {
            selectedLabel: function (val) {
                if (val.length > 0) {
                    this.selectedLabelColor = Con.ACTIVE_COLOR
                } else {
                    this.selectedLabelColor = Con.NON_ACTIVE_COLOR
                }
            }
        }
    }
</script>
<style lang='scss'>
</style>
