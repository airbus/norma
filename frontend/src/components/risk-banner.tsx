import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import {
  AlertTriangle,
  Ban,
  Info,
  Loader2,
  MessageSquare,
  RefreshCw,
  ShieldAlert,
} from 'lucide-react';

const RISK_CONFIG: Record<string, { icon: typeof Ban; className: string }> = {
  unacceptable: {
    icon: Ban,
    className: 'border-destructive/30 bg-destructive/10 text-destructive',
  },
  high: {
    icon: ShieldAlert,
    className: 'border-orange-500/30 bg-orange-500/10 text-orange-700 dark:text-orange-400',
  },
  limited: {
    icon: AlertTriangle,
    className: 'border-yellow-500/30 bg-yellow-500/10 text-yellow-700 dark:text-yellow-400',
  },
  minimal: {
    icon: Info,
    className: 'border-primary/30 bg-primary/10 text-primary',
  },
};

interface RiskBannerProps {
  riskClassification: string;
  description: string;
  chatMessage: string;
  evaluating?: boolean;
  onReEvaluate?: () => void;
}

export function RiskBanner({
  riskClassification,
  description,
  chatMessage,
  evaluating,
  onReEvaluate,
}: RiskBannerProps) {
  const { t } = useTranslation(['components', 'common']);
  const navigate = useNavigate();
  const config = RISK_CONFIG[riskClassification];
  if (!config) return null;

  const Icon = evaluating ? Loader2 : config.icon;

  return (
    <div className={`mb-6 flex items-center gap-3 rounded-lg border px-4 py-3 ${config.className}`}>
      <Icon className={`size-5 shrink-0 ${evaluating ? 'animate-spin' : ''}`} />
      <div className="flex-1">
        <p className="text-sm font-semibold">
          {evaluating ? t('common:loading.evaluatingRisk') : t(`common:risk.${riskClassification}`)}
        </p>
        <p className="text-xs opacity-80">{description}</p>
      </div>
      <div className="flex items-center gap-2">
        {onReEvaluate && (
          <div
            className="flex cursor-pointer items-center gap-1.5 rounded-md border border-current/30 px-2.5 py-1.5 hover:bg-current/5"
            onClick={onReEvaluate}
          >
            <RefreshCw className={`size-4 ${evaluating ? 'animate-spin' : ''}`} />
            <span className="text-xs font-medium">{t('common:buttons.reEvaluate')}</span>
          </div>
        )}
        <div
          className="flex cursor-pointer items-center gap-1.5 rounded-md border border-current/30 px-2.5 py-1.5 hover:bg-current/5"
          onClick={() => navigate(`/chat?q=${encodeURIComponent(chatMessage)}`)}
        >
          <MessageSquare className="size-4" />
          <span className="text-xs font-medium">{t('common:buttons.askNorma')}</span>
        </div>
      </div>
    </div>
  );
}
