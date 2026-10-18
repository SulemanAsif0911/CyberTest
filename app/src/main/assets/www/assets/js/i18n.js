// ============================================================
// CYBER HAYAT — i18n engine
// Translates every element carrying data-i18n / data-i18n-placeholder
// across the site when the language is changed in Settings.
//
// Full interface coverage: English (en) and Urdu (ur).
// Growing coverage: Sindhi (sd), Punjabi (pa), Pashto (ps) — core
// navigation, chrome, and chatbot strings are translated; long-form
// page copy still falls back to English until reviewed.
// Balochi (bal), Saraiki (skr), Hindko (hns), Brahui (brh) currently
// get chatbot replies from the online Llama assistant in that language;
// their interface translation is not yet available (English is shown).
// ============================================================
(function(){
  "use strict";

  const LANG_KEY = "ch_lang";
  const RTL_LANGS = ["ur","sd","pa","ps","bal","skr","hns","brh"];
  const FULL_UI_LANGS = ["en","ur","sd","pa","ps"];

  const DICTS = {

    en: {
      "nav.home":"Home", "nav.guide":"Guide", "nav.chatbot":"Chatbot",
      "nav.resources":"Resources", "nav.helplines":"Helplines",
      "cta.helplines":"Helplines", "cta.getHelp":"Get Help Now",
      "footer.tagline":"A student-led cyber safety initiative from the University of Central Punjab, helping people recognize cyber harassment, protect evidence, and reach the right support channels in Pakistan.",
      "footer.platform":"Platform", "footer.organization":"Organization", "footer.urgent":"Urgent",
      "footer.legalRights":"Legal Rights", "footer.copyright":"© 2026 Cyber Hayat PK · Students of University of Central Punjab. Stay safe. Protect yourself.",
      "footer.privacy":"Privacy Policy", "footer.terms":"Terms of Use",
      "settings.title":"Settings",
      "settings.language":"Language", "settings.languageLabel":"Assistant & interface language",
      "settings.languageHint":"Changes the site interface and the language the Chatbot replies in.",
      "hero.home.eyebrow":"Awareness & Defense",
      "hero.guide.eyebrow":"Watch & Learn", "hero.guide.title":"The Cyber Hayat Awareness Guide",
      "hero.resources.eyebrow":"Cyber Safety Action Center", "hero.resources.title":"Practical tools for every step of the process.",
      "hero.helplines.eyebrow":"Urgent Contacts", "hero.helplines.title":"Help is one call away.",
      "hero.privacy.eyebrow":"Your Data", "hero.privacy.title":"Privacy Policy",
      "hero.terms.eyebrow":"Using This Platform", "hero.terms.title":"Terms of Use"
    },

    ur: {
      "nav.home":"ہوم", "nav.guide":"رہنما", "nav.chatbot":"چیٹ بوٹ",
      "nav.resources":"وسائل", "nav.helplines":"ہیلپ لائنز",
      "cta.helplines":"ہیلپ لائنز", "cta.getHelp":"ابھی مدد لیں",
      "footer.tagline":"یونیورسٹی آف سنٹرل پنجاب کے طلبہ کی جانب سے ایک سائبر سیفٹی مہم، جو لوگوں کو سائبر ہراسانی پہچاننے، ثبوت محفوظ کرنے، اور پاکستان میں درست مدد تک پہنچنے میں مدد دیتی ہے۔",
      "footer.platform":"پلیٹ فارم", "footer.organization":"تنظیم", "footer.urgent":"ہنگامی",
      "footer.legalRights":"قانونی حقوق", "footer.copyright":"© 2026 سائبر حیات پی کے · یونیورسٹی آف سنٹرل پنجاب کے طلبہ۔ محفوظ رہیں، اپنی حفاظت کریں۔",
      "footer.privacy":"پرائیویسی پالیسی", "footer.terms":"شرائطِ استعمال",
      "settings.title":"سیٹنگز",
      "settings.language":"زبان", "settings.languageLabel":"اسسٹنٹ اور انٹرفیس کی زبان",
      "settings.languageHint":"ویب سائٹ کا انٹرفیس اور چیٹ بوٹ کے جوابات کی زبان تبدیل کرتا ہے۔",
      "hero.home.eyebrow":"آگاہی اور تحفظ",
      "hero.guide.eyebrow":"دیکھیں اور سیکھیں", "hero.guide.title":"سائبر حیات آگاہی رہنما",
      "hero.resources.eyebrow":"سائبر سیفٹی ایکشن سینٹر", "hero.resources.title":"ہر مرحلے کے لیے عملی اوزار۔",
      "hero.helplines.eyebrow":"ہنگامی رابطے", "hero.helplines.title":"مدد صرف ایک کال کی دوری پر ہے۔",
      "hero.privacy.eyebrow":"آپ کا ڈیٹا", "hero.privacy.title":"پرائیویسی پالیسی",
      "hero.terms.eyebrow":"اس پلیٹ فارم کا استعمال", "hero.terms.title":"شرائطِ استعمال"
    },

    sd: {
      "nav.home":"گھر", "nav.guide":"گائيڊ", "nav.chatbot":"چيٽ بوٽ",
      "nav.resources":"وسيلا", "nav.helplines":"مدد لائينون",
      "cta.helplines":"مدد لائينون", "cta.getHelp":"ھاڻي مدد وٺو",
      "footer.platform":"پليٽ فارم", "footer.organization":"تنظيم", "footer.urgent":"عاجل",
      "footer.legalRights":"قانوني حق", "footer.privacy":"رازداري پاليسي", "footer.terms":"استعمال جون شرطون",
      "settings.title":"سيٽنگون",
      "settings.language":"ٻولي", "settings.languageLabel":"اسسٽنٽ ۽ انٽرفيس جي ٻولي",
      "hero.helplines.title":"مدد فقط ھڪ ڪال جي مفاصلي تي آھي۔"
    },

    pa: {
      "nav.home":"گھر", "nav.guide":"گائیڈ", "nav.chatbot":"چیٹ بوٹ",
      "nav.resources":"وسیلے", "nav.helplines":"ہیلپ لائناں",
      "cta.helplines":"ہیلپ لائناں", "cta.getHelp":"ہُنے مدد لَوو",
      "footer.platform":"پلیٹ فارم", "footer.organization":"تنظیم", "footer.urgent":"ہنگامی",
      "footer.legalRights":"قانونی حق", "footer.privacy":"پرائیویسی پالیسی", "footer.terms":"شرطاں",
      "settings.title":"سیٹنگز",
      "settings.language":"بولی", "settings.languageLabel":"اسسٹنٹ تے انٹرفیس دی بولی",
      "hero.helplines.title":"مدد بس اک کال دوری تے اے۔"
    },

    ps: {
      "nav.home":"کور", "nav.guide":"لارښود", "nav.chatbot":"چیټ بوټ",
      "nav.resources":"سرچینې", "nav.helplines":"مرستې لاینونه",
      "cta.helplines":"مرستې لاینونه", "cta.getHelp":"اوس مرسته واخلئ",
      "footer.platform":"پلیټ فارم", "footer.organization":"سازمان", "footer.urgent":"بيړنی",
      "footer.legalRights":"قانوني حقونه", "footer.privacy":"محرمیت تګلاره", "footer.terms":"د کارونې شرایط",
      "settings.title":"ترتیبات",
      "settings.language":"ژبه", "settings.languageLabel":"د مرستیال او انٹرفیس ژبه",
      "hero.helplines.title":"مرسته یوازې یو زنګ لرې ده۔"
    }
  };

  function getLang(){ return localStorage.getItem(LANG_KEY) || "en"; }

  function translate(key, lang){
    const dict = DICTS[lang] || DICTS.en;
    return dict[key] || DICTS.en[key] || null;
  }

  function apply(){
    const lang = getLang();
    const isRtl = RTL_LANGS.includes(lang);
    document.documentElement.setAttribute("lang", lang);
    document.documentElement.setAttribute("dir", isRtl ? "rtl" : "ltr");
    document.documentElement.classList.toggle("ch-rtl", isRtl);

    document.querySelectorAll("[data-i18n]").forEach(el=>{
      const key = el.getAttribute("data-i18n");
      const text = translate(key, lang);
      if(text !== null) el.textContent = text;
    });
    document.querySelectorAll("[data-i18n-placeholder]").forEach(el=>{
      const key = el.getAttribute("data-i18n-placeholder");
      const text = translate(key, lang);
      if(text !== null) el.setAttribute("placeholder", text);
    });

    updateLanguageBanner(lang);
  }

  function updateLanguageBanner(lang){
    let banner = document.getElementById("langCoverageBanner");
    if(!FULL_UI_LANGS.includes(lang) || lang === "en"){
      if(banner) banner.remove();
      return;
    }
    // Full-UI languages beyond English still show nothing extra;
    // only warn for chatbot-only languages.
    if(banner) banner.remove();
  }

  function updateChatOnlyBanner(){
    const lang = getLang();
    let banner = document.getElementById("langCoverageBanner");
    const chatOnly = ["bal","skr","hns","brh"];
    if(chatOnly.includes(lang)){
      if(!banner){
        banner = document.createElement("div");
        banner.id = "langCoverageBanner";
        banner.className = "notice-box";
        banner.style.cssText = "position:fixed;left:1rem;right:1rem;bottom:1rem;z-index:150;max-width:34rem;margin-inline:auto;";
        document.body.appendChild(banner);
      }
      banner.textContent = "This language currently applies to Chatbot replies only — the site interface will show in English until translation is reviewed.";
    } else if(banner){
      banner.remove();
    }
  }

  window.CH_I18N = { apply, translate, getLang, LANGS: DICTS };

  document.addEventListener("DOMContentLoaded", ()=>{
    apply();
    updateChatOnlyBanner();
    document.addEventListener("ch:lang-changed", ()=>{ apply(); updateChatOnlyBanner(); });
  });
})();
