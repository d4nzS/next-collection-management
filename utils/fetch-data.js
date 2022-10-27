async function fetchData(requestConfig) {
  const response = await fetch(requestConfig.url, {
    method: requestConfig.method || 'GET',
    body: JSON.stringify(requestConfig.body) || null,
    headers: { 'Content-Type': 'application/json' }
  });

  if (!response.ok) {
    const error = new Error((await response.json()).message || 'Unexpected Error');
    error.status = response.status;

    throw error;
  }

  return response.json();
}

export default fetchData;