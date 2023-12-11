import "../assets/index.css";
import Logo from "../assets/logo.png";
import React, { useEffect, useRef, useState } from "react";
import ReactDOM from "react-dom/client";
import TranslateIcon from "../images/Icon_Translate.png";


function ContentScript() {
  const [selectedText, setSelectedText] = useState("");
  const [isOpen, setIsOpen] = useState(true);
  const refIcon = useRef(null);
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

  const renderTooltip = (selectionLocation, selectionText) => {
    const tooltipWrapper = document.createElement("div");
    tooltipWrapper.id = "translator-ext-rhp";
    const tooltipIcon = document.createElement("div");
    tooltipIcon.classList.add("translator-ext-icon");
    tooltipIcon.innerHTML = `<img src="${chrome.runtime.getURL(
      TranslateIcon
    )}" alt="" width="25px" height="25px"/>`;
    const top = selectionLocation.top + selectionLocation.height + 6 + "px";
    const left =
      selectionLocation.left +
      (selectionLocation.width / 2 - tooltipWrapper.offsetWidth / 2) +
      "px";
    tooltipWrapper.style.position = "absolute";
    tooltipWrapper.style.padding = "4px";
    tooltipWrapper.style.top = top;
    tooltipWrapper.style.left = left;
    //dùng useRef để giữ phần tu
    refIcon.current.appendChild(tooltipWrapper);
    tooltipWrapper.append(tooltipIcon);
    bodyDom.append(tooltipWrapper);

    if (tooltipWrapper) {
      tooltipWrapper.addEventListener("click", async () => {
        console.log("selectionText", selectionText);
        if (selectionText.length > 0) {
          try {
            const result = await fetch(`https://translate.googleapis.com/translate_a/single?client=dict-chrome-ex&sl=en&tl=vi&hl=en-US&dt=t&dt=bd&dj=1&source=bubble&q=${selectionText}.`)
            const data = await result.json();
            const text = data?.sentences[0].trans;

              console.log('text', text);
          }catch(error){

            console.log(error)
          }
        }
      });
    }
  };

  const clickOutside = (e) => {
    console.log(refIcon);
    if (refIcon.current && !refIcon.current.contains(e.target)) {
      setIsOpen(false);
    }
  };

  const handleMouseUp = () => {
    // lấy text
    const selectionText = getSelectedText();

    //lấyvị trí của chữ
    if (selectionText && selectionText.length > 0) {
      const selectionTextNode = getSelectedTextNode();
      //lấy vi tri trên vewport
      const selectionLocation = getSelectedTextNode().getBoundingClientRect();
      renderTooltip(selectionLocation, selectionText);
      setTimeout(() => {
        const tooltipWrapper = document.querySelector("div#translator-ext-rhp");
        if (tooltipWrapper) tooltipWrapper.remove();
      }, 10000);
      console.log("selectionTextNode", selectionLocation);
    }
  };

  useEffect(() => {
    bodyDom.addEventListener("mouseup", handleMouseUp);

    return () => {
      bodyDom.removeEventListener("mouseup", handleMouseUp);
    };
  }, []);

  return (
    <>
      <div className={"tooltipWrapper"} ref={refIcon}></div>
    </>
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
