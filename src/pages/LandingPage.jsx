import React, { useState, useEffect, useRef, useCallback } from 'react';
import ThreeScene from '../components/ThreeScene';
import ScrollSections from '../components/ScrollSections';
import { useNavigate } from 'react-router-dom';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export default function LandingPage() {
    const [scrollProgress, setScrollProgress] = useState(0);
    const heroRef = useRef(null);
    const navigate = useNavigate();

    useEffect(() => {
        // Track scroll progress for 3D camera
        const onScroll = () => {
            const scrolled = window.scrollY;
            const docHeight = document.documentElement.scrollHeight - window.innerHeight;
            const progress = docHeight > 0 ? Math.min(scrolled / docHeight, 1) : 0;
            setScrollProgress(progress);
        };
        window.addEventListener('scroll', onScroll, { passive: true });

        // Hero text entrance
        const ctx = gsap.context(() => {
            gsap.from('.hero-text-line', {
                y: 60,
                opacity: 0,
                duration: 1.2,
                stagger: 0.15,
                ease: 'power3.out',
                delay: 0.3,
            });

            gsap.from('.hero-cta', {
                y: 30,
                opacity: 0,
                duration: 0.8,
                ease: 'power2.out',
                delay: 1.0,
            });

            // Hero fade out on scroll
            if (heroRef.current) {
                gsap.to(heroRef.current, {
                    opacity: 0,
                    y: -60,
                    scrollTrigger: {
                        trigger: heroRef.current,
                        start: 'top top',
                        end: '+=400',
                        scrub: 1,
                    },
                });
            }
        });

        return () => {
            ctx.revert();
            window.removeEventListener('scroll', onScroll);
        };
    }, []);

    return (
        <div className="min-h-[400vh] relative" data-theme="dark">
            {/* 3D Scene is now handled globally in App.jsx */}

            {/* Hero Section — Fixed, fades on scroll */}
            <div
                ref={heroRef}
                className="fixed inset-0 z-10 flex items-center justify-center pointer-events-none"
            >
                <div className="text-center px-6 max-w-2xl">
                    <div className="overflow-hidden mb-2">
                        <p className="hero-text-line text-sm md:text-base uppercase tracking-[0.3em] text-violet-400 font-medium">
                            Introducing
                        </p>
                    </div>
                    <div className="overflow-hidden mb-1">
                        <h1 className="hero-text-line font-display text-5xl md:text-7xl lg:text-8xl font-extrabold text-white leading-[0.95] tracking-tight">
                            YOU CAN
                        </h1>
                    </div>
                    <div className="overflow-hidden mb-1">
                        <h1 className="hero-text-line font-display text-5xl md:text-7xl lg:text-8xl font-extrabold leading-[0.95] tracking-tight bg-gradient-to-r from-cyan-400 via-violet-400 to-pink-400 bg-clip-text text-transparent">
                            SPEND
                        </h1>
                    </div>
                    <div className="overflow-hidden mb-6">
                        <h1 className="hero-text-line font-display text-5xl md:text-7xl lg:text-8xl font-extrabold text-white leading-[0.95] tracking-tight">
                            TODAY
                        </h1>
                    </div>
                    <div className="overflow-hidden">
                        <p className="hero-text-line text-gray-400 text-lg md:text-xl max-w-md mx-auto">
                            Without blowing your month.
                        </p>
                    </div>

                    {/* Glassmorphic CTA */}
                    <div className="hero-cta mt-10 pointer-events-auto">
                        <button
                            onClick={() => {
                                window.scrollTo({ top: window.innerHeight * 1.5, behavior: 'smooth' });
                            }}
                            className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full backdrop-blur-xl bg-white/[0.06] border border-white/[0.12] text-white font-medium text-sm hover:bg-white/[0.1] hover:border-white/[0.2] transition-all duration-300 shadow-[0_0_25px_rgba(124,58,237,0.2)] hover:shadow-[0_0_40px_rgba(124,58,237,0.35)] active:scale-95"
                        >
                            <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                            Scroll to explore
                        </button>
                    </div>
                </div>
            </div>

            {/* Spacer so hero is visible before scroll content */}
            <div className="h-[150vh]" />

            {/* Scroll Feature Sections */}
            <ScrollSections />
        </div>
    );
}
