<template>
    <button class="add_section_btn mt-2" @click="open">
        <!-- <i class='bx bx-plus-circle'></i> -->
        <span class="add_section">セクション追加</span>
    </button>
</template>

<script>
    export default {
        name: 'CreateSectionBtn',
        data: () => ({
        }),
        methods: {
            open () {
                this.$emit('open-create')
            }
        }
    }
</script>

<style lang='scss' scoped>
    .add_section_btn::v-deep {
        position: relative;
        width: 100%;
        color: #777;
        transition: .2s;

        &::before {
            position: absolute;
            top: 50%;
            z-index: 1;
            content: '';
            display: block;
            width: 100%;
            height: 1px;
            background-color: #ccc;
        }
        &:hover {
            color: #333;
        }

        .add_section {
            position:relative;
            display: inline-block;
            z-index: 2;
            margin: 0 2.5em;
            padding: 0 1em;
            background-color: #fff;
            text-align: center;
        }
    }
</style>