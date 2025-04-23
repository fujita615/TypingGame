<!-- ログイン処理を呼び出すボタン -->
<script setup lang='ts'>
const { loginGoogle } = useUser()
</script>

<template>
	<button
		class="c-button c-button--start p-button__item"

		@click="loginGoogle"
	>
		<strong>ログインしてから遊ぶ</strong><br /><br /> <small>※googleアカウントを利用します</small>
	</button>
</template>
