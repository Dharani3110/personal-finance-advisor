import React from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { ArrowRight, TrendingUp, Brain, Target, BarChart3, Upload, Zap } from 'lucide-react'

export const Home: React.FC = () => {
  const { user } = useAuth()
  const navigate = useNavigate()

  const features = [
    {
      icon: Brain,
      title: 'AI-Powered Analysis',
      description: 'Advanced machine learning algorithms analyze your spending patterns and predict future expenses with high accuracy.',
    },
    {
      icon: Target,
      title: 'Smart Budgeting',
      description: 'Get personalized budget recommendations tailored to your unique spending habits across all categories.',
    },
    {
      icon: BarChart3,
      title: 'Multi-Category Tracking',
      description: 'Track spending across 8+ categories including Food, Transport, Housing, Entertainment, and more.',
    },
    {
      icon: TrendingUp,
      title: 'Spending Insights',
      description: 'Understand your financial trends with clear visualizations and actionable recommendations.',
    },
    {
      icon: Zap,
      title: 'Real-time Processing',
      description: 'Upload your transaction history and get instant AI-powered predictions and budget insights.',
    },
    {
      icon: Upload,
      title: 'Multi-App Support',
      description: 'Import transactions from multiple payment apps - GPay, PhonePe, Paytm, and more in one place.',
    },
  ]

  const steps = [
    {
      number: '1',
      title: 'Upload Transactions',
      description: 'Upload your bank or payment app transaction history as an Excel file.',
    },
    {
      number: '2',
      title: 'AI Analysis',
      description: 'Our advanced ML models analyze your spending patterns and trends.',
    },
    {
      number: '3',
      title: 'Smart Recommendations',
      description: 'Get personalized budget recommendations for each spending category.',
    },
    {
      number: '4',
      title: 'Track & Optimize',
      description: 'Monitor your budget and optimize your spending habits over time.',
    },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 via-white to-indigo-50">
      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-28">
        <div className="text-center">
          <div className="inline-block mb-6">
            <span className="inline-flex items-center gap-2 px-4 py-2 bg-blue-100 text-blue-700 rounded-full text-sm font-semibold">
              <Zap size={16} />
              AI-Powered Personal Finance Advisor
            </span>
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 mb-6 leading-tight">
            Smart Budgeting with{' '}
            <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              AI Intelligence
            </span>
          </h1>

          <p className="text-lg sm:text-xl text-gray-600 mb-8 max-w-3xl mx-auto leading-relaxed">
            Take control of your finances with AI-powered spending analysis.
          </p>

          <div className="flex flex-col sm:flex-row justify-center gap-4 mb-12">
            <button
              onClick={() => (user ? navigate('/upload') : navigate('/login'))}
              className="flex items-center justify-center gap-2 px-8 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg hover:shadow-lg transition-all duration-300 font-semibold text-lg"
            >
              <Upload size={20} />
              Get Started
              <ArrowRight size={20} />
            </button>

            {!user && (
              <button
                onClick={() => navigate('/login')}
                className="flex items-center justify-center gap-2 px-8 py-4 border-2 border-blue-600 text-blue-600 rounded-lg hover:bg-blue-50 transition-all duration-300 font-semibold text-lg"
              >
                Sign In
              </button>
            )}
          </div>

          {/* Hero image removed per request */}
        </div>
      </section>

      {/* Features Section */}
      <section className="bg-white py-20 sm:py-28">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">Powerful Features</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Everything you need to master your personal finances with intelligent AI-powered insights.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon
              return (
                <div
                  key={index}
                  className="p-8 rounded-xl border border-gray-100 hover:shadow-lg hover:border-blue-200 transition-all duration-300 hover:scale-105 group"
                >
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4 group-hover:bg-blue-600 transition-colors">
                    <Icon size={24} className="text-blue-600 group-hover:text-white transition-colors" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">{feature.title}</h3>
                  <p className="text-gray-600 leading-relaxed">{feature.description}</p>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20 sm:py-28">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">How It Works</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Get started in just 4 simple steps. Transform your transaction data into actionable financial insights.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {steps.map((step, index) => (
              <div key={index} className="relative">
                {/* Connector Line */}
                {index < steps.length - 1 && (
                  <div className="hidden lg:block absolute top-12 left-[calc(100%+12px)] w-6 h-0.5 bg-gradient-to-r from-blue-400 to-transparent"></div>
                )}

                <div className="bg-white rounded-xl p-8 border border-gray-100 hover:shadow-lg transition-all duration-300">
                  <div className="flex items-center justify-center w-12 h-12 bg-gradient-to-br from-blue-600 to-indigo-600 text-white rounded-lg font-bold text-lg mb-4">
                    {step.number}
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">{step.title}</h3>
                  <p className="text-gray-600">{step.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gradient-to-r from-blue-600 to-indigo-600 py-16 sm:py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">Ready to Transform Your Finances?</h2>
          <p className="text-xl text-blue-100 mb-8">
            Join thousands of users making smarter financial decisions with FinanceAI.
          </p>
          <button
            onClick={() => (user ? navigate('/upload') : navigate('/login'))}
            className="px-8 py-4 bg-white text-blue-600 rounded-lg hover:bg-blue-50 transition-all duration-300 font-semibold text-lg shadow-lg hover:shadow-xl"
          >
            Start Now
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-50 border-t border-gray-200 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-gray-600 text-sm">
          <p>© 2026 FinanceAI. All rights reserved. | AI-Powered Personal Finance Advisor</p>
        </div>
      </footer>
    </div>
  )
}
