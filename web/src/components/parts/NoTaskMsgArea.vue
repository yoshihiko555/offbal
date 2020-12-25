<template>
    <v-card
        flat
    >
        <p
            class="no_task_area_text"
        >
            {{ defaultMsg }}
        </p>
    </v-card>
</template>
<script>
    import { Const } from '@/assets/js/const'
    const Con = new Const()

    export default {
        name: 'NoTaskMsgArea',
        components: {
        },
        props: {
            type: {
                type: Number,
                required: false,
                default: 0
            }
        },
        data: () => ({
        }),
        computed: {
            defaultMsg () {
                return Con.NO_TASK_MSG[this.type]
            }
        }
    }

</script>
<style lang="scss" scoped>
    .no_task_area_text {
        height: 20px;
        padding: 1px 6px;
    }
</style>
