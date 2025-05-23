import React, { useState, useEffect } from 'react';
import { AlertTriangle, Home, RefreshCw, ArrowLeft } from 'lucide-react';

function ErrorPage() {
    const [isVisible, setIsVisible] = useState(false);
    const [glitchText, setGlitchText] = useState('4');

    useEffect(() => {
        setIsVisible(true);
        
        // Glitch effect for the error code
        const glitchInterval = setInterval(() => {
            const glitchChars = ['4', '?', '@', '#', '4'];
            setGlitchText(glitchChars[Math.floor(Math.random() * glitchChars.length)]);
            setTimeout(() => setGlitchText('4'), 100);
        }, 2000);

        return () => clearInterval(glitchInterval);
    }, []);

    const handleRefresh = () => {
        window.location.reload();
    };

    const handleGoHome = () => {
        window.location.href = '/';
    };

    const handleGoBack = () => {
        window.history.back();
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center p-4 relative overflow-hidden">
            {/* Animated background elements */}
            <div className="absolute inset-0 overflow-hidden">
                <div className="absolute -top-1/2 -left-1/2 w-full h-full bg-gradient-to-r from-purple-500/10 to-pink-500/10 rotate-12 animate-pulse"></div>
                <div className="absolute -bottom-1/2 -right-1/2 w-full h-full bg-gradient-to-l from-blue-500/10 to-cyan-500/10 -rotate-12 animate-pulse delay-1000"></div>
            </div>

            {/* Floating particles */}
            <div className="absolute inset-0">
                {[...Array(20)].map((_, i) => (
                    <div
                        key={i}
                        className="absolute w-2 h-2 bg-white/20 rounded-full animate-pulse"
                        style={{
                            left: `${Math.random() * 100}%`,
                            top: `${Math.random() * 100}%`,
                            animationDelay: `${Math.random() * 3}s`,
                            animationDuration: `${2 + Math.random() * 3}s`
                        }}
                    ></div>
                ))}
            </div>

            <div className={`relative z-10 text-center max-w-lg mx-auto transform transition-all duration-1000 ${
                isVisible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
            }`}>
                {/* Error Code with Glitch Effect */}
                <div className="mb-8">
                    <div className="text-8xl md:text-9xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-red-400 via-pink-500 to-purple-600 mb-4 relative">
                        <span className="relative">
                            {glitchText}0{glitchText}
                            <div className="absolute inset-0 text-red-500 animate-ping opacity-20">404</div>
                        </span>
                    </div>
                    <div className="w-24 h-1 bg-gradient-to-r from-red-500 to-purple-500 mx-auto rounded-full"></div>
                </div>

                {/* Error Icon */}
                <div className="mb-6 flex justify-center">
                    <div className="relative">
                        <AlertTriangle className="w-16 h-16 text-yellow-400 animate-bounce" />
                        <div className="absolute inset-0 w-16 h-16 bg-yellow-400/20 rounded-full animate-ping"></div>
                    </div>
                </div>

                {/* Error Message */}
                <div className="mb-8 space-y-4">
                    <h1 className="text-3xl md:text-4xl font-bold text-white mb-4">
                        Oops! Page Not Found
                    </h1>
                    <p className="text-gray-300 text-lg leading-relaxed">
                        The page you're looking for seems to have vanished into the digital void. 
                        Don't worry, even the best explorers sometimes take a wrong turn.
                    </p>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                    <button
                        onClick={handleGoHome}
                        className="group flex items-center gap-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-6 py-3 rounded-lg font-semibold transition-all duration-300 transform hover:scale-105 hover:shadow-xl hover:shadow-purple-500/25"
                    >
                        <Home className="w-5 h-5 group-hover:rotate-12 transition-transform duration-300" />
                        Go Home
                    </button>

                    <button
                        onClick={handleGoBack}
                        className="group flex items-center gap-2 bg-gradient-to-r from-slate-600 to-slate-700 hover:from-slate-700 hover:to-slate-800 text-white px-6 py-3 rounded-lg font-semibold transition-all duration-300 transform hover:scale-105 hover:shadow-xl hover:shadow-slate-500/25"
                    >
                        <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform duration-300" />
                        Go Back
                    </button>

                    <button
                        onClick={handleRefresh}
                        className="group flex items-center gap-2 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white px-6 py-3 rounded-lg font-semibold transition-all duration-300 transform hover:scale-105 hover:shadow-xl hover:shadow-green-500/25"
                    >
                        <RefreshCw className="w-5 h-5 group-hover:rotate-180 transition-transform duration-500" />
                        Try Again
                    </button>
                </div>

                {/* Additional Help Text */}
                <div className="mt-12 p-6 bg-white/5 backdrop-blur-sm rounded-xl border border-white/10">
                    <p className="text-gray-400 text-sm">
                        If you believe this is a mistake, please contact our support team or check the URL for any typos.
                    </p>
                </div>
            </div>

            {/* Decorative Elements */}
            <div className="absolute bottom-10 left-10 w-20 h-20 border-2 border-purple-500/30 rounded-full animate-spin-slow"></div>
            <div className="absolute top-10 right-10 w-16 h-16 border-2 border-pink-500/30 rounded-full animate-reverse-spin"></div>
        </div>
    );
}

export default ErrorPage;