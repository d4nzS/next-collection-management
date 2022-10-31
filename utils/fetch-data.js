async function fetchData(requestConfig, hasFile = false) {
  const response = await fetch(requestConfig.url, {
    method: requestConfig.method || 'GET',
    body: (hasFile ? requestConfig.body : JSON.stringify(requestConfig.body)) || null,
    ...(!hasFile && { headers: { 'Content-Type': 'application/json' } }),
  });

  if (!response.ok) {
    const error = new Error((await response.json()).message || 'Unexpected Error');
    error.status = response.status;

    throw error;
  }

  return response.json();
}

export default fetchData;