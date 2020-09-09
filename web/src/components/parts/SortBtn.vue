<template>
    <v-menu
        offset-y
        transition="slide-y-transition"
    >
        <template #activator='{ attrs, on }'>
            <vs-button
                icon
                relief
                v-bind='attrs'
                v-on='on'
            >
                <i class='bx bx-slider-alt'></i>
            </vs-button>
        </template>

        <v-list>
            <v-list-item
                v-for='(menu, i) in menus'
                :key='i'
                @click='sort(menu.type)'
            >
                <v-list-item-icon class="mr-0">
                    <v-icon small v-text='menu.icon'/>
                </v-list-item-icon>
                <v-list-item-title>{{ menu.name }}</v-list-item-title>
            </v-list-item>
        </v-list>
    </v-menu>
</template>

<script>
    import { mapGetters, mapActions } from 'vuex'

    export default {
        name: 'SortBtn',
        data () {
        	return {
                menus: [
                    {
                        name: '優先度',
                        icon: 'mdi-star',
                        type: 'priority',
                    },
                    {
                        name: '期限日',
                        icon: 'mdi-calendar-month-outline',
                        type: 'deadline',
                    },
                    {
                        name: 'あいうえお順',
                        icon: 'mdi-sort',
                        type: 'content',
                    },
                    {
                        name: '作成日',
                        icon: 'mdi-calendar-plus',
                        type: 'created_at',
                    },
                ],
        	}
        },
        computed: {
            ...mapGetters([
                'detailProject',
            ])
        },
        methods: {
            ...mapActions([
                'updateProjectAction',
            ]),
        	sort (type) {
                this.$axios({
                    url: `/api/project/${this.detailProject.id}/order_tasks/`,
                    method: 'GET',
                    params: {
                        ordering_type: type,
                    }
                })
                .then(res => {
                    console.log(res)
                    this.updateProjectAction(res.data)
                })
                .catch(e => {
                    console.log(e)
                })
        	},
        }
    }
</script>

<style lang='scss'>
</style>
