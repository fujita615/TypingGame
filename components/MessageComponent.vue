<!-- Flashメッセージ（注意喚起とs処理成功の２種類） -->
<script setup lang="ts">
const { flashMessage } = useMessage()
/**  注意喚起メッセージのCSSを充てるflg */
const checkAlert = computed((): boolean => {
	if (flashMessage.value.alert !== '') {
		return true
	}
	else {
		return false
	}
})
/**  成功メッセージのCSSを充てるflg */
const checkSuccess = computed((): boolean => {
	if (flashMessage.value.success !== '') {
		return true
	}
	else {
		return false
	}
})
/**  表示する文章 */
const messageCheck = computed((): string => {
	if (flashMessage.value.alert) {
		return flashMessage.value.alert
	}
	else if (flashMessage.value.success) {
		return flashMessage.value.success
	}
	else {
		return ''
	}
})
</script>

<template>
	<div
		v-show="messageCheck"
		class="p-message"
		:class="{
			'p-message--alert': checkAlert,
			'p-message--success': checkSuccess,
		}"
	>
		<div
			class="p-message__container"
			:class="{
				'p-message__container--alert': checkAlert,
				'p-message__container--success': checkSuccess,
			}"
		>
			<div
				v-show="checkSuccess"
				class="p-message__mark p-message__mark--success"
			>
				<Icon name="clarity:success-standard-solid" />
			</div>
			<div
				v-show="checkAlert"
				class="p-message__mark p-message__mark--alert"
			>
				<Icon name="iconamoon:attention-circle-fill" />
			</div>
			<div class="p-message__message">
				{{ messageCheck }}
			</div>
		</div>
	</div>
</template>
