import React, { useEffect, useState } from "react";
import ReactDOM from "react-dom/client";
import Item from "../components/display/display";
import '../assets/index.css';
import { AiFillShop, AiFillMinusCircle, AiFillFund, AiFillWallet, AiFillPlusCircle, AiFillReconciliation, AiFillEyeInvisible, AiFillHourglass, AiFillCreditCard, AiOutlineFileSearch } from 'react-icons/ai';
import { BsFillBagFill, BsFillPersonVcardFill, BsPersonVcardFill } from 'react-icons/bs';
import { LuCalendarSearch } from 'react-icons/lu';
import { MdMinimize } from 'react-icons/md';
import Logo from "../assets/logo.png";
import LogoDetail from "../assets/logoDetail.png";
import moment from "moment";

function ContentScript() {
	const [isOpen, setIsOpen] = useState(false)
	const [data, setData] = useState<any>({});
	const [isLoading, setLoading] = useState(true);
	const [isChangeData, setIsChangeData] = useState(false);

	const getData = async (rData: any) => {
		setData(rData);
		setIsChangeData(true);
		// setIsStatus(data?.account_status == 1 ?  );
	}

	const fData = async () => {
		//Get Ads_account_id
		var params = new URLSearchParams(window.location.search);
		var act = params.get("asset_id") || params.get("act");

		chrome.runtime.sendMessage(act, async (data: any) => {
			getData(data);
		});
	}

	const open = () => {
		setIsOpen(!isOpen);
	}

	useEffect(() => {
		(async () => {
			await fData();
		})()
	}, [isChangeData]);

	const formatCurrency = (number: any) => {
		try {
			let numberConvert = parseFloat(number);
			if (!isNaN(numberConvert)) {
				return numberConvert.toLocaleString('en-US');
			}
			return 0;
		} catch (error) {
			return 0;
		}
	};

	const RenderStatusComponent = ({ currency, status }: any) => {
		switch (status) {
			case 1:
				return (
					<span className="textActive">{currency} | Active </span>
				)
			case 2:
				return (<span className="textDisable">{currency} | Disable</span>
				)
			default:
				return (
					<span className="textDebt">{currency} | Debt</span>)
		}
	};

	return (
		<div className=" container mx-auto ">
			<div>
				<button onClick={open}>
					<div className=" btnClick ">
						<div className="circle">
							<img
								src={chrome.runtime.getURL(Logo)}
								width="50px"
								height="50px"
								style={{ borderRadius: "50%", paddingLeft: 10 }}
								alt="Logo" />
						</div>
					</div>
				</button>
			</div>
			{isOpen &&
				<main className="showView">
					<div className="showTop">
						<div className="topIcon">
							<div className="topIconSquare">
								<LuCalendarSearch color='#1577f2' size={16} />
							</div>
						</div>

						<div className="topTitle">
							<p className="topTileText">Ads Check By Ads.com</p>
						</div>

						<div className="topLink">
							<a href="https://adsaved.com/" target="_blank" className="no-underline-link">
								<button className="topButtonLink">
									<p className="topButtonLinkText">ADS.COM</p>
								</button>
							</a>
						</div>

						<div className="topClose">
							<button onClick={open} className="topCloseSquare">
								<MdMinimize color='#1767d6' size={16} />
							</button>
						</div>
					</div>

					<div className="showBetween">
						<Item icon={<AiFillShop color='#1577f2' size={22} />} title='Account status' value={<RenderStatusComponent currency={data?.currency} status={data?.accountStatus} />} />

						<Item icon={<AiFillMinusCircle color='#1577f2' size={22} />} title='Daily spending limit' value={`${formatCurrency(data?.limit)} ${data?.currency}`} id='1' />

						<Item icon={<AiFillFund color='#1577f2' size={22} />} title='Current threshold' value={data?.currentThreshold} />

						<Item icon={<AiFillWallet color='#1577f2' size={22} />} title='Surplus' value={`${formatCurrency(data?.balance)} ${data?.currency}`} />

						<Item icon={<BsFillBagFill color='#1577f2' size={22} />} title='Spending total' value={`${formatCurrency(data?.amountSpent)} ${data?.currency}`} />

						<Item icon={<AiFillPlusCircle color='#1577f2' size={22} />} title='Account creation date' value={moment(data?.createdTime).format('DD/MM/YYYY')} />

						<Item icon={<AiFillReconciliation color='#1577f2' size={22} />} title='Invoice date' value={moment(data?.nextBillDate).format('DD/MM/YYYY')} />

						<Item icon={<AiFillEyeInvisible color='#1577f2' size={22} />} title='Hidden admin' value={data?.hiddenAdmin} />

						<Item icon={<BsFillPersonVcardFill color='#1577f2' size={22} />} title='Account type' value={data?.accountType} id='2' accType='Individual' />

						<Item icon={<AiFillHourglass color='#1577f2' size={22} />} title='Time zone' value={data?.timezoneName} />

						<Item icon={<BsPersonVcardFill color='#1577f2' size={22} />} title='Account name' value={data?.name} />

						{/* <Item icon={<AiFillCreditCard color='#1577f2' size={22} />} title='Payment card' value={data?.paymentCard} />

						<Item icon={<AiFillFund color='#1577f2' size={22} />} title='Payment rights' value={data?.accountPermissions} /> */}
					</div>

					<div className="showBottom">
						<div className="bottomLeft">
							<p>
								<span className="bottomLeftTextName">ADS.COM</span> <span className="bottomLeftTextValue" > - Solution for advertisers</span>
							</p>
						</div>

						<div className="bottomRight">
							<img
								src={chrome.runtime.getURL(LogoDetail)}
								width="45px"
								height="45px"
								style={{ borderRadius: "50%" }}
								alt="Logo detail" />
						</div>
					</div>

				</main>
			}
		</div>
	);
}

const index = document.createElement("div");
index.id = "content-script";
document.body.appendChild(index);

ReactDOM.createRoot(index).render(
	<React.StrictMode>
		<ContentScript />
	</React.StrictMode>
);


// console.log('requestrequest', chrome.runtime.onMessage);

// chrome.runtime.onMessage.addListener(async (request) => {
// 	console.log('requestrequest11', request);
// })

// chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
// 	console.log('requestrequestrequest', request);
// })


// const newDiv = document.createElement("div");
// newDiv.id = "ex-billing-list";

// const index2 = document.getElementsByClassName(
// 	"xeuugli x2lwn1j x78zum5 xdt5ytf x1iyjqo2 x2lah0s xozqiw3 x1kxxb1g xxc7z9f x1cvmir6"
// )[0];

// console.log('index2index2', index2);

// if (index2 != undefined) {

// 	index2.appendChild(newDiv);

// 	ReactDOM.createRoot(newDiv).render(
// 		<React.StrictMode>
// 			<ContentScript2 url={document.location.href} />
// 		</React.StrictMode>
// 	);;
// }

// chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
// 	if (request.message === 'TabUpdated') {

// 		const newDiv = document.createElement("div");
// 		newDiv.id = "ex-billing-list";

// 		const index2 = document.getElementsByClassName(
// 			"xeuugli x2lwn1j x78zum5 xdt5ytf x1iyjqo2 x2lah0s xozqiw3 x1kxxb1g xxc7z9f x1cvmir6"
// 		)[0];

// 		console.log('index2index2', index2);

// 		if (index2 != undefined) {

// 			index2.appendChild(newDiv);

// 			ReactDOM.createRoot(newDiv).render(
// 				<React.StrictMode>
// 					<ContentScript2 url={document.location.href} />
// 				</React.StrictMode>
// 			);;
// 		}

// 	}
// })









