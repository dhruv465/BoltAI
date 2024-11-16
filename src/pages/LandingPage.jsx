import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Bot, Sparkles, Zap, Shield, ArrowRight } from 'lucide-react';
import { SignInButton, SignUpButton, useAuth } from '@clerk/clerk-react';
import { Modal } from '../components/Modal';

export function LandingPage() {
  const { isSignedIn } = useAuth();
  const [isVideoModalOpen, setIsVideoModalOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black text-white">
      <nav className="container mx-auto px-6 py-6 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Bot className="w-8 h-8 text-blue-500" />
          <span className="text-xl font-bold">ScriptGenie</span>
        </div>
        <div className="hidden md:flex space-x-8">
          <a href="#features" className="hover:text-blue-400 transition-colors">Features</a>
          <a href="#pricing" className="hover:text-blue-400 transition-colors">Pricing</a>
          <a href="#about" className="hover:text-blue-400 transition-colors">About</a>
        </div>
        {isSignedIn ? (
          <Link
            to="/dashboard"
            className="bg-blue-600 hover:bg-blue-700 px-6 py-2 rounded-full font-medium transition-colors"
          >
            Dashboard
          </Link>
        ) : (
          <SignInButton mode="modal">
            <button className="bg-blue-600 hover:bg-blue-700 px-6 py-2 rounded-full font-medium transition-colors">
              Sign In
            </button>
          </SignInButton>
        )}
      </nav>

      <main>
        <section className="container mx-auto px-6 pt-20 pb-32">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-block mb-6">
              <div className="flex items-center space-x-2 bg-gray-800/50 rounded-full px-4 py-2">
                <Sparkles className="w-5 h-5 text-blue-400" />
                <span className="text-blue-400">AI-Powered Innovation</span>
              </div>
            </div>
            <h1 className="text-5xl md:text-7xl font-bold mb-8 bg-gradient-to-r from-blue-400 to-purple-500 text-transparent bg-clip-text">
              Transform Your Workflow with AI
            </h1>
            <p className="text-xl text-gray-300 mb-12 max-w-2xl mx-auto">
              Harness the power of artificial intelligence to streamline your work, boost productivity, and unlock new possibilities.
            </p>
            <div className="flex flex-col md:flex-row items-center justify-center gap-4">
              <SignUpButton mode="modal">
                <button className="w-full md:w-auto bg-blue-600 hover:bg-blue-700 px-8 py-4 rounded-full font-medium transition-all transform hover:scale-105 flex items-center justify-center space-x-2">
                  <span>Start Free Trial</span>
                  <ArrowRight className="w-5 h-5" />
                </button>
              </SignUpButton>
              <button 
                onClick={() => setIsVideoModalOpen(true)}
                className="w-full md:w-auto bg-gray-800 hover:bg-gray-700 px-8 py-4 rounded-full font-medium transition-all"
              >
                Watch Demo
              </button>
            </div>
          </div>
        </section>

        <section className="bg-gray-900/50 py-24">
          <div className="container mx-auto px-6">
            <div className="grid md:grid-cols-3 gap-12">
              <div className="bg-gray-800/40 p-8 rounded-2xl backdrop-blur-sm">
                <div className="bg-blue-500/10 w-12 h-12 rounded-xl flex items-center justify-center mb-6">
                  <Zap className="w-6 h-6 text-blue-400" />
                </div>
                <h3 className="text-xl font-semibold mb-4">Lightning Fast</h3>
                <p className="text-gray-400">Get instant results with our optimized AI processing engine.</p>
              </div>
              <div className="bg-gray-800/40 p-8 rounded-2xl backdrop-blur-sm">
                <div className="bg-purple-500/10 w-12 h-12 rounded-xl flex items-center justify-center mb-6">
                  <Shield className="w-6 h-6 text-purple-400" />
                </div>
                <h3 className="text-xl font-semibold mb-4">Secure & Private</h3>
                <p className="text-gray-400">Your data is encrypted and protected with enterprise-grade security.</p>
              </div>
              <div className="bg-gray-800/40 p-8 rounded-2xl backdrop-blur-sm">
                <div className="bg-green-500/10 w-12 h-12 rounded-xl flex items-center justify-center mb-6">
                  <Bot className="w-6 h-6 text-green-400" />
                </div>
                <h3 className="text-xl font-semibold mb-4">Smart Automation</h3>
                <p className="text-gray-400">Automate repetitive tasks with intelligent AI workflows.</p>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Modal isOpen={isVideoModalOpen} onClose={() => setIsVideoModalOpen(false)}>
        <div className="bg-black rounded-xl overflow-hidden aspect-video">
          <video 
            className="w-full h-full"
            controls
            autoPlay
            src="https://res.cloudinary.com/dvfrcaw1c/video/upload/v1731748205/Screencast_from_2024-11-16_14-36-55_nktgqc.mp4"
          >
            Your browser does not support the video tag.
          </video>
        </div>
      </Modal>

      <footer className="border-t border-gray-800">
        <div className="container mx-auto px-6 py-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center space-x-2 mb-4 md:mb-0">
              <Bot className="w-6 h-6 text-blue-500" />
              <span className="font-bold">ScriptGenie</span>
            </div>
            <div className="flex space-x-6 text-sm text-gray-400">
              <a href="#" className="hover:text-white transition-colors">Privacy</a>
              <a href="#" className="hover:text-white transition-colors">Terms</a>
              <a href="#" className="hover:text-white transition-colors">Contact</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}