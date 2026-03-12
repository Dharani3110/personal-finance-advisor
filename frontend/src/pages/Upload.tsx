import React, { useState, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { Upload as UploadIcon, X, Check, AlertCircle, File, Loader } from 'lucide-react'

interface Predictions {
  [key: string]: number
}

interface FileData {
  file: File
  id: string
  source?: string
}

// Payment app identifiers
const PAYMENT_APPS = {
  gpay: { name: 'Google Pay', icon: '📱' },
  phonpe: { name: 'PhonePe', icon: '📱' },
  paytm: { name: 'Paytm', icon: '📱' },
  upi: { name: 'UPI', icon: '💳' },
  bank: { name: 'Bank Export', icon: '🏦' },
}

export const Upload: React.FC = () => {
  const [files, setFiles] = useState<FileData[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [dragActive, setDragActive] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const navigate = useNavigate()

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true)
    } else if (e.type === 'dragleave') {
      setDragActive(false)
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)
    setError('')

    const droppedFiles = e.dataTransfer.files
    if (droppedFiles && droppedFiles.length > 0) {
      addFiles(Array.from(droppedFiles))
    }
  }

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = e.target.files
    if (selectedFiles && selectedFiles.length > 0) {
      addFiles(Array.from(selectedFiles))
    }
  }

  const addFiles = (newFiles: File[]) => {
    const validFiles = newFiles.filter(file => {
      if (!file.name.endsWith('.xlsx')) {
        setError(`${file.name} is not a valid Excel file`)
        return false
      }
      return true
    })

    if (validFiles.length === 0) return

    const fileDataArray: FileData[] = validFiles.map(file => ({
      file,
      id: Math.random().toString(36),
      source: detectSource(file.name),
    }))

    setFiles(prev => [...prev, ...fileDataArray])
    setSuccess(`${validFiles.length} file(s) added successfully`)
    setTimeout(() => setSuccess(''), 3000)
  }

  const detectSource = (filename: string): string => {
    const lower = filename.toLowerCase()
    if (lower.includes('gpay')) return 'gpay'
    if (lower.includes('phonpe')) return 'phonpe'
    if (lower.includes('paytm')) return 'paytm'
    if (lower.includes('upi')) return 'upi'
    if (lower.includes('bank')) return 'bank'
    return 'unknown'
  }

  const removeFile = (id: string) => {
    setFiles(prev => prev.filter(f => f.id !== id))
  }

  const handleUpload = async () => {
    if (files.length === 0) {
      setError('Please select at least one file')
      return
    }

    setLoading(true)
    setError('')
    setSuccess('')

    try {
      // Upload all files and merge predictions
      const allPredictions: Predictions = {}

      for (const fileData of files) {
        const formData = new FormData()
        formData.append('file', fileData.file)

        console.log(`Uploading file: ${fileData.file.name}`)
        const response = await fetch('http://localhost:5000/predict', {
          method: 'POST',
          body: formData,
        })

        const data = await response.json()

        if (!response.ok) {
          throw new Error(`${fileData.file.name}: ${data.error || 'Upload failed'}`)
        }

        // Merge predictions (sum up spending by category)
        if (data.predictions) {
          Object.entries(data.predictions).forEach(([category, amount]: [string, any]) => {
            allPredictions[category] = (allPredictions[category] || 0) + amount
          })
        }
      }

      console.log('All predictions merged:', allPredictions)

      // Store merged predictions
      sessionStorage.setItem('predictions', JSON.stringify(allPredictions))
      setSuccess(`Successfully analyzed ${files.length} file(s)!`)
      setTimeout(() => navigate('/budget'), 1500)
    } catch (err: any) {
      console.error('Error:', err)
      setError(err.message || 'Failed to process files. Make sure Flask API is running.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 via-white to-indigo-50 pb-12">
      <main className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Upload Transactions</h1>
          <p className="text-lg text-gray-600">
            Upload one or more Excel files from your payment apps (Google Pay, PhonePe, Paytm, etc.). We'll merge them and generate AI-powered budget recommendations.
          </p>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3">
            <AlertCircle className="text-red-600 flex-shrink-0 mt-0.5" size={20} />
            <div>
              <p className="font-semibold text-red-900">Error</p>
              <p className="text-red-800 text-sm">{error}</p>
            </div>
          </div>
        )}

        {/* Success Alert */}
        {success && (
          <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg flex items-start gap-3">
            <Check className="text-green-600 flex-shrink-0 mt-0.5" size={20} />
            <p className="text-green-800 font-medium">{success}</p>
          </div>
        )}

        {/* Drag & Drop Zone */}
        <div
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
          className={`mb-8 border-2 border-dashed rounded-xl p-12 text-center transition-all duration-300 ${
            dragActive
              ? 'border-blue-500 bg-blue-50 scale-105'
              : 'border-gray-300 hover:border-blue-300 bg-white'
          }`}
        >
          <UploadIcon size={48} className="mx-auto text-blue-600 mb-4" />
          <p className="text-lg font-semibold text-gray-900 mb-2">Drag & drop your files here</p>
          <p className="text-gray-600 mb-6">or click the button below</p>
          <button
            onClick={() => fileInputRef.current?.click()}
            className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-semibold"
          >
            <File size={20} />
            Choose Files
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept=".xlsx"
            multiple
            onChange={handleFileSelect}
            className="hidden"
          />
          <p className="text-xs text-gray-500 mt-4">Supported format: .xlsx (Excel files)</p>
        </div>

        {/* File List */}
        {files.length > 0 && (
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-gray-900">
                {files.length} {files.length === 1 ? 'File' : 'Files'} Selected
              </h2>
              {files.length > 0 && (
                <button
                  onClick={() => setFiles([])}
                  className="text-sm text-red-600 hover:text-red-700 font-medium"
                >
                  Clear All
                </button>
              )}
            </div>

            <div className="space-y-3">
              {files.map(fileData => {
                const source =
                  fileData.source && fileData.source !== 'unknown'
                    ? PAYMENT_APPS[fileData.source as keyof typeof PAYMENT_APPS]
                    : null

                return (
                  <div
                    key={fileData.id}
                    className="bg-white border border-gray-200 rounded-lg p-4 flex items-center justify-between hover:shadow-md transition-shadow"
                  >
                    <div className="flex items-center gap-4 flex-1">
                      <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                        <File className="text-blue-600" size={24} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-gray-900 truncate">{fileData.file.name}</p>
                        <p className="text-sm text-gray-500">
                          {(fileData.file.size / 1024).toFixed(2)} KB
                          {source && ` • From ${source.name}`}
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={() => removeFile(fileData.id)}
                      className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors flex-shrink-0"
                    >
                      <X size={20} />
                    </button>
                  </div>
                )
              })}
            </div>
          </div>
        )}

        {/* Info Box removed as requested */}

        {/* Upload Button */}
        <button
          onClick={handleUpload}
          disabled={files.length === 0 || loading}
          className="w-full flex items-center justify-center gap-2 px-8 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg font-semibold hover:shadow-lg disabled:bg-gray-400 disabled:cursor-not-allowed transition-all duration-300"
        >
          {loading ? (
            <>
              <Loader className="animate-spin" size={20} />
              Analyzing your transactions...
            </>
          ) : (
            <>
              <UploadIcon size={20} />
              Upload & Analyze {files.length > 0 ? `(${files.length})` : ''}
            </>
          )}
        </button>

        {/* Help Text */}
        <p className="text-center text-gray-500 text-sm mt-6">
          💡 Tip: You can upload files from multiple payment apps at once. We'll merge them for a complete picture of your spending!
        </p>
      </main>
    </div>
  )
}
