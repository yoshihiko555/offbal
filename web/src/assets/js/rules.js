import { extend, localize } from 'vee-validate'
import { required, max } from 'vee-validate/dist/rules'
import ja from 'vee-validate/dist/locale/ja.json'

export default function myRules () {
	localize('ja', ja)
	extend('required', required)
	extend('max', max)

	// カスタムルール設定の例
	extend('sample', {
		validate: v => v === 'a',
		message: 'aじゃない',
	})
}