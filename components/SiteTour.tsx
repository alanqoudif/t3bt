import { useEffect, useState } from 'react';
import Joyride, { CallBackProps, Step, STATUS } from 'react-joyride';

interface SiteTourProps {
  startTour?: boolean;
}

const SiteTour = ({ startTour = false }: SiteTourProps) => {
  const [run, setRun] = useState(false);
  const [steps, setSteps] = useState<Step[]>([
    {
      target: '.search-container',
      content: 'مرحباً بك في ذكي! هذا هو مربع البحث الذي يمكنك من خلاله طرح أي سؤال أو استعلام',
      placement: 'bottom',
      disableBeacon: true,
    },
    {
      target: '.chat-container',
      content: 'هنا ستظهر نتائج البحث والمحادثة مع الذكاء الاصطناعي',
      placement: 'top',
    },
    {
      target: '.theme-toggle',
      content: 'يمكنك تغيير الوضع بين الليلي والنهاري من خلال هذا الزر',
      placement: 'left',
    },
    {
      target: '.about-button',
      content: 'اضغط هنا لمعرفة المزيد عن ذكي وميزاته',
      placement: 'left',
    },
    {
      target: '.search-history',
      content: 'ستظهر هنا عمليات البحث السابقة التي أجريتها',
      placement: 'bottom',
    }
  ]);

  useEffect(() => {
    // بدء الجولة عند تحميل الصفحة لأول مرة إذا لم يسبق للمستخدم رؤيتها
    const hasSeenTour = localStorage.getItem('hasSeenTour');
    
    if (startTour || !hasSeenTour) {
      setRun(true);
    }
  }, [startTour]);

  const handleJoyrideCallback = (data: CallBackProps) => {
    const { status } = data;
    
    if ([STATUS.FINISHED, STATUS.SKIPPED].includes(status)) {
      // تسجيل أن المستخدم قد رأى الجولة
      localStorage.setItem('hasSeenTour', 'true');
      setRun(false);
    }
  };

  return (
    <Joyride
      callback={handleJoyrideCallback}
      continuous
      hideCloseButton
      run={run}
      scrollToFirstStep
      showProgress
      showSkipButton
      steps={steps}
      styles={{
        options: {
          zIndex: 10000,
          primaryColor: '#000',
          textColor: '#333',
          backgroundColor: '#fff',
          arrowColor: '#fff',
        },
        buttonNext: {
          backgroundColor: '#000',
          color: '#fff',
        },
        buttonBack: {
          color: '#000',
        },
        buttonSkip: {
          color: '#777',
        },
        spotlight: {
          backgroundColor: 'transparent',
        },
      }}
      locale={{
        back: 'السابق',
        close: 'إغلاق',
        last: 'إنهاء',
        next: 'التالي',
        skip: 'تخطي',
      }}
    />
  );
};

export default SiteTour; 