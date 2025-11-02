'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { MapPin, Users, Heart, Backpack, Baby, Briefcase, ArrowRight } from 'lucide-react';

const TRIP_TYPES = [
  { id: 'solo', label: 'Solo', icon: Backpack, color: 'bg-orange-500' },
  { id: 'family', label: 'Family', icon: Baby, color: 'bg-blue-500' },
  { id: 'couple', label: 'Couple', icon: Heart, color: 'bg-pink-500' },
];

const CITIES = [
  { slug: 'bangkok', name: 'Bangkok', country: 'Thailand' },
  // Add more as they become available
];

export default function TripPlanner() {
  const router = useRouter();
  const [selectedCity, setSelectedCity] = useState('');
  const [selectedTripType, setSelectedTripType] = useState('');
  const [showCityDropdown, setShowCityDropdown] = useState(false);

  const handleStartPlanning = () => {
    if (!selectedCity) {
      // If no city selected, go to cities list
      router.push('/cities');
      return;
    }

    const url = selectedTripType 
      ? `/city/${selectedCity}?tripType=${selectedTripType}`
      : `/city/${selectedCity}`;
    
    router.push(url);
  };

  return (
    <Card className="relative overflow-hidden bg-white dark:bg-slate-900 border-2 shadow-2xl">
      {/* Decorative accent */}
      <div className="absolute top-0 left-0 right-0 h-2 bg-primary" />
      
      <div className="p-8 space-y-6">
        <div>
          <h2 className="text-2xl font-bold mb-2">Explore Safety by Trip Type</h2>
          <p className="text-muted-foreground">Get personalized safety insights for your travel style</p>
        </div>

        {/* Where are you going? */}
        <div className="space-y-2">
          <label className="text-sm font-semibold flex items-center gap-2">
            <MapPin className="h-4 w-4 text-primary" />
            Where are you going?
          </label>
          <div className="relative">
            <Input
              type="text"
              placeholder="Search destination..."
              className="h-14 text-lg"
              value={selectedCity ? CITIES.find(c => c.slug === selectedCity)?.name : ''}
              onFocus={() => setShowCityDropdown(true)}
              onBlur={() => setTimeout(() => setShowCityDropdown(false), 200)}
              onChange={(e) => {
                if (!e.target.value) setSelectedCity('');
              }}
            />
            {showCityDropdown && (
              <div className="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-slate-900 border-2 rounded-xl shadow-xl z-50 max-h-60 overflow-y-auto">
                {CITIES.map((city) => (
                  <button
                    key={city.slug}
                    className="w-full text-left px-4 py-3 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors border-b last:border-0"
                    onClick={() => {
                      setSelectedCity(city.slug);
                      setShowCityDropdown(false);
                    }}
                  >
                    <div className="font-semibold">{city.name}</div>
                    <div className="text-xs text-muted-foreground">{city.country}</div>
                  </button>
                ))}
                <button
                  className="w-full text-left px-4 py-3 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors text-primary font-semibold"
                  onClick={() => {
                    router.push('/cities');
                    setShowCityDropdown(false);
                  }}
                >
                  Browse all cities →
                </button>
              </div>
            )}
          </div>
        </div>

        {/* What type of trip? */}
        <div className="space-y-3">
          <label className="text-sm font-semibold">What type of trip?</label>
          <div className="grid grid-cols-3 gap-3">
            {TRIP_TYPES.map((tripType) => {
              const Icon = tripType.icon;
              const isSelected = selectedTripType === tripType.id;
              
              return (
                <button
                  key={tripType.id}
                  onClick={() => setSelectedTripType(isSelected ? '' : tripType.id)}
                  className={`
                    relative group p-4 rounded-2xl border-2 transition-all
                    ${isSelected 
                      ? 'border-primary bg-primary/5 shadow-lg scale-105' 
                      : 'border-slate-200 dark:border-slate-700 hover:border-primary/50 hover:scale-105'
                    }
                  `}
                >
                  <div className={`
                    w-12 h-12 rounded-xl ${tripType.color} 
                    flex items-center justify-center mb-2 mx-auto
                    ${isSelected ? 'shadow-lg' : 'opacity-80 group-hover:opacity-100'}
                  `}>
                    <Icon className="h-6 w-6 text-white" />
                  </div>
                  <div className="text-sm font-semibold text-center">{tripType.label}</div>
                  {isSelected && (
                    <div className="absolute top-2 right-2 w-5 h-5 bg-primary rounded-full flex items-center justify-center">
                      <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* CTA Button */}
        <Button 
          size="lg" 
          className="w-full h-14 text-lg font-bold rounded-xl bg-primary hover:bg-primary/90 hover:shadow-xl transition-all group"
          onClick={handleStartPlanning}
        >
          Explore Safety Now
          <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
        </Button>

        {selectedTripType && (
          <p className="text-xs text-center text-muted-foreground">
            ✨ Get {TRIP_TYPES.find(t => t.id === selectedTripType)?.label.toLowerCase()}-specific safety tips
          </p>
        )}
      </div>
    </Card>
  );
}

