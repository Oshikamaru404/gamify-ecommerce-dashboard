UPDATE public.orders 
SET payment_status='paid', status='processing', updated_at=now() 
WHERE id='5dd5ad67-b511-4544-9a3f-6f46020b825b';