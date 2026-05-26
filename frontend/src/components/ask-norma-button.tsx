import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';

function NormaIconWhite({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 32 32" fill="none" className={className}>
      <path d="M16 16C16 16 6 14 4 6c0 0 8-2 12 10z" fill="currentColor" />
      <path d="M16 16C16 16 18 6 28 4c0 0 2 8-12 12z" fill="currentColor" />
      <path d="M16 16C16 16 26 18 28 26c0 0-8 2-12-10z" fill="currentColor" />
      <path d="M16 16C16 16 14 26 4 28c0 0-2-8 12-12z" fill="currentColor" />
    </svg>
  );
}

export function AskNormaButton({ question }: { question: string }) {
  const { t } = useTranslation('common');
  const navigate = useNavigate();

  return (
    <Button
      size="sm"
      className="cursor-pointer bg-gradient-to-r from-indigo-500 to-cyan-500 text-white hover:from-indigo-600 hover:to-cyan-600"
      onClick={() => navigate('/chat?q=' + encodeURIComponent(question))}
    >
      <NormaIconWhite className="mr-1 size-4" />
      {t('buttons.askNorma')}
    </Button>
  );
}
