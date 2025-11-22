// pages/index.js (Next.js Page Component)
import Head from 'next/head';

// -- المكونات المستوردة (يجب عليك إنشاؤها لاحقاً)
import TeacherCard from '../components/TeacherCard'; 
import VideoPlayer from '../components/VideoPlayer'; 

// -- بيانات وهمية للمدرسين
const teachers = [
    { id: 1, name: 'أ. أحمد علي', subject: 'الرياضيات', description: 'خبير في منهج السادس العلمي' },
    { id: 2, name: 'أ. سارة خالد', subject: 'الكيمياء', description: 'شرح مفصل بأسلوب مبتكر' },
    // ... المزيد من المدرسين
];

export default function HomePage() {
  return (
    <>
      <Head>
        <title>منصة التعليم الرقمي - الرئيسية</title>
      </Head>

      {/* قسم الترحيب والتعريف */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <h1 className="text-4xl font-extrabold text-blue-700 mb-3">
            مرحباً بك في منصتك التعليمية الجديدة
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            أفضل محاضرات للسادس العلمي - مجانية وعالية الجودة.
          </p>
          
          {/* هنا يمكن إضافة بوابة التيليجرام الإلزامية */}
          <div className="bg-yellow-100 p-4 rounded-lg shadow-md max-w-lg mx-auto">
            <p className="font-bold text-red-600 mb-2">تنبيه هام:</p>
            <p className="text-gray-800">للوصول إلى المحاضرات، يرجى الاشتراك في قناة التحديثات.</p>
            <button 
              onClick={() => window.open('https://t.me/your_channel', '_blank')}
              className="mt-3 bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-6 rounded-full transition duration-300"
            >
              الاشتراك بقناة التليجرام
            </button>
          </div>
        </div>
      </section>

      {/* قسم اختيار المدرسين */}
      <section className="py-16">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-gray-800 text-center mb-10">
            👨‍🏫 اختر المدرس المناسب لك
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {teachers.map(teacher => (
              <TeacherCard key={teacher.id} teacher={teacher} />
            ))}
          </div>
        </div>
      </section>

      {/* مثال على منطقة عرض فيديو (يمكن نقله إلى صفحة المحاضرة) */}
      <section className="py-16 bg-gray-200">
        <h2 className="text-3xl font-bold text-gray-800 text-center mb-10">
             محاضرة تجريبية
        </h2>
        <div className="max-w-4xl mx-auto px-4">
           {/* المكون الذي يعرض مشغل الفيديو */}
           <VideoPlayer 
              lectureTitle="محاضرة المتجهات - الفصل الأول" 
              resolutions={[
                { quality: '1080p', url: '/videos/lec1_1080.mp4' },
                { quality: '720p', url: '/videos/lec1_720.mp4' },
                { quality: '360p', url: '/videos/lec1_360.mp4' }
              ]}
           />
        </div>
      </section>
    </>
  );
}
