<!-- ページランディング時に表示する注意書きモーダル -->
<script setup lang="ts">
import { useModalComponent } from '~/composables/useModalComponent'

const { closeModal } = useModalComponent()
</script>

<template>
	<div class="p-modal">
		<div class="p-modal__dialog">
			<div class="p-modal__header">
				<h1 class="p-modal__title">
					当サイトはポートフォリオサイトです<br class="c-br c-br--sp" />
				</h1>
			</div>
			<div class="p-modal__body">
				<CautionaryNote />
			</div>
			<div class="p-modal__footer">
				<div @click="closeModal('welcome')">
					<strong> TOPページへ</strong>
				</div>
			</div>
		</div>
	</div>
</template>
