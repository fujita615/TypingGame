<!-- gameページのレイアウト ログイン状態とgameの進行状況でheaderの表示内容を切り替える -->
<script setup lang="ts">
import BestScore from '@/components/BestScore.vue'
import UserIcon from '@/components/UserIcon.vue'

const { gameFlg, countNum, reset } = useGame()
const { isLogin, requestAuthStatusFlg } = useUser()
</script>

<template>
	<div class="l-wrapper">
		<header class="l-header">
			<div class="l-header__container">
				<ul class="l-header__icon">
					<li>
						<NuxtLink :to="{ name: 'index' }"><Icon
							name="fluent:scan-type-24-filled"
							class="c-icon c-icon--head-user"
							@click="reset"
						/></NuxtLink>
					</li>
					<BestScore v-if="gameFlg !== 'playing'&& isLogin" />
				</ul>
				<ul
					v-if="gameFlg === 'playing'"
					class="l-header__nav p-timer"
				>
					<li class="p-timer__icon">
						<Icon
							name="clarity:alarm-clock-outline-badged"
							class=" c-nav__item"
						/>
					</li>

					<li class="p-timer__count">
						{{ countNum }}
					</li>
				</ul>
				<ul
					v-if="gameFlg !== 'playing'&& isLogin"
					class="l-header__nav"
				>
					<UserIcon />
				</ul>
			</div>
		</header>

		<!-- ブラウザのjavascriptが無効だった時の画面表示  -->
		<main
			v-if="!requestAuthStatusFlg"
			class="l-main"
		>
			<div class="p-standard">
				<div class="p-standard__container p-standard__container--appear">
					<h2 class="c-sub-heading c-sub-heading--article">
						当サイトはブラウザのJavaScriptを有効にしてご試用ください
						<br />一部機能はgoogleアカウント,cookieを利用しています
					</h2>
					<CautionaryNote />
					<CookiePolicy />
				</div>
			</div>
		</main>
		<slot />
		<footer
			v-if="gameFlg !== 'playing'"
			class="l-footer"
		>
			<ul class="l-footer__nav-container">
				<li class="l-footer__link c-nav">
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
