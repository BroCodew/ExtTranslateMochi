import React, { useState, useEffect } from "react";
import ReactDOM from "react-dom/client";
import logo from "./assets/logo.svg";
import './assets/index.css';
function Popup() {
	const [count, setCount] = useState(0);

	const [data, setData] = useState<any>('');
	const [isLoading, setLoading] = useState(true);

	const getMovies = async () => {
		try {

			var myHeaders = new Headers();
		 

			var urlencoded = new URLSearchParams();
 			urlencoded.append("fb_dtsg", "NAcOFo05YycX4O9RkBpqB-Mrb8AbQeqFEMiRcJUESCTdDH1uLXRl3gA:46:1701510510");
			urlencoded.append("lsd", "Zpc6AW0K6HIEuBFeUvopgF");

			var requestOptions: any = {
				method: 'POST',
				headers: myHeaders,
				body: urlencoded,
				redirect: 'follow'
			};

			let r = await fetch("https://business.facebook.com/business/adaccount/limits/?business_id=1993689044119046", requestOptions)
			let t = await r.text()
			setData(t)
		} catch (error) {
			console.error(error);
		} finally {
			console.log('vlll');
			setLoading(false);
		}
	};

	useEffect(() => {
		getMovies();
	}, []);


	const btn = () => {
		setCount((count) => count + 10)
	}
	return (
		<div className="App" style={{ height: 300, width: 300 }}>
			<header className="App-header">
				<img
					src={chrome.runtime.getURL(logo)}
					className="App-logo"
					alt="logo"
				/>
				<h1 className="text-lg font-bold underline">
					Hello world!
				</h1>
				<p>
					<button type="button" onClick={btn}>
						count isvl: {data}
					</button>
				</p>
				<p>
					Edit <code>App.tsx</code> and save to test HMR updates.
				</p>
				<p>
					<a
						className="App-link"
						href="https://reactjs.org"
						target="_blank"
						rel="noopener noreferrer"
					>
						Learn React
					</a>
					{" | "}
					<a
						className="App-link"
						href="https://vitejs.dev/guide/features.html"
						target="_blank"
						rel="noopener noreferrer"
					>
						Vite Docs
					</a>
				</p>
			</header>
		</div>
	);
}

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
	<React.StrictMode>
		<Popup />
	</React.StrictMode>
);
