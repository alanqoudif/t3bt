/* eslint-disable @next/next/no-img-element */
"use client";

import { GithubLogo, XLogo, InstagramLogo } from '@phosphor-icons/react';
import { Bot, Brain, Command, GraduationCap, Image, Search, Share2, Sparkles, Star, Trophy, Users, AlertTriangle, Github, Twitter } from 'lucide-react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { TextLoop } from '@/components/core/text-loop';
import { TextShimmer } from '@/components/core/text-shimmer';
import { Check } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { VercelLogo } from '@/components/logos/vercel-logo';
import { TavilyLogo } from '@/components/logos/tavily-logo';
import NextImage from 'next/image';

const container = {
    hidden: { opacity: 0 },
    show: {
        opacity: 1,
        transition: {
            staggerChildren: 0.1
        }
    }
};

const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
};

export default function AboutPage() {
    const router = useRouter();
    const [showWarning, setShowWarning] = useState(false);
    
    useEffect(() => {
        // تطبيق الخط على كل العناصر
        document.documentElement.style.fontFamily = "var(--font-tajawal)";
        document.body.style.fontFamily = "var(--font-tajawal)";
    }, []);

    useEffect(() => {
        // Check if user has seen the warning
        const hasSeenWarning = localStorage.getItem('hasSeenWarning');
        if (!hasSeenWarning) {
            setShowWarning(true);
        }
    }, []);

    const handleDismissWarning = () => {
        setShowWarning(false);
        localStorage.setItem('hasSeenWarning', 'true');
    };

    const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        const query = formData.get('query')?.toString();
        if (query) {
            router.push(`/?q=${encodeURIComponent(query)}`);
        }
    };

    return (
        <div className="min-h-screen bg-background overflow-hidden" dir="rtl">
            <Dialog open={showWarning} onOpenChange={setShowWarning}>
                <DialogContent className="sm:max-w-[425px] p-0 bg-neutral-50 dark:bg-neutral-900">
                    <div className="p-6 border-b border-neutral-200 dark:border-neutral-800">
                        <DialogHeader>
                            <DialogTitle className="flex items-center gap-2 text-yellow-600 dark:text-yellow-500">
                                <AlertTriangle className="h-5 w-5" />
                                تنبيه ⚠️
                            </DialogTitle>
                            <DialogDescription className="text-neutral-600 dark:text-neutral-400">
                                ذكي هو محرك بحث بالذكاء الاصطناعي وما يشتغل بأي شي يخص العملات الرقمية. انتبه من الناس اللي يحتالون عليك.
                            </DialogDescription>
                        </DialogHeader>
                    </div>
                    <DialogFooter className="p-6 pt-4">
                        <Button 
                            variant="default" 
                            onClick={handleDismissWarning}
                            className="w-full bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 hover:bg-neutral-800 dark:hover:bg-neutral-200"
                        >
                            خلاص، فهمت
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Hero Section */}
            <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-b from-neutral-100/40 dark:from-neutral-900/40" />
                <div className="absolute inset-0 bg-grid-neutral-700/[0.05] dark:bg-grid-neutral-300/[0.05]" />
                <div className="relative pt-20 pb-20 px-4">
                    <motion.div 
                        className="container max-w-5xl mx-auto space-y-12"
                        variants={container}
                        initial="hidden"
                        animate="show"
                    >
                        {/* Company Name/Logo */}
                        <motion.div variants={item} className="text-center">
                            <Link href="/" className="inline-flex items-end gap-3 text-5xl font-syne font-bold">
                                <img src="/dhaki_logo-removebg-preview.png" alt="ذكي Logo" className="h-16 w-16" />
                                <span className=''></span>
                            </Link>
                        </motion.div>

                        <motion.form 
                            variants={item} 
                            className="max-w-2xl mx-auto w-full"
                            onSubmit={handleSearch}
                        >
                            <div className="relative group">
                                <input
                                    type="text"
                                    name="query"
                                    placeholder="شنو تبي تعرف..."
                                    className="w-full h-14 px-6 rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 focus:border-neutral-300 dark:focus:border-neutral-700 focus:outline-none focus:ring-2 focus:ring-neutral-300 dark:focus:ring-neutral-700 transition-all duration-300"
                                    onKeyDown={(e) => {
                                        if (e.key === 'Enter') {
                                            e.preventDefault();
                                            const query = e.currentTarget.value;
                                            if (query) {
                                                router.push(`/?q=${encodeURIComponent(query)}`);
                                            }
                                        }
                                    }}
                                />
                                <button
                                    type="submit"
                                    className="absolute left-2 top-2 h-10 px-4 rounded-xl bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 font-medium hover:opacity-90 transition-opacity"
                                >
                                    ابحث ويانا 🔍
                                </button>
                            </div>
                        </motion.form>

                        <motion.div variants={item} className="text-center space-y-6">
                            <p className="text-xl text-neutral-600 dark:text-neutral-400 max-w-2xl mx-auto">
                                أول محرك بحث عماني مدعوم بالذكاء الاصطناعي مع قدرات RAG والبحث المستند. شغلنا عماني وحنا فخورين به. ✨
                            </p>
                            <p className="text-lg text-blue-600 dark:text-blue-400 font-medium">
                                أول منصة ذكاء اصطناعي عمانية 100% 🇴🇲
                            </p>
                        </motion.div>

                        <motion.div variants={item} className="flex flex-wrap items-center justify-center gap-4">
                            <Link
                                href="/"
                                className="group relative inline-flex h-12 items-center gap-2 px-6 rounded-xl bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white border border-neutral-200 dark:border-neutral-700 hover:border-neutral-300 dark:hover:border-neutral-600 transition-all duration-300"
                            >
                                <span className="font-medium">جربه الحين 🚀</span>
                                <svg className="h-4 w-4 transition-transform duration-200 group-hover:-translate-x-1" style={{ transform: "scaleX(-1)" }} viewBox="0 0 16 16" fill="none">
                                    <path d="M6.66667 12.6667L11.3333 8.00004L6.66667 3.33337" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                </svg>
                            </Link>
                        </motion.div>
                    </motion.div>
                </div>
            </div>

            {/* Search Simulation */}
            <div className="py-24 px-4 bg-white dark:bg-black border-y border-neutral-200 dark:border-neutral-800">
                <motion.div 
                    className="container max-w-5xl mx-auto"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                >
                    <div className="text-center space-y-4 mb-16">
                        <h2 className="text-3xl font-bold">تقنيات بحث متطورة من عمان 🧠</h2>
                        <p className="text-neutral-600 dark:text-neutral-400 max-w-2xl mx-auto">
                            شوف كيف يستخدم ذكي تقنيات الذكاء الاصطناعي المتطورة عشان يعطيك إجابات دقيقة وحديثة من مصادر موثوقة.
                        </p>
                    </div>

                    <div className="relative max-w-2xl mx-auto rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900 p-8 space-y-8">
                        {/* Query */}
                        <div className="flex items-start gap-4">
                            <div className="flex-1 space-y-2">
                                <p className="text-sm text-neutral-500">الاستعلام 📝</p>
                                <p className="text-neutral-900 dark:text-neutral-100">
                                    اشرح الحوسبة الكمية وتطبيقاتها في العالم الحقيقي
                                </p>
                            </div>
                            <div className="w-8 h-8 rounded-full bg-neutral-200 dark:bg-neutral-800 flex-shrink-0" />
                        </div>

                        {/* Processing */}
                        <div className="flex items-start gap-4">
                            <div className="flex-1 space-y-4">
                                <div className="space-y-2">
                                    <p className="text-sm text-neutral-500">معالجة البيانات</p>
                                    <TextLoop interval={1.5}>
                                        <p className="text-sm font-medium text-neutral-900 dark:text-neutral-100">
                                            🔍 جاري البحث عن المعلومات ذات الصلة...
                                        </p>
                                        <p className="text-sm font-medium text-neutral-900 dark:text-neutral-100">
                                            📚 معالجة نتائج البحث...
                                        </p>
                                        <p className="text-sm font-medium text-neutral-900 dark:text-neutral-100">
                                            🤖 إنشاء الرد...
                                        </p>
                                        <p className="text-sm font-medium text-neutral-900 dark:text-neutral-100">
                                            ✨ تحسين المحتوى بالسياق...
                                        </p>
                                    </TextLoop>
                                </div>
                                <div className="space-y-2">
                                    <p className="text-sm text-neutral-500">إنشاء الإجابة</p>
                                    <TextShimmer className="text-sm font-medium">
                                        جمع المعلومات من مصادر متعددة لتقديم إجابة شاملة...
                                    </TextShimmer>
                                </div>
                            </div>
                            <div className="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900 flex-shrink-0 flex items-center justify-center">
                                <Bot className="w-4 h-4 text-blue-500" />
                            </div>
                        </div>

                        {/* Response Preview */}
                        <div className="flex items-start gap-4">
                            <div className="flex-1 space-y-2">
                                <p className="text-sm text-neutral-500">معاينة الإجابة ✅</p>
                                <div className="prose prose-sm dark:prose-invert">
                                    <p className="text-neutral-900 dark:text-neutral-100">
                                        الحوسبة الكمية هي تقنية ثورية تستفيد من ميكانيكا الكم لحل المشكلات المعقدة...
                                    </p>
                                    <div className="text-xs text-neutral-500 mt-2">
                                        المصادر: مجلة فيزياء الطبيعة، أبحاث IBM، معهد MIT للتكنولوجيا
                                    </div>
                                </div>
                            </div>
                            <div className="w-8 h-8 rounded-full bg-green-100 dark:bg-green-900 flex-shrink-0 flex items-center justify-center">
                                <Check className="w-4 h-4 text-green-500" />
                            </div>
                        </div>
                    </div>
                </motion.div>
            </div>

            {/* Powered By Section */}
            <div className="py-24 px-4 bg-white dark:bg-black border-y border-neutral-200 dark:border-neutral-800">
                <motion.div 
                    className="container max-w-5xl mx-auto space-y-16"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                >
                    <div className="text-center space-y-4">
                        <h2 className="text-3xl font-bold">مطور في عمان 💪</h2>
                        <p className="text-neutral-600 dark:text-neutral-400 max-w-2xl mx-auto">
                            مبني بأحدث التقنيات من عمان للعالم
                        </p>
                    </div>

                    <div className="flex justify-center">
                        <div className="p-8 rounded-2xl bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 flex flex-col items-center justify-center gap-4">
                            <img src="/nuqtalogo.webp" alt="نقطة" className="w-auto h-20" />
                            <p className="text-neutral-600 dark:text-neutral-400 text-center">
                                مدعوم بواسطة نقطة 🚀
                            </p>
                        </div>
                    </div>
                </motion.div>
            </div>

            {/* Integration Section - Add before Use Cases */}
            <div className="py-24 px-4">
                <motion.div 
                    className="container max-w-5xl mx-auto space-y-16"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                >
                    <div className="text-center space-y-4">
                        <h2 className="text-3xl font-bold">مدعوم بنماذج لغوية متقدمة 🌟</h2>
                        <p className="text-neutral-600 dark:text-neutral-400 max-w-2xl mx-auto">
                            تم اختيار كل نموذج بعناية لقدراته الفريدة في فهم ومعالجة المعلومات
                        </p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                        <div className="p-6 rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800">
                            <h3 className="font-semibold">جروك 2 🤖</h3>
                            <p className="text-sm text-neutral-600 dark:text-neutral-400 mt-2">أداء متميز مع معرفة واسعة في الوقت الحقيقي</p>
                        </div>
                        <div className="p-6 rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800">
                            <h3 className="font-semibold">جروك 2 فيجن 👁️</h3>
                            <p className="text-sm text-neutral-600 dark:text-neutral-400 mt-2">فهم وتحليل متقدم للصور</p>
                        </div>
                        <div className="p-6 rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800">
                            <h3 className="font-semibold">جروك 3 🔮</h3>
                            <p className="text-sm text-neutral-600 dark:text-neutral-400 mt-2">الجيل القادم من الذكاء الاصطناعي (قريباً)</p>
                        </div>
                    </div>
                </motion.div>
            </div>

            {/* Features Section */}
            <div className="py-24 px-4">
                <motion.div 
                    className="container max-w-5xl mx-auto space-y-16"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                >
                    <div className="text-center space-y-4">
                        <h2 className="text-3xl font-bold">ميزات بحث عمانية 100% 🔍</h2>
                        <p className="text-neutral-600 dark:text-neutral-400 max-w-2xl mx-auto">
                            استمتع بطريقة أفضل للبحث مع ميزات مدعومة بذكاء اصطناعي يفهم شنو تبي وشنو تسأل
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {[
                            { 
                                icon: Brain, 
                                title: "فهم ذكي 🧠",
                                description: "يستخدم نماذج ذكاء اصطناعي متعددة لفهم أسئلتك بشكل أفضل" 
                            },
                            { 
                                icon: Search, 
                                title: "بحث شامل 🔎",
                                description: "يبحث عبر مصادر متعددة للحصول على إجابات كاملة" 
                            },
                            { 
                                icon: Image, 
                                title: "فهم الصور 📸",
                                description: "يمكنه فهم وشرح الصور التي تشاركها" 
                            },
                            { 
                                icon: InstagramLogo, 
                                title: "حساب انستغرام نقطة 📲",
                                description: "تابع نقطة على انستغرام @nuqta_om لآخر المستجدات والتحديثات" 
                            },
                            { 
                                icon: GraduationCap, 
                                title: "مساعد بحثي 📚",
                                description: "يساعد في العثور على الأبحاث الأكاديمية وشرحها" 
                            },
                            { 
                                icon: Sparkles, 
                                title: "محادثات طبيعية ✨",
                                description: "يستجيب بطريقة واضحة ومحادثة طبيعية" 
                            }
                        ].map((feature, i) => (
                            <motion.div
                                key={i}
                                className="group relative p-8 rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 hover:border-neutral-300 dark:hover:border-neutral-700 transition-all duration-300"
                                whileHover={{ y: -4 }}
                                onClick={() => {
                                    if (i === 3) {
                                        window.open('https://www.instagram.com/nuqta_om/', '_blank');
                                    }
                                }}
                                style={{ cursor: i === 3 ? 'pointer' : 'default' }}
                            >
                                <div className="space-y-4">
                                    <div className="p-2.5 w-fit rounded-xl bg-neutral-100 dark:bg-neutral-800">
                                        <feature.icon className="h-6 w-6" />
                                    </div>
                                    <div className="space-y-2">
                                        <h3 className="text-xl font-semibold">{feature.title}</h3>
                                        <p className="text-neutral-600 dark:text-neutral-400">{feature.description}</p>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </motion.div>
            </div>

            {/* New Use Cases Section */}
            <div className="py-24 px-4 bg-neutral-50 dark:bg-neutral-900/50 border-y border-neutral-200 dark:border-neutral-800">
                <motion.div className="container max-w-5xl mx-auto space-y-16">
                    <div className="text-center space-y-4">
                        <h2 className="text-3xl font-bold">تقنية عمانية للكل 👨‍👩‍👧‍👦</h2>
                        <p className="text-neutral-600 dark:text-neutral-400 max-w-2xl mx-auto">
                            سواء تبي إجابات سريعة أو بحث عميق، ذكي يتأقلم مع اللي تحتاجه من البحث
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <div className="p-6 rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800">
                            <h3 className="text-lg font-semibold mb-2">الطلاب 👨‍🎓</h3>
                            <ul className="list-disc list-inside space-y-2 text-neutral-600 dark:text-neutral-400">
                                <li>مساعدة أبحاث الطلاب</li>
                                <li>شرح المواضيع المعقدة</li>
                                <li>حل مسائل الرياضيات</li>
                            </ul>
                        </div>
                        <div className="p-6 rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800">
                            <h3 className="text-lg font-semibold mb-2">الباحثون 🔬</h3>
                            <ul className="list-disc list-inside space-y-2 text-neutral-600 dark:text-neutral-400">
                                <li>تحليل الأوراق الأكاديمية</li>
                                <li>تفسير البيانات</li>
                                <li>مراجعة الدراسات السابقة</li>
                            </ul>
                        </div>
                        <div className="p-6 rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800">
                            <h3 className="text-lg font-semibold mb-2">المحترفون 👨‍💼</h3>
                            <ul className="list-disc list-inside space-y-2 text-neutral-600 dark:text-neutral-400">
                                <li>أبحاث السوق</li>
                                <li>التوثيق التقني</li>
                                <li>تحليل البيانات</li>
                            </ul>
                        </div>
                    </div>
                </motion.div>
            </div>

            {/* Footer Section */}
            <footer className="border-t border-neutral-200 dark:border-neutral-800 bg-white dark:bg-black">
                <div className="mx-auto max-w-5xl px-4 py-12">
                    <div className="flex flex-col items-center justify-between gap-6 sm:flex-row">
                        <div className="flex items-center gap-3">
                            <img src="/dhaki_logo-removebg-preview.png" alt="ذكي Logo" className="h-8 w-8" />
                            <p className="text-sm text-neutral-600 dark:text-neutral-400">
                                © {new Date().getFullYear()} حقوق محفوظة - صنع في عمان بكل فخر 🇴🇲
                            </p>
                        </div>
                        
                        <div className="flex items-center gap-3">
                            <Link
                                href="https://www.instagram.com/nuqta_om/"
                                className="rounded-lg p-2 text-neutral-600 hover:bg-neutral-100 dark:text-neutral-400 dark:hover:bg-neutral-800 transition-colors"
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                <InstagramLogo className="h-5 w-5" />
                            </Link>
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    );
} 