import { initializeApp } from 'firebase/app'

// Firebase 認証情報
export default defineNuxtPlugin(() => {
	const config = useRuntimeConfig()

	const firebaseConfig = {
		apiKey: config.public.firebaseApiKey,
		authDomain: config.public.firebaseAuthDomain,
		projectId: config.public.firebaseProjectId,
		storageBucket: config.public.firebaseStorageBucket,
		messagingSenderId: config.public.firebaseMessagingSenderId,
		appId: config.public.firebaseAppId,
	}
	// Firebase アプリの初期化
	initializeApp(firebaseConfig)
})
