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
    import { mapGetters } from 'vuex'

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
                    const prefix = (this.isCategory()) ? '/myapp/category' : '/myapp'
                	this.$router.push(`${prefix}/${this.setting.start_page}`)
                }
            },
        },
        computed: {
            ...mapGetters('setting', [
                'setting',
            ])
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
            isCategory () {
        		if (this.setting.start_page === 'today' ||
        			this.setting.start_page === 'future-scheduled') {
        			// カテゴリーじゃない
        			return false
        		} else {
        			// カテゴリー
        			return true
        		}
        	},
        }
    }
</script>

<style lang="scss" scoped>
</style>
