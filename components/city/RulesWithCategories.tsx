'use client';

import { useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { CheckCircle, XCircle } from 'lucide-react';
import type { Rule } from '@/types';
import { getCategoryInfo, type TipCategory } from '@/lib/tip-categories';

interface RulesWithCategoriesProps {
  dos: Rule[];
  donts: Rule[];
  INITIAL_SHOW_COUNT?: number;
}

export default function RulesWithCategories({ 
  dos, 
  donts, 
  INITIAL_SHOW_COUNT = 3 
}: RulesWithCategoriesProps) {
  const [showAllDos, setShowAllDos] = useState(false);
  const [showAllDonts, setShowAllDonts] = useState(false);

  const renderRules = (rules: Rule[], color: 'green' | 'red', icon: typeof CheckCircle, showAll: boolean, setShowAll: (val: boolean) => void) => {
    const colorClasses = color === 'green' 
      ? {
          bg: 'bg-green-50 dark:bg-green-950/20',
          border: 'border-green-200 dark:border-green-900',
          text: 'text-green-700 dark:text-green-300',
          textBold: 'text-green-900 dark:text-green-100',
          dot: 'bg-green-500'
        }
      : {
          bg: 'bg-red-50 dark:bg-red-950/20',
          border: 'border-red-200 dark:border-red-900',
          text: 'text-red-700 dark:text-red-300',
          textBold: 'text-red-900 dark:text-red-100',
          dot: 'bg-red-500'
        };

    const Icon = icon;
    const displayRules = showAll ? rules : rules.slice(0, INITIAL_SHOW_COUNT);

    return (
      <div className={`p-4 ${colorClasses.bg} border-2 ${colorClasses.border} rounded-xl`}>
        <h3 className={`font-bold mb-3 flex items-center gap-2 ${colorClasses.text}`}>
          <Icon className="h-5 w-5" />
          {color === 'green' ? `Things to Do (${rules.length})` : `Things to Avoid (${rules.length})`}
        </h3>
        <ul className="space-y-3">
          {displayRules.map((rule) => {
            const categoryInfo = rule.tip_category ? getCategoryInfo(rule.tip_category as TipCategory) : null;
            const CategoryIcon = categoryInfo?.icon;

            return (
              <li key={rule.id} className="flex gap-3">
                <div className={`w-2 h-2 rounded-full ${colorClasses.dot} mt-2 flex-shrink-0`} />
                <div className="flex-1">
                  <div className="flex items-start gap-2 mb-1">
                    <strong className={colorClasses.textBold}>{rule.title}</strong>
                    {categoryInfo && (
                      <Badge variant="secondary" className="text-xs flex items-center gap-1">
                        {CategoryIcon && <CategoryIcon className="h-3 w-3" />}
                        {categoryInfo.label}
                      </Badge>
                    )}
                  </div>
                  <p className={`text-sm ${colorClasses.text} mt-0.5`}>{rule.reason}</p>
                </div>
              </li>
            );
          })}
        </ul>
        {rules.length > INITIAL_SHOW_COUNT && (
          <Button 
            variant="ghost" 
            size="sm" 
            className="w-full mt-3"
            onClick={() => setShowAll(!showAll)}
          >
            {showAll ? 'Show Less' : `Show ${rules.length - INITIAL_SHOW_COUNT} More`}
          </Button>
        )}
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {dos.length > 0 && renderRules(dos, 'green', CheckCircle, showAllDos, setShowAllDos)}
      {donts.length > 0 && renderRules(donts, 'red', XCircle, showAllDonts, setShowAllDonts)}
    </div>
  );
}

