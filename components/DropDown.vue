<!-- ユーザー情報処理へのリンクをリスト表示するドロップダウン（NuxtUI利用） -->
<script setup lang="ts">
import { useModalComponent } from '~/composables/useModalComponent'

const { logout, showUserForm, requestUserStatusFlg } = useUser()
const { openModal } = useModalComponent()
const items = [
	[{
		label: 'ユーザー名変更',
		click: () => showUserForm(),
	},
	{
		label: 'ユーザー登録削除',
		click: () => {
			openModal('userDelete')
		},
	}], [{
		label: 'ログアウト',
		click: () => logout(),
	}],
]
</script>

<template>
	<UDropdown
		v-if="requestUserStatusFlg !=='error'"
		:items="items"
		:popper="{ placement: 'bottom-start' }"
		mode="hover"
		:ui="{
			wrapper: 'relative inline-flex text-left rtl:text-right',
			container: 'z-20 group',
			trigger: 'inline-flex w-full',
			width: 'w-60',
			height: '',
			background: 'bg-white dark:bg-gray-800',
			shadow: 'shadow-lg',
			rounded: 'rounded-md',
			ring: 'ring-1 ring-gray-200 dark:ring-gray-700',
			base: 'relative focus:outline-none overflow-y-auto scroll-py-1',
			divide: 'divide-y divide-gray-200 dark:divide-gray-700',
			padding: 'p-1',
			item: {
				base: 'group flex items-center gap-1.5 w-full',
				rounded: 'rounded-md',
				padding: 'px-1.5 py-1.5',
				size: 'text-2xl',
				active: 'bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-white',
				inactive: 'text-gray-700 dark:text-gray-200',
				disabled: 'cursor-not-allowed opacity-50',
				icon: {
					base: 'flex-shrink-0 w-5 h-5',
					active: 'text-gray-500 dark:text-gray-400',
					inactive: 'text-gray-400 dark:text-gray-500',
				},

				label: 'truncate',
				shortcuts: 'hidden md:inline-flex flex-shrink-0 gap-0.5 ms-auto',
			},
			transition: {
				enterActiveClass: 'transition duration-100 ease-out',
				enterFromClass: 'transform scale-95 opacity-0',
				enterToClass: 'transform scale-100 opacity-100',
				leaveActiveClass: 'transition duration-75 ease-in',
				leaveFromClass: 'transform scale-100 opacity-100',
				leaveToClass: 'transform scale-95 opacity-0',
			},
			popper: {
				placement: 'bottom-end',
				strategy: 'fixed',
			},
			default: {
				openDelay: 0,
				closeDelay: 0,
			},
			arrow: {
				base: 'invisible before:visible before:block before:rotate-45 before:z-[-1] before:w-2 before:h-2',
				ring: 'before:ring-1 before:ring-gray-200 dark:before:ring-gray-700',
				rounded: 'before:rounded-sm',
				background: 'before:bg-white dark:before:bg-gray-700',
				shadow: 'before:shadow',
			},
		}"
	>
		<Icon
			name="uil:user-circle"
			class="c-icon c-icon--header"
		/>
	</UDropdown>
</template>
