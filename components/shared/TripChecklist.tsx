'use client';

import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { CheckCircle2, Circle } from 'lucide-react';

interface ChecklistItem {
  id: string;
  label: string;
  completed: boolean;
}

interface TripChecklistProps {
  cityName?: string;
}

export default function TripChecklist({ cityName = 'Bangkok' }: TripChecklistProps) {
  const [items, setItems] = useState<ChecklistItem[]>([
    { id: '1', label: `Read top scam alerts in ${cityName}`, completed: false },
    { id: '2', label: 'Review safe zones and areas to avoid', completed: false },
    { id: '3', label: 'Save emergency contact numbers', completed: false },
    { id: '4', label: 'Learn about local taxi/transport scams', completed: false },
    { id: '5', label: 'Check cultural etiquette tips', completed: false },
  ]);

  // Load from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem(`checklist-${cityName}`);
    if (saved) {
      try {
        setItems(JSON.parse(saved));
      } catch (e) {
        console.error('Failed to load checklist');
      }
    }
  }, [cityName]);

  // Save to localStorage when items change
  useEffect(() => {
    localStorage.setItem(`checklist-${cityName}`, JSON.stringify(items));
  }, [items, cityName]);

  const toggleItem = (id: string) => {
    setItems(items.map(item => 
      item.id === id ? { ...item, completed: !item.completed } : item
    ));
  };

  const resetChecklist = () => {
    setItems(items.map(item => ({ ...item, completed: false })));
  };

  const completedCount = items.filter(item => item.completed).length;
  const progress = (completedCount / items.length) * 100;

  return (
    <Card className="p-6">
      <div className="mb-4">
        <div className="flex items-center justify-between mb-2">
          <h3 className="font-bold">Trip Safety Checklist</h3>
          <span className="text-sm text-muted-foreground">
            {completedCount}/{items.length}
          </span>
        </div>
        <div className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
          <div 
            className="h-full bg-primary transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      <div className="space-y-3 mb-4">
        {items.map((item) => (
          <div
            key={item.id}
            className="flex items-start gap-3 p-3 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-900 transition-colors cursor-pointer"
            onClick={() => toggleItem(item.id)}
          >
            <div className="pt-0.5">
              {item.completed ? (
                <CheckCircle2 className="h-5 w-5 text-primary" />
              ) : (
                <Circle className="h-5 w-5 text-muted-foreground" />
              )}
            </div>
            <label
              className={`flex-1 text-sm cursor-pointer ${
                item.completed 
                  ? 'line-through text-muted-foreground' 
                  : 'text-foreground'
              }`}
            >
              {item.label}
            </label>
          </div>
        ))}
      </div>

      {completedCount === items.length && (
        <div className="p-4 bg-green-50 dark:bg-green-950/20 border border-green-200 dark:border-green-900 rounded-lg mb-4">
          <p className="text-sm text-green-700 dark:text-green-400 font-semibold text-center">
            🎉 You're all set! Have a safe trip to {cityName}!
          </p>
        </div>
      )}

      <Button
        variant="ghost"
        size="sm"
        onClick={resetChecklist}
        className="w-full text-xs"
      >
        Reset Checklist
      </Button>
    </Card>
  );
}

