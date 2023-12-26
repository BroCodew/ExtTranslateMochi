import "../assets/index.css";
import Logo from "../assets/logo.png";
import React, {useEffect, useRef, useState} from "react";
import ReactDOM from "react-dom/client";
import TranslateIcon from "../images/Icon_Translate.png";
import './styles/index.scss'
import ReactDOMServer from "react-dom/server";
import LogoDetail from "../assets/logoDetail.png";

import Close from "../images/Icon_close.png";
import Copy from "../images/Icon_copy.png";
import Setting from "../images/Icon_setting.png";
import Speaker from "../images/Icon_speaker.png";
import Translate from "../images/Icon_Translate.png";


function ContentScript() {
    const [selectedText, setSelectedText] = useState("");
    const [checkLocation, setCheckLocation] = useState(false)
    const tooltipWrapperRef = useRef(null);
    const tooltipResultRef = useRef(null);

    const bodyDom = document.querySelector("body");

    const getSelectedText = () => {
        let newText = "";
        if (window.getSelection) {
            const selection = window.getSelection();
            newText = selection?.toString() || "";
        } else if (document.getSelection) {
            const selection = document.getSelection();
            newText = selection?.toString() || "";
        }
        setSelectedText(newText);
        return newText;
    };

    const getSelectedTextNode = () => {
        let newText = "" || {};
        if (window.getSelection) {
            newText = window.getSelection().getRangeAt(0);
        } else if (document.getSelection) {
            newText = document.getSelection().getRangeAt(0);
        }
        return newText;
    };

    const isVisible = (elem) => !!elem && !!(elem.offsetWidth || elem.offsetHeight || elem.getClientRects().length);
    const hideOnClickOutside = (element) => {
        const outsideClickListener = (event) => {
            console.log('!element.contains(event.target)', !element.contains(event.target))
            console.log("isVisible(element)", isVisible(element))
            if (!element.contains(event.target) && isVisible(element)) {
                element.style.display = 'none';
                console.log('element', element)
                removeClickListener();
            }
        };
        const removeClickListener = () => {
            document.removeEventListener('click', outsideClickListener);
        };
        document.addEventListener('click', outsideClickListener);
        return removeClickListener;
    };

    const hideTooltipOnClickOutside = () => {
        if (tooltipWrapperRef.current) {
            console.log('tooltipWrapperRef.current', tooltipWrapperRef.current)
            hideOnClickOutside(tooltipWrapperRef.current);
            setCheckLocation(true)
        }
        if (tooltipResultRef.current) {
            hideOnClickOutside(tooltipResultRef.current);
        }
    };

    const renderTooltip = (selectionLocation, selectionText) => {
        tooltipWrapperRef.current = document.createElement("div");
        tooltipWrapperRef.current.id = "translator-ext-rhp";
        const tooltipIcon = document.createElement("div");
        tooltipIcon.classList.add("translator-ext-icon");
        tooltipIcon.innerHTML = `<img src="${chrome.runtime.getURL(
            TranslateIcon
        )}" alt="" width="25px" height="25px"/>`;
        console.log('111111111')
        const top = selectionLocation.top + selectionLocation.height + 6 + "px";
        const left =
            selectionLocation.left +
            (selectionLocation.width / 2 - tooltipWrapperRef.current.offsetWidth / 2) +
            "px";
        if (tooltipWrapperRef.current) {
            tooltipWrapperRef.current.style.position = "absolute";
            tooltipWrapperRef.current.style.padding = "4px";
            tooltipWrapperRef.current.style.top = top;
            tooltipWrapperRef.current.style.left = left;
            tooltipWrapperRef.current.append(tooltipIcon);
        }
        if (tooltipWrapperRef.current) {
            bodyDom.append(tooltipWrapperRef.current);
        }
        if (tooltipWrapperRef.current) {
            tooltipWrapperRef.current.addEventListener("click", async () => {
                if (selectionText.length > 0) {
                    try {
                        const result = await fetch(`https://translate.googleapis.com/translate_a/single?client=dict-chrome-ex&sl=auto&tl=vi&hl=en-US&dt=t&dt=bd&dj=1&source=bubble&q=${selectionText}`);
                        const data = await result.json();
                        const text = data?.sentences[0].trans;
                        renderTooltipResultTranslator(selectionLocation, selectionText, text);
                        console.log('text', text);
                    } catch (error) {
                        console.log(error);
                    }
                }
            });
        }
    };


    const showTypeOfKey = (type) => {
        switch (type) {
            case "verb":
                return <p style={{color: "#2f80ed", fontSize: 13, fontWeight: 700}}>( V )</p>;
            case 'noun':
                return <p style={{color: "#eb5757", fontSize: 13, fontWeight: 700}}>( N )</p>;
            case "adjective":
                return <p style={{color: "#000", fontSize: 13, fontWeight: 700}}>( ADJ )</p>;
            default:
                break
        }
    }

    const TooltipContent = ({ selectionText, selectionTextTranslated }) => (
        <div id="translator-result-ext-rhp">
            <div className="translator-result-ext-container">
                <div>
                    <div className="translateResultContainer">
                        <div className="translateHeader">
                            <div className="headerChange">
                                <img
                                    alt=""
                                    src={chrome.runtime.getURL(Translate)}
                                    style={{ width: 24, height: 24 }}
                                />
                                <div className="changeInto">Translate into : </div>
                                <div className="changeLanguage">
                                    <select
                                        placeholder="ENG"
                                        className="languageSelect"
                                        style={{ color: "#000", fontWeight: 700 }}
                                    >
                                        <option style={{ marginBottom: 20 }} value="option1">
                                            ENG
                                        </option>
                                        <option value="option2">VN</option>
                                        <option value="option3">CN</option>
                                    </select>
                                </div>
                            </div>
                            <div className="headerSetting">
                                <div style={{ paddingRight: "34px" }}>
                                    <img
                                        alt=""
                                        src={chrome.runtime.getURL(Setting)}
                                        style={{ width: 16, height: 16 }}
                                    />
                                </div>
                                <div style={{ paddingRight: "17px" }}>
                                    <img
                                        alt=""
                                        src={chrome.runtime.getURL(Close)}
                                        style={{ width: 14, height: 14 }}
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="translate-body" style={{ display: "flex" }}>
                            <div>{selectionTextTranslated}</div>
                            <div>
                                <img
                                    alt=""
                                    src={chrome.runtime.getURL(Speaker)}
                                    style={{ width: 18, height: 18 }}
                                />
                            </div>
                            <div>
                                <img
                                    alt=""
                                    src={chrome.runtime.getURL(Copy)}
                                    style={{ width: 18, height: 18 }}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );



    const renderTooltipResultTranslator = (selectionLocation, selectionText, selectionTextTranslated) => {
        const tooltipWrapper = document.createElement("div");
        tooltipWrapper.id = "translator-result-ext-rhp";
        const tooltipIconContainer = document.createElement("div");
        tooltipIconContainer.classList.add("translator-result-ext-container");

        const tooltipContent = (
            <TooltipContent
                selectionText={selectionText}
                selectionTextTranslated={selectionTextTranslated}
            />
        );

        ReactDOMServer.renderToStaticMarkup(tooltipContent);


        tooltipWrapper.innerHTML = ReactDOMServer.renderToString(tooltipContent);
        tooltipWrapper.append(tooltipIconContainer);
        const top = selectionLocation.top - 6 + "px";
        const left = selectionLocation.left +
            (selectionLocation.width / 2 - tooltipWrapper.offsetWidth / 2) +
            "px";
        tooltipWrapper.style.position = "absolute";
        tooltipWrapper.style.padding = "4px";
        tooltipWrapper.style.top = top;
        tooltipWrapper.style.left = left;
        bodyDom.append(tooltipWrapper);
    };

    const handleMouseUp = () => {
        const tooltipResult = document.querySelector("div#translator-result-ext-rhp")
        if (tooltipResult) tooltipResult.remove();
        const selectionText = getSelectedText();
        if (selectionText && selectionText.length > 0) {
            const selectionTextNode = getSelectedTextNode();
            const selectionLocation = getSelectedTextNode().getBoundingClientRect();
            renderTooltip(selectionLocation, selectionText);
            setTimeout(() => {
                const tooltipWrapper = tooltipWrapperRef.current;
                if (tooltipWrapper) tooltipWrapper.remove();
            }, 10000);
        }
    };


    useEffect(() => {
        bodyDom.addEventListener("mouseup", handleMouseUp);
        const handleDocumentClick = (event) => {
            if (!tooltipWrapperRef.current.contains(event.target) && isVisible(tooltipWrapperRef.current)) {
                hideTooltipOnClickOutside();
            }
        };
        document.addEventListener("click", handleDocumentClick);
        return () => {
            document.removeEventListener("click", handleDocumentClick);
            bodyDom.removeEventListener("mouseup", handleMouseUp);
        };
    }, []);
    return (
        <>
            <div className={"tooltipWrapper"}></div>
        </>
    );
}

const index = document.createElement("div");
index.id = "content-script";
document.body.appendChild(index);

ReactDOM.createRoot(index).render(
    <React.StrictMode>
        <ContentScript/>
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
