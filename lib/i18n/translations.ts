export type Language = "ar" | "en";
export type Direction = "rtl" | "ltr";

export const translations = {
  ar: {
    common: {
      appName: "متتبع الوظائف",
      loading: "جاري التحميل...",
      save: "حفظ",
      saving: "جاري الحفظ...",
      cancel: "إلغاء",
      delete: "حذف",
      edit: "تعديل",
      close: "إغلاق",
      unexpectedError: "حدث خطأ غير متوقع",
      switchToEnglish: "English (LTR)",
      switchToArabic: "العربية (RTL)",
      language: "اللغة",
      themeToggle: "تبديل المظهر",
    },
    nav: {
      appName: "متتبع الوظائف",
      signIn: "تسجيل الدخول",
      signUp: "إنشاء حساب",
      dashboard: "لوحة التحكم",
      logout: "تسجيل الخروج",
    },
    landing: {
      heroEyebrow: "مصمم للعربية أولاً",
      heroTitle: "كل طلباتك.",
      heroTitleAccent: "لوحة واحدة.",
      heroSubtitle:
        "اسحب، رتّب، وتابع كل فرصة وظيفية من أول تقديم حتى توقيع العقد.",
      orContinueWithEmail: "أو بالبريد الإلكتروني",
      emailCapturePlaceholder: "بريدك الإلكتروني",
      demoTitle: "جرّب اللوحة بنفسك",
      demoSubtitle:
        "اسحب البطاقات بين الأعمدة. هذه نفس اللوحة التي ستدير بها بحثك عن عمل.",
      demoDataBadge: "بيانات تجريبية",
      demoSaveCta: "سجّل مجاناً لتحفظ لوحتك",
      startFree: "ابدأ مجاناً",
      featuresTitle: "كل ما تحتاجه لبحثك عن عمل",
      feature1Title: "لوحات وأعمدة مرنة",
      feature1Desc:
        "أنشئ لوحات وأعمدة مخصصة لتتبع طلبات التوظيف الخاصة بك في كل مرحلة من مراحل التقديم.",
      feature2Title: "كل شيء في مكان واحد",
      feature2Desc:
        "لا تفقد أي تقديم وظيفي أبداً. احتفظ بجميع بيانات بحثك عن وظيفة في مكان واحد مركزي.",
      feature3Title: "تابع تقدمك",
      feature3Desc:
        "راقب حالة تقديمك من التقديم وحتى المقابلة والعرض عبر لوحات كانبان التفاعلية.",
    },
    auth: {
      signInTitle: "تسجيل الدخول",
      signUpTitle: "إنشاء حساب",
      name: "الاسم",
      namePlaceholder: "محمد أحمد",
      email: "البريد الإلكتروني",
      emailPlaceholder: "John@doe.com",
      password: "كلمة المرور",
      signInButton: "تسجيل الدخول",
      signUpButton: "إنشاء حساب",
      signingIn: "جاري تسجيل الدخول...",
      signingUp: "جاري إنشاء الحساب...",
      hasAccount: "إذا كان لديك حساب بالفعل",
      noAccount: "ليس لديك حساب؟",
      somethingWentWrong: "حدث خطأ ما",
      orContinueWith: "أو المتابعة عبر",
      continueWithGoogle: "المتابعة باستخدام Google",
      continueWithGitHub: "المتابعة باستخدام GitHub",
      providerNotConfigured: "هذا المزود غير مهيأ بعد. يرجى إضافة مفاتيح OAuth في ملف .env",
    },
    dashboard: {
      defaultBoardTitle: "لوحة الوظائف",
      subtitle: "تتبع طلبات التوظيف الخاصة بك",
      unableToLoad: "تعذر تحميل اللوحة. يُرجى تحديث الصفحة.",
      loading: "جاري تحميل اللوحة...",
      addJob: "إضافة وظيفة",
      addJobTo: "إضافة وظيفة إلى",
    },
    jobForm: {
      company: "الشركة",
      companyPlaceholder: "أبل، جوجل، ...",
      position: "المسمى الوظيفي",
      positionPlaceholder: "مهندس برمجيات",
      location: "الموقع",
      locationPlaceholder: "عن بُعد، الرياض، دبي...",
      status: "الحالة",
      statusPlaceholder: "تم التقديم، مقابلات...",
      salary: "الراتب",
      salaryPlaceholder: "120 ألف - 140 ألف ريال",
      tags: "الوسوم",
      tagsPlaceholder: "React, Next.js, Frontend",
      tagsHelp: "افصل بين الوسوم بفواصل (,)",
      jobUrl: "رابط الوظيفة",
      jobUrlPlaceholder: "https://...",
      description: "الوصف",
      descriptionPlaceholder: "متطلبات الوظيفة، المسؤوليات...",
      notes: "الملاحظات",
      notesPlaceholder: "بيانات مسؤول التوظيف، التحضير للمقابلة...",
      saveChanges: "حفظ التغييرات",
      addJob: "إضافة وظيفة",
      cancel: "إلغاء",
      saving: "جاري الحفظ...",
    },
    jobCard: {
      edit: "تعديل",
      moveTo: "نقل إلى",
      delete: "حذف",
      deleteConfirm: "هل أنت متأكد من رغبتك في حذف هذا الطلب الوظيفي؟",
      notesPrefix: "ملاحظات: ",
      viewPosting: "عرض إعلان الوظيفة",
      dragCardAria: "سحب بطاقة الوظيفة",
      editJobDetails: "تعديل تفاصيل الوظيفة",
      editDialogTitle: "تعديل تفاصيل الوظيفة",
    },
  },
  en: {
    common: {
      appName: "Job Tracker",
      loading: "Loading...",
      save: "Save",
      saving: "Saving...",
      cancel: "Cancel",
      delete: "Delete",
      edit: "Edit",
      close: "Close",
      unexpectedError: "An unexpected error occurred",
      switchToEnglish: "English (LTR)",
      switchToArabic: "العربية (RTL)",
      language: "Language",
      themeToggle: "Toggle theme",
    },
    nav: {
      appName: "Job Tracker",
      signIn: "Sign In",
      signUp: "Sign Up",
      dashboard: "Dashboard",
      logout: "Log out",
    },
    landing: {
      heroEyebrow: "Designed for Arabic first",
      heroTitle: "Every application.",
      heroTitleAccent: "One board.",
      heroSubtitle:
        "Drag, organize, and track every opportunity from first application to signed offer.",
      orContinueWithEmail: "or with your email",
      emailCapturePlaceholder: "Your email address",
      demoTitle: "Try the board yourself",
      demoSubtitle:
        "Drag cards between columns. This is the same board you will use to run your search.",
      demoDataBadge: "Demo data",
      demoSaveCta: "Sign up free to save your board",
      startFree: "Start Free",
      featuresTitle: "Everything you need for the job hunt",
      feature1Title: "Flexible boards",
      feature1Desc:
        "Create custom boards and columns to track your job applications at every stage of the process.",
      feature2Title: "Everything in one place",
      feature2Desc:
        "Never lose track of an application. Keep all your job search information in one centralized place.",
      feature3Title: "Track your progress",
      feature3Desc:
        "Monitor your application status from applied to interview to offer with visual Kanban boards.",
    },
    auth: {
      signInTitle: "Sign In",
      signUpTitle: "Sign Up",
      name: "Name",
      namePlaceholder: "John Doe",
      email: "Email",
      emailPlaceholder: "John@doe.com",
      password: "Password",
      signInButton: "Sign in",
      signUpButton: "Sign up",
      signingIn: "Signing in...",
      signingUp: "Signing up...",
      hasAccount: "if you have an account",
      noAccount: "Don't have an account?",
      somethingWentWrong: "Something went wrong",
      orContinueWith: "Or continue with",
      continueWithGoogle: "Continue with Google",
      continueWithGitHub: "Continue with GitHub",
      providerNotConfigured: "This provider is not configured yet. Please configure OAuth keys in .env",
    },
    dashboard: {
      defaultBoardTitle: "Job Board",
      subtitle: "Track Your Applications",
      unableToLoad: "Unable to load board. Please refresh.",
      loading: "Loading...",
      addJob: "Add Job",
      addJobTo: "Add job to",
    },
    jobForm: {
      company: "Company",
      companyPlaceholder: "Apple, Google, ...",
      position: "Position",
      positionPlaceholder: "Software Engineer",
      location: "Location",
      locationPlaceholder: "Remote, Riyadh, SF...",
      status: "Status",
      statusPlaceholder: "applied, interviewing...",
      salary: "Salary",
      salaryPlaceholder: "$120k - $140k",
      tags: "Tags",
      tagsPlaceholder: "React, Next.js, Frontend",
      tagsHelp: "Separate tags with commas",
      jobUrl: "Job URL",
      jobUrlPlaceholder: "https://...",
      description: "Description",
      descriptionPlaceholder: "Job requirements, responsibilities...",
      notes: "Notes",
      notesPlaceholder: "Recruiter contact, interview prep...",
      saveChanges: "Save Changes",
      addJob: "Add Job",
      cancel: "Cancel",
      saving: "Saving...",
    },
    jobCard: {
      edit: "Edit",
      moveTo: "Move to",
      delete: "Delete",
      deleteConfirm: "Are you sure you want to delete this job application?",
      notesPrefix: "Notes: ",
      viewPosting: "View Job Posting",
      dragCardAria: "Drag job card",
      editJobDetails: "Edit Job Details",
      editDialogTitle: "Edit Job Details",
    },
  },
} as const;

type RecursiveString<T> = {
  [K in keyof T]: T[K] extends string ? string : RecursiveString<T[K]>;
};

export type Translations = RecursiveString<typeof translations.ar>;

// Mapping for standard column names in both directions
const COLUMN_TRANSLATIONS: Record<string, { ar: string; en: string }> = {
  "wish list": { ar: "قائمة الرغبات", en: "Wish List" },
  "applied": { ar: "تم التقديم", en: "Applied" },
  "interviewing": { ar: "المقابلات", en: "Interviewing" },
  "offer": { ar: "عرض وظيفي", en: "Offer" },
  "rejected": { ar: "مرفوض", en: "Rejected" },
  "قائمة الرغبات": { ar: "قائمة الرغبات", en: "Wish List" },
  "تم التقديم": { ar: "تم التقديم", en: "Applied" },
  "المقابلات": { ar: "المقابلات", en: "Interviewing" },
  "عرض وظيفي": { ar: "عرض وظيفي", en: "Offer" },
  "مرفوض": { ar: "مرفوض", en: "Rejected" },
};

export function getLocalizedColumnName(name: string, lang: Language): string {
  const normalized = name.trim().toLowerCase();
  for (const [key, mapping] of Object.entries(COLUMN_TRANSLATIONS)) {
    if (key.toLowerCase() === normalized) {
      return mapping[lang];
    }
  }
  return name;
}

const BOARD_TRANSLATIONS: Record<string, { ar: string; en: string }> = {
  "new board": { ar: "لوحة الوظائف", en: "Job Board" },
  "job board": { ar: "لوحة الوظائف", en: "Job Board" },
  "لوحة الوظائف": { ar: "لوحة الوظائف", en: "Job Board" },
  "لوحة جديدة": { ar: "لوحة جديدة", en: "New Board" },
};

export function getLocalizedBoardName(name: string, lang: Language): string {
  const normalized = name.trim().toLowerCase();
  for (const [key, mapping] of Object.entries(BOARD_TRANSLATIONS)) {
    if (key.toLowerCase() === normalized) {
      return mapping[lang];
    }
  }
  return name;
}
