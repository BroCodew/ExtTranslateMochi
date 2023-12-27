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
    const [isPaused, setIsPaused] = useState(false);
    const [utterance, setUtterance] = useState(null);
    const [externalTranslate, setExternalTranslate] = useState([]);


    const TypeLanguage = [
        {
            ab: "Abkhazian",
            aa: "Afar",
            af: "Afrikaans",
            ak: "Akan",
            sq: "Albanian",
            am: "Amharic",
            ar: "Arabic",
            an: "Aragonese",
            hy: "Armenian",
            as: "Assamese",
            av: "Avaric",
            ae: "Avestan",
            ay: "Aymara",
            az: "Azerbaijani",
            bm: "Bambara",
            ba: "Bashkir",
            eu: "Basque",
            be: "Belarusian",
            bn: "Bengali",
            bi: "Bislama",
            bs: "Bosnian",
            br: "Breton",
            bg: "Bulgarian",
            my: "Burmese",
            ca: "Catalan",
            ch: "Chamorro",
            ce: "Chechen",
            ny: "Chichewa",
            zh: "Chinese",
            cu: "Church Slavonic",
            cv: "Chuvash",
            kw: "Cornish",
            co: "Corsican",
            cr: "Cree",
            hr: "Croatian",
            cs: "Czech",
            da: "Danish",
            dv: "Divehi",
            nl: "Dutch",
            dz: "Dzongkha",
            en: "English",
            eo: "Esperanto",
            et: "Estonian",
            ee: "Ewe",
            fo: "Faroese",
            fj: "Fijian",
            fi: "Finnish",
            fr: "French",
            fy: "Western Frisian",
            ff: "Fulah",
            gd: "Gaelic",
            gl: "Galician",
            lq: "Ganda",
            ka: "Georgian",
            de: "German",
            el: "Greek",
            kl: "Kalaallisut",
            gn: "Guarani",
            gu: "Gujarati",
            ht: "Haitian",
            ha: "Hausa",
            he: "Hebrew",
            hz: "Herero",
            hi: "Hindi",
            ho: "Hiri Motu",
            hu: "Hungarian",
            is: "Icelandic",
            io: "Ido",
            ig: "Igbo",
            id: "Indonesian",
            ia: "Interlingua",
            ie: "Interlingue",
            iu: "Inuktitut",
            ik: "Inupiaq",
            ga: "Irish",
            it: "Italian",
            ja: "Japanese",
            jv: "Javanese",
            kn: "Kannada",
            kr: "Kanuri",
            ks: "Kashmiri",
            kk: "Kazakh",
            km: "Central Khmer",
            ki: "Kikuyu",
            rw: "Kinyarwanda",
            ky: "Kirghiz",
            kv: "Komi",
            kg: "Kongo",
            ko: "Korean",
            kj: "Kuanyama",
            ku: "Kurdish",
            lo: "Lao",
            la: "Latin",
            lv: "Latvian",
            li: "Limburgan",
            ln: "Lingala",
            lt: "Lithuanian",
            lu: "Luba-Katanga",
            lb: "Luxembourgish",
            mk: "Macedonian",
            mg: "Malagasy",
            ms: "Malay",
            ml: "Malayalam",
            mt: "Maltese",
            gv: "Manx",
            mi: "Maori",
            mr: "Marathi",
            mh: "Marshallese",
            mn: "Mongolian",
            na: "Nauru",
            nv: "Navajo",
            nd: "North Ndebele",
            nr: "South Ndebele",
            ng: "Ndonga",
            ne: "Nepali",
            no: "Norwegian",
            nb: "Norwegian Bokmål",
            nn: "Norwegian Nynorsk",
            ii: "Sichuan Yi",
            oc: "Occitan",
            oj: "Ojibwa",
            or: "Oriya",
            om: "Oromo",
            os: "Ossetian",
            pi: "Pali",
            ps: "Pashto",
            fa: "Persian",
            pl: "Polish",
            pt: "Portuguese",
            pa: "Punjabi",
            qu: "Quechua",
            ro: "Romanian",
            rm: "Romansh",
            rn: "Rundi",
            ru: "Russian",
            se: "Northern Sami",
            sm: "Samoan",
            sg: "Sango",
            sa: "Sanskrit",
            sc: "Sardinian",
            sr: "Serbian",
            sn: "Shona",
            sd: "Sindhi",
            si: "Sinhala",
            sk: "Slovak",
            sl: "Slovenian",
            so: "Somali",
            st: "Southern Sotho",
            es: "Spanish",
            su: "Sundanese",
            sw: "Swahili",
            ss: "Swahili",
            sv: "Swedish",
            tl: "Tagalog",
            ty: "Tahitian",
            tg: "Tajik",
            ta: "Tamil",
            tt: "Tatar",
            te: "Telugu",
            th: "Thai",
            bo: "Tibetan",
            ti: "Tigrinya",
            to: "Tonga",
            ts: "Tsonga",
            tn: "Tswana",
            tr: "Turkish",
            tk: "Turkmen",
            tw: "Twi",
            ug: "Uighur",
            uk: "Ukrainian",
            ur: "Urdu",
            uz: "Uzbek",
            ve: "Venda",
            vi: "VN",
            vo: "Volapük",
            wa: "Walloon",
            cy: "Welsh",
            wo: "Wolof",
            xh: "Xhosa",
            yi: "Yiddish",
            yo: "Yoruba",
            za: "Zhuang",
            zu: "Zulu",
        },
    ];

    const bodyDom = document.querySelector("body");
    const handlePlay = () => {
        const synth = window.speechSynthesis;

        if (isPaused) {
            synth.resume();
        }

        synth.speak(utterance);

        setIsPaused(false);
    };
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
            if (!element.contains(event.target) && isVisible(element)) {
                element.style.display = 'none';
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
            hideOnClickOutside(tooltipWrapperRef.current);
            console.log('1111111')
        }
        if (tooltipResultRef.current) {
            console.log('222222222')

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

    const TooltipContent = ({selectionText, selectionTextTranslated}) => (
        <div id="translator-result-ext-rhp">
            <div className="translator-result-ext-container">
                <div>
                    <div className="translateResultContainer">
                        <div className="translateHeader">
                            <div className="headerChange">
                                <img
                                    alt=""
                                    src={chrome.runtime.getURL(Translate)}
                                    style={{width: 24, height: 24}}
                                />
                                <div className="changeInto">Translate into 111111111:</div>
                                <div className="changeLanguage">
                                    <select
                                        placeholder="ENG"
                                        className="languageSelect"
                                        style={{color: "#000", fontWeight: 700}}
                                    >
                                        {TypeLanguage.map((item) =>
                                            Object.entries(item).map(([key, value]) => (
                                                <option key={key} value={key}>
                                                    {value}
                                                </option>
                                            ))
                                        )}
                                    </select>
                                </div>
                            </div>
                            <div className="headerSetting">
                                <div style={{paddingRight: "34px"}}>
                                    <img
                                        alt=""
                                        src={chrome.runtime.getURL(Setting)}
                                        style={{width: 16, height: 16}}
                                    />
                                </div>
                                <div style={{paddingRight: "17px"}}>
                                    <img
                                        alt=""
                                        src={chrome.runtime.getURL(Close)}
                                        style={{width: 14, height: 14}}
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="translate-body" style={{display: "flex"}}>
                            <div style={{display: "flex", alignItems: "center"}}>
                                <p className={"body-translate-text"}>{selectionTextTranslated}</p>

                                <div style={{display: "flex", marginLeft: "50spx"}} onClick={handlePlay}>
                                    <img
                                        alt={""}
                                        src={chrome.runtime.getURL(Speaker)}
                                        style={{width: 18, height: 18}}
                                    />
                                    <img alt={""} src={chrome.runtime.getURL(Copy)}
                                         style={{marginLeft: "10px", width: 18, height: 18}}/>

                                </div>
                                <div>
                                </div>
                            </div>

                            <div style={{marginTop: "5px"}}>
                                {externalTranslate?.dict?.map((item, key) =>
                                    <div key={key}>
                                        {showTypeOfKey(item.pos)}
                                        <p>{item.terms.slice(0, 3).join(", ")}</p>

                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );


    const renderTooltipResultTranslator = (selectionLocation, selectionText, selectionTextTranslated) => {
        tooltipResultRef.current= document.createElement("div");
        tooltipResultRef.current.id = "translator-result-ext-rhp";
        const tooltipIconContainer = document.createElement("div");
        tooltipIconContainer.classList.add("translator-result-ext-container");

        const tooltipContent = (
            <TooltipContent
                selectionText={selectionText}
                selectionTextTranslated={selectionTextTranslated}
            />
        );

        ReactDOMServer.renderToStaticMarkup(tooltipContent);
        tooltipResultRef.current.innerHTML = ReactDOMServer.renderToString(tooltipContent);
        tooltipResultRef.current.append(tooltipIconContainer);
        const top = selectionLocation.top - 6 + "px";
        const left = selectionLocation.left +
            (selectionLocation.width / 2 -  tooltipResultRef.current.offsetWidth / 2) +
            "px";
        tooltipResultRef.current.style.position = "absolute";
        tooltipResultRef.current.style.padding = "4px";
        tooltipResultRef.current.style.top = top;
        tooltipResultRef.current.style.left = left;
        bodyDom.append( tooltipResultRef.current);
    };

    const handleMouseUp = (event) => {
        tooltipResultRef.current = document.querySelector("div#translator-result-ext-rhp")
        if (tooltipResultRef.current && !tooltipResultRef.current.contains(event.target)) {
            tooltipResultRef.current.remove();
            console.log('Tooltip removed');
        }
        tooltipWrapperRef.current = document.querySelector("div#translator-ext-rhp")
        if (tooltipWrapperRef.current && !tooltipWrapperRef.current.contains(event.target)) {
            tooltipWrapperRef.current.remove();
            console.log('Tooltip removed');
        }

        console.log('33333')
        const selectionText = getSelectedText();
        if (selectionText && selectionText.length > 0) {
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
            if (
                tooltipWrapperRef.current &&
                !tooltipWrapperRef.current.contains(event.target) &&
                isVisible(tooltipWrapperRef.current)
        ) {

                console.log(' tooltipResultRef.current', tooltipResultRef.current)
                console.log(' isVisible(tooltipResultRef.current)', isVisible(tooltipResultRef.current))
                console.log('  !tooltipResultRef.current.contains(event.target)',   !tooltipResultRef.current.contains(event.target))
                hideTooltipOnClickOutside();
                event.stopPropagation();
            }

            if (
                tooltipResultRef.current &&
                !tooltipResultRef.current.contains(event.target) &&
                isVisible(tooltipResultRef.current)
            ) {
                console.log(' tooltipResultRef.current', tooltipResultRef.current)
                console.log(' isVisible(tooltipResultRef.current)', isVisible(tooltipResultRef.current))
                console.log('  !tooltipResultRef.current.contains(event.target)',   !tooltipResultRef.current.contains(event.target))
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

