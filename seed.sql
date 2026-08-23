-- ============================================================
-- Vijayavyuham Seed Data
-- ============================================================

-- ---------- SETTINGS ----------
INSERT OR REPLACE INTO settings (key, value) VALUES
  ('site_name', 'Vijayavyuham'),
  ('tagline_en', 'Strategy • Intelligence • Impact'),
  ('tagline_te', 'వ్యూహం • విశ్లేషణ • ప్రభావం'),
  ('tagline_hi', 'रणनीति • बुद्धिमत्ता • प्रभाव'),
  ('contact_phone', ''),
  ('contact_whatsapp', ''),
  ('contact_email', ''),
  ('contact_address_en', 'Hyderabad, Telangana, India'),
  ('contact_address_te', 'హైదరాబాద్, తెలంగాణ, భారతదేశం'),
  ('contact_address_hi', 'हैदराबाद, तेलंगाना, भारत'),
  ('social_facebook', ''),
  ('social_instagram', ''),
  ('social_whatsapp', ''),
  ('social_twitter', ''),
  ('social_youtube', ''),
  ('page_home', '1'),
  ('page_about', '1'),
  ('page_services', '1'),
  ('page_blog', '1'),
  ('page_contact', '1'),
  ('page_gallery', '0'),
  ('page_team', '0'),
  ('meta_description_en', 'Vijayavyuham is a data-driven political campaign consultancy serving Telangana and Andhra Pradesh. Voter research, booth management, social media campaigns, IVR, WhatsApp outreach, and AI video messaging.'),
  ('meta_keywords', 'political consultancy Telangana, election campaign management Andhra Pradesh, voter survey Telugu states, booth management, political survey research, Vijayavyuham'),
  ('hero_headline_en', 'Win with Strategy. Lead with Intelligence.'),
  ('hero_headline_te', 'వ్యూహంతో గెలవండి. విశ్లేషణతో నడిపించండి.'),
  ('hero_headline_hi', 'रणनीति से जीतें। बुद्धिमत्ता से नेतृत्व करें।'),
  ('hero_subtext_en', 'A modern political campaign partner for the Telugu states — turning voter insight into decisive electoral action across Telangana and Andhra Pradesh.'),
  ('hero_subtext_te', 'తెలుగు రాష్ట్రాల కోసం ఆధునిక రాజకీయ ప్రచార భాగస్వామి — తెలంగాణ మరియు ఆంధ్రప్రదేశ్‌లలో ఓటర్ల అవగాహనను నిర్ణయాత్మక ఎన్నికల చర్యగా మారుస్తాము.'),
  ('hero_subtext_hi', 'तेलुगु राज्यों के लिए एक आधुनिक राजनीतिक अभियान भागीदार — तेलंगाना और आंध्र प्रदेश में मतदाता अंतर्दृष्टि को निर्णायक चुनावी कार्रवाई में बदलना।'),
  ('about_body_en', 'Vijayavyuham is a new-generation political strategy firm built for the Telugu states. We combine rigorous ground research, sharp data analysis, and disciplined field execution into one connected campaign system. Every recommendation we make is grounded in evidence — never guesswork. Our focus is simple: understand the voter deeply, communicate with clarity, and execute on the ground with precision so our clients can make confident decisions at every stage of the campaign.'),
  ('about_body_te', 'విజయవ్యూహం అనేది తెలుగు రాష్ట్రాల కోసం రూపొందించబడిన కొత్త తరం రాజకీయ వ్యూహ సంస్థ. మేము కఠినమైన క్షేత్రస్థాయి పరిశోధన, పదునైన డేటా విశ్లేషణ మరియు క్రమశిక్షణతో కూడిన క్షేత్ర అమలును ఒకే అనుసంధాన ప్రచార వ్యవస్థగా మిళితం చేస్తాము. మా ప్రతి సిఫార్సు ఆధారాలపై ఆధారపడి ఉంటుంది — ఎప్పుడూ ఊహలపై కాదు.'),
  ('about_body_hi', 'विजयव्यूहम तेलुगु राज्यों के लिए बनाई गई एक नई पीढ़ी की राजनीतिक रणनीति फर्म है। हम कठोर जमीनी शोध, तेज डेटा विश्लेषण और अनुशासित क्षेत्र निष्पादन को एक जुड़े हुए अभियान प्रणाली में जोड़ते हैं। हमारी हर सिफारिश साक्ष्य पर आधारित होती है — कभी अनुमान पर नहीं।'),
  ('mission_en', 'To empower political leaders and organizations in the Telugu states with clear, evidence-led strategy and flawless ground execution.'),
  ('mission_te', 'స్పష్టమైన, ఆధారాధారిత వ్యూహం మరియు దోషరహిత క్షేత్ర అమలుతో తెలుగు రాష్ట్రాల్లోని రాజకీయ నాయకులు మరియు సంస్థలను శక్తివంతం చేయడం.'),
  ('mission_hi', 'तेलुगु राज्यों में राजनीतिक नेताओं और संगठनों को स्पष्ट, साक्ष्य-आधारित रणनीति और त्रुटिहीन क्षेत्र निष्पादन के साथ सशक्त बनाना।'),
  ('vision_en', 'To become the most trusted political campaign partner in Telangana and Andhra Pradesh — known for integrity, intelligence, and impact.'),
  ('vision_te', 'తెలంగాణ మరియు ఆంధ్రప్రదేశ్‌లలో అత్యంత నమ్మకమైన రాజకీయ ప్రచార భాగస్వామిగా మారడం — నిజాయితీ, విశ్లేషణ మరియు ప్రభావం కోసం గుర్తింపు పొందడం.'),
  ('vision_hi', 'तेलंगाना और आंध्र प्रदेश में सबसे भरोसेमंद राजनीतिक अभियान भागीदार बनना — ईमानदारी, बुद्धिमत्ता और प्रभाव के लिए जाना जाने वाला।');

-- ---------- SERVICES ----------
INSERT OR REPLACE INTO services (slug, sort_order, icon, title_en, short_en, description_en, title_te, short_te, title_hi, short_hi, features) VALUES
('political-survey-research', 1, 'fa-magnifying-glass-chart',
 'Political Survey & Research', 'Measure voter sentiment, local issues, leadership perception, and electoral movement through structured political research.',
 'We design and run structured political research to measure voter sentiment, surface local issues, gauge leadership perception, and track electoral movement over time. Our surveys are built for the ground realities of Telangana and Andhra Pradesh — sampling that reflects real constituencies, questionnaires in Telugu, and analysis you can act on. Research before rhetoric, always.',
 'రాజకీయ సర్వే & పరిశోధన', 'నిర్మాణాత్మక రాజకీయ పరిశోధన ద్వారా ఓటర్ల మనోభావాలు, స్థానిక సమస్యలు మరియు నాయకత్వ అవగాహనను కొలవండి.',
 'राजनीतिक सर्वेक्षण और अनुसंधान', 'संरचित राजनीतिक अनुसंधान के माध्यम से मतदाता भावना, स्थानीय मुद्दों और नेतृत्व धारणा को मापें।',
 '[{"en":"Research before rhetoric","te":"వాదన కంటే ముందు పరిశోధన","hi":"बयानबाजी से पहले शोध"},{"en":"Constituency-first understanding","te":"నియోజకవర్గం ఆధారిత అవగాహన","hi":"निर्वाचन क्षेत्र-प्रथम समझ"},{"en":"Evidence-led strategy","te":"ఆధారాధారిత వ్యూహం","hi":"साक्ष्य-आधारित रणनीति"}]'),

('voter-mapping', 2, 'fa-map-location-dot',
 'Voter Mapping', 'Organize constituencies by booth, locality, voter segment, persuasion opportunity, and turnout risk.',
 'We map your constituency down to the booth and locality — segmenting voters by community, persuasion opportunity, and turnout risk. This gives your campaign a clear picture of where to invest energy, which segments to prioritize, and where the real battlegrounds lie. Map before movement.',
 'ఓటర్ మ్యాపింగ్', 'బూత్, ప్రాంతం, ఓటర్ విభాగం మరియు హాజరు ప్రమాదం ద్వారా నియోజకవర్గాలను నిర్వహించండి.',
 'मतदाता मानचित्रण', 'बूथ, इलाके, मतदाता वर्ग और मतदान जोखिम के आधार पर निर्वाचन क्षेत्रों को व्यवस्थित करें।',
 '[{"en":"Map before movement","te":"కదలిక కంటే ముందు మ్యాపింగ్","hi":"आंदोलन से पहले मानचित्रण"},{"en":"Segmented voter understanding","te":"విభజిత ఓటర్ అవగాహన","hi":"खंडित मतदाता समझ"},{"en":"Priority outreach zones","te":"ప్రాధాన్యత ప్రచార ప్రాంతాలు","hi":"प्राथमिकता आउटरीच क्षेत्र"}]'),

('social-media-campaign', 3, 'fa-hashtag',
 'Social Media Political Campaign Management', 'Plan platform strategy, content, rapid response, audience engagement, and performance-led digital communication.',
 'We run daily narrative control across every platform — planning platform strategy, producing creative political content, managing rapid response, and driving audience engagement with performance-led digital communication tuned for Telugu audiences.',
 'సోషల్ మీడియా రాజకీయ ప్రచార నిర్వహణ', 'ప్లాట్‌ఫారమ్ వ్యూహం, కంటెంట్, వేగవంతమైన స్పందన మరియు ప్రేక్షకుల నిమగ్నతను ప్లాన్ చేయండి.',
 'सोशल मीडिया राजनीतिक अभियान प्रबंधन', 'प्लेटफ़ॉर्म रणनीति, सामग्री, त्वरित प्रतिक्रिया और दर्शक जुड़ाव की योजना बनाएं।',
 '[{"en":"Daily narrative control","te":"రోజువారీ కథన నియంత్రణ","hi":"दैनिक कथा नियंत्रण"},{"en":"Creative political communication","te":"సృజనాత్మక రాజకీయ సమాచారం","hi":"रचनात्मक राजनीतिक संचार"},{"en":"Platform-ready execution","te":"ప్లాట్‌ఫారమ్-సిద్ధ అమలు","hi":"प्लेटफ़ॉर्म-तैयार निष्पादन"}]'),

('booth-management', 4, 'fa-people-group',
 'Election Booth Management', 'Booth-first execution with local accountability and review-led field work for maximum turnout.',
 'Elections are won booth by booth. We build booth-first execution systems with clear local accountability, structured review cycles, and disciplined field work so no polling booth is left unmanaged on the day that matters most.',
 'ఎన్నికల బూత్ నిర్వహణ', 'స్థానిక జవాబుదారీతనం మరియు సమీక్ష ఆధారిత క్షేత్ర పనితో బూత్-ఆధారిత అమలు.',
 'चुनाव बूथ प्रबंधन', 'स्थानीय जवाबदेही और समीक्षा-आधारित क्षेत्र कार्य के साथ बूथ-प्रथम निष्पादन।',
 '[{"en":"Booth-first execution","te":"బూత్-ఆధారిత అమలు","hi":"बूथ-प्रथम निष्पादन"},{"en":"Local accountability","te":"స్థానిక జవాబుదారీతనం","hi":"स्थानीय जवाबदेही"},{"en":"Review-led field work","te":"సమీక్ష ఆధారిత క్షేత్ర పని","hi":"समीक्षा-आधारित क्षेत्र कार्य"}]'),

('rally-yatra-management', 5, 'fa-route',
 'Rally & Yatra Management', 'Coordinate routes, crowds, local mobilization, media moments, logistics, and post-event campaign follow-up.',
 'From route planning to crowd coordination, local mobilization, media moments, and full logistics — we manage rallies and yatras end to end, and follow up after every event to convert momentum into lasting campaign gains. Movement with message.',
 'ర్యాలీ & యాత్ర నిర్వహణ', 'మార్గాలు, జనసమూహాలు, స్థానిక సమీకరణ, మీడియా క్షణాలు మరియు లాజిస్టిక్స్‌ను సమన్వయం చేయండి.',
 'रैली और यात्रा प्रबंधन', 'मार्ग, भीड़, स्थानीय लामबंदी, मीडिया क्षण और लॉजिस्टिक्स का समन्वय करें।',
 '[{"en":"Movement with message","te":"సందేశంతో కూడిన కదలిక","hi":"संदेश के साथ आंदोलन"},{"en":"Route-led visibility","te":"మార్గ ఆధారిత దృశ్యమానత","hi":"मार्ग-आधारित दृश्यता"},{"en":"Crowd & media coordination","te":"జనసమూహం & మీడియా సమన్వయం","hi":"भीड़ और मीडिया समन्वय"}]'),

('event-management', 6, 'fa-calendar-check',
 'Event Management', 'Deliver political meetings, public programs, stakeholder events, and campaign activations with disciplined coordination.',
 'We deliver political meetings, public programs, stakeholder gatherings, and campaign activations with disciplined coordination — every detail planned, every message aligned, every event built to advance the campaign.',
 'ఈవెంట్ నిర్వహణ', 'రాజకీయ సమావేశాలు, ప్రజా కార్యక్రమాలు మరియు ప్రచార కార్యక్రమాలను క్రమశిక్షణతో అందించండి.',
 'कार्यक्रम प्रबंधन', 'राजनीतिक बैठकें, सार्वजनिक कार्यक्रम और अभियान सक्रियण को अनुशासित समन्वय के साथ प्रदान करें।',
 '[{"en":"Organized public engagement","te":"వ్యవస్థీకృత ప్రజా నిమగ్నత","hi":"संगठित सार्वजनिक जुड़ाव"},{"en":"Campaign-ready event design","te":"ప్రచార-సిద్ధ ఈవెంట్ డిజైన్","hi":"अभियान-तैयार कार्यक्रम डिज़ाइन"},{"en":"Message-led execution","te":"సందేశ ఆధారిత అమలు","hi":"संदेश-आधारित निष्पादन"}]'),

('ivr-bulk-calls', 7, 'fa-phone-volume',
 'IVR Bulk Calls', 'Reach large voter groups with recorded voice messages, language targeting, scheduling, and response tracking.',
 'Reach lakhs of voters with recorded voice messages in Telugu, Hindi, or English. We handle language targeting, scheduling, and response tracking so your campaign message lands at scale with measurable feedback.',
 'IVR బల్క్ కాల్స్', 'రికార్డ్ చేసిన వాయిస్ సందేశాలతో పెద్ద ఓటర్ సమూహాలను చేరుకోండి.',
 'IVR बल्क कॉल', 'रिकॉर्ड किए गए वॉयस संदेशों के साथ बड़े मतदाता समूहों तक पहुंचें।',
 '[{"en":"Recorded voter outreach","te":"రికార్డ్ చేసిన ఓటర్ ప్రచారం","hi":"रिकॉर्ड किया गया मतदाता आउटरीच"},{"en":"Rapid constituency coverage","te":"వేగవంతమైన నియోజకవర్గ కవరేజ్","hi":"तीव्र निर्वाचन क्षेत्र कवरेज"},{"en":"Campaign-ready call flows","te":"ప్రచార-సిద్ధ కాల్ ప్రవాహాలు","hi":"अभियान-तैयार कॉल फ्लो"}]'),

('whatsapp-bulk-messaging', 8, 'fa-whatsapp',
 'WhatsApp Bulk Messaging', 'Distribute campaign updates, local messages, invitations, and media assets through organized WhatsApp outreach.',
 'Distribute campaign updates, localized messages, event invitations, and rich media through organized WhatsApp outreach — the platform where Telugu voters actually spend their time. Direct, personal, and trackable.',
 'వాట్సాప్ బల్క్ మెసేజింగ్', 'వ్యవస్థీకృత వాట్సాప్ ద్వారా ప్రచార నవీకరణలు మరియు మీడియాను పంపిణీ చేయండి.',
 'व्हाट्सएप बल्क मैसेजिंग', 'संगठित व्हाट्सएप के माध्यम से अभियान अपडेट और मीडिया वितरित करें।',
 '[{"en":"Direct campaign updates","te":"ప్రత్యక్ష ప్రచార నవీకరణలు","hi":"प्रत्यक्ष अभियान अपडेट"},{"en":"Localized message distribution","te":"స్థానికీకృత సందేశ పంపిణీ","hi":"स्थानीयकृत संदेश वितरण"},{"en":"Volunteer network support","te":"వాలంటీర్ నెట్‌వర్క్ మద్దతు","hi":"स्वयंसेवक नेटवर्क समर्थन"}]'),

('ai-video-messaging', 9, 'fa-clapperboard',
 'AI Personalised Video Messaging', 'Create personalized leader videos at scale for constituencies, communities, supporters, and campaign milestones.',
 'Create personalized leader videos at scale — addressing constituencies, communities, and supporters by name and locality. AI-driven video outreach that feels one-to-one, delivered at campaign scale.',
 'AI వ్యక్తిగతీకృత వీడియో మెసేజింగ్', 'నియోజకవర్గాలు మరియు మద్దతుదారుల కోసం వ్యక్తిగతీకృత నాయకుడి వీడియోలను సృష్టించండి.',
 'AI व्यक्तिगत वीडियो संदेश', 'निर्वाचन क्षेत्रों और समर्थकों के लिए व्यक्तिगत नेता वीडियो बनाएं।',
 '[{"en":"Personalized voter communication","te":"వ్యక్తిగతీకృత ఓటర్ సమాచారం","hi":"व्यक्तिगत मतदाता संचार"},{"en":"Scalable video outreach","te":"స్కేలబుల్ వీడియో ప్రచారం","hi":"स्केलेबल वीडियो आउटरीच"},{"en":"Leader-led messaging","te":"నాయకుడి ఆధారిత సందేశం","hi":"नेता-आधारित संदेश"}]'),

('opinion-exit-poll', 10, 'fa-square-poll-vertical',
 'Opinion and Exit Poll', 'Track electoral preference, issue salience, candidate strength, and voting patterns through rigorous polling.',
 'Track electoral preference, issue salience, candidate strength, and emerging voting patterns through methodologically rigorous opinion and exit polls — designed and analyzed specifically for the Telugu electorate.',
 'అభిప్రాయ & ఎగ్జిట్ పోల్', 'కఠినమైన పోలింగ్ ద్వారా ఎన్నికల ప్రాధాన్యత మరియు ఓటింగ్ నమూనాలను ట్రాక్ చేయండి.',
 'राय और एग्जिट पोल', 'कठोर मतदान के माध्यम से चुनावी प्राथमिकता और मतदान पैटर्न को ट्रैक करें।',
 '[{"en":"Rigorous methodology","te":"కఠినమైన పద్దతి","hi":"कठोर पद्धति"},{"en":"Candidate strength tracking","te":"అభ్యర్థి బలం ట్రాకింగ్","hi":"उम्मीदवार ताकत ट्रैकिंग"},{"en":"Voting pattern analysis","te":"ఓటింగ్ నమూనా విశ్లేషణ","hi":"मतदान पैटर्न विश्लेषण"}]'),

('political-advertising', 11, 'fa-bullhorn',
 'Political Advertising', 'Develop message-led creative and media campaigns for public visibility, persuasion, and voter recall.',
 'We develop message-led creative and place it across the right media mix — building public visibility, driving persuasion, and maximizing voter recall through advertising built for the Telugu media landscape.',
 'రాజకీయ ప్రకటనలు', 'ప్రజా దృశ్యమానత మరియు ఒప్పింపు కోసం సందేశ ఆధారిత సృజనాత్మక ప్రచారాలను అభివృద్ధి చేయండి.',
 'राजनीतिक विज्ञापन', 'सार्वजनिक दृश्यता और अनुनय के लिए संदेश-आधारित रचनात्मक अभियान विकसित करें।',
 '[{"en":"Message-led creative","te":"సందేశ ఆధారిత సృజనాత్మకత","hi":"संदेश-आधारित रचनात्मकता"},{"en":"Right media mix","te":"సరైన మీడియా మిశ్రమం","hi":"सही मीडिया मिश्रण"},{"en":"Maximized voter recall","te":"గరిష్ట ఓటర్ రీకాల్","hi":"अधिकतम मतदाता स्मरण"}]'),

('political-canvassing', 12, 'fa-clipboard-list',
 'Political Canvassing', 'Run structured voter-contact programs that capture feedback, identify support, and strengthen local presence.',
 'Run structured voter-contact programs that capture real feedback, identify committed support, and steadily strengthen your local presence — turning conversations into campaign intelligence.',
 'రాజకీయ కాన్వాసింగ్', 'అభిప్రాయాన్ని సేకరించే మరియు మద్దతును గుర్తించే నిర్మాణాత్మక ఓటర్-సంపర్క కార్యక్రమాలను నిర్వహించండి.',
 'राजनीतिक कैनवासिंग', 'संरचित मतदाता-संपर्क कार्यक्रम चलाएं जो प्रतिक्रिया एकत्र करें और समर्थन की पहचान करें।',
 '[{"en":"Structured voter contact","te":"నిర్మాణాత్మక ఓటర్ సంపర్కం","hi":"संरचित मतदाता संपर्क"},{"en":"Feedback capture","te":"అభిప్రాయ సేకరణ","hi":"प्रतिक्रिया संग्रह"},{"en":"Support identification","te":"మద్దతు గుర్తింపు","hi":"समर्थन पहचान"}]'),

('door-to-door-campaign', 13, 'fa-house-user',
 'Door-to-Door Campaign', 'Plan household outreach, volunteer deployment, voter conversations, data capture, and follow-up action.',
 'The most personal form of politics. We plan household outreach, deploy and train volunteers, structure voter conversations, capture data at the doorstep, and drive disciplined follow-up action — building trust one home at a time.',
 'ఇంటింటి ప్రచారం', 'గృహ ప్రచారం, వాలంటీర్ల నియామకం, ఓటర్ సంభాషణలు మరియు డేటా సేకరణను ప్లాన్ చేయండి.',
 'घर-घर अभियान', 'घरेलू आउटरीच, स्वयंसेवक तैनाती, मतदाता बातचीत और डेटा संग्रह की योजना बनाएं।',
 '[{"en":"Household outreach planning","te":"గృహ ప్రచార ప్రణాళిక","hi":"घरेलू आउटरीच योजना"},{"en":"Volunteer deployment","te":"వాలంటీర్ నియామకం","hi":"स्वयंसेवक तैनाती"},{"en":"Doorstep data capture","te":"గుమ్మం వద్ద డేటా సేకరణ","hi":"द्वार पर डेटा संग्रह"}]');

-- ---------- TESTIMONIALS (trust signals - generic, honest for a new firm) ----------
INSERT OR REPLACE INTO testimonials (author_name, author_role, sort_order, quote_en, quote_te, quote_hi) VALUES
('Campaign Coordinator', 'Assembly Constituency, Telangana', 1,
 'The clarity of their booth-level research changed how we allocated our ground teams. Every rupee spent felt intentional.',
 'వారి బూత్-స్థాయి పరిశోధన స్పష్టత మా క్షేత్ర బృందాలను కేటాయించే విధానాన్ని మార్చింది.',
 'उनके बूथ-स्तरीय शोध की स्पष्टता ने बदल दिया कि हमने अपनी जमीनी टीमों को कैसे आवंटित किया।'),
('Local Leader', 'Andhra Pradesh', 2,
 'What impressed me was the discipline — every plan had evidence behind it, and every promise was delivered on the ground.',
 'నన్ను ఆకట్టుకున్నది క్రమశిక్షణ — ప్రతి ప్రణాళిక వెనుక ఆధారం ఉంది.',
 'मुझे जो प्रभावित किया वह अनुशासन था — हर योजना के पीछे सबूत था।');

-- Blog posts (from seed_content.sql)
INSERT OR REPLACE INTO blogs (slug, category, author, title_en, excerpt_en, content_en, title_te, excerpt_te, content_te, title_hi, excerpt_hi, content_hi, meta_title, meta_description, keywords, is_published, published_at) VALUES

('why-data-driven-campaigns-win-in-telangana-andhra', 'Strategy', 'Vijayavyuham Team',
 'Why Data-Driven Campaigns Win in Telangana & Andhra Pradesh',
 'In the Telugu states, elections are increasingly decided at the booth level. Here is why grounded voter research beats gut instinct every single time.',
 'For decades, campaigns in Telangana and Andhra Pradesh relied heavily on the instinct of local leaders and the reach of a few dominant voices. That era is ending. Today, the constituencies of the Telugu states are among the most digitally connected and politically aware in India — and the campaigns that win are the ones that understand their voters with precision.

Data-driven campaigning starts with a simple discipline: research before rhetoric. Before a single slogan is written or a rally is planned, a serious campaign must know what its voters actually think. What are the top three local issues in each mandal? How is the leadership perceived among first-time voters versus older cohorts? Which booths are safe, which are swing, and which are at genuine risk of low turnout?

At Vijayavyuham, every recommendation we make begins with structured field research designed for the ground realities of the Telugu states — sampling that reflects real constituencies, questionnaires in Telugu, and analysis you can act on the same week. When you combine that intelligence with disciplined booth-level execution, you stop guessing and start winning.

The parties and leaders who embrace this shift will define the next decade of politics in Telangana and Andhra Pradesh. The ones who do not will keep spending energy in the wrong places.',
 'తెలంగాణ & ఆంధ్రప్రదేశ్‌లో డేటా ఆధారిత ప్రచారాలు ఎందుకు గెలుస్తాయి',
 'తెలుగు రాష్ట్రాల్లో ఎన్నికలు క్రమంగా బూత్ స్థాయిలో నిర్ణయించబడుతున్నాయి. ఆధారాధారిత ఓటర్ పరిశోధన ఎందుకు ఊహల కంటే మెరుగైనదో ఇక్కడ ఉంది.',
 'దశాబ్దాలుగా, తెలంగాణ మరియు ఆంధ్రప్రదేశ్‌లలో ప్రచారాలు స్థానిక నాయకుల ఊహలపై ఎక్కువగా ఆధారపడ్డాయి. ఆ యుగం ముగుస్తోంది. నేడు, తెలుగు రాష్ట్రాల నియోజకవర్గాలు భారతదేశంలోనే అత్యంత డిజిటల్‌గా అనుసంధానించబడిన మరియు రాజకీయంగా అవగాహన కలిగినవి.

డేటా ఆధారిత ప్రచారం ఒక సరళమైన క్రమశిక్షణతో ప్రారంభమవుతుంది: వాదన కంటే ముందు పరిశోధన. ఒక్క నినాదం రాయకముందే, తీవ్రమైన ప్రచారం తన ఓటర్లు నిజంగా ఏమనుకుంటున్నారో తెలుసుకోవాలి.

విజయవ్యూహంలో, మేము చేసే ప్రతి సిఫార్సు తెలుగు రాష్ట్రాల క్షేత్రస్థాయి వాస్తవాల కోసం రూపొందించబడిన నిర్మాణాత్మక క్షేత్ర పరిశోధనతో ప్రారంభమవుతుంది.',
 'तेलंगाना और आंध्र प्रदेश में डेटा-संचालित अभियान क्यों जीतते हैं',
 'तेलुगु राज्यों में चुनाव तेजी से बूथ स्तर पर तय हो रहे हैं। यहां बताया गया है कि जमीनी मतदाता अनुसंधान हर बार अंतर्ज्ञान को क्यों हराता है।',
 'दशकों तक, तेलंगाना और आंध्र प्रदेश में अभियान स्थानीय नेताओं के अंतर्ज्ञान पर बहुत अधिक निर्भर थे। वह युग समाप्त हो रहा है। आज, तेलुगु राज्यों के निर्वाचन क्षेत्र भारत में सबसे अधिक डिजिटल रूप से जुड़े हुए हैं।

डेटा-संचालित अभियान एक सरल अनुशासन से शुरू होता है: बयानबाजी से पहले शोध। विजयव्यूहम में, हमारी हर सिफारिश तेलुगु राज्यों की जमीनी वास्तविकताओं के लिए डिज़ाइन किए गए संरचित क्षेत्र अनुसंधान से शुरू होती है।',
 'Why Data-Driven Political Campaigns Win in Telangana & Andhra Pradesh | Vijayavyuham',
 'Discover why data-driven political campaigns and booth-level voter research consistently win elections in Telangana and Andhra Pradesh. Insights from Vijayavyuham.',
 'data driven political campaign Telangana, voter research Andhra Pradesh, booth level strategy, election consultancy Telugu states, Vijayavyuham',
 1, '2025-11-10 09:00:00'),

('booth-level-strategy-guide-telugu-states', 'Field Operations', 'Vijayavyuham Team',
 'The Booth-Level Strategy Guide for Winning Telugu Constituencies',
 'Elections are won and lost booth by booth. A practical look at how booth management, local accountability, and turnout planning decide close races.',
 'Ask any experienced campaign manager in the Telugu states where elections are truly won, and the answer is always the same: at the booth. A constituency is not one big battle — it is hundreds of small ones, each with its own community mix, its own local issues, and its own turnout dynamics.

Booth-first execution means treating every polling booth as a unit of accountability. Who is responsible for it? What is the expected turnout? Which households are supporters, which are undecided, and which need a follow-up conversation? Without answers to these questions, even the most charismatic candidate is flying blind on polling day.

A disciplined booth management system has three pillars. First, mapping: segmenting each booth by community, persuasion opportunity, and turnout risk. Second, accountability: assigning a named local worker to each booth with clear review cycles. Third, follow-through: converting doorstep conversations into data, and data into action.

At Vijayavyuham, we build these systems from the ground up for constituencies across Telangana and Andhra Pradesh. The result is a campaign that knows exactly where to invest its energy in the final, decisive weeks.',
 'తెలుగు నియోజకవర్గాలను గెలవడానికి బూత్-స్థాయి వ్యూహ మార్గదర్శి',
 'ఎన్నికలు బూత్ ద్వారా బూత్ గెలవబడతాయి మరియు ఓడిపోతాయి. బూత్ నిర్వహణ దగ్గరి పోటీలను ఎలా నిర్ణయిస్తుందో ఆచరణాత్మక విశ్లేషణ.',
 'తెలుగు రాష్ట్రాల్లో ఎన్నికలు నిజంగా ఎక్కడ గెలవబడతాయో అనుభవజ్ఞుడైన ఏ ప్రచార నిర్వాహకుడిని అడిగినా, సమాధానం ఎప్పుడూ ఒకటే: బూత్ వద్ద. ఒక నియోజకవర్గం ఒక పెద్ద యుద్ధం కాదు — ఇది వందల చిన్న యుద్ధాలు.

బూత్-ఆధారిత అమలు అంటే ప్రతి పోలింగ్ బూత్‌ను జవాబుదారీతన యూనిట్‌గా పరిగణించడం. విజయవ్యూహంలో, మేము తెలంగాణ మరియు ఆంధ్రప్రదేశ్‌లోని నియోజకవర్గాల కోసం ఈ వ్యవస్థలను నిర్మిస్తాము.',
 'तेलुगु निर्वाचन क्षेत्रों को जीतने के लिए बूथ-स्तरीय रणनीति गाइड',
 'चुनाव बूथ दर बूथ जीते और हारे जाते हैं। बूथ प्रबंधन नज़दीकी मुकाबलों को कैसे तय करता है, इसका व्यावहारिक विश्लेषण।',
 'तेलुगु राज्यों में किसी भी अनुभवी अभियान प्रबंधक से पूछें कि चुनाव वास्तव में कहां जीते जाते हैं, और उत्तर हमेशा एक ही होता है: बूथ पर। एक निर्वाचन क्षेत्र एक बड़ी लड़ाई नहीं है — यह सैकड़ों छोटी लड़ाइयां हैं।

बूथ-प्रथम निष्पादन का अर्थ है प्रत्येक मतदान बूथ को जवाबदेही की इकाई के रूप में मानना। विजयव्यूहम में, हम तेलंगाना और आंध्र प्रदेश के निर्वाचन क्षेत्रों के लिए ये प्रणालियां बनाते हैं।',
 'Booth-Level Strategy Guide for Winning Telugu Constituencies | Vijayavyuham',
 'A practical guide to booth management, local accountability, and turnout planning for winning close races in Telangana and Andhra Pradesh constituencies.',
 'booth management Telangana, booth level strategy Andhra Pradesh, election field operations, turnout planning, political consultancy Telugu states',
 1, '2025-11-18 09:00:00'),

('whatsapp-ivr-ai-video-modern-voter-outreach', 'Digital', 'Vijayavyuham Team',
 'WhatsApp, IVR & AI Video: The New Toolkit for Voter Outreach',
 'The Telugu voter lives on WhatsApp. Learn how modern digital outreach — bulk messaging, IVR calls, and personalized AI video — is reshaping campaigns.',
 'The single biggest shift in voter communication over the last five years has been the move to the smartphone — and in the Telugu states, that means WhatsApp. Voters who once received their political information from television and newspapers now get it, discuss it, and forward it on their phones every single day.

Modern campaigns meet voters where they already are. That starts with organized WhatsApp outreach: campaign updates, localized messages, event invitations, and rich media distributed through a structured volunteer network. It continues with IVR bulk calls — recorded voice messages in Telugu, Hindi, or English that reach lakhs of voters with measurable response tracking. And increasingly, it includes AI-personalized video: leader messages that address constituencies, communities, and supporters by name and locality, delivered at a scale that once seemed impossible.

None of these tools replace the ground game — they amplify it. A well-run digital program keeps a campaign present in a voter''s daily life between doorstep visits, reinforces the core message, and creates opportunities for two-way engagement.

At Vijayavyuham, we plan and execute integrated digital outreach tuned specifically for Telugu audiences, so your message lands with the right person, in the right language, at the right moment.',
 'వాట్సాప్, IVR & AI వీడియో: ఓటర్ ప్రచారానికి కొత్త సాధనాలు',
 'తెలుగు ఓటరు వాట్సాప్‌లో నివసిస్తారు. ఆధునిక డిజిటల్ ప్రచారం ప్రచారాలను ఎలా మారుస్తుందో తెలుసుకోండి.',
 'గత ఐదేళ్లలో ఓటర్ల సమాచారంలో అతిపెద్ద మార్పు స్మార్ట్‌ఫోన్‌కు మారడం — తెలుగు రాష్ట్రాల్లో అంటే వాట్సాప్. ఆధునిక ప్రచారాలు ఓటర్లు ఇప్పటికే ఉన్న చోట కలుస్తాయి.

విజయవ్యూహంలో, మేము తెలుగు ప్రేక్షకుల కోసం ప్రత్యేకంగా రూపొందించిన సమగ్ర డిజిటల్ ప్రచారాన్ని ప్లాన్ చేసి అమలు చేస్తాము.',
 'व्हाट्सएप, IVR और AI वीडियो: मतदाता आउटरीच के लिए नया टूलकिट',
 'तेलुगु मतदाता व्हाट्सएप पर रहता है। जानें कि आधुनिक डिजिटल आउटरीच अभियानों को कैसे नया रूप दे रहा है।',
 'पिछले पांच वर्षों में मतदाता संचार में सबसे बड़ा बदलाव स्मार्टफोन की ओर बढ़ना रहा है — और तेलुगु राज्यों में, इसका मतलब व्हाट्सएप है। आधुनिक अभियान मतदाताओं से वहीं मिलते हैं जहां वे पहले से हैं।

विजयव्यूहम में, हम तेलुगु दर्शकों के लिए विशेष रूप से तैयार एकीकृत डिजिटल आउटरीच की योजना बनाते और निष्पादित करते हैं।',
 'WhatsApp, IVR & AI Video Voter Outreach in Telugu States | Vijayavyuham',
 'How WhatsApp bulk messaging, IVR calls, and AI-personalized video are reshaping political voter outreach in Telangana and Andhra Pradesh.',
 'WhatsApp campaign Telangana, IVR bulk calls Andhra Pradesh, AI video messaging politics, digital voter outreach Telugu, Vijayavyuham',
 1, '2025-11-25 09:00:00');
