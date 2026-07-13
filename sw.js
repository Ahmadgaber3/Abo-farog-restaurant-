        let deferredPrompt;
        const installBanner = document.getElementById('installBanner');
        const installBtn = document.getElementById('installBtn');
        const installDesc = document.getElementById('installDesc');

        // كشف نوع الجهاز (هل هو آيفون/آيباد؟)
        const isIos = () => {
            const userAgent = window.navigator.userAgent.toLowerCase();
            return /iphone|ipad|ipod/.test(userAgent);
        }
        
        // هل التطبيق متثبت بالفعل ومفتوح كتطبيق مستقل؟
        const isInStandaloneMode = () => ('standalone' in window.navigator) && (window.navigator.standalone);

        // تشغيل المنطق بمجرد تحميل الصفحة
        window.addEventListener('DOMContentLoaded', () => {
            // لو العميل مثبت التطبيق فعلياً وفاتحه، مش هنعرض له الزرار
            if (isInStandaloneMode()) return;

            if (isIos()) {
                // لو آيفون: هنظهر الزرار العائم بعد ثانيتين ونغير النص ليوجه المستخدم للطريقة اليدوية لآبل
                installDesc.innerText = "اضغط على زر المشاركة ثم 'إضافة للشاشة الرئيسية'";
                installBtn.innerText = "كيفية التثبيت؟";
                
                setTimeout(() => {
                    if (installBanner) installBanner.classList.add('show');
                }, 2000);

                installBtn.addEventListener('click', () => {
                    alert("على أجهزة الآيفون 📱:\n1. اضغط على زر المشاركة في أسفل المتصفح (مربع طالع منه سهم).\n2. اسحب الخيارات واضغط على 'إضافة إلى الشاشة الرئيسية' (Add to Home Screen).");
                });
            } else {
                // لو أندرويد/كروم: هنستمع لحدث التثبيت الرسمي
                window.addEventListener('beforeinstallprompt', (e) => {
                    e.preventDefault();
                    deferredPrompt = e;
                    // إظهار البانر العائم فوراً لأن المتصفح جاهز للتثبيت بنقرة واحدة
                    if (installBanner) installBanner.classList.add('show');
                });

                installBtn.addEventListener('click', async () => {
                    if (deferredPrompt) {
                        deferredPrompt.prompt(); // يفتح نافذة التثبيت الرسمية بتاعت الـ 3 نقط فوراً
                        const { outcome } = await deferredPrompt.userChoice;
                        if (outcome === 'accepted') {
                            closeInstallBanner();
                        }
                        deferredPrompt = null;
                    } else {
                        // في حال لم يكتشف المتصفح الحدث بعد أو تم حظره مؤقتاً
                        alert("يمكنك تثبيت التطبيق فوراً بالضغط على الثلاث نقط في أعلى المتصفح واختيار 'تثبيت التطبيق' أو 'إضافة للشاشة الرئيسية' 📱");
                    }
                });
            }
        });

        function closeInstallBanner() {
            if (installBanner) installBanner.classList.remove('show');
        }

        // تسجيل الـ Service Worker
        if ('serviceWorker' in navigator) {
            window.addEventListener('load', () => {
                navigator.serviceWorker.register('./sw.js')
                    .then(reg => console.log('Service Worker Registered'))
                    .catch(err => console.log('SW registration failed: ', err));
            });
        }