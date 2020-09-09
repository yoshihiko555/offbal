<template>
    <div>
        <v-tooltip
            v-if="isSelected"
            top
            activator="#label_btn"
            z-index=99000
            open-delay=250
        >
            <span>{{ labelValue }}</span>
        </v-tooltip>
        <v-tooltip
            v-else
            top
            activator="#label_btn"
            z-index=99000
            open-delay=250
        >
            <span>ラベルを設定</span>
        </v-tooltip>
        <v-menu
            :close-on-content-click="false"
            offset-x
            rounded="true"
            v-model="menu"
            min-width="250px"
        >
            <template v-slot:activator="{ on, attrs }">
                <div id="label_btn">
                    <v-btn
                        icon
                        v-bind="attrs"
                        v-on="on"
                    >
                        <v-icon
                            :color="labelColor"
                        >mdi-label-multiple-outline</v-icon>
                    </v-btn>
                </div>
            </template>
            <v-card>
                <v-card-actions
                    class="label_select_area_wrap"
                >
                    <vs-select
                        placeholder='Select Label'
                        v-model='selectLabelList'
                        multiple
                        filter
                        collapse-chips
                    >
                        <vs-option
                            v-for='(label, i) in labels'
                            :key='i'
                            :label='label.name'
                            :value='label.id'
                            filter
                        >{{ label.name }}
                        </vs-option>
                    </vs-select>
                </v-card-actions>
                <v-card-actions>
                    <v-spacer></v-spacer>
                        <v-btn text @click="menu = false">cancel</v-btn>
                        <v-btn color="primary" text @click="menu = false">ok</v-btn>
                </v-card-actions>
            </v-card>
        </v-menu>
    </div>
</template>
<script>
    import { mapGetters } from 'vuex'
    import { Const } from '@/assets/js/const'
    const Con = new Const()

    export default {
        name: 'LabelBtn',
        components: {},
        props: {
            defaultLabelList: {
                type: Array,
                required: false,
                default: () => ([])
            },
        },
        data: () => ({
            labelColor: Con.NON_ACTIVE_COLOR,
            selectLabelList: [],
            menu: false,
        }),
        created () {
            for (const i in this.defaultLabelList) {
                this.selectLabelList.push(this.defaultLabelList[i].id)
            }
        },
        mounted: function () {
        },
        watch: {
            selectLabelList: function (val) {
                this.labelColor = (val.length > 0) ? Con.ACTIVE_COLOR : Con.NON_ACTIVE_COLOR
                this.$eventHub.$emit('create_task_info', 'label_list', val)
            }
        },
        computed: {
            ...mapGetters([
                'labels',
            ]),
            isSelected () {
                return this.selectLabelList.length > 0
            },
            labelValue () {
                // 選択済みのラベルをカンマ区切りで出力
                let res = ''
                let multi = false
                for (const i in this.selectLabelList) {
                    const label = this.labels.filter(label => label.id === this.selectLabelList[i])[0]
                    if (multi) res += ', '
                    res += label.name
                    multi = true
                }
                return res
            }
        },
        methods: {},
    }
</script>
<style lang='scss' scoped>
    .label_select_area_wrap {
        padding: 20px 20px 0px 20px;
    }
</style>
