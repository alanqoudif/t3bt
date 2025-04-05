import { useEffect, useState } from 'react';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';

interface SiteTourProps {
  startTour?: boolean;
}

const SiteTour = ({ startTour = false }: SiteTourProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  
  const steps = [
    {
      title: 'مربع البحث',
      content: 'مرحباً بك في ذكي! هذا هو مربع البحث الذي يمكنك من خلاله طرح أي سؤال أو استعلام',
      target: '.search-container',
    },
    {
      title: 'منطقة المحادثة',
      content: 'هنا ستظهر نتائج البحث والمحادثة مع الذكاء الاصطناعي',
      target: '.chat-container',
    },
    {
      title: 'تغيير المظهر',
      content: 'يمكنك تغيير الوضع بين الليلي والنهاري من خلال هذا الزر',
      target: '.theme-toggle',
    },
    {
      title: 'حول ذكي',
      content: 'اضغط هنا لمعرفة المزيد عن ذكي وميزاته',
      target: '.about-button',
    },
    {
      title: 'سجل البحث',
      content: 'ستظهر هنا عمليات البحث السابقة التي أجريتها',
      target: '.search-history',
    }
  ];

  useEffect(() => {
    // بدء الجولة عند تحميل الصفحة لأول مرة إذا لم يسبق للمستخدم رؤيتها
    const hasSeenTour = localStorage.getItem('hasSeenTour');
    
    if (startTour || !hasSeenTour) {
      setIsOpen(true);
    }
  }, [startTour]);

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      handleFinish();
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleFinish = () => {
    localStorage.setItem('hasSeenTour', 'true');
    setIsOpen(false);
  };

  const handleSkip = () => {
    localStorage.setItem('hasSeenTour', 'true');
    setIsOpen(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="sm:max-w-md">
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">{steps[currentStep].title}</h3>
          <p>{steps[currentStep].content}</p>
          
          <div className="flex justify-between pt-4">
            <div className="space-x-2 rtl:space-x-reverse">
              <Button 
                variant="outline" 
                onClick={handleSkip}
                className="ml-2 rtl:mr-2"
              >
                تخطي
              </Button>
              {currentStep > 0 && (
                <Button
                  variant="outline"
                  onClick={handlePrevious}
                >
                  السابق
                </Button>
              )}
            </div>
            <Button onClick={handleNext}>
              {currentStep === steps.length - 1 ? 'إنهاء' : 'التالي'}
            </Button>
          </div>
          
          <div className="flex justify-center space-x-1 rtl:space-x-reverse">
            {steps.map((_, index) => (
              <div 
                key={index} 
                className={`h-2 w-2 rounded-full ${
                  index === currentStep ? 'bg-black dark:bg-white' : 'bg-gray-300 dark:bg-gray-600'
                }`}
              />
            ))}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default SiteTour; 