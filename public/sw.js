self.addEventListener("install", (event) => {
	event.waitUntil(self.skipWaiting());
	console.log("Service Worker installed");
});

self.addEventListener("activate", (event) => {
	event.waitUntil(self.clients.claim());
	startPeriodicSync();
	console.log("Service Worker activated");
});

function startPeriodicSync() {
	setTimeout(async function syncData() {
		// ここに定期的に実行したい処理を記述
		console.log("定期的に実行されています");

		// const url = "https://hooks.slack.com/services/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";
		// const payload = {
		//   text: `ホーム地点までの距離は ${distance.value.toFixed(0)} m だよ．けろけろ．`,
		// };
		// fetch(url, {
		//   method: "POST",
		//   headers: {
		//     "Content-Type": "application/json",
		//   },
		//   body: JSON.stringify(payload),
		// });

		// 再度 5 秒後に実行
		setTimeout(syncData, 1000);
	}, 1000);
}

