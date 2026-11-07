import { ADVICE_CATALOGUE } from "@/data";
import { PREPAINTED_ADVICE_GLOBAL } from "./prepainted-advice";

export const RANDOM_ADVICE_SCRIPT_ID = "random-advice";

export const RANDOM_ADVICE_SCRIPT = `(function(){var s=${JSON.stringify(ADVICE_CATALOGUE)},a=s[Math.floor(Math.random()*s.length)],h=document.querySelector("h1"),b=document.querySelector("blockquote[cite]"),q=b&&b.querySelector("q");if(!h||!q)return;var n=/\\d+$/;h.textContent=h.textContent.replace(n,a.id);b.setAttribute("cite",b.getAttribute("cite").replace(n,a.id));q.textContent=a.text;window.${PREPAINTED_ADVICE_GLOBAL}=a})()`;
