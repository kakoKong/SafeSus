'use client';

import { useMemo, useState } from 'react';
import Image from 'next/image';

type Step = {
  id: number;
  title: string;
  description: string;
  image: string;
  imageAlt: string;
};

interface SafetyIndexInteractiveProps {
  headlineClassName: string;
}

const STEPS: Step[] = [
  {
    id: 1,
    title: 'Define Your Bubble',
    description:
      'Set trusted contacts and safe zones. We only share location when you move outside your comfort area.',
    image: '/images/hero-traveler.png',
    imageAlt: 'Traveler using phone in urban environment',
  },
  {
    id: 2,
    title: 'Live Environmental Scan',
    description:
      'Safesus cross-references local news, police reports, and crowdsourced data to keep you informed.',
    image: '/images/hero-safegroup.png',
    imageAlt: 'Safety group and community monitoring',
  },
  {
    id: 3,
    title: 'One-Tap Reassurance',
    description:
      'If anything feels off, trigger an alert that sends location and a short audio clip to your SafeGroup.',
    image: '/images/safemap-real.png',
    imageAlt: 'Map intelligence and incident visualization',
  },
];

export default function SafetyIndexInteractive({ headlineClassName }: SafetyIndexInteractiveProps) {
  const [activeStep, setActiveStep] = useState(1);
  const active = useMemo(
    () => STEPS.find((step) => step.id === activeStep) ?? STEPS[0],
    [activeStep]
  );

  return (
    <section id="safety-index" className="bg-[#f7f2f8] py-24">
      <div className="mx-auto w-full max-w-7xl px-6">
        <div className="grid grid-cols-1 items-center gap-20 lg:grid-cols-2">
          <div className="order-2 space-y-12 lg:order-1">
            {STEPS.map((step) => {
              const isActive = activeStep === step.id;
              return (
                <button
                  key={step.id}
                  type="button"
                  onClick={() => setActiveStep(step.id)}
                  className="flex w-full gap-6 text-left"
                >
                  <div
                    className={`flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full text-xl font-bold ${
                      isActive
                        ? 'bg-gradient-to-br from-[#00327d] to-[#0047ab] text-white'
                        : 'bg-[#e5e1e7] text-[#00327d]'
                    }`}
                  >
                    {step.id}
                  </div>
                  <div>
                    <h4 className={`${headlineClassName} mb-2 text-lg font-bold text-[#00327d] sm:text-xl`}>
                      {step.title}
                    </h4>
                    <p className="text-[#434653]">{step.description}</p>
                  </div>
                </button>
              );
            })}
          </div>

          <div className="order-1 mx-auto w-[76%] max-w-[300px] sm:w-[68%] sm:max-w-[360px] lg:order-2 lg:w-full lg:max-w-none">
            <div className="rounded-[3rem] bg-white p-2 shadow-xl">
              <div className="relative aspect-[4/5] w-full overflow-hidden rounded-[2.5rem]">
                {STEPS.map((step) => {
                  const isActive = step.id === active.id;
                  return (
                    <Image
                      key={step.id}
                      src={step.image}
                      alt={step.imageAlt}
                      fill
                      sizes="(max-width: 1024px) 100vw, 50vw"
                      className={`object-cover transition-all duration-500 ease-out ${
                        isActive ? 'scale-100 opacity-100' : 'scale-105 opacity-0'
                      }`}
                      priority={step.id === 1}
                    />
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

