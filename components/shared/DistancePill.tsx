import { formatDistance } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';

interface DistancePillProps {
  meters: number;
  className?: string;
}

export default function DistancePill({ meters, className = '' }: DistancePillProps) {
  return (
    <Badge variant="secondary" className={className}>
      {formatDistance(meters)} away
    </Badge>
  );
}

