<!-- ユーザー登録削除フォーム -->
<script setup lang="ts">
import Loader from '@/components/LoaderComponent.vue'
const { closeModal, modalFlg } = useModalComponent()
const { deleteGoogle, requestUserStatusFlg } = useUser()
</script>

<template>
	<div>
		<div
			v-if="requestUserStatusFlg !=='pending'"
			v-show="modalFlg.userDelete.isShow"
			class="p-modal"
		>
			<div class="p-modal__dialog">
				<div class="p-modal__header">
					<h1 class="p-modal__title">
						ユーザー登録の削除
					</h1>
				</div>
				<div class="p-modal__body">
					<p>
						ユーザー登録を削除するとニックネーム、スコアの記録など全て削除されます。
						この操作は元に戻せません。
					</p>
				</div>
				<div class="p-modal__footer">
					<button
						type="button"
						class="c-button c-button--dialog"
						:disabled="requestUserStatusFlg !=='init'"
						@click.prevent="deleteGoogle"
					>
						ユーザー登録を完全に削除する
					</button>
					<button
						type="button"
						class="c-button c-button--edit"
						@click.prevent="closeModal('userDelete')"
					>
						削除を中止
					</button>
				</div>
			</div>
		</div>
		<div
			v-show="requestUserStatusFlg === 'pending'"
			class="p-modal__message"
		>
			<Loader>
				<template #body>
					With deleting...
				</template>
			</Loader>
		</div>
	</div>
</template>
