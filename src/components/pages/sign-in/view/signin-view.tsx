import SignInForm from '../signin-form';
import { Clock } from 'lucide-react';

const SigninInView = () => {
  return (
    <main className="min-h-dvh bg-gray-50 lg:bg-white flex items-center justify-center lg:items-stretch lg:justify-start">
      {/* ฝั่งซ้าย: รูปภาพ/กราฟิก (แสดงเฉพาะจอใหญ่) */}
      <div className="hidden lg:flex lg:w-1/2 bg-gray-50 relative overflow-hidden items-center justify-center border-r border-gray-100">
        {/* ของตกแต่งพื้นหลังให้ดูมินิมอล */}
        <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-yellow-200 rounded-full mix-blend-multiply filter blur-3xl opacity-50 animate-blob"></div>
          <div className="absolute top-1/3 right-1/4 w-64 h-64 bg-purple-200 rounded-full mix-blend-multiply filter blur-3xl opacity-50 animate-blob animation-delay-2000"></div>
          <div className="absolute bottom-1/4 left-1/3 w-64 h-64 bg-pink-200 rounded-full mix-blend-multiply filter blur-3xl opacity-50 animate-blob animation-delay-4000"></div>
        </div>

        <div className="relative z-10 text-center px-12 max-w-lg">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-white shadow-sm mb-8">
            <Clock className="w-8 h-8 text-yellow-500" />
          </div>
          <h2 className="text-4xl font-bold text-gray-900 mb-4 tracking-tight">
            จัดการเวลา
            <br />
            ให้มีประสิทธิภาพกว่าเดิม
          </h2>
          <p className="text-lg text-gray-500">
            วางแผน จัดตาราง และติดตามงานของคุณได้ง่ายๆ ในที่เดียวด้วย TimeCheese
          </p>
        </div>
      </div>

      {/* ฝั่งขวา: ฟอร์มล็อกอิน */}
      <div className="w-full lg:w-1/2 min-h-dvh flex items-center justify-center p-4 sm:p-8 lg:p-12 xl:p-24 relative overflow-hidden lg:overflow-visible">
        {/* ของตกแต่งพื้นหลังสำหรับมือถือ (ซ่อนในจอใหญ่) */}
        <div className="absolute inset-0 lg:hidden pointer-events-none">
          <div className="absolute -top-20 -right-20 w-64 h-64 bg-yellow-200 rounded-full mix-blend-multiply filter blur-3xl opacity-40"></div>
          <div className="absolute -bottom-20 -left-20 w-64 h-64 bg-purple-200 rounded-full mix-blend-multiply filter blur-3xl opacity-40"></div>
        </div>
        <div className="w-full max-w-md bg-white/80 backdrop-blur-xl lg:bg-transparent lg:backdrop-blur-none p-8 sm:p-10 rounded-[2rem] shadow-2xl shadow-gray-200/50 lg:shadow-none lg:p-0 relative z-10 border border-white/50 lg:border-none">
          {/* โลโก้ */}
          <div className="flex items-center gap-3 mb-10 lg:mb-12">
            <span className="text-4xl">🧀</span>
            <span className="text-3xl font-extrabold bg-clip-text text-transparent bg-linear-to-r from-yellow-500 via-pink-500  to-indigo-500">
              TimeCheese
            </span>
          </div>

          <div className="mb-8 lg:mb-10">
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">เข้าสู่ระบบ</h1>
            <p className="text-sm sm:text-base text-gray-500">
              ยินดีต้อนรับกลับมา! กรุณากรอกข้อมูลของคุณ
            </p>
          </div>

          <SignInForm />
        </div>
      </div>
    </main>
  );
};

export default SigninInView;
