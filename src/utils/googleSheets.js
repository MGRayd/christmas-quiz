// Helper functions for Google Sheets interaction
export const SHEET_URL = 'https://script.google.com/macros/s/AKfycbwzB9YerryLXoXNVnqiS_9MAp8851x8Edzxk00iyLdxPrVk_ghIEAFLB27dY-lMptWi1A/exec';

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
      throw new Error('Network response was not ok');
    }
    
    const rows = await response.json();
    console.log('Raw server response:', rows);
    
    if (!Array.isArray(rows)) {
      console.error('Invalid data format received:', rows);
      return [];
    }

    // Map the array data directly based on column positions
    const formattedData = rows.map(row => ({
      name: row[0] || '',                    // Name (Column A)
      score: parseInt(row[1]) || 0,          // Score (Column B)
      maxScore: parseInt(row[2]) || 0,       // Max Score (Column C)
      hintsUsed: parseInt(row[3]) || 0,      // Hints Used (Column D)
      maxHints: parseInt(row[4]) || 0,       // Max Hints (Column E)
      date: new Date(row[5]) || new Date(),  // Date (Column F)
      roundScores: row[6] ? JSON.parse(row[6]) : {} // Round Scores (Column G)
    }));

    console.log('Formatted leaderboard data:', formattedData);
    return formattedData;
  } catch (error) {
    console.error('Error fetching leaderboard:', error);
    return [];
  }
}

export const submitScore = async (name, roundScores) => {
  try {
    const callbackName = 'jsonpCallback_' + Date.now();
    console.log('Submitting score with data:', { name, roundScores });

    const totalScore = Object.values(roundScores).reduce((sum, round) => {
      console.log('Processing round:', round);
      return sum + (Number(round.correct) || 0);
    }, 0);
    console.log('Calculated total score:', totalScore);

    const params = new URLSearchParams();
    params.append('name', name);
    params.append('score', totalScore);
    params.append('roundScores', JSON.stringify(roundScores));
    params.append('callback', callbackName);

    console.log('Final URL parameters:', params.toString());

    const jsonpPromise = new Promise((resolve, reject) => {
      window[callbackName] = (response) => {
        console.log('Received response:', response);
        delete window[callbackName];
        document.head.removeChild(script);
        resolve(response);
      };

      const script = document.createElement('script');
      const url = `${SHEET_URL}?${params.toString()}`;
      console.log('Making request to:', url);
      script.src = url;
      script.onerror = (error) => {
        console.error('Script error:', error);
        delete window[callbackName];
        document.head.removeChild(script);
        reject(new Error('Failed to load script'));
      };
      document.head.appendChild(script);
    });

    const result = await jsonpPromise;
    if (result.result === 'error') {
      throw new Error(result.message);
    }
    return result;

  } catch (error) {
    console.error('Error submitting score:', error);
    throw error;
  }
}; 