'use client';
import { useToast } from '@/hooks/use-toast';
import { useTransition } from 'react';
import { useTranslation } from 'react-i18next';
import { approveStore } from '../../../../actions/admin/approve-store';
import { DropdownMenuItem } from '@/components/ui/dropdown-menu';
import { TicketCheck, TicketX } from 'lucide-react';

interface ApproveActionsProps {
  id: string;
}

export const ApproveActions = ({ id }: ApproveActionsProps) => {
  const { t } = useTranslation();
  const { toast } = useToast();
  const [isPending, startTransition] = useTransition();

  const handleApproveStore = (approve: boolean) => {
    startTransition(() => {
      approveStore(id, approve).then((res) => {
        if (res.error) {
          toast({
            title: t('error'),
            description: t(res.error),
            variant: 'destructive',
          });
        } else if (res.success) {
          toast({
            title: t('success'),
            description: t(res.success || 'approved'),
          });
        } else {
          toast({
            title: t('success'),
            description: t(res.success || 'disapproved'),
          });
        }
      });
    });
  };

  return (
    <>
      <DropdownMenuItem
        disabled={isPending}
        className='flex items-center gap-2'
        onClick={() => {
          handleApproveStore(true);
        }}
      >
        <TicketCheck height={16} width={16} />
        {t('approve')}
      </DropdownMenuItem>
      <DropdownMenuItem
        disabled={isPending}
        className='flex items-center gap-2'
        onClick={() => {
          handleApproveStore(false);
        }}
      >
        <TicketX height={16} width={16} />
        {t('disapprove')}
      </DropdownMenuItem>
    </>
  );
};
