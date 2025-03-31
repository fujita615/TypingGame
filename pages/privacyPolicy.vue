<!-- privacy policy画面 -->
<script setup lang="ts">
definePageMeta({
	layout: 'privacy-policy',
})
</script>

<template>
	<div class="p-standard">
		<div class="p-standard__container">
			<h2 class="c-medium-heading c-medium-heading--section">
				当サイトについて
			</h2>
			<!-- 注意書きコンポーネント -->
			<CautionaryNote />
			<br />
			<!-- クッキーポリシーコンポーネント -->
			<CookiePolicy />
			<h3 class="c-sub-heading c-sub-heading--article">
				個人情報保護方針
			</h3>
			<p class="c-paragraph c-paragraph--article">
				
			</p>
		</div>
	</div>
</template>
