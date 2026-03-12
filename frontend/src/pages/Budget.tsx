import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { TrendingUp, AlertCircle, CheckCircle, Info } from 'lucide-react'

interface Predictions {
  [key: string]: number
}

interface BudgetItem {
  category: string
  predicted: number
  budget: number
  status: string
  percentage: number
  humanDescription: string
  recommendation: string
}

// Category icons and descriptions
const categoryInfo: {
  [key: string]: { icon: string; description: string }
} = {
  Food: { icon: '🍔', description: 'Groceries and dining' },
  Transport: { icon: '🚗', description: 'Travel and commute' },
  Housing: { icon: '🏠', description: 'Rent and utilities' },
  Utilities: { icon: '💡', description: 'Bills and subscriptions' },
  Entertainment: { icon: '🎬', description: 'Movies and hobbies' },
  Health: { icon: '🏥', description: 'Medical and fitness' },
  Education: { icon: '📚', description: 'Learning and courses' },
  Shopping: { icon: '🛍️', description: 'Clothing and accessories' },
}

export const Budget: React.FC = () => {
  const [predictions, setPredictions] = useState<Predictions | null>(null)
  const [budgetItems, setBudgetItems] = useState<BudgetItem[]>([])
  const navigate = useNavigate()

  useEffect(() => {
    const stored = sessionStorage.getItem('predictions')
    if (!stored) {
      navigate('/upload')
      return
    }

    const preds: Predictions = JSON.parse(stored)
    setPredictions(preds)

    // Generate budget recommendations with human-friendly descriptions
    const items: BudgetItem[] = Object.entries(preds)
      .sort(([a], [b]) => a.localeCompare(b)) // Sort alphabetically
      .map(([category, predicted]) => {
        const buffer = predicted * 0.15 // 15% buffer
        const budget = predicted + buffer

        let status = 'Safe'
        let statusIcon = CheckCircle
        if (budget > predicted * 1.5) {
          status = 'At Risk'
          statusIcon = AlertCircle
        } else if (budget > predicted * 1.25) {
          status = 'Warning'
        }

        const humanDescription =
          predicted > 0
            ? `You're likely to spend around ₹${Math.round(predicted).toLocaleString()} on ${category.toLowerCase()} next month`
            : `No recent spending tracked in ${category.toLowerCase()}`

        const recommendation =
          predicted > 0
            ? `We recommend keeping your ${category} budget under ₹${Math.round(budget).toLocaleString()} to stay safe`
            : `Start tracking ${category.toLowerCase()} to get personalized recommendations`

        return {
          category,
          predicted: Math.round(predicted),
          budget: Math.round(budget),
          status,
          percentage: 100,
          humanDescription,
          recommendation,
        }
      })

    setBudgetItems(items)
  }, [navigate])

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Safe':
        return 'bg-green-100 text-green-800 border border-green-300'
      case 'Warning':
        return 'bg-yellow-100 text-yellow-800 border border-yellow-300'
      case 'At Risk':
        return 'bg-red-100 text-red-800 border border-red-300'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Safe':
        return <CheckCircle size={18} />
      case 'Warning':
        return <AlertCircle size={18} />
      case 'At Risk':
        return <AlertCircle size={18} />
      default:
        return <Info size={18} />
    }
  }

  const getTotalBudget = () => budgetItems.reduce((sum, item) => sum + item.budget, 0)
  const getTotalPredicted = () => budgetItems.reduce((sum, item) => sum + item.predicted, 0)
  const bufferAmount = getTotalBudget() - getTotalPredicted()

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 via-white to-indigo-50 pb-12">
      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Your Smart Budget</h1>
          <p className="text-lg text-gray-600">
            AI-generated recommendations based on your spending patterns. Stay informed, stay in control.
          </p>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-lg transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <p className="text-gray-600 font-medium">Expected Monthly Spending</p>
              <TrendingUp className="text-blue-600" size={24} />
            </div>
            <p className="text-3xl font-bold text-gray-900">₹{getTotalPredicted().toLocaleString()}</p>
            <p className="text-sm text-gray-500 mt-2">Based on your historical data</p>
          </div>

          <div className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-lg transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <p className="text-gray-600 font-medium">Recommended Monthly Budget</p>
              <TrendingUp className="text-indigo-600" size={24} />
            </div>
            <p className="text-3xl font-bold text-gray-900">₹{getTotalBudget().toLocaleString()}</p>
            <p className="text-sm text-gray-500 mt-2">15% buffer included for safety</p>
          </div>

          <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl border border-green-200 p-6 hover:shadow-lg transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <p className="text-green-700 font-medium">Safety Buffer</p>
              <CheckCircle className="text-green-600" size={24} />
            </div>
            <p className="text-3xl font-bold text-green-700">₹{bufferAmount.toLocaleString()}</p>
            <p className="text-sm text-green-600 mt-2">Emergency cushion for unexpected expenses</p>
          </div>
        </div>

        {/* Category-wise Budget Cards */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Category-wise Budget Breakdown</h2>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {budgetItems.map(item => (
              <div
                key={item.category}
                className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-lg transition-all duration-300 hover:border-blue-300"
              >
                {/* Header with Icon and Category */}
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <div className="flex items-center gap-3 mb-2">
                      <span className="text-3xl">{categoryInfo[item.category]?.icon || '💰'}</span>
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900">{item.category}</h3>
                        <p className="text-sm text-gray-500">{categoryInfo[item.category]?.description}</p>
                      </div>
                    </div>
                  </div>
                  <span
                    className={`flex items-center gap-1 px-3 py-1 rounded-full text-sm font-semibold ${getStatusColor(
                      item.status,
                    )}`}
                  >
                    {getStatusIcon(item.status)}
                    {item.status}
                  </span>
                </div>

                {/* Human-friendly description */}
                <p className="text-gray-700 mb-4 leading-relaxed">{item.humanDescription}</p>

                {/* Budget Bars */}
                <div className="space-y-3 mb-4">
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm font-medium text-gray-600">Expected Spending</span>
                      <span className="text-sm font-bold text-blue-600">₹{item.predicted.toLocaleString()}</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-blue-600 h-2 rounded-full transition-all duration-500"
                        style={{ width: '60%' }}
                      ></div>
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm font-medium text-gray-600">Recommended Budget Cap</span>
                      <span className="text-sm font-bold text-indigo-600">₹{item.budget.toLocaleString()}</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-indigo-600 h-2 rounded-full transition-all duration-500"
                        style={{ width: '100%' }}
                      ></div>
                    </div>
                  </div>
                </div>

                {/* Recommendation */}
                <div className="bg-blue-50 rounded-lg p-4 border border-blue-100">
                  <div className="flex gap-2">
                    <Info size={16} className="text-blue-600 flex-shrink-0 mt-0.5" />
                    <p className="text-sm text-blue-900">{item.recommendation}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Tips Section */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl p-8 text-white">
          <h3 className="text-xl font-bold mb-4">💡 Budget Tips</h3>
          <ul className="space-y-2 text-blue-50">
            <li>✓ Set category limits based on recommended budgets</li>
            <li>✓ Track actual spending against budget caps weekly</li>
            <li>✓ Use the safety buffer for emergencies only</li>
            <li>✓ Upload new transactions monthly to update predictions</li>
          </ul>
        </div>
      </main>
    </div>
  )
}
