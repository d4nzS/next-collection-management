async function fetchData(requestConfig) {
  try {
    const response = await fetch(requestConfig.url, {
      method: requestConfig.method,
      body: JSON.stringify(requestConfig.body),
      headers: { 'Content-Type': 'application/json' }
    });

    if (!response.ok) {
      const error = await response.json();

      throw new Error(error.message || 'Unexpected error');
    }

    return await response.json();
  } catch (err) {
    alert(err.message);
  }
}

export default fetchData;