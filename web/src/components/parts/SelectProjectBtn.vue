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
                    :color="project.color"
                >mdi-inbox</v-icon>
            </v-btn>
        </template>
        <v-list>
            <v-list-item-group>
                <div
                    v-for="(project, i) in projects"
                    :key="i"
                >
                    <v-list-item
                        class="project_name"
                        @click="selectProject(project)"
                    >
                        <v-icon
                            class="pl-1 mr-2"
                            :color="project.color"
                        >mdi-circle-medium</v-icon>
                        {{ project.name }}
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
        name: 'ProjectBtn',
        data: () => ({
            project: {
                name: '',
                color: Con.NON_ACTIVE_COLOR,
                section: ''
            },
            isShow: false,
        }),
        computed: {
            ...mapGetters([
                'projects',
            ])
        },
        methods: {
            selectProject (project) {
                this.$emit('move-section', project)
            },
            open () {
                this.isShow = true
            }
        },
    }
</script>
<style lang='scss' scoped>
    .project_name {
        padding-top: 15px;
        height: 48px;
    }
    .v-btn {
        width: 0;
        opacity: 0;
        pointer-events: none;
    }
</style>
