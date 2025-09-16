import React from 'react';
import { motion } from 'framer-motion';
import { PlayIcon, ShieldCheckIcon, BoltIcon, ArrowPathIcon } from '@heroicons/react/24/outline';
import { NavigationHeader } from '../components/common/Navigation';
import { Button } from '../components/common/Button';
import { GlassCard } from '../components/common/Card';

const LandingPage: React.FC = () => {
  const benefits = [
    {
      title: "Avoid fraudulent content",
      subtitle: "and protect your reputation.",
      improvement: "+9% purchase intention",
      icon: <ShieldCheckIcon className="w-8 h-8" />
    },
    {
      title: "Avoid fraudulent content",
      subtitle: "and protect your reputation.",
      improvement: "+9% purchase intention",
      icon: <BoltIcon className="w-8 h-8" />
    },
    {
      title: "Avoid fraudulent content",
      subtitle: "and protect your reputation.",
      improvement: "+9% purchase intention",
      icon: <ArrowPathIcon className="w-8 h-8" />
    }
  ];

  const protections = [
    {
      icon: <ShieldCheckIcon className="w-6 h-6" />,
      title: "AI",
      description: "Use analytics provided to improve your customer contact to sell more."
    },
    {
      icon: <BoltIcon className="w-6 h-6" />,
      title: "Protection",
      description: "Secure creditor data so everyone understands its legal value."
    },
    {
      icon: <ArrowPathIcon className="w-6 h-6" />,
      title: "Personalization",
      description: "Segmentation sub-models according to customer guidelines."
    }
  ];

  return (
    <div className="min-h-screen">
      <NavigationHeader transparent />
      
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left Content */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="text-center lg:text-left"
            >
              <motion.h1 
                className="text-hero text-gradient mb-6"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
              >
                THE
                <br />
                SIMPLE
                <br />
                FUND.
              </motion.h1>
              
              <motion.p 
                className="text-subtitle mb-8 max-w-md mx-auto lg:mx-0"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
              >
                Security | Convenience | Transitions
              </motion.p>

              <motion.div
                className="space-y-4 mb-12"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.5 }}
              >
                <h2 className="text-2xl font-bold text-white">About</h2>
                <p className="text-white/80 max-w-lg mx-auto lg:mx-0">
                  Timbolaiê Timbolaiê Timbolaiê Timbolaiê
                  Timbolaiê Timbolaiê Timbolaiê Timbolaiê
                </p>
              </motion.div>

              <motion.div
                className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.6 }}
              >
                <Button size="lg" href="/select-role">
                  Explore Platform
                </Button>
                <Button 
                  variant="secondary" 
                  size="lg"
                  icon={<PlayIcon className="w-5 h-5" />}
                >
                  Watch Video
                </Button>
              </motion.div>
            </motion.div>

            {/* Right Content - 3D Card Visual */}
            <motion.div
              className="flex justify-center lg:justify-end"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
            >
              <div className="relative">
                <motion.div
                  className="w-80 h-48 bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl shadow-2xl transform rotate-12"
                  animate={{ 
                    rotateY: [0, 5, 0],
                    rotateX: [0, 2, 0]
                  }}
                  transition={{ 
                    duration: 6,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent rounded-2xl" />
                  <div className="p-6 h-full flex flex-col justify-between">
                    <div className="flex justify-between items-start">
                      <div className="w-12 h-8 bg-white/80 rounded-md" />
                      <div className="w-8 h-8 bg-white/60 rounded-full" />
                    </div>
                    <div className="space-y-2">
                      <div className="flex space-x-2">
                        <div className="w-4 h-4 bg-white/60 rounded" />
                        <div className="w-4 h-4 bg-white/60 rounded" />
                        <div className="w-4 h-4 bg-white/60 rounded" />
                        <div className="w-4 h-4 bg-white/40 rounded" />
                      </div>
                    </div>
                  </div>
                </motion.div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-3 gap-8">
            {benefits.map((benefit, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.2 }}
                viewport={{ once: true }}
              >
                <GlassCard
                  icon={benefit.icon}
                  title={benefit.title}
                  subtitle={benefit.subtitle}
                  className="text-center h-full"
                >
                  <div className="mt-6">
                    <div className="inline-flex items-center justify-center px-4 py-2 bg-white/10 rounded-full">
                      <span className="text-sm font-semibold text-white">
                        {benefit.improvement}
                      </span>
                    </div>
                  </div>
                </GlassCard>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Strategy Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <motion.h2
              className="text-4xl md:text-5xl font-black text-white mb-6"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              Don't count on luck.
              <br />
              Invest with strategy.
            </motion.h2>
            <motion.p
              className="text-xl text-white/80 max-w-3xl mx-auto"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              viewport={{ once: true }}
            >
              Use intelligent premium strategy to maintain real engagement from investors to your investment.
            </motion.p>
          </div>

          {/* Demo Image Placeholder */}
          <motion.div
            className="relative max-w-4xl mx-auto"
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            viewport={{ once: true }}
          >
            <div className="bg-gradient-to-br from-blue-600/20 to-purple-600/20 rounded-3xl p-8 backdrop-blur-sm border border-white/10">
              <div className="aspect-video bg-black/30 rounded-2xl flex items-center justify-center">
                <div className="text-center">
                  <PlayIcon className="w-16 h-16 text-white/60 mx-auto mb-4" />
                  <p className="text-white/60 text-lg">Demo Preview</p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-3 gap-8">
            {protections.map((protection, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="text-center"
              >
                <div className="flex justify-center mb-6">
                  <div className="p-4 bg-white/10 rounded-2xl">
                    {protection.icon}
                  </div>
                </div>
                <h3 className="text-xl font-bold text-white mb-4">
                  {protection.title}
                </h3>
                <p className="text-white/70 leading-relaxed">
                  {protection.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-4xl font-black text-white mb-8">
              Ready to start investing smarter?
            </h2>
            <Button size="lg" href="/select-role">
              Get Started Today
            </Button>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default LandingPage;