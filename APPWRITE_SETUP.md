# 🗄️ CIBID — إعداد قاعدة البيانات Appwrite

## بيانات الاتصال (Infinity Free)

```
Project ID:  if0_41916916
API Key:     aboode2005555
Database ID: if0_41916916_cibod
Endpoint:    https://cloud.appwrite.io/v1
```

---

## 📋 المجموعات (Collections)

### 1️⃣ **Channels** (القنوات)
```javascript
{
  collectionId: 'channels',
  documents: [
    {
      name: String (مطلوب),
      url: String (مطلوب) - رابط البث,
      image: String - صورة الغلاف,
      category: String - التصنيف (عام، أفلام، إلخ),
      userId: String - صاحب القناة,
      description: String - الوصف,
      views: Integer - عدد المشاهدات,
      isActive: Boolean - هل القناة نشطة,
      createdAt: DateTime,
      updatedAt: DateTime
    }
  ]
}
```

### 2️⃣ **Users** (المستخدمون)
```javascript
{
  collectionId: 'users',
  documents: [
    {
      email: String (مطلوب، فريد),
      passwordHash: String (مطلوب),
      username: String,
      fullName: String,
      avatar: String - رابط الصورة,
      isActive: Boolean,
      role: String - admin أو user,
      lastLogin: DateTime,
      createdAt: DateTime,
      updatedAt: DateTime
    }
  ]
}
```

### 3️⃣ **Sessions** (الجلسات)
```javascript
{
  collectionId: 'sessions',
  documents: [
    {
      userId: String (مطلوب),
      token: String (مطلوب),
      userAgent: String,
      ipAddress: String,
      expiresAt: DateTime,
      createdAt: DateTime
    }
  ]
}
```

### 4️⃣ **Favorites** (المفضلة)
```javascript
{
  collectionId: 'favorites',
  documents: [
    {
      userId: String (مطلوب),
      channelId: String (مطلوب),
      createdAt: DateTime
    }
  ]
}
```

### 5️⃣ **Logs** (السجلات)
```javascript
{
  collectionId: 'logs',
  documents: [
    {
      userId: String,
      action: String (مطلوب),
      resource: String,
      ipAddress: String,
      statusCode: String,
      createdAt: DateTime
    }
  ]
}
```

---

## 🔒 الأمان والصلاحيات

### Channels Permissions
```
read:        أي شخص يمكنه قراءة القنوات
create:      المستخدمون المسجلون فقط
update:      صاحب القناة فقط
delete:      صاحب القناة فقط
```

### Users Permissions
```
read:        المستخدمون فقط
create:      الضيوف (للتسجيل الجديد)
update:      المستخدم نفسه فقط
delete:      المستخدم نفسه فقط
```

---

## ⚡ خطوات الإعداد

### الخطوة 1: إنشاء Database
```bash
1. اذهب إلى https://cloud.appwrite.io
2. سجل الدخول بحسابك
3. اختر Project: if0_41916916
4. انتقل إلى Databases
5. انقر على "Create Database"
6. أدخل الاسم: if0_41916916_cibod
```

### الخطوة 2: إنشاء Collections
```bash
في Database الذي أنشأته:
1. انقر على "Create Collection"
2. أنشئ كل collection من القوائم أعلاه
3. أضف الحقول المطلوبة
4. اضبط الصلاحيات
```

### الخطوة 3: إعداد الفهارس (Indexes)
```javascript
// للأداء الأفضل، أنشئ هذه الفهارس:

Channels:
- channelNameIndex (name)
- channelUserIndex (userId)
- channelCategoryIndex (category)

Users:
- userEmailIndex (email) - UNIQUE
- userActiveIndex (isActive)

Sessions:
- sessionUserIndex (userId)
- sessionExpiresIndex (expiresAt)

Favorites:
- favoriteUserIndex (userId)
```

---

## 🔑 استخدام API في الكود

### Node.js / Express
```javascript
const { Client, Databases } = require('node-appwrite');

const client = new Client()
  .setEndpoint('https://cloud.appwrite.io/v1')
  .setProject('if0_41916916')
  .setKey('aboode2005555');

const databases = new Databases(client);

// جلب جميع القنوات
const channels = await databases.listDocuments(
  'if0_41916916_cibod',
  'channels'
);

// إنشاء قناة جديدة
await databases.createDocument(
  'if0_41916916_cibod',
  'channels',
  'unique-id',
  {
    name: 'Channel Name',
    url: 'http://stream.url',
    category: 'عام',
    userId: 'user-id'
  }
);
```

### JavaScript في المتصفح
```javascript
const API_ENDPOINT = 'https://cloud.appwrite.io/v1';
const PROJECT_ID = 'if0_41916916';
const DATABASE_ID = 'if0_41916916_cibod';

// جلب البيانات من خادمك (Server)
const response = await fetch('/api/channels', {
  method: 'GET',
  headers: { 'Content-Type': 'application/json' },
  credentials: 'include'
});

const channels = await response.json();
```

---

## 🛡️ مزايا الأمان المضمنة

✅ **Permissions-based Access Control** — التحكم في من يمكنه الوصول  
✅ **Encryption at Rest** — تشفير البيانات المخزنة  
✅ **HTTPS/TLS** — الاتصال آمن  
✅ **API Keys** — توثيق آمن  
✅ **Rate Limiting** — منع الإساءة  
✅ **Audit Logs** — تسجيل النشاط  

---

## 📝 أمثلة الاستعلامات (Queries)

### البحث عن قنوات بالفئة
```javascript
const channels = await databases.listDocuments(
  'if0_41916916_cibod',
  'channels',
  [
    Query.equal('category', 'أفلام'),
    Query.equal('isActive', true),
    Query.limit(20)
  ]
);
```

### البحث عن قنوات المستخدم
```javascript
const myChannels = await databases.listDocuments(
  'if0_41916916_cibod',
  'channels',
  [
    Query.equal('userId', 'user-id'),
    Query.orderDesc('createdAt')
  ]
);
```

### تحديث القناة
```javascript
await databases.updateDocument(
  'if0_41916916_cibod',
  'channels',
  'channel-id',
  {
    views: 100,
    updatedAt: new Date().toISOString()
  }
);
```

---

## 🚀 الخطوات التالية

1. ✅ أنشئ Database و Collections
2. ✅ اضبط الصلاحيات (Permissions)
3. ✅ أنشئ API Backend (server.js)
4. ✅ ربط Frontend بـ API
5. ✅ اختبر العمليات CRUD
6. ✅ أضف نظام التوثيق
7. ✅ فعّل reCAPTCHA
8. ✅ انشر على الإنتاج

---

## ⚠️ ملاحظات مهمة

- **لا تشارك API Key** في الكود الظاهر
- استخدم **Environment Variables** لحفظ المفاتيح
- لا تخزن **كلمات المرور** مباشرة — استخدم **Hash**
- استخدم **JWT Tokens** مع **expiration**
- فعّل **HTTPS** على الإنتاج
- اختبر **CORS** والصلاحيات جيداً

---

## 📞 دعم إضافي

- Appwrite Docs: https://appwrite.io/docs
- Console: https://cloud.appwrite.io
- Community: https://appwrite.io/community
