# Community Connect

Build a modern, elegant, fully responsive Arabic (RTL) web application for a school volunteering and community partnership platform named:

"منصة التطوع ودعم الشراكة المجتمعية - مدرسة صفية بنت عبد المطلب"

### 1. Visual Identity & Heritage Theme (الهوية والتصميم التراثي السعودي):

- Language: Arabic (RTL layout) using modern fonts (e.g., Cairo or Tajawal).

- Palette (inspired by Saudi National Day & Najdi architecture):

  - Primary / Saudi Olive Green: `#386633`

  - Secondary / Diriyah Clay Terracotta: `#C7764A`

  - Warm Sand / Cream Background: `#FAF7F2`

  - Text & Accents: `#2D2723` (Charcoal) and Gold (`#D97706`).

- Design Elements: Incorporate Najdi mud-brick geometric motifs (triangular patterns), palm tree icons, and subtle vector artwork of Saudi landmarks (Kingdom Tower, Diriyah architecture).

### 2. Welcome Gate, Role Selection & Security Passcode (الشاشة الترحيبية ونظام التحقق):

- On initial load, display an interactive full-screen modal/gate asking the user to select their portal role:

  1. "دخول كـ طالبة متطوعة" (Student Volunteer Portal) -> Direct entry without password.

  2. "دخول كـ جهة التطوع" (Volunteering Entity / Admin Dashboard) -> Requires PIN/Passcode modal before access is granted.

- **Passcode Requirement**: The passcode for "جهة التطوع" is strictly set to: `1500`.

  - Entering `1500` grants access to the Admin Dashboard.

  - If incorrect, show an error alert: "رمز الدخول غير صحيح، يرجى المحاولة مرة أخرى".

- Top Navbar includes a quick role switcher button allowing smooth switching between Student and Entity modes (triggers the `1500` passcode prompt when switching to Entity mode).

### 3. AUTOMATED REAL-TIME DATA FLOW (التدفق التلقائي المباشر للبيانات):

- **Automated Data Streaming**: Whenever a student submits her volunteer log or applies for an opportunity, all her data MUST instantly and automatically propagate to the "جهة التطوع" (Entity) dashboard in real time without refreshing the page.

- **Student Data Captured Automatically**:

  - اسم الطالبة الثلاثي (Student Full Name)

  - السنة الدراسية (Academic Year / Grade)

  - الفصل / الشعبة (Class / Section)

  - المجال / اسم الفرصة التطوعية (Volunteering Opportunity / Field)

  - عدد الساعات التطوعية (Logged Hours)

  - تاريخ المشاركة (Date of Participation)

  - وصف المهمة (Task Description)

  - Default Status: "قيد الانتظار" (Pending Approval).

### 4. Volunteering Entity / Admin Dashboard (لوحة تحكم جهة التطوع):

Create a complete management dashboard containing:

A. Real-Time Student Submissions Table (جدول طلبات وسجلات الطالبات):

   - Table displaying automatically streamed student records.

   - Columns: الطالبة | السنة الدراسية | الفصل | الفرصة | الساعات | التاريخ | الوصف | حالة الطلب | إجراءات.

   - Interactive One-Click Buttons: "اعتماد" (Approve) and "رفض" (Reject).

   - Approving an entry automatically adds the hours to the student's total and qualifies her for the Wall of Fame and Certificate generator.

B. Opportunity Creator & Manager (إدارة وطرح الفرص التطوعية):

   - Form for Entity to post new opportunities with: Title, Category/Field, Hours Awarded, Available Seats, Execution Date, and Description.

   - Ability to edit, delete, or toggle availability.

C. Administrative Dynamic Stat Counters:

   - Pending Approvals Count (طلبات قيد الانتظار)

   - Total Approved Hours (إجمالي الساعات المعتمدة)

   - Total Registered Volunteers Count (عدد المتطوعات المسجلات)

### 5. Student Volunteer Portal & 6 Main Navigation Sections (واجهة المتطوعة والأقسام الستة):

Top Navigation Bar featuring school logo, title "مدرسة صفية بنت عبد المطلب", and 6 primary sections:

1. الفرص والمبادرات (Opportunities & Initiatives):

   - Filterable cards by categories: اليوم الوطني, دعم الطالبات والتعليم التعاوني, تحسين البيئة المدرسية, التشجير والبيئة الخضراء, تحسين جودة القراءة, تدريب القدرات والتحصيل, الشراكة المجتمعية وشراكة الأسرة, المبادرات الرقمية.

   - Each card displays hours awarded, timeline ("طوال العام الدراسي"), description, and a "سجلي الآن" button.

2. سجلي تطوعك (Volunteer Hours Registration):

   - Interactive form for students to submit completed hours. Submitting automatically sends all student details (Name, Grade, Class, Opp, Hours, Date, Desc) directly to the Entity Dashboard.

3. التوثيق والمعرض (Documentation Gallery):

   - Visual grid gallery displaying photos, activity reports, participating models, and downloadable PDF report placeholders for school events.

4. سجل الإنجازات (Wall of Fame & Achievements 🏆):

   - Leaderboard that automatically ranks top volunteer students based on approved hours.

   - Beneficiary metrics counter and success stories showcase.

5. شاركينا والشهادات (Forms Hub & Instant Certificates 💡):

   - Tabbed interface containing:

     a) نموذج تسجيل متطوعة جديدة (New Volunteer Sign-up).

     b) نموذج اقتراح مبادرة / فكرة تطوعية جديدة (Idea Proposal Form): MUST include a mandatory note/field pre-filled or ending with reference code: `777777777777777777777`.

     c) استبيان تقييم تجربة التطوع وقياس الأثر (Impact & Satisfaction Survey).

     d) مركز إصدار الشهادات الرقمية (Digital Certificate Center): A tool where students input their name, select their approved initiative, and generate an instant, printable high-resolution Thank You Certificate officially branded for "مدرسة صفية بنت عبد المطلب".

6. التقييم وقياس الأثر (Impact Evaluation):

   - Display panel showing satisfaction percentage charts, key results, and recommendations for continuous improvement.

### 6. Data State & Live Demo Mode:

- Initial state starts clean and empty (counters at 0, no dummy student table rows) ready for a live presentation.

- Use `localStorage` persistence and state synchronization so student submissions update the Admin Dashboard live in real time.

This project was built with [Lovable](https://lovable.dev).

**Live app**: https://nujum-volunteer.lovable.app

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/3a15c7cc-16e1-5293-8ac6-bd57f8bd4a4c).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
