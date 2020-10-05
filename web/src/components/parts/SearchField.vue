<template>
    <div>
        <vs-input v-model="text" placeholder="Search..." class='ml-2'>
            <template #icon>
                <i class='bx bx-search-alt-2' ></i>
            </template>
        </vs-input>
    </div>
</template>

<script>
export default {
    name: 'SearchField',
    data: () => ({
    	text: '',
    }),
	created () {
	},
    watch: {
        text: function (val) {
            if (val.length > 0) this.$eventHub.$emit('search-task', val)
        }
    },
    methods: {
    }
}
</script>

<style lang="scss" scoped>
</style>
