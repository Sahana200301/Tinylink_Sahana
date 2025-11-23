# TinyLink

A simple and user-friendly URL shortener built with Next.js, Prisma, and PostgreSQL.

## Description

TinyLink allows you to create short links for long URLs. It provides a clean dashboard to manage your links, track clicks, and view statistics.

## Features

- Create short links with custom codes (optional)
- Automatic code generation
- Click tracking and statistics
- Responsive and attractive UI
- RESTful API for link management

## Tech Stack

- **Frontend:** Next.js 16, React 19, Tailwind CSS
- **Backend:** Next.js API Routes
- **Database:** PostgreSQL (via Prisma)
- **ORM:** Prisma
- **Deployment:** Vercel (recommended)

## Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/Sahana200301/Tinylink_Sahana.git
   cd tinylink
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up the database:
   - Create a PostgreSQL database (e.g., using Neon, Supabase, or local PostgreSQL)
   - Copy `.env.example` to `.env` and update the `DATABASE_URL`

4. Run database migrations:
   ```bash
   npx prisma generate
   npx prisma db push
   ```

5. Start the development server:
   ```bash
   npm run dev
   ```

6. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Usage

### Creating a Link

1. Go to the dashboard at `http://localhost:3000`
2. Enter a URL in the "Create Short Link" form
3. Optionally, provide a custom code (6-8 alphanumeric characters)
4. Click "Create Link"
5. Your short link will be generated (e.g., `http://localhost:3000/abc123`)

### Viewing Statistics

- Click on a link code in the table to view detailed statistics
- Statistics include total clicks, last clicked time, and creation date

### Deleting a Link

- Click the "Delete" button next to any link in the table
- Confirm the deletion in the popup

## API Endpoints

- `GET /api/links` - Get all links
- `POST /api/links` - Create a new link (body: `{ url, code? }`)
- `GET /api/links/[code]` - Get link statistics
- `DELETE /api/links/[code]` - Delete a link

## Database Schema

The application uses a single `Link` table with the following fields:
- `id`: Auto-incrementing primary key
- `code`: Unique short code (string)
- `url`: Original URL (string)
- `clicks`: Click count (integer, default 0)
- `lastClicked`: Last click timestamp (datetime, nullable)
- `createdAt`: Creation timestamp (datetime)

## Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature-name`
3. Make your changes and commit: `git commit -m 'Add feature'`
4. Push to the branch: `git push origin feature-name`
5. Submit a pull request

## License

This project is open source and available under the [MIT License](LICENSE).

## Deployment

Deployed on Vercel: [TinyLink](https://tinylink-sahana.vercel.app) (update with actual link after deployment)