export async function requestStormPanelFulfillment(
  supabaseUrl: string,
  serviceKey: string,
  orderId: string,
): Promise<void> {
  const response = await fetch(`${supabaseUrl}/functions/v1/storm-panel-fulfill`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${serviceKey}`,
      apikey: serviceKey,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ orderId }),
    signal: AbortSignal.timeout(120_000),
  });

  if (!response.ok) {
    const detail = (await response.text()).slice(0, 300);
    throw new Error(`Storm Panel fulfillment failed (${response.status}): ${detail}`);
  }
}
