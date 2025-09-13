interface LoadingSpinnerProps {
  message?: string
}

export function LoadingSpinner({
  message = 'Processando...',
}: LoadingSpinnerProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl p-8 flex flex-col items-center space-y-4 max-w-sm mx-4">
        <div className="text-center">
          <h3 className="text-lg font-semibold text-gray-900 mb-1">
            {message}
          </h3>
          <p className="text-sm text-gray-600">
            Nossa IA está analisando seu TCC...
          </p>
        </div>
        <div className="flex space-x-1">
          <div className="w-2 h-2 bg-purple-600 rounded-full animate-bounce"></div>
          <div
            className="w-2 h-2 bg-purple-600 rounded-full animate-bounce"
            style={{ animationDelay: '0.1s' }}
          ></div>
          <div
            className="w-2 h-2 bg-purple-600 rounded-full animate-bounce"
            style={{ animationDelay: '0.2s' }}
          ></div>
        </div>
      </div>
    </div>
  )
}
