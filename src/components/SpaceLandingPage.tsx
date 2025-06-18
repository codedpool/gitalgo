import React, { useState, useEffect } from 'react';
import { Github, Star, Rocket, Globe, Zap, Users, Code, ArrowRight, Sparkles } from 'lucide-react';
import AuthModal from './AuthModal';

interface SpaceLandingPageProps {
  onAuthSuccess: (user: any) => void;
}

export default function SpaceLandingPage({ onAuthSuccess }: SpaceLandingPageProps) {
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const handleAuthClick = (mode: 'login' | 'register') => {
    setAuthMode(mode);
    setShowAuthModal(true);
  };

  const features = [
    {
      icon: Code,
      title: 'Version Control',
      description: 'Track changes and collaborate with your team across the galaxy',
      color: 'from-blue-400 to-cyan-400'
    },
    {
      icon: Users,
      title: 'Team Collaboration',
      description: 'Work together seamlessly across space and time',
      color: 'from-purple-400 to-pink-400'
    },
    {
      icon: Rocket,
      title: 'Deploy Anywhere',
      description: 'Launch your projects to any corner of the universe',
      color: 'from-orange-400 to-red-400'
    },
    {
      icon: Zap,
      title: 'Lightning Fast',
      description: 'Experience the speed of light in your development workflow',
      color: 'from-yellow-400 to-orange-400'
    }
  ];

  const stats = [
    { value: '100M+', label: 'Repositories' },
    { value: '73M+', label: 'Developers' },
    { value: '4M+', label: 'Organizations' },
    { value: '330M+', label: 'Stars Given' }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0">
        {/* Stars */}
        <div className="absolute inset-0">
          {[...Array(100)].map((_, i) => (
            <div
              key={i}
              className="absolute w-1 h-1 bg-white rounded-full animate-pulse"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 3}s`,
                animationDuration: `${2 + Math.random() * 2}s`
              }}
            />
          ))}
        </div>

        {/* Floating Planets */}
        <div className="absolute top-20 right-20 w-32 h-32 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full opacity-20 animate-pulse" />
        <div className="absolute bottom-32 left-16 w-24 h-24 bg-gradient-to-br from-orange-400 to-red-500 rounded-full opacity-15 animate-pulse" style={{ animationDelay: '1s' }} />
        <div className="absolute top-1/2 left-1/4 w-16 h-16 bg-gradient-to-br from-green-400 to-blue-500 rounded-full opacity-10 animate-pulse" style={{ animationDelay: '2s' }} />

        {/* Nebula Effect */}
        <div 
          className="absolute inset-0 opacity-30"
          style={{
            background: `radial-gradient(circle at ${mousePosition.x}px ${mousePosition.y}px, rgba(139, 92, 246, 0.3) 0%, transparent 50%)`
          }}
        />
      </div>

      {/* Content */}
      <div className="relative z-10">
        {/* Header */}
        <header className="flex items-center justify-between p-8">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-br from-white to-gray-200 rounded-lg flex items-center justify-center shadow-lg">
              <Github className="h-6 w-6 text-gray-900" />
            </div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
              GitHub Galaxy
            </h1>
          </div>
          
          <div className="flex items-center space-x-4">
            <button
              onClick={() => handleAuthClick('login')}
              className="px-6 py-2 text-white/80 hover:text-white transition-colors font-medium"
            >
              Sign In
            </button>
            <button
              onClick={() => handleAuthClick('register')}
              className="px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl hover:from-purple-600 hover:to-pink-600 transition-all duration-200 hover:scale-105 shadow-lg hover:shadow-purple-500/25 font-semibold"
            >
              Join the Galaxy
            </button>
          </div>
        </header>

        {/* Hero Section */}
        <div className="flex flex-col items-center justify-center min-h-[80vh] text-center px-8">
          <div className="mb-8 relative">
            <div className="absolute -inset-4 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-full blur-xl animate-pulse" />
            <Sparkles className="h-16 w-16 text-yellow-400 relative animate-spin" style={{ animationDuration: '8s' }} />
          </div>

          <h1 className="text-6xl md:text-8xl font-bold mb-6 bg-gradient-to-r from-white via-purple-200 to-pink-200 bg-clip-text text-transparent leading-tight">
            Code Across
            <br />
            <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
              The Universe
            </span>
          </h1>

          <p className="text-xl md:text-2xl text-gray-300 mb-12 max-w-3xl leading-relaxed">
            Join millions of developers in the ultimate collaborative platform. 
            Build, share, and deploy your projects across the digital cosmos.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 mb-16">
            <button
              onClick={() => handleAuthClick('register')}
              className="group px-8 py-4 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl hover:from-purple-600 hover:to-pink-600 transition-all duration-200 hover:scale-105 shadow-lg hover:shadow-purple-500/25 font-semibold text-lg flex items-center justify-center"
            >
              <Rocket className="h-5 w-5 mr-2 group-hover:animate-bounce" />
              Launch Your Journey
              <ArrowRight className="h-5 w-5 ml-2 group-hover:translate-x-1 transition-transform" />
            </button>
            
            <button
              onClick={() => handleAuthClick('login')}
              className="px-8 py-4 border-2 border-white/20 text-white rounded-xl hover:border-white/40 hover:bg-white/5 transition-all duration-200 font-semibold text-lg backdrop-blur-sm"
            >
              Access Mission Control
            </button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-16">
            {stats.map((stat, index) => (
              <div
                key={stat.label}
                className="text-center p-6 rounded-xl bg-white/5 backdrop-blur-sm border border-white/10 hover:bg-white/10 transition-all duration-300 hover:scale-105"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent mb-2">
                  {stat.value}
                </div>
                <div className="text-gray-300 text-sm font-medium">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Features Section */}
        <div className="px-8 pb-16">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-4xl font-bold text-center mb-4 bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
              Explore the Features
            </h2>
            <p className="text-gray-400 text-center mb-12 text-lg">
              Discover the tools that power development across the galaxy
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {features.map((feature, index) => (
                <div
                  key={feature.title}
                  className="group p-6 rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10 hover:bg-white/10 transition-all duration-300 hover:scale-105 hover:shadow-2xl"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-r ${feature.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-200`}>
                    <feature.icon className="h-6 w-6 text-white" />
                  </div>
                  <h3 className="text-xl font-semibold text-white mb-2 group-hover:text-purple-200 transition-colors">
                    {feature.title}
                  </h3>
                  <p className="text-gray-400 group-hover:text-gray-300 transition-colors">
                    {feature.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Call to Action */}
        <div className="px-8 pb-16">
          <div className="max-w-4xl mx-auto text-center">
            <div className="p-12 rounded-3xl bg-gradient-to-r from-purple-500/10 to-pink-500/10 backdrop-blur-sm border border-white/10">
              <Globe className="h-16 w-16 text-purple-400 mx-auto mb-6 animate-spin" style={{ animationDuration: '20s' }} />
              <h2 className="text-4xl font-bold mb-4 bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                Ready to Join the Galaxy?
              </h2>
              <p className="text-gray-300 text-lg mb-8 max-w-2xl mx-auto">
                Start your cosmic coding journey today. Connect with developers from across the universe 
                and build the future together.
              </p>
              <button
                onClick={() => handleAuthClick('register')}
                className="group px-10 py-4 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl hover:from-purple-600 hover:to-pink-600 transition-all duration-200 hover:scale-105 shadow-lg hover:shadow-purple-500/25 font-semibold text-lg"
              >
                <Star className="h-5 w-5 mr-2 inline group-hover:animate-spin" />
                Begin Your Mission
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Auth Modal */}
      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        onAuthSuccess={onAuthSuccess}
        initialMode={authMode}
      />
    </div>
  );
}