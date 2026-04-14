import React from 'react'

export default function LoadingSpinner({ fullScreen = false, size = 'md', text = '' }) {
  const sizes = { sm: 'w-5 h-5', md: 'w-8 h-8', lg: 'w-12 h-12' }

  const spinner = (
    <div className="flex flex-col items-center justify-center gap-3">
      <div className={`${sizes[size]} relative`}>
        <div className={`${sizes[size]} rounded-full border-2 border-gray-200 dark:border-dark-border`} />
        <div className={`${sizes[size]} rounded-full border-2 border-primary-500 border-t-transparent animate-spin absolute top-0 left-0`} />
      </div>
      {text && <p className="text-sm text-gray-500 dark:text-gray-400 animate-pulse">{text}</p>}
    </div>
  )

  if (fullScreen) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-white dark:bg-dark-bg z-50">
        <div className="flex flex-col items-center gap-4">
          <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-primary-600 rounded-xl flex items-center justify-center animate-float shadow-glow">
            <span className="text-white font-bold">SW</span>
          </div>
          {spinner}
        </div>
      </div>
    )
  }

  return spinner
}
