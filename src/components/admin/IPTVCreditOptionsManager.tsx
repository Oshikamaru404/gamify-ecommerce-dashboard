import React from 'react';
import InlineCreditOptionsManager from './InlineCreditOptionsManager';
import { useIPTVCreditOptions, useCreateIPTVCreditOption, useUpdateIPTVCreditOption, useDeleteIPTVCreditOption } from '@/hooks/useIPTVCreditOptions';

interface IPTVCreditOptionsManagerProps {
  packageId: string;
  packageName: string;
}

const IPTVCreditOptionsManager: React.FC<IPTVCreditOptionsManagerProps> = ({ packageId, packageName }) => {
  const { data: creditOptions, isLoading } = useIPTVCreditOptions(packageId);
  const createOption = useCreateIPTVCreditOption();
  const updateOption = useUpdateIPTVCreditOption();
  const deleteOption = useDeleteIPTVCreditOption();

  const handleSave = async (option: any) => {
    const data = {
      package_id: packageId,
      credits: option.credits,
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
      showMonths={false}
      onSave={handleSave}
      onDelete={handleDelete}
      label={`Credit Options — ${packageName}`}
    />
  );
};

export default IPTVCreditOptionsManager;
