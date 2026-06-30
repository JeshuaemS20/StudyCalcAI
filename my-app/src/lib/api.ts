const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:5000';

export async function saveCalculationToBackend(expression: string, result: string) {
  try {
    const response = await fetch(`${API_BASE_URL}/api/calculations`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ expression, result }),
    });

    if (!response.ok) {
      throw new Error(`Request failed with status ${response.status}`);
    }
  } catch (error) {
    console.warn('Unable to sync calculation to PostgreSQL backend:', error);
  }
}

export async function fetchCalculationsFromBackend() {
  try {
    const response = await fetch(`${API_BASE_URL}/api/calculations`);
    if (!response.ok) {
      throw new Error(`Request failed with status ${response.status}`);
    }
    return (await response.json()) as Array<{ id: number; expression: string; result: string }>;
  } catch (error) {
    console.warn('Unable to load calculations from PostgreSQL backend:', error);
    return [];
  }
}
