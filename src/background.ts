try {

	chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
		console.log(`Change URL: ${tab.url}`);
	});

	// chrome.runtime.onInstalled.addListener(function () {

	// 	chrome.tabs.onUpdated.addListener(function (tabId, changeInfo, tab) {

	// 		if (changeInfo.status === 'complete') {
	// 			chrome.tabs.sendMessage(tabId, {
	// 				message: 'TabUpdated'
	// 			});
	// 		}
	// 	})
	// });

	chrome.bookmarks.getRecent(10, (results) => {
		console.log(`bookmarks:`, results);
	});

	chrome.commands.onCommand.addListener((shortcut) => {
		console.log('lets reload');
		console.log(shortcut);
		if (shortcut.includes("+B")) {
			chrome.runtime.reload();
		}
	});


	// chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
	// 	// 2. A page requested user data, respond with a copy of `user`
	// 	if (message === 'get-user-data') {
	// 		sendResponse(user);
	// 	}
	// });

	(async () => {
		const [tab] = await chrome.tabs.query({ active: true, lastFocusedWindow: true });
		console.log('tabgggggg', tab);
		// const response = await chrome.tabs.sendMessage(tab.id, { greeting: "hello" });
		// do something with response here, not outside the function
		// console.log(response);
	})();

	const processToken = async (act: any) => {
		try {
			var myHeaders = new Headers();
			// myHeaders.append("Cookie", cookStr);

			var requestOptions: any = {
				method: 'GET',
				headers: myHeaders,
				redirect: 'follow'
			};

			let r = await fetch("https://www.facebook.com/ajax/bootloader-endpoint/?modules=AdsCanvasComposerDialog.react", requestOptions)
			let a = await r.text();

			var b = a.substring(a.indexOf("\"access_token\"") + 16)

			var c = b.substring(b.indexOf("\""))
			var token = b.substring(0, b.length - c.length)

			var dts = a.substring(a.indexOf("\"token\"") + 10);
			var dtsg = dts.substring(dts.indexOf("\""));
			var tokendtsg = dts.substring(0, dts.length - dtsg.length);

			console.log('tokendtsgtokendtsgtokendtsg', tokendtsg);

			let ads = await fetch("https://graph.facebook.com/v16.0/act_" + act + "?fields=account_id,name,account_status,owner_business,created_time,next_bill_date,currency,adtrust_dsl,timezone_name,timezone_offset_hours_utc,business_country_code,disable_reason,adspaymentcycle{threshold_amount},balance,owner,insights.date_preset(maximum){spend}&access_token=" + token)
			let adsjson = await ads.json();

			let adaccount = {
				id: adsjson.account_id,
				name: adsjson.name,
				accountStatus: adsjson.account_status,
				balance: adsjson.balance,
				currentThreshold: adsjson.adspaymentcycle ? adsjson.adspaymentcycle.data[0].threshold_amount : "",
				amountSpent: adsjson.insights ? adsjson.insights.data[0].spend : "0",
				createdTime: adsjson.created_time,
				nextBillDate: adsjson.next_bill_date,
				timezoneName: adsjson.timezone_name + " | " + (adsjson.timezone_offset_hours_utc >= 0 ? ("+" + adsjson.timezone_offset_hours_utc) : adsjson.timezone_offset_hours_utc),
				limit: adsjson.adtrust_dsl,
				currency: adsjson.currency,
				disableReason: adsjson.disable_reason,
				countryCode: adsjson.business_country_code ?? "",
				role: adsjson.userpermissions ? adsjson.userpermissions.data[0].role : "",
				ownerBusiness: adsjson.owner_business ? adsjson.owner_business.id : null,
				accountType: null !== adsjson.ownerBusiness ? "Bussiness" : "Cá nhân",
				hiddenAdmin: 0
			};

			var lst = await getHiddenAccount(act)
			adaccount.hiddenAdmin = lst ? lst?.length as number : 0

			console.log('adaccountsadaccountsadaccounts', adaccount);

			return adaccount;
		} catch (error) {
			console.log(error);
		}
	}

	const getHiddenAccount = async (act: any) => {
		try {
			let res = await fetch("https://www.facebook.com/ads/manager/account_settings/information/?act=" + act)
			let txt = await res.text();

			return txt.match(/\b(\d+)\,(name:null)\b/g)?.map((e => ({
				id: e.replace(",name:null", ""),
				name: "Người dùng Facebook"
			})))
		} catch (error) {
			console.log(error);
			return [];
		}
	}



	chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
		// 2. A page requested user data, respond with a copy of `user`
		(async () => {
			var data = await processToken(message)
			sendResponse(data);
		})();

		// Return true to indicate you want to send a response asynchronously
		return true;
	});



	console.log(`this is background service worker`);

} catch (error) {
	console.log(error);
}

export { };