export interface TransferCategory {
  id: 'wallet' | 'mobile' | 'bank_exchange';
  label: string;
}

export const TRANSFER_CATEGORIES: TransferCategory[] = [
  { id: 'wallet', label: 'محفظة إلكترونية' },
  { id: 'mobile', label: 'رقم جوال' },
  { id: 'bank_exchange', label: 'رقم حساب بنكي / تحويل صراف' },
];

export interface TransferMethodItem {
  name: string;
  category: 'wallet' | 'mobile' | 'bank_exchange';
}

export interface CountryMethodConfig {
  country: string;
  flag: string;
  methods: TransferMethodItem[];
}

export const COUNTRY_TRANSFER_METHODS: CountryMethodConfig[] = [
  {
    country: 'مصر',
    flag: '🇪🇬',
    methods: [
      { name: 'فودافون كاش', category: 'wallet' },
      { name: 'إنستاباي', category: 'wallet' },
      { name: 'بنك مصر', category: 'bank_exchange' },
      { name: 'البنك الأهلي', category: 'bank_exchange' },
      { name: 'بنك الإسكندرية', category: 'bank_exchange' },
    ],
  },
  {
    country: 'السعودية',
    flag: '🇸🇦',
    methods: [
      { name: 'مصرف الراجحي', category: 'bank_exchange' },
      { name: 'البنك الأهلي', category: 'bank_exchange' },
      { name: 'بنك البركة', category: 'bank_exchange' },
      { name: 'بنك الخليج الدولي', category: 'bank_exchange' },
      { name: 'بنك STC', category: 'wallet' },
      { name: 'تحويلات عبر الصراف', category: 'bank_exchange' },
    ],
  },
  {
    country: 'سوريا',
    flag: '🇸🇾',
    methods: [
      { name: 'شام كاش', category: 'wallet' },
      { name: 'تحويل عبر صراف', category: 'bank_exchange' },
    ],
  },
  {
    country: 'الجزائر',
    flag: '🇩🇿',
    methods: [
      { name: 'بريد الجزائر', category: 'bank_exchange' },
      { name: 'تحويل عبر صراف', category: 'bank_exchange' },
    ],
  },
  {
    country: 'المغرب',
    flag: '🇲🇦',
    methods: [
      { name: 'البنك الشعبي', category: 'bank_exchange' },
      { name: 'تحويلات عبر الصراف', category: 'bank_exchange' },
    ],
  },
  {
    country: 'العراق',
    flag: '🇮🇶',
    methods: [
      { name: 'زين كاش', category: 'wallet' },
      { name: 'سوبر كي', category: 'wallet' },
      { name: 'تحويل عبر صراف', category: 'bank_exchange' },
    ],
  },
  {
    country: 'تونس',
    flag: '🇹🇳',
    methods: [
      { name: 'بريد تونس', category: 'bank_exchange' },
      { name: 'تحويل عبر صراف', category: 'bank_exchange' },
    ],
  },
  {
    country: 'عالمي (كل الدول)',
    flag: '🌐',
    methods: [
      { name: 'وسترن يونيون', category: 'bank_exchange' },
      { name: 'موني جرام', category: 'bank_exchange' },
    ],
  },
];
