<!-- エラー画面 -->
<script setup lang="ts">
import type { NuxtError } from '#app'

const props = defineProps({
	error: Object as () => NuxtError,
})
/** 画面表示するメッセージ */
const message = computed(() => {
	if (props.error !== undefined && props.error.statusCode === 404) {
		return 'ご指定のページは存在しません'
	}
	else {
		return '申し訳ございません.システムエラーが発生しております'
	}
})
/** エラーを初期化してTOP画面に遷移する */
const onBackButtonClick = () => {
	clearError({ redirect: '/' })
}
</script>

<template>
	<div
		v-if="message"
		class="l-wrapper"
	>
		<header class="l-header">
			<div class="l-header__container">
				<ul class="l-header__icon">
					<li>
						<NuxtLink :to="{ name: 'index' }"><Icon
							name="fluent:scan-type-24-filled"
							class="c-icon c-icon--header"
							@click="onBackButtonClick"
						/></NuxtLink>
					</li>
				</ul>
			</div>
		</header>
		<main class="l-main">
			<div
				class="p-error"
			>
				<br />
				<br /><p>{{ message }}</p>
				<br />
				<br />
				<NuxtLink
					:to="{ name: 'index' }"
					class="c-link c-link--hover"
					@click="onBackButtonClick"
				>
					TOPページへ
				</NuxtLink>
			</div>
		</main>
		<footer
			class="l-footer"
		>
			<ul class="l-footer__nav-container">
				<li class="l-footer__copyright">
					&copy;2025
					<NuxtLink
						:to="{ name: 'index' }"
						@click="onBackButtonClick"
					>typing&nbsp;! </NuxtLink>
				</li>
			</ul>
		</footer>
	</div>
</template>
