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
      color: 'from-indigo-500 to-purple-600'
    },
    {
      icon: Users,
      title: 'Team Collaboration',
      description: 'Work together seamlessly across space and time',
      color: 'from-purple-500 to-pink-600'
    },
    {
      icon: Rocket,
      title: 'Deploy Anywhere',
      description: 'Launch your projects to any corner of the universe',
      color: 'from-orange-500 to-red-600'
    },
    {
      icon: Zap,
      title: 'Lightning Fast',
      description: 'Experience the speed of light in your development workflow',
      color: 'from-yellow-500 to-orange-600'
    }
  ];

  const stats = [
    { value: '100M+', label: 'Repositories' },
    { value: '73M+', label: 'Developers' },
    { value: '4M+', label: 'Organizations' },
    { value: '330M+', label: 'Stars Given' }
  ];

  return (
    <div className="min-h-screen bg-black relative overflow-hidden">
      {/* Deep Space Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-black via-gray-900 to-black">
        {/* Subtle cosmic gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-purple-900/10 via-black to-blue-900/10" />
      </div>

      {/* Animated Background Elements */}
      <div className="absolute inset-0">
        {/* Stars - More numerous and varied */}
        <div className="absolute inset-0">
          {[...Array(200)].map((_, i) => (
            <div
              key={i}
              className={`absolute rounded-full animate-pulse ${
                i % 4 === 0 ? 'w-1 h-1 bg-blue-200' :
                i % 4 === 1 ? 'w-0.5 h-0.5 bg-white' :
                i % 4 === 2 ? 'w-1 h-1 bg-purple-200' :
                'w-0.5 h-0.5 bg-gray-300'
              }`}
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 5}s`,
                animationDuration: `${3 + Math.random() * 4}s`
              }}
            />
          ))}
        </div>

        {/* Shooting Stars */}
        {[...Array(3)].map((_, i) => (
          <div
            key={`shooting-${i}`}
            className="absolute w-1 h-1 bg-white rounded-full opacity-0 animate-ping"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 50}%`,
              animationDelay: `${i * 3 + Math.random() * 2}s`,
              animationDuration: '0.5s'
            }}
          />
        ))}

        {/* Distant Galaxies/Nebulae */}
        <div className="absolute top-1/4 right-1/4 w-40 h-40 bg-gradient-to-br from-purple-600/20 to-transparent rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/3 left-1/5 w-32 h-32 bg-gradient-to-br from-blue-600/15 to-transparent rounded-full blur-2xl animate-pulse" style={{ animationDelay: '2s' }} />
        <div className="absolute top-1/2 right-1/6 w-24 h-24 bg-gradient-to-br from-indigo-600/10 to-transparent rounded-full blur-xl animate-pulse" style={{ animationDelay: '4s' }} />

        {/* Interactive Mouse Glow */}
        <div 
          className="absolute inset-0 opacity-20 pointer-events-none"
          style={{
            background: `radial-gradient(circle 300px at ${mousePosition.x}px ${mousePosition.y}px, rgba(139, 92, 246, 0.15) 0%, transparent 70%)`
          }}
        />
      </div>

      {/* Content */}
      <div className="relative z-10">
        {/* Header */}
        <header className="flex items-center justify-between p-8">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-br from-gray-800 to-black border border-gray-700 rounded-lg flex items-center justify-center shadow-2xl">
              <Github className="h-6 w-6 text-white" />
            </div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-white via-gray-200 to-gray-400 bg-clip-text text-transparent">
              GitHub Galaxy
            </h1>
          </div>
          
          <div className="flex items-center space-x-4">
            <button
              onClick={() => handleAuthClick('login')}
              className="px-6 py-2 text-gray-300 hover:text-white transition-colors font-medium border border-gray-700 rounded-lg hover:border-gray-600 hover:bg-gray-900/50"
            >
              Sign In
            </button>
            <button
              onClick={() => handleAuthClick('register')}
              className="px-6 py-3 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-lg hover:from-purple-700 hover:to-indigo-700 transition-all duration-200 hover:scale-105 shadow-lg hover:shadow-purple-500/25 font-semibold border border-purple-500/50"
            >
              Join the Galaxy
            </button>
          </div>
        </header>

        {/* Hero Section */}
        <div className="flex flex-col items-center justify-center min-h-[80vh] text-center px-8">
          <div className="mb-8 relative">
            <div className="absolute -inset-6 bg-gradient-to-r from-purple-600/30 to-indigo-600/30 rounded-full blur-2xl animate-pulse" />
            <div className="absolute -inset-3 bg-gradient-to-r from-white/10 to-gray-300/10 rounded-full blur-xl" />
            <Sparkles className="h-16 w-16 text-white relative animate-spin drop-shadow-2xl" style={{ animationDuration: '8s' }} />
          </div>

          <h1 className="text-6xl md:text-8xl font-bold mb-6 bg-gradient-to-r from-white via-gray-100 to-gray-300 bg-clip-text text-transparent leading-tight drop-shadow-2xl">
            Code in the
            <br />
            <span className="bg-gradient-to-r from-purple-400 via-indigo-400 to-blue-400 bg-clip-text text-transparent">
              Void of Space
            </span>
          </h1>

          <p className="text-xl md:text-2xl text-gray-400 mb-12 max-w-3xl leading-relaxed">
            Enter the infinite darkness where code becomes light. 
            Join the cosmic network of developers building across the digital universe.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 mb-16">
            <button
              onClick={() => handleAuthClick('register')}
              className="group px-8 py-4 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-lg hover:from-purple-700 hover:to-indigo-700 transition-all duration-200 hover:scale-105 shadow-2xl hover:shadow-purple-500/30 font-semibold text-lg flex items-center justify-center border border-purple-500/50"
            >
              <Rocket className="h-5 w-5 mr-2 group-hover:animate-bounce" />
              Enter the Void
              <ArrowRight className="h-5 w-5 ml-2 group-hover:translate-x-1 transition-transform" />
            </button>
            
            <button
              onClick={() => handleAuthClick('login')}
              className="px-8 py-4 border-2 border-gray-700 text-gray-300 rounded-lg hover:border-gray-600 hover:bg-gray-900/50 hover:text-white transition-all duration-200 font-semibold text-lg backdrop-blur-sm"
            >
              Access Control Center
            </button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-16">
            {stats.map((stat, index) => (
              <div
                key={stat.label}
                className="text-center p-6 rounded-xl bg-gray-900/30 backdrop-blur-sm border border-gray-800 hover:bg-gray-800/40 hover:border-gray-700 transition-all duration-300 hover:scale-105 shadow-xl"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="text-3xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent mb-2">
                  {stat.value}
                </div>
                <div className="text-gray-400 text-sm font-medium">
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
              Navigate the Darkness
            </h2>
            <p className="text-gray-500 text-center mb-12 text-lg">
              Discover the tools that illuminate development in the cosmic void
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {features.map((feature, index) => (
                <div
                  key={feature.title}
                  className="group p-6 rounded-2xl bg-gray-900/40 backdrop-blur-sm border border-gray-800 hover:bg-gray-800/50 hover:border-gray-700 transition-all duration-300 hover:scale-105 hover:shadow-2xl"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-r ${feature.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-200 shadow-lg`}>
                    <feature.icon className="h-6 w-6 text-white" />
                  </div>
                  <h3 className="text-xl font-semibold text-white mb-2 group-hover:text-gray-200 transition-colors">
                    {feature.title}
                  </h3>
                  <p className="text-gray-500 group-hover:text-gray-400 transition-colors">
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
            <div className="p-12 rounded-3xl bg-gradient-to-r from-gray-900/50 to-black/50 backdrop-blur-sm border border-gray-800 shadow-2xl">
              <Globe className="h-16 w-16 text-purple-400 mx-auto mb-6 animate-spin drop-shadow-2xl" style={{ animationDuration: '20s' }} />
              <h2 className="text-4xl font-bold mb-4 bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                Ready to Embrace the Void?
              </h2>
              <p className="text-gray-400 text-lg mb-8 max-w-2xl mx-auto">
                Step into the infinite darkness where code becomes starlight. 
                Connect with developers across the cosmic network and forge the future in the void.
              </p>
              <button
                onClick={() => handleAuthClick('register')}
                className="group px-10 py-4 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-lg hover:from-purple-700 hover:to-indigo-700 transition-all duration-200 hover:scale-105 shadow-2xl hover:shadow-purple-500/30 font-semibold text-lg border border-purple-500/50"
              >
                <Star className="h-5 w-5 mr-2 inline group-hover:animate-spin" />
                Enter the Cosmic Network
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