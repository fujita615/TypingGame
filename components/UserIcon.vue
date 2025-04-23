<!-- ドロップダウンをログイン中のみ表示させるコンポーネント -->
<script setup lang='ts'>
const { isLogin } = useUser()
</script>

<template>
	<li
		v-if="isLogin"
		class="p-timer__icon"
	>
		<DropDown />
	</li>
</template>
