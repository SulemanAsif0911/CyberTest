// ============================================================
// CYBER HAYAT — offline guidance library (English + Urdu).
// Used whenever the live AI is unreachable, so the assistant is
// always useful with no internet. Helpline numbers are the ones
// published on the Helplines page.
// ============================================================
(function(){
  "use strict";
  const H_EN = "**Helplines:** NCCIA 1799 · FIA 9911 · PCSW 1043 · Digital Rights Foundation 0800-39393";
  const H_UR = "**ہیلپ لائنز:** NCCIA 1799 · FIA 9911 · PCSW 1043 · ڈیجیٹل رائٹس فاؤنڈیشن 0800-39393";

  const TOPICS = [
    { id:"crisis", crisis:true,
      kw:["suicide","kill myself","end my life","self harm","hurt myself","want to die","unsafe right now","in danger","خودکشی","مرنا چاہتی","مرنا چاہتا","جان دے","خود کو نقصان"],
      en:"I’m really sorry you’re going through this, and I’m glad you reached out. **Your safety comes first.**\n\n- If you are in immediate danger, contact local emergency services or go to a safe place with someone you trust.\n- Please tell a trusted person near you what you’re feeling right now.\n- You can also call a helpline and speak to a person.\n\n"+H_EN+"\n\nYou don’t have to handle this alone. When you’re ready, tell me what’s happening and we’ll take it one step at a time.",
      ur:"مجھے افسوس ہے کہ آپ اس مشکل سے گزر رہے ہیں، اور اچھا ہوا کہ آپ نے بات کی۔ **آپ کی حفاظت سب سے پہلے ہے۔**\n\n- اگر آپ فوری خطرے میں ہیں تو مقامی ایمرجنسی سروس سے رابطہ کریں یا کسی قابلِ اعتماد شخص کے ساتھ محفوظ جگہ پر چلے جائیں۔\n- جو آپ محسوس کر رہے ہیں وہ اپنے کسی قریبی قابلِ اعتماد شخص کو ضرور بتائیں۔\n- آپ ہیلپ لائن پر کسی سے بات بھی کر سکتے ہیں۔\n\n"+H_UR+"\n\nآپ اکیلے نہیں ہیں۔ جب تیار ہوں تو بتائیں کیا ہو رہا ہے، ہم قدم بہ قدم آگے بڑھیں گے." },

    { id:"blackmail",
      kw:["blackmail","sextortion","threaten","leak my","leaked","private photo","intimate","nude","pay money","extort","بلیک میل","دھمکی","تصاویر","نجی","پیسے مانگ"],
      en:"Blackmail is a crime, and **it is not your fault.** Here is what to do:\n\n1. **Don’t pay and don’t send anything more.** Payment usually leads to more demands.\n2. **Keep the evidence:** screenshot the messages, the profile, usernames and links with date/time visible. Don’t delete the chat.\n3. **Stop engaging**, then block and report the account on the platform.\n4. **Secure your accounts:** change passwords and turn on 2-step verification.\n5. **Report it:** NCCIA complaint portal (complaint.nccia.gov.pk) or call 1799; FIA 9911.\n6. **Intimate images:** StopNCII.org (adults) can help stop them spreading on major platforms; for under-18s use takeitdown.ncmec.org.\n\nWould you like help preparing your report?",
      ur:"بلیک میلنگ جرم ہے اور **اس میں آپ کا کوئی قصور نہیں۔** یہ کریں:\n\n1. **پیسے نہ دیں اور مزید کچھ نہ بھیجیں۔** ادائیگی سے عموماً مزید مطالبات بڑھتے ہیں۔\n2. **ثبوت محفوظ کریں:** پیغامات، پروفائل، یوزر نیم اور لنکس کے اسکرین شاٹ تاریخ اور وقت سمیت لیں۔ چیٹ ڈیلیٹ نہ کریں۔\n3. **جواب دینا بند کریں،** اکاؤنٹ کو بلاک اور رپورٹ کریں۔\n4. **اپنے اکاؤنٹس محفوظ کریں:** پاسورڈ بدلیں اور ٹو اسٹیپ ویریفیکیشن آن کریں۔\n5. **رپورٹ کریں:** NCCIA پورٹل (complaint.nccia.gov.pk) یا 1799؛ FIA 9911۔\n6. **نجی تصاویر:** StopNCII.org (بالغوں کے لیے) بڑی ویب سائٹس پر پھیلاؤ روکنے میں مدد کرتا ہے۔\n\nکیا آپ رپورٹ تیار کرنے میں مدد چاہتے ہیں؟" },

    { id:"hacked",
      kw:["hacked","hack","account taken","stolen account","can’t log in","cant login","password changed","someone logged","otp","ہیک","اکاؤنٹ چوری","لاگ ان نہیں","پاسورڈ"],
      en:"Act quickly to take your account back:\n\n1. Use the platform’s **account recovery** page from a device you trust.\n2. **Change the password** (long and unique) and **log out of all sessions**.\n3. Turn on **2-step verification** using an authenticator app rather than SMS if possible.\n4. Check the **recovery email and phone number** — attackers often change them.\n5. Warn your contacts not to click links or send money.\n6. If money was lost, call your bank at once, then report to NCCIA (1799) or FIA (9911).\n\nTell me which platform it is and I’ll guide you through its recovery steps.",
      ur:"اپنا اکاؤنٹ واپس لینے کے لیے فوراً یہ کریں:\n\n1. کسی قابلِ اعتماد ڈیوائس سے پلیٹ فارم کا **اکاؤنٹ ریکوری** صفحہ استعمال کریں۔\n2. **پاسورڈ بدلیں** (لمبا اور منفرد) اور **تمام سیشنز سے لاگ آؤٹ** کریں۔\n3. **ٹو اسٹیپ ویریفیکیشن** آن کریں۔\n4. **ریکوری ای میل اور فون نمبر** چیک کریں، ہیکر اکثر انہیں بدل دیتے ہیں۔\n5. اپنے رابطوں کو خبردار کریں کہ لنک نہ کھولیں اور پیسے نہ بھیجیں۔\n6. اگر رقم گئی ہے تو فوراً بینک سے رابطہ کریں، پھر NCCIA (1799) یا FIA (9911) کو رپورٹ کریں۔\n\nپلیٹ فارم کا نام بتائیں، میں ریکوری کے مراحل بتا دوں گا۔" },

    { id:"fake_profile",
      kw:["fake profile","fake account","impersonat","pretending to be me","clone","جعلی پروفائل","جعلی اکاؤنٹ","میرے نام سے"],
      en:"Someone impersonating you can be reported and removed:\n\n1. **Save evidence:** profile link, username, screenshots of posts and messages.\n2. **Report it as impersonation** using the platform’s dedicated form (it is separate from a normal report).\n3. Ask trusted friends to report the same profile.\n4. Post a short notice on your real account so contacts know it’s fake.\n5. Tighten your privacy settings and limit who can see your photos.\n6. If it’s being used to harass or defraud people, file a complaint with NCCIA (1799) or FIA (9911).\n\nWant me to draft a short message for the platform’s report form?",
      ur:"آپ کی جعلی شناخت بنانے والے اکاؤنٹ کو رپورٹ کر کے ہٹوایا جا سکتا ہے:\n\n1. **ثبوت محفوظ کریں:** پروفائل لنک، یوزر نیم، پوسٹس اور پیغامات کے اسکرین شاٹ۔\n2. پلیٹ فارم کے مخصوص **امپرسونیشن فارم** سے رپورٹ کریں۔\n3. قابلِ اعتماد دوستوں سے بھی وہی پروفائل رپورٹ کروائیں۔\n4. اپنے اصل اکاؤنٹ پر مختصر اطلاع لگائیں کہ وہ پروفائل جعلی ہے۔\n5. پرائیویسی سیٹنگز سخت کریں۔\n6. اگر اسے ہراسانی یا فراڈ کے لیے استعمال کیا جا رہا ہے تو NCCIA (1799) یا FIA (9911) میں شکایت کریں۔" },

    { id:"harassment",
      kw:["harass","bully","abuse","stalk","troll","insult","hate","message me","following me","hateful","ہراس","تنگ","گالی","پیچھا","دھمکا"],
      en:"I’m sorry this is happening. You deserve to feel safe online. A practical path:\n\n1. **Don’t retaliate** — it can escalate things and weaken your case.\n2. **Document everything:** screenshots with usernames, dates and links; keep a simple timeline.\n3. **Block and report** the accounts on each platform.\n4. **Lock down privacy:** limit who can message, tag or find you; hide your phone number and location.\n5. **Tell someone you trust** so you’re not carrying this alone.\n6. **Report formally** to NCCIA (complaint.nccia.gov.pk, 1799) or FIA (9911) if it’s persistent, threatening or sexual.\n\n"+H_EN+"\n\nWould you like to start with documenting evidence, or reporting?",
      ur:"مجھے افسوس ہے کہ آپ کے ساتھ ایسا ہو رہا ہے۔ آپ کو آن لائن محفوظ محسوس کرنے کا پورا حق ہے۔ عملی راستہ:\n\n1. **جواب میں بدتمیزی نہ کریں،** اس سے معاملہ بڑھ سکتا ہے۔\n2. **سب کچھ محفوظ کریں:** یوزر نیم، تاریخ اور لنک کے ساتھ اسکرین شاٹ، اور سادہ ٹائم لائن۔\n3. ہر پلیٹ فارم پر اکاؤنٹ **بلاک اور رپورٹ** کریں۔\n4. **پرائیویسی سخت کریں:** کون پیغام بھیج سکتا ہے، ٹیگ کر سکتا ہے، سب محدود کریں؛ فون نمبر اور لوکیشن چھپائیں۔\n5. کسی **قابلِ اعتماد شخص کو بتائیں۔**\n6. اگر معاملہ مسلسل، دھمکی آمیز یا جنسی نوعیت کا ہو تو NCCIA (1799) یا FIA (9911) میں **باقاعدہ شکایت** کریں۔\n\n"+H_UR },

    { id:"evidence",
      kw:["evidence","screenshot","proof","record","save chat","document","ثبوت","اسکرین شاٹ","ریکارڈ"],
      en:"Good evidence makes a report much stronger:\n\n- **Screenshots** that show the username, date/time and the full conversation or post.\n- **Copy links (URLs)** of profiles, posts and images. Note usernames and user IDs.\n- **Screen-record** content that disappears (stories, disappearing messages).\n- **Never edit or crop** originals; keep the unedited files and make a backup copy (cloud or another device).\n- **Keep a timeline:** what happened, when, and on which platform.\n- Don’t delete the chat or the account, even if it’s painful to see.\n\nThe Resources page has an evidence checklist and an incident report you can fill in.",
      ur:"اچھا ثبوت آپ کی رپورٹ کو بہت مضبوط بناتا ہے:\n\n- **اسکرین شاٹ** جس میں یوزر نیم، تاریخ/وقت اور پوری گفتگو یا پوسٹ نظر آئے۔\n- پروفائلز، پوسٹس اور تصاویر کے **لنک (URL)** کاپی کریں؛ یوزر نیم اور آئی ڈی نوٹ کریں۔\n- جو مواد غائب ہو جاتا ہے (اسٹوریز، ڈس اپیئرنگ میسجز) اس کی **اسکرین ریکارڈنگ** کریں۔\n- اصل فائلوں کو **ایڈٹ یا کراپ نہ کریں،** اور بیک اپ رکھیں۔\n- **ٹائم لائن** بنائیں: کیا ہوا، کب، اور کس پلیٹ فارم پر۔\n- چیٹ یا اکاؤنٹ ڈیلیٹ نہ کریں۔\n\nریسورسز صفحے پر ثبوت کی چیک لسٹ اور انسیڈنٹ رپورٹ موجود ہے۔" },

    { id:"report",
      kw:["report","complaint","fia","nccia","file a case","police","where to report","شکایت","رپورٹ","ایف آئی اے","مقدمہ","درج"],
      en:"You can report cybercrime in Pakistan through official channels:\n\n- **NCCIA:** complaint.nccia.gov.pk · helpline **1799**\n- **FIA Cyber Crime:** complaint.fia.gov.pk · helpline **9911**\n- **Digital Rights Foundation helpline:** 0800-39393 (free support and guidance)\n\n**Before you file, gather:** your CNIC details, a short written timeline, screenshots and links, and the usernames or phone numbers involved. Keep copies of everything.\n\nI can help you write a clear complaint letter — the Resources page has a letter generator, or just tell me what happened.",
      ur:"پاکستان میں سائبر کرائم سرکاری ذرائع سے رپورٹ کیا جا سکتا ہے:\n\n- **NCCIA:** complaint.nccia.gov.pk · ہیلپ لائن **1799**\n- **FIA سائبر کرائم:** complaint.fia.gov.pk · ہیلپ لائن **9911**\n- **ڈیجیٹل رائٹس فاؤنڈیشن ہیلپ لائن:** 0800-39393 (مفت رہنمائی)\n\n**شکایت سے پہلے جمع کریں:** شناختی کارڈ کی تفصیل، مختصر تحریری ٹائم لائن، اسکرین شاٹس اور لنکس، اور متعلقہ یوزر نیم یا فون نمبر۔\n\nمیں شکایتی خط لکھنے میں مدد کر سکتا ہوں؛ ریسورسز صفحے پر لیٹر جنریٹر بھی ہے۔" },

    { id:"deepfake",
      kw:["deepfake","edited photo","morphed","fake video","ai generated","fake image","ایڈٹ","جعلی ویڈیو","جعلی تصویر","مارف"],
      en:"Edited or AI-generated images and videos of you are a serious violation, and you can fight back:\n\n1. **Save the evidence** (links, screenshots, where it was shared) before reporting.\n2. **Report it to the platform** as non-consensual or manipulated content — most have a fast-track option.\n3. **StopNCII.org** can block intimate images from spreading across participating platforms (adults).\n4. Tell people you trust that the content is fake, so they don’t share it.\n5. **File a complaint** with NCCIA (1799) or FIA (9911).\n\nIf you’re under 18, tell a trusted adult and use takeitdown.ncmec.org.",
      ur:"آپ کی ایڈٹ شدہ یا اے آئی سے بنی تصاویر/ویڈیوز سنگین خلاف ورزی ہیں اور آپ کارروائی کر سکتی/سکتے ہیں:\n\n1. رپورٹ سے پہلے **ثبوت محفوظ کریں** (لنکس، اسکرین شاٹس، کہاں شیئر ہوا)۔\n2. پلیٹ فارم پر **بغیر اجازت یا جعلی مواد** کے طور پر رپورٹ کریں۔\n3. **StopNCII.org** نجی تصاویر کو شریک پلیٹ فارمز پر پھیلنے سے روکنے میں مدد کرتا ہے (بالغوں کے لیے)۔\n4. اپنے قابلِ اعتماد لوگوں کو بتائیں کہ مواد جعلی ہے۔\n5. NCCIA (1799) یا FIA (9911) میں **شکایت درج کریں۔**" },

    { id:"privacy_tips",
      kw:["secure","safety tips","privacy","protect myself","password","2fa","two factor","settings","safe online","پرائیویسی","محفوظ","سیٹنگ","حفاظت"],
      en:"A strong baseline for staying safe online:\n\n- Use a **unique long password** for each important account (a password manager helps).\n- Turn on **2-step verification** everywhere, preferably with an authenticator app.\n- Set profiles to **private** and review who can message, tag or find you.\n- Turn off **location sharing** on photos and posts.\n- Review **app permissions** and remove apps you don’t use.\n- Be cautious with links and OTP requests; **never share an OTP** with anyone.\n\nWant a step-by-step privacy check for a specific app?",
      ur:"آن لائن محفوظ رہنے کی بنیادی باتیں:\n\n- ہر اہم اکاؤنٹ کے لیے **منفرد اور لمبا پاسورڈ** رکھیں۔\n- ہر جگہ **ٹو اسٹیپ ویریفیکیشن** آن کریں۔\n- پروفائلز **پرائیویٹ** رکھیں اور دیکھیں کون پیغام بھیج، ٹیگ یا تلاش کر سکتا ہے۔\n- تصاویر اور پوسٹس میں **لوکیشن** بند رکھیں۔\n- ایپس کی **اجازتیں** چیک کریں اور غیر ضروری ایپس ہٹا دیں۔\n- لنکس اور OTP مانگنے والوں سے محتاط رہیں؛ **OTP کسی کو نہ بتائیں۔**" },

    { id:"minor",
      kw:["my child","my daughter","my son","kid","minor","student","school","بچی","بچہ","بیٹی","بیٹا","بچے"],
      en:"Thank you for acting on this. If a child or teenager is being targeted online:\n\n1. **Stay calm and reassure them** that they are not in trouble and it is not their fault.\n2. **Save evidence** without sharing it further, and don’t confront the other person.\n3. **Block and report** the accounts; adjust privacy settings together.\n4. **Report** to NCCIA (1799) or FIA (9911). For intimate images use takeitdown.ncmec.org.\n5. Consider support from a school counsellor or a trusted professional.\n\n"+H_EN,
      ur:"آپ نے قدم اٹھایا، یہ اچھی بات ہے۔ اگر کوئی بچہ یا نوجوان آن لائن نشانہ بن رہا ہو:\n\n1. **پرسکون رہیں** اور انہیں یقین دلائیں کہ وہ مشکل میں نہیں اور اس میں ان کا قصور نہیں۔\n2. ثبوت محفوظ کریں مگر آگے شیئر نہ کریں، اور دوسرے شخص سے خود بحث نہ کریں۔\n3. اکاؤنٹس **بلاک اور رپورٹ** کریں اور مل کر پرائیویسی سیٹنگز بدلیں۔\n4. NCCIA (1799) یا FIA (9911) کو **رپورٹ** کریں۔\n5. اسکول کاؤنسلر یا کسی قابلِ اعتماد ماہر سے مدد لینے پر غور کریں۔\n\n"+H_UR },

    { id:"support",
      kw:["scared","afraid","anxious","depressed","alone","ashamed","embarrassed","stress","cry","sad","ڈر","خوف","اکیلی","اکیلا","شرم","پریشان","اداس"],
      en:"What you’re feeling is a normal reaction to something that isn’t okay. **You haven’t done anything wrong, and you’re not alone.**\n\n- Talk to someone you trust: a friend, family member or counsellor.\n- Take small steps — you don’t need to solve everything today.\n- You can speak to a trained person on a helpline.\n\n"+H_EN+"\n\nWhenever you’re ready, tell me what happened and I’ll help you with the next practical step.",
      ur:"آپ جو محسوس کر رہے ہیں وہ ایک غلط بات کا فطری ردِعمل ہے۔ **آپ نے کچھ غلط نہیں کیا اور آپ اکیلے نہیں ہیں۔**\n\n- کسی قابلِ اعتماد شخص سے بات کریں: دوست، گھر والے یا کاؤنسلر۔\n- چھوٹے قدم اٹھائیں، آج سب کچھ حل کرنا ضروری نہیں۔\n- ہیلپ لائن پر تربیت یافتہ شخص سے بات کر سکتے ہیں۔\n\n"+H_UR+"\n\nجب تیار ہوں تو بتائیں کیا ہوا، میں اگلے عملی قدم میں مدد کروں گا." },

    { id:"hello", kw:["hello","hi","hey","salam","assalam","السلام","سلام","ہیلو"], greet:true,
      en:"Hello, I’m the Cyber Hayat Assistant. I can help you **save evidence, secure your accounts, report to the right authority** and find support. What’s happening?",
      ur:"السلام علیکم، میں سائبر حیات اسسٹنٹ ہوں۔ میں **ثبوت محفوظ کرنے، اکاؤنٹس محفوظ بنانے، درست ادارے کو رپورٹ کرنے** اور مدد تلاش کرنے میں آپ کی رہنمائی کر سکتا ہوں۔ کیا مسئلہ ہے؟" }
  ];

  const FALLBACK = {
    en:"I want to make sure I give you the right guidance. Could you tell me a bit more — for example, is this about **blackmail, a hacked account, a fake profile, harassment or edited images**?\n\nIn the meantime:\n1. Save screenshots and links.\n2. Don’t reply to threats or send money.\n3. Block and report on the platform.\n\n"+H_EN,
    ur:"میں چاہتا ہوں کہ آپ کو درست رہنمائی دوں۔ ذرا مزید بتائیں، مثلاً یہ **بلیک میلنگ، ہیک شدہ اکاؤنٹ، جعلی پروفائل، ہراسانی یا ایڈٹ شدہ تصاویر** میں سے کس بارے میں ہے؟\n\nفی الحال:\n1. اسکرین شاٹس اور لنکس محفوظ کریں۔\n2. دھمکیوں کا جواب نہ دیں اور پیسے نہ بھیجیں۔\n3. پلیٹ فارم پر بلاک اور رپورٹ کریں۔\n\n"+H_UR
  };

  function norm(t){ return (t||"").toLowerCase().replace(/[\u2018\u2019]/g,"'").replace(/[\u064B-\u065F\u0670]/g,""); }

  function isCrisis(text){
    const t = norm(text);
    return TOPICS[0].kw.some(k => t.indexOf(norm(k)) !== -1);
  }

  function answer(text, lang){
    const L = lang === "ur" ? "ur" : "en";
    const t = norm(text);
    if(isCrisis(text)) return { id:"crisis", text:TOPICS[0][L], crisis:true };
    let best = null, bestScore = 0;
    for(const tp of TOPICS){
      if(tp.crisis) continue;
      let sc = 0;
      for(const k of tp.kw){ if(t.indexOf(norm(k)) !== -1) sc += (k.length > 4 ? 2 : 1); }
      if(tp.greet && t.trim().split(/\s+/).length > 4) sc = 0;
      if(sc > bestScore){ best = tp; bestScore = sc; }
    }
    if(best) return { id:best.id, text:best[L] };
    return { id:"fallback", text:FALLBACK[L] };
  }

  const STARTERS = {
    en:[ ["Blackmail or threats","Someone is threatening to leak my photos"], ["My account was hacked","My account was hacked and I can’t log in"], ["Fake profile","Someone made a fake profile using my name"], ["Harassment","I’m being harassed online"], ["How do I report?","How do I report to FIA or NCCIA?"], ["Save evidence","How do I save evidence properly?"] ],
    ur:[ ["بلیک میلنگ یا دھمکیاں","کوئی میری تصاویر لیک کرنے کی دھمکی دے رہا ہے"], ["اکاؤنٹ ہیک ہو گیا","میرا اکاؤنٹ ہیک ہو گیا ہے"], ["جعلی پروفائل","کسی نے میرے نام سے جعلی پروفائل بنائی ہے"], ["ہراسانی","مجھے آن لائن ہراساں کیا جا رہا ہے"], ["رپورٹ کیسے کریں؟","FIA یا NCCIA کو رپورٹ کیسے کریں؟"], ["ثبوت محفوظ کریں","ثبوت صحیح طریقے سے کیسے محفوظ کروں؟"] ]
  };

  window.CH_KB = { answer, isCrisis, STARTERS };
})();
