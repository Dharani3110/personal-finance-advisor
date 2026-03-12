import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { Menu, X, LogOut, Home, Upload, Wallet, User } from 'lucide-react'

export const Navbar: React.FC = () => {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const [isOpen, setIsOpen] = useState(false)

  const handleLogout = async () => {
    await logout()
    navigate('/')
  }

  const navItems = [
    { label: 'Home', path: '/', icon: Home },
    { label: 'Upload', path: '/upload', icon: Upload },
    { label: 'Dashboard', path: '/budget', icon: Wallet },
    { label: 'Profile', path: '/profile', icon: User },
  ]

  return (
    <nav className="fixed top-0 left-0 right-0 bg-white shadow-sm border-b border-gray-100 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div
            onClick={() => navigate('/')}
            className="flex items-center gap-2 cursor-pointer group"
          >
            <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold">₹</span>
            </div>
            <span className="text-lg font-bold text-gray-900 group-hover:text-blue-600 transition-colors">
              AI Finance
            </span>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-1">
            {user &&
              navItems.map(({ label, path, icon: Icon }) => (
                <button
                  key={path}
                  onClick={() => navigate(path)}
                  className="flex items-center gap-2 px-4 py-2 text-gray-700 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all duration-200 text-sm font-medium"
                >
                  <Icon size={18} />
                  {label}
                </button>
              ))}
          </div>

          {/* Right Section */}
          <div className="flex items-center gap-4">
            {user ? (
              <>
                <div className="hidden sm:flex items-center gap-2 text-sm text-gray-600">
                  <span className="truncate">{user.email}</span>
                </div>
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-2 px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-all duration-200 font-medium text-sm"
                >
                  <LogOut size={18} />
                  <span className="hidden sm:inline">Logout</span>
                </button>
              </>
            ) : (
              <button
                onClick={() => navigate('/login')}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium text-sm"
              >
                Login
              </button>
            )}

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="md:hidden p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isOpen && user && (
          <div className="md:hidden pb-4 border-t border-gray-100 space-y-2">
            {navItems.map(({ label, path, icon: Icon }) => (
              <button
                key={path}
                onClick={() => {
                  navigate(path)
                  setIsOpen(false)
                }}
                className="w-full flex items-center gap-3 px-4 py-3 text-gray-700 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all duration-200 text-sm font-medium"
              >
                <Icon size={18} />
                {label}
              </button>
            ))}
          </div>
        )}
      </div>
    </nav>
  )
}
