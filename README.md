# Christmas Quiz

A festive interactive quiz game built with React and Vite, featuring:
- 5 unique rounds of Christmas-themed questions
- Real-time score tracking
- Global leaderboard using Google Sheets
- Mobile-responsive design
- Festive animations and styling

## Live Demo
Visit the quiz at: https://mgrayd.github.io/xmas-quiz/

## Features
- Round 1: Christmas Trivia
- Round 2: Name That Christmas Movie
- Round 3: Christmas Anagrams
- Round 4: Christmas Song Lyrics
- Round 5: Christmas Emoji Pictionary

## Tech Stack
- React
- Vite
- Tailwind CSS
- Google Sheets API
- GitHub Pages

## Local Development
1. Clone the repository:
```bash
git clone https://github.com/[your-username]/christmas-quiz.git
cd christmas-quiz
```

2. Install dependencies:
```bash
npm install
```

3. Set up Google Sheets:
   - Create a new Google Sheet for score tracking
   - Go to Google Cloud Console and create a new project
   - Enable the Google Sheets API for your project
   - Create credentials (Service Account) and download the JSON key file
   - Share your Google Sheet with the service account email
   - Copy the Google Sheet ID from the URL

4. Configure environment variables:
   - Create a `.env` file in the root directory
   - Add the following variables:
     ```
     VITE_GOOGLE_SHEET_ID=your_sheet_id
     VITE_GOOGLE_SERVICE_ACCOUNT_EMAIL=your_service_account_email
     VITE_GOOGLE_PRIVATE_KEY=your_private_key
     ```

5. Run the development server:
```bash
npm run dev
```

## Deployment

To deploy to GitHub Pages:

1. Make sure all changes are committed
2. Run `npm run deploy`
3. The site will be deployed to https://[your-github-username].github.io/christmas-quiz/
