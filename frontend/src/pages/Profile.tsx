import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { auth } from '../lib/firebase'
import { updateProfile } from 'firebase/auth'
import { User, Edit2, Save, X, Check, AlertCircle, Mail, Shield } from 'lucide-react'

export const Profile: React.FC = () => {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const [isEditing, setIsEditing] = useState(false)
  const [displayName, setDisplayName] = useState(user?.displayName || '')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)

  useEffect(() => {
    setDisplayName(user?.displayName || '')
  }, [user])

  const handleSaveProfile = async () => {
    if (!displayName.trim()) {
      setMessage({ type: 'error', text: 'Name cannot be empty' })
      return
    }

    setLoading(true)
    try {
      if (auth.currentUser) {
        await updateProfile(auth.currentUser, {
          displayName: displayName.trim(),
        })
        setMessage({ type: 'success', text: 'Profile updated successfully!' })
        setIsEditing(false)
      }
    } catch (err: any) {
      setMessage({ type: 'error', text: err.message || 'Failed to update profile' })
    } finally {
      setLoading(false)
    }
  }

  const handleLogout = async () => {
    await logout()
    navigate('/')
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 via-white to-indigo-50 pb-12">
      <main className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Your Profile</h1>
          <p className="text-lg text-gray-600">Manage your account information and preferences</p>
        </div>

        {/* Status Messages */}
        {message && (
          <div
            className={`mb-6 p-4 rounded-lg flex items-gap-3 border ${
              message.type === 'success'
                ? 'bg-green-50 border-green-200 text-green-800'
                : 'bg-red-50 border-red-200 text-red-800'
            }`}
          >
            {message.type === 'success' ? (
              <Check size={20} className="flex-shrink-0 mr-3" />
            ) : (
              <AlertCircle size={20} className="flex-shrink-0 mr-3" />
            )}
            <p className="font-medium">{message.text}</p>
          </div>
        )}

        {/* Profile Card */}
        <div className="bg-white rounded-xl border border-gray-200 p-8 mb-6 hover:shadow-lg transition-shadow">
          <div className="flex items-start justify-between mb-8">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center">
                <User size={32} className="text-white" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-900">{displayName || 'User'}</h2>
                <p className="text-gray-500">{user?.email}</p>
              </div>
            </div>
            {!isEditing && (
              <button
                onClick={() => setIsEditing(true)}
                className="flex items-center gap-2 px-4 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors font-medium"
              >
                <Edit2 size={18} />
                Edit Profile
              </button>
            )}
          </div>

          {/* Edit Form */}
          {isEditing && (
            <div className="space-y-6 mb-6 p-6 bg-gray-50 rounded-xl">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-3">Display Name</label>
                <input
                  type="text"
                  value={displayName}
                  onChange={e => setDisplayName(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter your name"
                />
              </div>

              <div className="flex gap-3">
                <button
                  onClick={handleSaveProfile}
                  disabled={loading}
                  className="flex items-center gap-2 px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:bg-gray-400 transition-colors font-semibold"
                >
                  <Save size={18} />
                  {loading ? 'Saving...' : 'Save Changes'}
                </button>
                <button
                  onClick={() => {
                    setIsEditing(false)
                    setDisplayName(user?.displayName || '')
                    setMessage(null)
                  }}
                  disabled={loading}
                  className="flex items-center gap-2 px-6 py-3 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 disabled:bg-gray-200 transition-colors font-semibold"
                >
                  <X size={18} />
                  Cancel
                </button>
              </div>
            </div>
          )}

          {/* Profile Information */}
          {!isEditing && (
            <div className="space-y-4">
              <div className="pb-4 border-b border-gray-200">
                <label className="block text-sm font-semibold text-gray-600 mb-2">Email Address</label>
                <div className="flex items-center gap-2">
                  <Mail size={18} className="text-gray-500" />
                  <p className="text-gray-900">{user?.email}</p>
                </div>
              </div>

              <div className="pb-4 border-b border-gray-200">
                <label className="block text-sm font-semibold text-gray-600 mb-2">Account Type</label>
                <div className="flex items-center gap-2">
                  <Shield size={18} className="text-gray-500" />
                  <p className="text-gray-900">
                    {user?.providerData && user.providerData.length > 0
                      ? user.providerData[0].providerId === 'google.com'
                        ? 'Google Sign-In'
                        : user.providerData[0].providerId === 'password'
                        ? 'Email & Password'
                        : user.providerData[0].providerId
                      : 'Unknown'}
                  </p>
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-600 mb-2">User ID</label>
                <p className="text-gray-900 text-sm break-all font-mono bg-gray-50 p-3 rounded-lg">{user?.uid}</p>
              </div>
            </div>
          )}
        </div>

        {/* Account Stats */}
        <div className="grid grid-cols-2 gap-6 mb-6">
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <p className="text-gray-600 text-sm font-medium mb-2">Account Created</p>
            <p className="text-lg font-semibold text-gray-900">
              {user?.metadata?.creationTime
                ? new Date(user.metadata.creationTime).toLocaleDateString()
                : 'N/A'}
            </p>
          </div>
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <p className="text-gray-600 text-sm font-medium mb-2">Last Sign In</p>
            <p className="text-lg font-semibold text-gray-900">
              {user?.metadata?.lastSignInTime
                ? new Date(user.metadata.lastSignInTime).toLocaleDateString()
                : 'N/A'}
            </p>
          </div>
        </div>

        {/* Logout only (Danger Zone removed) */}
        <div className="mb-6">
          <button
            onClick={handleLogout}
            className="w-full px-6 py-3 bg-red-600 text-white rounded-lg font-semibold hover:bg-red-700 transition-colors"
          >
            Logout
          </button>
        </div>
      </main>
    </div>
  )
}
