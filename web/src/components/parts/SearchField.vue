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
    import _ from 'lodash'

    export default {
        name: 'SearchField',
        data: () => ({
        	text: '',
            path: '',
        }),
    	created () {
    	},
        watch: {
            text: function (val) {
                if (val.length > 0) {
                    this.path = this.$route.path
                    this.search(val)
                } else {
                    this.$router.push('/myapp')
                }
            },
        },
        methods: {
            search: _.debounce(function search (searchText) {
                this.$eventHub.$emit('closeTaskDetail')
                const trimedText = this.trim(searchText)
                const trimedTextList = [...new Set(trimedText.split(/\s+/))]
                const searchWord = trimedTextList.join(',')
                this.$router.push({
                    name: 'SearchResult',
                    query: {
                        text: searchWord
                    }
                })
            }, 100),
            trim (word) {
                return String(word).replace(/^\s+|\s+$/g, '')
            },
        }
    }
</script>

<style lang="scss" scoped>
</style>
