<!-- 【PrivacyPolicyページのレイアウト】ログイン状態でheaderの表示内容を切り替える -->
<script setup lang="ts">
const { reset } = useGame()
const { isLogin } = useUser()
</script>

<template>
	<div class="l-wrapper">
		<header class="l-header">
			<div class="l-header__container">
				<ul class="l-header__icon">
					<li>
						<NuxtLink :to="{ name: 'index' }"><Icon
							name="fluent:scan-type-24-filled"
							class="c-icon c-icon--header"
							@click="reset"
						/></NuxtLink>
					</li>
				</ul>
				<ul
					v-if="isLogin"
					class="l-header__nav"
				>
					<UserIcon />
				</ul>
			</div>
		</header>

		<slot />
		<footer
			class="l-footer"
		>
			<ul class="l-footer__nav-container">
				<li class="l-footer__link">
					<a
						href=""
						target="_blank"
						rel="noopener noreferrer"
						class="c-nav__link c-nav__link--sns"
					>
						<Icon name="uil:github" />
					</a>
				</li>
				<li class="l-footer__link c-nav__link c-nav__link--footer">
					<NuxtLink :to="{ name: 'privacyPolicy' }">policy</NuxtLink>
				</li>
				&copy;2025 &nbsp;
				<li class="l-footer__copyright">
					<NuxtLink
						:to="{ name: 'index' }"
						@click="reset"
					>typing&nbsp;! </NuxtLink>
				</li>
			</ul>
		</footer>
	</div>
</template>
