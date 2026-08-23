import { Lang } from '../types';

type Dict = Record<string, { en: string; te: string; hi: string }>;

export const T: Dict = {
  // Nav
  nav_home: { en: 'Home', te: 'హోమ్', hi: 'होम' },
  nav_about: { en: 'About', te: 'మా గురించి', hi: 'हमारे बारे में' },
  nav_services: { en: 'Services', te: 'సేవలు', hi: 'सेवाएं' },
  nav_blog: { en: 'Blog', te: 'బ్లాగ్', hi: 'ब्लॉग' },
  nav_gallery: { en: 'Gallery', te: 'గ్యాలరీ', hi: 'गैलरी' },
  nav_team: { en: 'Team', te: 'బృందం', hi: 'टीम' },
  nav_contact: { en: 'Contact', te: 'సంప్రదించండి', hi: 'संपर्क करें' },

  // CTA
  cta_enquire: { en: 'Send Enquiry', te: 'విచారణ పంపండి', hi: 'पूछताछ भेजें' },
  cta_enquire_now: { en: 'Enquire Now', te: 'ఇప్పుడే విచారించండి', hi: 'अभी पूछताछ करें' },
  cta_view_service: { en: 'View Service', te: 'సేవను చూడండి', hi: 'सेवा देखें' },
  cta_all_services: { en: 'Explore All Services', te: 'అన్ని సేవలను చూడండి', hi: 'सभी सेवाएं देखें' },
  cta_call: { en: 'Call Us', te: 'కాల్ చేయండి', hi: 'कॉल करें' },
  cta_whatsapp: { en: 'WhatsApp', te: 'వాట్సాప్', hi: 'व्हाट्सएप' },
  cta_email: { en: 'Email Us', te: 'ఇమెయిల్', hi: 'ईमेल करें' },
  cta_learn_more: { en: 'Learn More', te: 'మరింత తెలుసుకోండి', hi: 'और जानें' },
  cta_read_more: { en: 'Read More', te: 'మరింత చదవండి', hi: 'और पढ़ें' },
  cta_get_started: { en: 'Start the Conversation', te: 'సంభాషణ ప్రారంభించండి', hi: 'बातचीत शुरू करें' },

  // Sections
  our_services: { en: 'Our Services', te: 'మా సేవలు', hi: 'हमारी सेवाएं' },
  services_sub: { en: 'A complete campaign system for the Telugu states', te: 'తెలుగు రాష్ట్రాల కోసం సంపూర్ణ ప్రచార వ్యవస్థ', hi: 'तेलुगु राज्यों के लिए एक संपूर्ण अभियान प्रणाली' },
  why_us: { en: 'Why Vijayavyuham', te: 'విజయవ్యూహం ఎందుకు', hi: 'विजयव्यूहम क्यों' },
  latest_insights: { en: 'Latest Insights', te: 'తాజా విశ్లేషణలు', hi: 'नवीनतम अंतर्दृष्टि' },
  our_team: { en: 'Our Team', te: 'మా బృందం', hi: 'हमारी टीम' },
  our_work: { en: 'Our Work', te: 'మా పని', hi: 'हमारा काम' },
  what_clients_say: { en: 'What People Say', te: 'ప్రజలు ఏమంటున్నారు', hi: 'लोग क्या कहते हैं' },
  mission: { en: 'Our Mission', te: 'మా లక్ష్యం', hi: 'हमारा मिशन' },
  vision: { en: 'Our Vision', te: 'మా దృష్టి', hi: 'हमारा दृष्टिकोण' },

  // Contact form
  form_name: { en: 'Your Name', te: 'మీ పేరు', hi: 'आपका नाम' },
  form_email: { en: 'Email', te: 'ఇమెయిల్', hi: 'ईमेल' },
  form_phone: { en: 'Phone', te: 'ఫోన్', hi: 'फ़ोन' },
  form_service: { en: 'Service of Interest', te: 'ఆసక్తి ఉన్న సేవ', hi: 'रुचि की सेवा' },
  form_message: { en: 'How can we help you?', te: 'మేము మీకు ఎలా సహాయం చేయగలం?', hi: 'हम आपकी कैसे मदद कर सकते हैं?' },
  form_send: { en: 'Send Enquiry', te: 'విచారణ పంపండి', hi: 'पूछताछ भेजें' },
  form_success: { en: 'Thank you! Your enquiry has been received. We will reach out soon.', te: 'ధన్యవాదాలు! మీ విచారణ అందింది. మేము త్వరలో సంప్రదిస్తాము.', hi: 'धन्यवाद! आपकी पूछताछ प्राप्त हो गई है। हम जल्द ही संपर्क करेंगे।' },
  form_error: { en: 'Something went wrong. Please try again.', te: 'ఏదో తప్పు జరిగింది. దయచేసి మళ్లీ ప్రయత్నించండి.', hi: 'कुछ गलत हो गया। कृपया पुनः प्रयास करें।' },
  form_optional: { en: 'optional', te: 'ఐచ్ఛికం', hi: 'वैकल्पिक' },

  // Misc
  get_in_touch: { en: 'Get in Touch', te: 'సంప్రదించండి', hi: 'संपर्क में रहें' },
  contact_us: { en: 'Contact Us', te: 'మమ్మల్ని సంప్రదించండి', hi: 'हमसे संपर्क करें' },
  address: { en: 'Address', te: 'చిరునామా', hi: 'पता' },
  quick_links: { en: 'Quick Links', te: 'త్వరిత లింకులు', hi: 'त्वरित लिंक' },
  follow_us: { en: 'Follow Us', te: 'మమ్మల్ని అనుసరించండి', hi: 'हमें फॉलो करें' },
  rights: { en: 'All rights reserved.', te: 'అన్ని హక్కులు ప్రత్యేకించబడ్డాయి.', hi: 'सर्वाधिकार सुरक्षित।' },
  serving: { en: 'Serving Telangana & Andhra Pradesh', te: 'తెలంగాణ & ఆంధ్రప్రదేశ్‌లకు సేవలు', hi: 'तेलंगाना और आंध्र प्रदेश की सेवा' },
  back_to_services: { en: 'Back to all services', te: 'అన్ని సేవలకు తిరిగి', hi: 'सभी सेवाओं पर वापस' },
  no_posts: { en: 'New insights are coming soon.', te: 'కొత్త విశ్లేషణలు త్వరలో వస్తున్నాయి.', hi: 'नई अंतर्दृष्टि जल्द आ रही है।' },
  quick_enquiry: { en: 'Quick Enquiry', te: 'త్వరిత విచారణ', hi: 'त्वरित पूछताछ' },
  lang_prompt: { en: 'Choose your language', te: 'మీ భాషను ఎంచుకోండి', hi: 'अपनी भाषा चुनें' },
  lang_prompt_sub: { en: 'Read Vijayavyuham in the language you prefer', te: 'మీకు నచ్చిన భాషలో విజయవ్యూహం చదవండి', hi: 'अपनी पसंदीदा भाषा में विजयव्यूहम पढ़ें' },
};

export function t(key: string, lang: Lang): string {
  const entry = T[key];
  if (!entry) return key;
  return entry[lang] || entry.en;
}

export const LANGS: { code: Lang; label: string; native: string }[] = [
  { code: 'en', label: 'English', native: 'English' },
  { code: 'te', label: 'Telugu', native: 'తెలుగు' },
  { code: 'hi', label: 'Hindi', native: 'हिन्दी' },
];

// Pick localized field from a DB row with _en/_te/_hi suffixes, falling back to en
export function loc(row: any, base: string, lang: Lang): string {
  if (!row) return '';
  return (row[`${base}_${lang}`] || row[`${base}_en`] || '') as string;
}
