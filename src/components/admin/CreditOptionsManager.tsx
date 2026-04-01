import React from 'react';
import InlineCreditOptionsManager from './InlineCreditOptionsManager';
import { useSubscriptionCreditOptions, useCreateSubscriptionCreditOption, useUpdateSubscriptionCreditOption, useDeleteSubscriptionCreditOption } from '@/hooks/useSubscriptionCreditOptions';

interface CreditOptionsManagerProps {
  packageId: string;
  packageName: string;
}

const CreditOptionsManager: React.FC<CreditOptionsManagerProps> = ({ packageId, packageName }) => {
  const { data: creditOptions, isLoading } = useSubscriptionCreditOptions(packageId);
  const createOption = useCreateSubscriptionCreditOption();
  const updateOption = useUpdateSubscriptionCreditOption();
  const deleteOption = useDeleteSubscriptionCreditOption();

  const handleSave = async (option: any) => {
    const data = {
      package_id: packageId,
      credits: option.credits,
      months: option.months ?? 1,
      price: option.price,
      sort_order: option.sort_order ?? 0,
    };
    if (option.id) {
      await updateOption.mutateAsync({ id: option.id, ...data });
    } else {
      await createOption.mutateAsync(data);
    }
  };

  const handleDelete = async (id: string) => {
    await deleteOption.mutateAsync(id);
  };

  return (
    <InlineCreditOptionsManager
      options={creditOptions}
      isLoading={isLoading}
      showMonths={true}
      onSave={handleSave}
      onDelete={handleDelete}
      label={`Credit Options — ${packageName}`}
    />
  );
};

export default CreditOptionsManager;
