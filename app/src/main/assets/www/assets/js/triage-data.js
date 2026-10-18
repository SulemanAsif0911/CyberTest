// ============================================================
// CYBER HAYAT — Guided plan content.
// Every step: when (now|today|week), t = title, d = detail, a = actions.
// Actions: vault, report, platform, helplines, safety, calm, chat, letter, check,
//          {call:"1799"}, {link:"https://…", label:"…"}
// Urdu (ur) is provided for the four most common situations; others fall back to English.
// ============================================================
(function(){
  "use strict";
  const NCCIA = { link: "https://complaint.nccia.gov.pk", label: "NCCIA complaint portal" };
  const FIA   = { link: "https://complaint.fia.gov.pk", label: "FIA complaint portal" };
  const STOPNCII = { link: "https://stopncii.org", label: "StopNCII.org (adults)" };
  const TAKEIT = { link: "https://takeitdown.ncmec.org", label: "Take It Down (under 18)" };

  const SCENARIOS = [
    { id: "blackmail",  icon: "alert",   t: { en: "Blackmail or threats", ur: "بلیک میلنگ یا دھمکیاں" },            s: { en: "Someone threatens to share photos or secrets", ur: "کوئی تصاویر یا راز ظاہر کرنے کی دھمکی دیتا ہے" } },
    { id: "leaked",     icon: "image",   t: { en: "Photos or videos shared", ur: "تصاویر یا ویڈیوز شیئر ہو گئیں" },  s: { en: "Private content is already online", ur: "نجی مواد پہلے ہی آن لائن ہے" } },
    { id: "hacked",     icon: "lock",    t: { en: "Account hacked", ur: "اکاؤنٹ ہیک ہو گیا" },                   s: { en: "I’m locked out or something looks wrong", ur: "لاگ ان نہیں ہو پا رہا یا کچھ غلط لگ رہا ہے" } },
    { id: "fake",       icon: "users",   t: { en: "Fake profile", ur: "جعلی پروفائل" },                         s: { en: "Someone is pretending to be me", ur: "کوئی میرے نام سے بنا ہوا ہے" } },
    { id: "harassment", icon: "chat",    t: { en: "Harassment or bullying", ur: "ہراسانی یا بدسلوکی" },        s: { en: "Abusive messages, comments or hate", ur: "نازیبا پیغامات، تبصرے یا نفرت" } },
    { id: "stalking",   icon: "eye",     t: { en: "Stalking or tracking", ur: "پیچھا کرنا یا نگرانی" },        s: { en: "Being followed or monitored online", ur: "آن لائن پیچھا یا نگرانی" } },
    { id: "deepfake",   icon: "file",    t: { en: "Edited or AI images", ur: "ایڈٹ یا اے آئی تصاویر" },        s: { en: "Fake images or videos of me", ur: "میری جعلی تصاویر یا ویڈیوز" } },
    { id: "fraud",      icon: "scale",   t: { en: "Online scam, money lost", ur: "آن لائن فراڈ، رقم چلی گئی" }, s: { en: "I paid or shared bank details", ur: "رقم دی یا بینک تفصیل بتا دی" } }
  ];

  const S = {
    blackmail: [
      { id:"b1", w:"now",   t:{ en:"Stop replying, and don’t pay", ur:"جواب دینا بند کریں اور پیسے نہ دیں" },
        d:{ en:"Paying rarely ends it; blackmailers usually ask for more. Don’t send more photos or money. Pause the conversation without deleting it, so the evidence stays.",
            ur:"پیسے دینے سے عموماً مسئلہ ختم نہیں ہوتا، مطالبات بڑھتے ہیں۔ مزید تصاویر یا رقم نہ بھیجیں۔ گفتگو روک دیں مگر چیٹ ڈیلیٹ نہ کریں تاکہ ثبوت محفوظ رہے۔" }, a:[] },
      { id:"b2", w:"now",   t:{ en:"Save the evidence before it disappears", ur:"ثبوت غائب ہونے سے پہلے محفوظ کریں" },
        d:{ en:"Screenshot the username, profile link, date and time, and the full conversation. Copy any payment or account numbers they give. Keep the originals unedited.",
            ur:"یوزر نیم، پروفائل لنک، تاریخ و وقت اور پوری گفتگو کے اسکرین شاٹ لیں۔ جو اکاؤنٹ یا ادائیگی کے نمبر وہ دیں انہیں محفوظ کریں۔ اصل فائلیں ایڈٹ نہ کریں۔" }, a:["vault"] },
      { id:"b3", w:"now",   t:{ en:"Tell one person you trust", ur:"کسی ایک قابلِ اعتماد شخص کو بتائیں" },
        d:{ en:"Carrying this alone makes it heavier. A friend, sibling, parent or counsellor can help you think clearly. You have not done anything wrong.",
            ur:"اکیلے برداشت کرنے سے بوجھ بڑھتا ہے۔ دوست، بہن بھائی، والدین یا کاؤنسلر آپ کو واضح سوچنے میں مدد دے سکتے ہیں۔ آپ نے کوئی غلطی نہیں کی۔" }, a:["safety","calm"] },
      { id:"b4", w:"today", t:{ en:"Secure your accounts", ur:"اپنے اکاؤنٹس محفوظ کریں" },
        d:{ en:"Change passwords for your email, social media and phone cloud account. Turn on two-step verification and sign out of other devices.",
            ur:"ای میل، سوشل میڈیا اور فون کلاؤڈ اکاؤنٹ کے پاسورڈ بدلیں۔ ٹو اسٹیپ ویریفیکیشن آن کریں اور دوسری ڈیوائسز سے لاگ آؤٹ کریں۔" }, a:["chat"] },
      { id:"b5", w:"today", t:{ en:"Report the account to the platform", ur:"پلیٹ فارم پر اکاؤنٹ رپورٹ کریں" },
        d:{ en:"Use the platform’s report option for blackmail, harassment or non-consensual intimate images. Block them only after your evidence is saved.",
            ur:"پلیٹ فارم کے رپورٹ آپشن میں بلیک میلنگ، ہراسانی یا بغیر اجازت نجی تصاویر چنیں۔ ثبوت محفوظ ہونے کے بعد ہی بلاک کریں۔" }, a:["platform"] },
      { id:"b6", w:"today", t:{ en:"Report to NCCIA or FIA", ur:"NCCIA یا FIA کو رپورٹ کریں" },
        d:{ en:"File a complaint online or call the helpline. Bring your screenshots, links and a short timeline of what happened and when.",
            ur:"آن لائن شکایت درج کریں یا ہیلپ لائن پر کال کریں۔ اسکرین شاٹس، لنکس اور واقعات کی مختصر ٹائم لائن ساتھ رکھیں۔" }, a:[NCCIA,{call:"1799"},{call:"9911"},"report"] },
      { id:"b7", w:"week",  t:{ en:"Check what is public", ur:"دیکھیں کیا عوامی ہو چکا ہے" },
        d:{ en:"Search your name and usernames. If anything has been posted, save it first, then report it and ask the platform to remove it.",
            ur:"اپنا نام اور یوزر نیم سرچ کریں۔ اگر کچھ پوسٹ ہوا ہو تو پہلے محفوظ کریں، پھر رپورٹ کریں اور ہٹانے کی درخواست دیں۔" }, a:["platform",STOPNCII] },
      { id:"b8", w:"week",  t:{ en:"Look after yourself", ur:"اپنا خیال رکھیں" },
        d:{ en:"Sleep, food and talking to someone all help. If you feel unsafe or hopeless, speak to a helpline or a trusted person today.",
            ur:"نیند، کھانا اور کسی سے بات کرنا مدد دیتا ہے۔ اگر خود کو غیر محفوظ یا ناامید محسوس کریں تو آج ہی ہیلپ لائن یا کسی قابلِ اعتماد شخص سے بات کریں۔" }, a:["calm","helplines"] },
      { id:"b9", w:"week",  t:{ en:"Follow up on your complaint", ur:"اپنی شکایت کی پیروی کریں" },
        d:{ en:"Keep your complaint number and the date. If you hear nothing within a few days, call the helpline and quote it.",
            ur:"شکایت کا نمبر اور تاریخ محفوظ رکھیں۔ چند دن میں جواب نہ ملے تو ہیلپ لائن پر کال کر کے نمبر بتائیں۔" }, a:["report"] }
    ],
    leaked: [
      { id:"l1", w:"now",   t:{ en:"Save proof of where it is posted", ur:"جہاں پوسٹ ہوا ہے اس کا ثبوت محفوظ کریں" },
        d:{ en:"Copy the links and take screenshots showing the page, the account that posted it, and the date. If it is hard to look at, ask a trusted friend to help so you don’t have to see it repeatedly.", ur:"لنکس کاپی کریں اور پیج، پوسٹ کرنے والے اکاؤنٹ اور تاریخ کے اسکرین شاٹ لیں۔ اگر دیکھنا مشکل ہو تو کسی قابلِ اعتماد دوست سے مدد لیں۔" }, a:["vault"] },
      { id:"l2", w:"now",   t:{ en:"Block it from spreading with a hash service", ur:"پھیلاؤ روکنے کے لیے ہیش سروس استعمال کریں" },
        d:{ en:"StopNCII.org (adults) and Take It Down (under 18) create a digital fingerprint on your device, so participating platforms can block the image. The image itself is not uploaded.", ur:"StopNCII.org (بالغوں کے لیے) اور Take It Down (18 سال سے کم) آپ کی ڈیوائس پر ڈیجیٹل فنگر پرنٹ بناتے ہیں تاکہ شریک پلیٹ فارمز تصویر کو روک سکیں۔ تصویر خود اپ لوڈ نہیں ہوتی۔" }, a:[STOPNCII,TAKEIT] },
      { id:"l3", w:"today", t:{ en:"Report to each platform", ur:"ہر پلیٹ فارم پر رپورٹ کریں" },
        d:{ en:"Choose the option for non-consensual intimate images. Most platforms treat these as urgent.", ur:"بغیر اجازت نجی تصاویر کا آپشن چنیں۔ زیادہ تر پلیٹ فارمز اسے فوری نوعیت کا مسئلہ سمجھتے ہیں۔" }, a:["platform"] },
      { id:"l4", w:"today", t:{ en:"Report to NCCIA or FIA", ur:"NCCIA یا FIA کو رپورٹ کریں" },
        d:{ en:"File a complaint with your links and screenshots. Say clearly that the content was shared without your consent.", ur:"لنکس اور اسکرین شاٹس کے ساتھ شکایت درج کریں۔ واضح لکھیں کہ مواد آپ کی اجازت کے بغیر شیئر ہوا۔" }, a:[NCCIA,{call:"1799"},"report"] },
      { id:"l5", w:"today", t:{ en:"Tell someone you trust", ur:"کسی قابلِ اعتماد شخص کو بتائیں" },
        d:{ en:"This is not your fault. Sharing private content without consent is a violation, and the responsibility lies with the person who shared it.", ur:"اس میں آپ کا قصور نہیں۔ اجازت کے بغیر نجی مواد شیئر کرنا خلاف ورزی ہے اور ذمہ داری شیئر کرنے والے کی ہے۔" }, a:["safety","calm"] },
      { id:"l6", w:"week",  t:{ en:"Ask search engines to remove pages", ur:"سرچ انجن سے صفحات ہٹانے کی درخواست کریں" },
        d:{ en:"Search the engine’s help centre for its form on removing non-consensual intimate images, and submit each link you saved.", ur:"سرچ انجن کے ہیلپ سینٹر میں بغیر اجازت نجی تصاویر ہٹانے کا فارم تلاش کریں اور محفوظ کیے ہوئے ہر لنک کے لیے جمع کروائیں۔" }, a:["vault"] },
      { id:"l7", w:"week",  t:{ en:"Look after yourself", ur:"اپنا خیال رکھیں" },
        d:{ en:"Take breaks from your phone, lean on people who support you, and speak to a counsellor or helpline if it feels too heavy.", ur:"فون سے وقفہ لیں، مددگار لوگوں کا سہارا لیں، اور بوجھ زیادہ ہو تو کاؤنسلر یا ہیلپ لائن سے بات کریں۔" }, a:["calm","helplines"] }
    ],
    hacked: [
      { id:"h1", w:"now",   t:{ en:"Use a safe device to start recovery", ur:"محفوظ ڈیوائس سے ریکوری شروع کریں" },
        d:{ en:"If your phone may be infected, use a trusted friend’s device or a computer you control. Open the platform’s official account recovery page.", ur:"اگر آپ کا فون متاثر ہو سکتا ہے تو کسی قابلِ اعتماد ڈیوائس سے پلیٹ فارم کا سرکاری اکاؤنٹ ریکوری صفحہ کھولیں۔" }, a:["platform"] },
      { id:"h2", w:"now",   t:{ en:"Change the password and sign out everywhere", ur:"پاسورڈ بدلیں اور ہر جگہ سے لاگ آؤٹ کریں" },
        d:{ en:"Use a long, unique password. Then use “sign out of all devices” so the attacker loses access.", ur:"لمبا اور منفرد پاسورڈ رکھیں، پھر ’تمام ڈیوائسز سے لاگ آؤٹ‘ استعمال کریں تاکہ حملہ آور کی رسائی ختم ہو۔" }, a:[] },
      { id:"h3", w:"now",   t:{ en:"Check recovery email and phone number", ur:"ریکوری ای میل اور فون نمبر چیک کریں" },
        d:{ en:"Attackers often replace these. Remove anything you don’t recognise.", ur:"حملہ آور اکثر انہیں بدل دیتے ہیں۔ جو آپ کا نہ ہو اسے ہٹا دیں۔" }, a:[] },
      { id:"h4", w:"today", t:{ en:"Turn on two-step verification", ur:"ٹو اسٹیپ ویریفیکیشن آن کریں" },
        d:{ en:"Prefer an authenticator app over SMS codes. Never share a code with anyone, including someone claiming to be support.", ur:"SMS کے بجائے آتھنٹیکیٹر ایپ بہتر ہے۔ کوڈ کسی کو نہ بتائیں، چاہے وہ سپورٹ ہونے کا دعویٰ کرے۔" }, a:["chat"] },
      { id:"h5", w:"today", t:{ en:"Warn your contacts", ur:"اپنے رابطوں کو خبردار کریں" },
        d:{ en:"Tell friends and family not to click links or send money if they received messages from you.", ur:"دوستوں اور گھر والوں کو بتائیں کہ آپ کے نام سے آئے پیغامات کے لنک نہ کھولیں اور رقم نہ بھیجیں۔" }, a:[] },
      { id:"h6", w:"today", t:{ en:"Check money and linked apps", ur:"رقم اور منسلک ایپس چیک کریں" },
        d:{ en:"Review bank, wallet and shopping apps. If money moved, call your bank or wallet provider immediately, then report to NCCIA or FIA.", ur:"بینک، والٹ اور شاپنگ ایپس دیکھیں۔ اگر رقم گئی ہو تو فوراً بینک یا والٹ فراہم کنندہ کو کال کریں، پھر NCCIA یا FIA کو رپورٹ کریں۔" }, a:[{call:"1799"},NCCIA] },
      { id:"h7", w:"week",  t:{ en:"Fix other accounts that share the password", ur:"ایک جیسے پاسورڈ والے دوسرے اکاؤنٹس ٹھیک کریں" },
        d:{ en:"Change every account that used the same or a similar password. A password manager makes this easier.", ur:"جن اکاؤنٹس میں وہی یا ملتا جلتا پاسورڈ تھا سب بدلیں۔ پاسورڈ مینیجر اسے آسان بناتا ہے۔" }, a:[] }
    ],
    fake: [
      { id:"f1", w:"now",   t:{ en:"Save the profile as evidence", ur:"پروفائل کو ثبوت کے طور پر محفوظ کریں" },
        d:{ en:"Copy the profile link and username, and screenshot the photos, bio, posts and any messages sent in your name.", ur:"پروفائل لنک اور یوزر نیم کاپی کریں اور تصاویر، بایو، پوسٹس اور آپ کے نام سے بھیجے گئے پیغامات کے اسکرین شاٹ لیں۔" }, a:["vault"] },
      { id:"f2", w:"now",   t:{ en:"Report it as impersonation", ur:"امپرسونیشن کے طور پر رپورٹ کریں" },
        d:{ en:"Use the platform’s impersonation form (separate from a normal report). Some ask for ID; share it only through the official form.", ur:"پلیٹ فارم کا امپرسونیشن فارم استعمال کریں (یہ عام رپورٹ سے الگ ہوتا ہے)۔ شناخت مانگی جائے تو صرف سرکاری فارم کے ذریعے دیں۔" }, a:["platform"] },
      { id:"f3", w:"today", t:{ en:"Ask trusted friends to report it too", ur:"قابلِ اعتماد دوستوں سے بھی رپورٹ کروائیں" },
        d:{ en:"Several reports can speed up review. Ask them not to message or confront the fake account.", ur:"کئی رپورٹس جائزہ تیز کر سکتی ہیں۔ انہیں کہیں کہ جعلی اکاؤنٹ سے بات یا بحث نہ کریں۔" }, a:[] },
      { id:"f4", w:"today", t:{ en:"Post a short notice on your real account", ur:"اپنے اصل اکاؤنٹ پر مختصر اطلاع لگائیں" },
        d:{ en:"For example: “A fake account is using my name and photos. Please don’t engage; report it.” Keep it brief and calm.", ur:"مثلاً: ’میرے نام اور تصاویر سے ایک جعلی اکاؤنٹ بنا ہے۔ براہِ کرم اس سے بات نہ کریں، رپورٹ کریں۔‘ مختصر اور پرسکون رکھیں۔" }, a:[] },
      { id:"f5", w:"today", t:{ en:"Tighten your privacy settings", ur:"پرائیویسی سیٹنگز سخت کریں" },
        d:{ en:"Make your profile private and limit who can see your photos, so they are harder to copy.", ur:"پروفائل پرائیویٹ کریں اور محدود کریں کہ تصاویر کون دیکھ سکتا ہے تاکہ انہیں کاپی کرنا مشکل ہو۔" }, a:["platform"] },
      { id:"f6", w:"week",  t:{ en:"File a complaint if it is used to harm or defraud", ur:"نقصان یا فراڈ کے لیے استعمال ہو تو شکایت کریں" },
        d:{ en:"If the account is harassing, asking for money or spreading false claims, report to NCCIA or FIA with your evidence.", ur:"اگر اکاؤنٹ ہراساں کر رہا ہو، پیسے مانگ رہا ہو یا جھوٹ پھیلا رہا ہو تو ثبوت کے ساتھ NCCIA یا FIA کو رپورٹ کریں۔" }, a:[NCCIA,{call:"1799"},"report"] }
    ],
    harassment: [
      { id:"r1", w:"now",   t:{ en:"Don’t engage or retaliate", ur:"جواب نہ دیں، بدلہ نہ لیں" },
        d:{ en:"Replying can escalate things and weaken your case. You don’t owe them an answer.", ur:"جواب دینے سے معاملہ بڑھ سکتا ہے اور آپ کا کیس کمزور ہو سکتا ہے۔ آپ پر جواب دینا لازم نہیں۔" }, a:[] },
      { id:"r2", w:"now",   t:{ en:"Document everything", ur:"سب کچھ دستاویز کریں" },
        d:{ en:"Screenshot messages and posts with usernames and dates. Keep a simple timeline: what happened, when, and where.", ur:"یوزر نیم اور تاریخ کے ساتھ پیغامات اور پوسٹس کے اسکرین شاٹ لیں۔ سادہ ٹائم لائن رکھیں: کیا ہوا، کب اور کہاں۔" }, a:["vault"] },
      { id:"r3", w:"now",   t:{ en:"Mute, block and report", ur:"میوٹ، بلاک اور رپورٹ کریں" },
        d:{ en:"Use the platform tools on each account. Block after saving evidence.", ur:"ہر اکاؤنٹ پر پلیٹ فارم کے ٹولز استعمال کریں۔ ثبوت محفوظ کرنے کے بعد بلاک کریں۔" }, a:["platform"] },
      { id:"r4", w:"today", t:{ en:"Limit who can reach you", ur:"محدود کریں کہ آپ تک کون پہنچ سکتا ہے" },
        d:{ en:"Restrict who can message, tag, comment or find you. Hide your phone number and location.", ur:"محدود کریں کہ کون پیغام، ٹیگ، تبصرہ یا تلاش کر سکتا ہے۔ فون نمبر اور لوکیشن چھپائیں۔" }, a:["platform"] },
      { id:"r5", w:"today", t:{ en:"Tell someone you trust", ur:"کسی قابلِ اعتماد شخص کو بتائیں" },
        d:{ en:"If it involves your school, university or workplace, tell them as well; many have formal complaint routes.", ur:"اگر معاملہ اسکول، یونیورسٹی یا دفتر سے متعلق ہو تو انہیں بھی بتائیں؛ اکثر کے پاس باقاعدہ شکایتی نظام ہوتا ہے۔" }, a:["safety"] },
      { id:"r6", w:"week",  t:{ en:"Make a formal complaint if it continues", ur:"جاری رہے تو باقاعدہ شکایت کریں" },
        d:{ en:"If there are threats, sexual content, or the harassment is persistent, report to NCCIA or FIA.", ur:"اگر دھمکیاں، جنسی مواد یا مسلسل ہراسانی ہو تو NCCIA یا FIA کو رپورٹ کریں۔" }, a:[NCCIA,{call:"1799"},"report","letter"] },
      { id:"r7", w:"week",  t:{ en:"Protect your wellbeing", ur:"اپنی ذہنی صحت کا خیال رکھیں" },
        d:{ en:"Take breaks, limit what you read, and talk to someone. Support is available.", ur:"وقفہ لیں، جو پڑھتے ہیں اسے محدود کریں، اور کسی سے بات کریں۔ مدد موجود ہے۔" }, a:["calm","helplines"] }
    ],
    stalking: [
      { id:"s1", w:"now",   t:{ en:"Put physical safety first", ur:"جسمانی حفاظت کو ترجیح دیں" }, d:{ en:"If you think this person could show up in real life, tell someone and avoid being alone. Call emergency services if you feel in danger.", ur:"" }, a:["safety"] },
      { id:"s2", w:"now",   t:{ en:"Save evidence of the contact", ur:"" }, d:{ en:"Screenshot messages, comments and profile visits. Note the dates and times you noticed being followed or watched.", ur:"" }, a:["vault"] },
      { id:"s3", w:"today", t:{ en:"Check your phone for tracking", ur:"" }, d:{ en:"Review location sharing in your apps, remove unknown apps and devices linked to your accounts, and check who has access to your cloud and family-sharing settings.", ur:"" }, a:["chat"] },
      { id:"s4", w:"today", t:{ en:"Change passwords from a safe device", ur:"" }, d:{ en:"Use a device the person has never touched. Turn on two-step verification everywhere.", ur:"" }, a:[] },
      { id:"s5", w:"today", t:{ en:"Remove location clues", ur:"" }, d:{ en:"Turn off location tags on photos and posts, and avoid sharing live location. Check what your background shows.", ur:"" }, a:["platform"] },
      { id:"s6", w:"week",  t:{ en:"Report and make a safety plan", ur:"" }, d:{ en:"Report to NCCIA or FIA, and write down who to call, where you can go and who can stay with you.", ur:"" }, a:[NCCIA,{call:"1799"},"safety"] }
    ],
    deepfake: [
      { id:"d1", w:"now",   t:{ en:"Save the fake before it is removed", ur:"" }, d:{ en:"Copy links and take screenshots showing where it appears and who posted it. Don’t re-share it, even to show that it is fake.", ur:"" }, a:["vault"] },
      { id:"d2", w:"now",   t:{ en:"Report it as manipulated or non-consensual", ur:"" }, d:{ en:"Choose the platform option for edited, AI-generated or intimate images shared without consent.", ur:"" }, a:["platform"] },
      { id:"d3", w:"today", t:{ en:"Use a hash service if it is intimate", ur:"" }, d:{ en:"StopNCII.org (adults) and Take It Down (under 18) help block intimate images from spreading on participating platforms.", ur:"" }, a:[STOPNCII,TAKEIT] },
      { id:"d4", w:"today", t:{ en:"Tell people close to you", ur:"" }, d:{ en:"A short message such as “this is fake, please don’t share it” helps stop it spreading.", ur:"" }, a:["safety"] },
      { id:"d5", w:"week",  t:{ en:"File a complaint", ur:"" }, d:{ en:"Report to NCCIA or FIA with your evidence. Say that the images or video are fabricated.", ur:"" }, a:[NCCIA,{call:"1799"},"report"] },
      { id:"d6", w:"week",  t:{ en:"Look after yourself", ur:"" }, d:{ en:"Seeing a fake of yourself is distressing. Take breaks, and talk to someone you trust.", ur:"" }, a:["calm","helplines"] }
    ],
    fraud: [
      { id:"x1", w:"now",   t:{ en:"Call your bank or wallet provider now", ur:"" }, d:{ en:"Ask them to block the transaction or freeze the account and card. Speed matters. Give them the transaction ID and time.", ur:"" }, a:[] },
      { id:"x2", w:"now",   t:{ en:"Stop contact and save evidence", ur:"" }, d:{ en:"Don’t send anything more. Screenshot chats, payment receipts, numbers and links.", ur:"" }, a:["vault"] },
      { id:"x3", w:"today", t:{ en:"Report to NCCIA or FIA", ur:"" }, d:{ en:"File a complaint for financial fraud with your transaction details and evidence.", ur:"" }, a:[NCCIA,FIA,{call:"1799"},{call:"9911"}] },
      { id:"x4", w:"today", t:{ en:"Change PINs and passwords", ur:"" }, d:{ en:"If you shared a PIN, OTP or password, change it, and any account that uses the same one.", ur:"" }, a:[] },
      { id:"x5", w:"week",  t:{ en:"Watch your statements", ur:"" }, d:{ en:"Check accounts for unfamiliar activity over the next weeks and tell your bank if anything looks wrong.", ur:"" }, a:["check"] },
      { id:"x6", w:"week",  t:{ en:"Warn others", ur:"" }, d:{ en:"Share the scam pattern with friends and family so they don’t fall for it.", ur:"" }, a:[] }
    ]
  };

  const MODS = {
    danger: [ { id:"m_danger", w:"now", prepend:true,
      t:{ en:"Get somewhere safe and call for help", ur:"محفوظ جگہ پر جائیں اور مدد کے لیے کال کریں" },
      d:{ en:"If anyone may hurt you, go to a safe place and call local emergency services or someone you trust now. Then return to this plan.", ur:"اگر کوئی آپ کو نقصان پہنچا سکتا ہے تو محفوظ جگہ پر جائیں اور فوراً مقامی ایمرجنسی سروس یا کسی قابلِ اعتماد شخص کو کال کریں۔ پھر اس منصوبے پر واپس آئیں۔" },
      a:[{call:"15"},{call:"1122"},"safety"] } ],
    minor: [ { id:"m_minor", w:"now",
      t:{ en:"Tell a trusted adult. You are not in trouble", ur:"کسی قابلِ اعتماد بڑے کو بتائیں۔ آپ مشکل میں نہیں ہیں" },
      d:{ en:"A parent, teacher or relative can help you report this. If images are involved, Take It Down can help remove them.", ur:"والدین، استاد یا رشتہ دار رپورٹ کرنے میں مدد کر سکتے ہیں۔ اگر تصاویر کا معاملہ ہو تو Take It Down انہیں ہٹانے میں مدد دے سکتا ہے۔" },
      a:[TAKEIT,{call:"1098"}] } ],
    paid: [ { id:"m_paid", w:"now",
      t:{ en:"Keep receipts and stop paying", ur:"رسیدیں رکھیں اور مزید ادائیگی نہ کریں" },
      d:{ en:"Save payment receipts, wallet numbers and transaction IDs. Tell your bank or wallet provider what happened.", ur:"ادائیگی کی رسیدیں، والٹ نمبر اور ٹرانزیکشن آئی ڈی محفوظ کریں۔ بینک یا والٹ فراہم کنندہ کو بتائیں۔" }, a:["vault"] } ],
    shared: [ { id:"m_shared", w:"now",
      t:{ en:"Don’t send anything more, and assume copies exist", ur:"مزید کچھ نہ بھیجیں اور فرض کریں کاپیاں موجود ہیں" },
      d:{ en:"Don’t send more photos or videos, even if they promise to delete them. Use StopNCII.org or Take It Down to limit spreading.", ur:"مزید تصاویر یا ویڈیوز نہ بھیجیں، چاہے وہ ڈیلیٹ کرنے کا وعدہ کریں۔ پھیلاؤ محدود کرنے کے لیے StopNCII.org یا Take It Down استعمال کریں۔" }, a:[STOPNCII,TAKEIT] } ],
    knows: [ { id:"m_knows", w:"today",
      t:{ en:"Don’t confront them alone", ur:"اکیلے ان کا سامنا نہ کریں" },
      d:{ en:"If you know who it is, write down their name, number and accounts. Consider telling your school, family or workplace, and keep things in writing.", ur:"اگر آپ جانتے ہیں کہ کون ہے تو ان کا نام، نمبر اور اکاؤنٹس لکھ لیں۔ اسکول، گھر والوں یا دفتر کو بتانے پر غور کریں اور بات تحریری رکھیں۔" }, a:["report"] } ]
  };

  const QUESTIONS = [
    { id:"danger", t:{ en:"I feel I may be in physical danger", ur:"مجھے جسمانی خطرہ محسوس ہوتا ہے" }, d:{ en:"Someone threatens to hurt me or turn up in person.", ur:"کوئی نقصان پہنچانے یا سامنے آنے کی دھمکی دیتا ہے۔" } },
    { id:"minor",  t:{ en:"I am under 18", ur:"میری عمر 18 سال سے کم ہے" }, d:{ en:"This adds extra protection steps.", ur:"اس سے اضافی تحفظی اقدامات شامل ہوتے ہیں۔" } },
    { id:"paid",   t:{ en:"I have already paid or sent money", ur:"میں رقم دے چکا/چکی ہوں" }, d:{ en:"Including mobile wallet or gift cards.", ur:"موبائل والٹ یا گفٹ کارڈ سمیت۔" } },
    { id:"shared", t:{ en:"I have sent private photos or videos", ur:"میں نجی تصاویر یا ویڈیوز بھیج چکا/چکی ہوں" }, d:{ en:"To the person causing this.", ur:"اس شخص کو جو یہ کر رہا ہے۔" } },
    { id:"knows",  t:{ en:"I know who is doing this", ur:"میں جانتا/جانتی ہوں یہ کون ہے" }, d:{ en:"A classmate, ex-partner, colleague or acquaintance.", ur:"ہم جماعت، سابق ساتھی، رفیقِ کار یا جاننے والا۔" } }
  ];

  const ACTIONS = {
    vault:    { href:"vault.html", label:{ en:"Open evidence vault", ur:"ایویڈنس والٹ کھولیں" } },
    report:   { href:"resources.html#incident-report", label:{ en:"Make an incident report", ur:"انسیڈنٹ رپورٹ بنائیں" } },
    platform: { href:"platforms.html", label:{ en:"Platform guides", ur:"پلیٹ فارم گائیڈز" } },
    helplines:{ href:"helplines.html", label:{ en:"Helplines", ur:"ہیلپ لائنز" } },
    safety:   { href:"safety.html", label:{ en:"Safety plan", ur:"حفاظتی منصوبہ" } },
    calm:     { href:"calm.html", label:{ en:"Calm exercise", ur:"سکون کی مشق" } },
    chat:     { href:"chatbot.html", label:{ en:"Ask the assistant", ur:"اسسٹنٹ سے پوچھیں" } },
    letter:   { href:"resources.html#letter-tool", label:{ en:"Complaint letter", ur:"شکایتی خط" } },
    check:    { href:"checker.html", label:{ en:"Scam checker", ur:"اسکیم چیکر" } }
  };

  window.CH_TRIAGE = { SCENARIOS, STEPS: S, MODS, QUESTIONS, ACTIONS };
})();
