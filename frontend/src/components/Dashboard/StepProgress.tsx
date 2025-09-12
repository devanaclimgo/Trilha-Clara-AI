'use client'

import { ArrowRight } from 'lucide-react'

interface StepProgressProps {
  currentStep: number
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  steps: Array<{ id: number; title: string; icon: any }>
}

export default function StepProgress({
  currentStep,
  steps,
}: StepProgressProps) {
  return (
    <div className="flex justify-center mb-8">
      <div className="flex items-center gap-4 bg-slate-50/80 backdrop-blur-sm rounded-2xl p-4 shadow-lg border border-slate-200/20">
        {steps.map((step, index) => (
          <div key={step.id} className="flex items-center">
            <div
              className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-all duration-300 ${
                currentStep === step.id
                  ? 'gradient-bg text-white shadow-lg'
                  : currentStep > step.id
                  ? 'bg-green-100 text-green-700'
                  : 'bg-gray-100 text-gray-500'
              }`}
            >
              <step.icon className="h-4 w-4" />
              <span className="text-sm font-medium hidden sm:block">
                {step.title}
              </span>
            </div>
            {index < steps.length - 1 && (
              <ArrowRight className="h-4 w-4 text-gray-400 mx-2" />
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
