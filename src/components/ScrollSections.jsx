import React, { useRef, useEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ArrowRight, TrendingUp, PieChart, Zap } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

gsap.registerPlugin(ScrollTrigger);

const FEATURES = [
    {
        icon: TrendingUp,
        title: 'Track',
        description: 'Know exactly how much you can spend today. No guesswork.',
        gradient: 'from-cyan-400 to-blue-500',
    },
    {
        icon: PieChart,
        title: 'Understand',
        description: 'Historical charts show your spending patterns over time.',
        gradient: 'from-violet-400 to-purple-600',
    },
    {
        icon: Zap,
        title: 'Win',
        description: 'Stay on pace. Guilt-free spending, every single day.',
        gradient: 'from-pink-400 to-rose-500',
    },
];

export default function ScrollSections() {
    const sectionRefs = useRef([]);
    const ctaRef = useRef(null);
    const navigate = useNavigate();

    useEffect(() => {
        const ctx = gsap.context(() => {
            // Animate each feature card on scroll
            sectionRefs.current.forEach((el, i) => {
                if (!el) return;
                gsap.fromTo(
                    el,
                    { opacity: 0, y: 80, scale: 0.95 },
                    {
                        opacity: 1,
                        y: 0,
                        scale: 1,
                        duration: 1,
                        ease: 'power3.out',
                        scrollTrigger: {
                            trigger: el,
                            start: 'top 85%',
                            end: 'top 50%',
                            toggleActions: 'play none none reverse',
                        },
                    }
                );
            });

            // CTA entrance
            if (ctaRef.current) {
                gsap.fromTo(
                    ctaRef.current,
                    { opacity: 0, y: 40 },
                    {
                        opacity: 1,
                        y: 0,
                        duration: 0.8,
                        ease: 'power2.out',
                        scrollTrigger: {
                            trigger: ctaRef.current,
                            start: 'top 90%',
                            toggleActions: 'play none none reverse',
                        },
                    }
                );
            }
        });

        return () => ctx.revert();
    }, []);

    return (
        <div className="relative z-10">
            {/* Feature Cards */}
            <div className="max-w-lg mx-auto px-6 flex flex-col gap-16 py-8">
                {FEATURES.map((feat, i) => {
                    const Icon = feat.icon;
                    return (
                        <div
                            key={feat.title}
                            ref={(el) => (sectionRefs.current[i] = el)}
                            className="backdrop-blur-xl bg-white/[0.04] border border-white/[0.08] rounded-3xl p-8 transition-all duration-300 hover:bg-white/[0.07] hover:border-white/[0.15]"
                        >
                            <div className={`inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-gradient-to-br ${feat.gradient} mb-5`}>
                                <Icon size={22} className="text-white" strokeWidth={2.5} />
                            </div>
                            <h3 className="font-display text-2xl font-bold text-white mb-3">
                                {feat.title}
                            </h3>
                            <p className="text-gray-400 text-base leading-relaxed">
                                {feat.description}
                            </p>
                        </div>
                    );
                })}
            </div>

            {/* Final CTA */}
            <div
                ref={ctaRef}
                className="flex flex-col items-center justify-center py-32 px-6"
            >
                <h2 className="font-display text-3xl md:text-4xl font-bold text-white text-center mb-4">
                    Ready to take control?
                </h2>
                <p className="text-gray-400 text-center mb-8 max-w-sm">
                    Your daily allowance is waiting. No signup, no friction.
                </p>
                <button
                    onClick={() => navigate('/app')}
                    className="group relative inline-flex items-center gap-3 px-8 py-4 rounded-full bg-gradient-to-r from-violet-600 to-purple-600 text-white font-semibold text-lg shadow-[0_0_30px_rgba(124,58,237,0.4)] hover:shadow-[0_0_50px_rgba(124,58,237,0.6)] transition-all duration-300 hover:scale-105 active:scale-95"
                >
                    Enter Your Dashboard
                    <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                </button>
            </div>
        </div>
    );
}
