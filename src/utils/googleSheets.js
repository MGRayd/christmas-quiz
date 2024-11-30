// Helper functions for Google Sheets interaction
const SHEET_URL = 'https://script.google.com/macros/s/AKfycbxwH36g-u9PZIJPmH-dRm0xXn6FIsIuaIbjfobHxW6R-vBSwbKIubBiWVQ2YUohuyazmA/exec';

export async function fetchLeaderboard() {
  try {
    console.log('Fetching leaderboard...');
    const response = await fetch(`${SHEET_URL}?action=getLeaderboard`, {
      method: 'GET',
      mode: 'cors',
      headers: {
        'Accept': 'application/json',
      },
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error('Server response:', errorText);
      throw new Error('Network response was not ok');
    }
    
    const result = await response.json();
    console.log('Raw server response:', result);
    
    // Handle array response directly
    const dataArray = Array.isArray(result) ? result : result.data;
    
    if (!dataArray || !Array.isArray(dataArray)) {
      console.error('Invalid data format received:', result);
      return [];
    }

    const formattedData = dataArray
      .filter(entry => {
        // Case-insensitive property check
        return entry && 
          (entry.Name || entry.name) && 
          (entry.Score !== undefined || entry.score !== undefined);
      })
      .map(entry => ({
        name: entry.Name || entry.name,
        score: parseInt(entry.Score || entry.score) || 0,
        maxScore: parseInt(entry.MaxScore || entry.maxScore) || 0,
        date: new Date(entry.Date || entry.date),
        roundScores: typeof (entry.RoundScores || entry.roundScores) === 'string'
          ? JSON.parse(entry.RoundScores || entry.roundScores || '{}')
          : (entry.RoundScores || entry.roundScores || {})
      }))
      .sort((a, b) => b.score - a.score)
      .slice(0, 10);

    console.log('Formatted leaderboard data:', formattedData);
    return formattedData;
  } catch (error) {
    console.error('Error fetching leaderboard:', error);
    return [];
  }
}

export async function submitScore(scoreData) {
  try {
    // Sanitize and prepare the data with capitalized property names to match sheet
    const sanitizedData = {
      Name: scoreData.name.trim(),
      Score: String(scoreData.score),
      MaxScore: String(scoreData.maxScore),
      Date: new Date(scoreData.date).toISOString(),
      RoundScores: JSON.stringify({
        round1: scoreData.roundScores.round1,
        round2: scoreData.roundScores.round2,
        round3: scoreData.roundScores.round3,
        round4: scoreData.roundScores.round4,
        round5: scoreData.roundScores.round5
      })
    };

    // Create URL with parameters
    const params = new URLSearchParams({
      action: 'submitScore',
      ...sanitizedData
    });

    console.log('Submitting to URL:', `${SHEET_URL}?${params.toString()}`);

    const response = await fetch(`${SHEET_URL}?${params.toString()}`, {
      method: 'GET',
      mode: 'cors',
      headers: {
        'Accept': 'application/json',
      }
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error('Server response:', errorText);
      throw new Error('Failed to submit score');
    }

    const result = await response.json();
    if (result.error) {
      throw new Error(result.error);
    }

    return result;
  } catch (error) {
    console.error('Error submitting score:', error);
    throw error;
  }
} 