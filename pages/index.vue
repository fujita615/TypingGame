<!-- TOP画面 -->
<script setup lang="ts">
import { TIME_LIMIT } from '@/types/types'

definePageMeta({
	middleware: ['auth-check'],
})
const { openModal } = useModalComponent()
const categoryToken = useCookie('category',	{ readonly: true })
const { isLogin, requestAuthStatusFlg, requestUserStatusFlg } = useUser()
/** ページ再訪の形跡がなければwelcomeModalを呼び出す */
onMounted(() => {
	if (isLogin.value === false && !categoryToken.value) {
		openModal('welcome')
	}
})
</script>

<template>
	<div
		v-if="requestAuthStatusFlg"
		class="p-top"
	>
		<div class="l-main__section p-top__container">
			<div

				class="p-top__title"
			>
				<h1 class="c-head-line animate__animated animate__flip">
					Typing&nbsp;!
				</h1>
			</div>
			<div
				class="p-top__description"
			>
				<h2
					class="c-sub-heading c-sub-heading--article"
				>
					表示されている色の名前をtypingしてください
				</h2>
				<h3 class="c-sub-heading c-sub-heading--article">
					制限時間:{{ TIME_LIMIT }}秒
				</h3>
			</div>
			<ul
				class="p-button p-button__container"
			>
				<li
					class="p-game__button"
				>
					<NuxtLink
						:to="{ name: 'game', query: { category: 'color' } }"
					>
						<LoginButton v-if="!isLogin&&requestUserStatusFlg !== 'error'" /></NuxtLink>
				</li>

				<li class="p-game__button">
					<NuxtLink
						:to="{ name: 'game', query: { category: 'color' } }"
						class="c-button c-button--start p-button__item p-button__item--second"
						:class="{ 'c-button--is-login': isLogin || requestUserStatusFlg === 'error' }"
					>
						<p v-show="!isLogin&&requestUserStatusFlg !== 'error'">ログインせずに</p><strong>Play</strong>
					</NuxtLink>
				</li>
			</ul>
		</div>
	</div>
</template>
