'use client'

import { CheckCircle } from 'lucide-react'

interface ProgressOverviewProps {
  currentStep: number
  steps: Array<{ id: number; title: string; icon: any }>
  getProgressPercentage: () => number
}

export default function ProgressOverview({
  currentStep,
  steps,
  getProgressPercentage,
}: ProgressOverviewProps) {
  return (
    <div className="bg-slate-50/80 backdrop-blur-sm rounded-2xl p-8 shadow-lg border border-slate-200/20">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold gradient-text">Progresso do TCC</h2>
        <div className="text-right">
          <div className="text-3xl font-bold gradient-text">
            {getProgressPercentage()}%
          </div>
          <div className="text-sm text-gray-600">Concluído</div>
        </div>
      </div>
      <div className="w-full bg-gray-200 rounded-full h-4 mb-6">
        <div
          className="gradient-bg h-4 rounded-full transition-all duration-500"
          style={{ width: `${getProgressPercentage()}%` }}
        ></div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        {steps.map((step) => (
          <div
            key={step.id}
            className={`flex flex-col items-center p-4 rounded-xl transition-all ${
              currentStep > step.id
                ? 'bg-green-50 border border-green-200'
                : currentStep === step.id
                ? 'bg-gradient-to-r from-purple-50 to-blue-50 border border-purple-200'
                : 'bg-gray-50 border border-gray-200'
            }`}
          >
            <step.icon
              className={`h-6 w-6 mb-2 ${
                currentStep > step.id
                  ? 'text-green-600'
                  : currentStep === step.id
                  ? 'text-purple-600'
                  : 'text-gray-400'
              }`}
            />
            <span
              className={`text-sm font-medium text-center ${
                currentStep > step.id
                  ? 'text-green-700'
                  : currentStep === step.id
                  ? 'text-purple-700'
                  : 'text-gray-500'
              }`}
            >
              {step.title}
            </span>
            {currentStep > step.id && (
              <CheckCircle className="h-4 w-4 text-green-600 mt-1" />
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
