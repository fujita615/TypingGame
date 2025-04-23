<!-- ユーザー名登録(変更)フォーム -->
<script setup lang="ts">
import { NICKNAME_MAX } from '@/types/types'
import Loader from '@/components/LoaderComponent.vue'

const { requestUserStatusFlg } = useUser()
const { inputNickname, validation, validationNickName, closeUserForm } = useUser()
// フォームへの入力を監視して、新入力があった時はバリデーションエラーメッセージを消去する
watch(
	() => inputNickname.value,
	(newValue) => {
		if (newValue !== '') {
			if (validation.value !== '') {
				validation.value = ''
			}
		}
	},
)
</script>

<template>
	<div class="p-modal">
		<div
			v-show="requestUserStatusFlg === 'pending'"
			class="p-modal__message"
		>
			<Loader>
				<template #body>
					With drawing...
				</template>
			</Loader>
		</div>

		<div
			v-show="requestUserStatusFlg!=='pending'"
			class="p-form p-modal__form"
		>
			<h3 class="c-sub-heading c-sub-heading--article">
				Register your NickName
			</h3>

			<div class="p-form__label">
				<strong>Username </strong><br />
				<small>rankingに公開される名前を登録してください &nbsp;&nbsp;<br class="c-br c-br--sp" />
					※{{	NICKNAME_MAX }}文字以内 &nbsp;&nbsp;<br class="c-br c-br--sp" />.（ピリオド）はご利用いただけません</small>
			</div>
			<div class="p-form__input">
				<input
					v-model="inputNickname"
					v-focus
					type="text"
					placeholder="登録名"
					class="c-input c-input--form"
				/>
				<div class="p-form__error">
					<label
						v-show="validation"
						class="p-form__error-message"
					>
						{{ validation }}
					</label>
				</div>
			</div>

			<button
				v-show=" inputNickname && !validation"
				type="button"
				class="c-button c-button--form p-form__button"
				:disabled="requestUserStatusFlg=='pending'"
				@click.prevent="validationNickName()"
			>
				登録する
			</button>
			<button
				v-show=" !inputNickname|| validation
				"
				type="button"
				class="c-button c-button--form p-form__button c-button--disabled"
			>
				Inputting...
			</button>
			<button
				type="button"
				class="c-button c-button--edit"
				:disabled="requestUserStatusFlg==='pending'"
				@click.prevent="closeUserForm"
			>
				登録を中止する
			</button>
		</div>
	</div>
</template>
