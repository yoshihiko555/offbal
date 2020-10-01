<!-- スタートページ切り替えのルートコンポーネント -->
<template>
    <div id='start-app'>
    </div>
</template>

<script>
    import { mapGetters } from 'vuex'
    import AuthService from '@/auth/AuthService'
    const auth = new AuthService()

    export default {
        name: 'StartApp',
        components: {
        },
        data: () => ({
        }),
        created () {
        	// auth.testCheckSession()
        	const prefix = (this.isCategory()) ? '/myapp/category' : '/myapp'
        	this.$router.push(`${prefix}/${this.setting.start_page}`)
        },
        computed: {
        	...mapGetters('setting', [
        		'setting',
        	])
        },
        methods: {
        	isCategory () {
        		if (this.setting.start_page === 'today' ||
        			this.setting.start_page === 'future-scheduled') {
        			// カテゴリーじゃない
        			return false
        		} else {
        			// カテゴリー
        			return true
        		}
        	}
        },
    }
</script>

<style lang="scss" scoped>
</style>