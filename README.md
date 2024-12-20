# Pentagram: Instagram, but with AI Images
# Realtime Image Diffusion Model

## Overview
This repository implements a Realtime Image Diffusion Model with a user-friendly web interface. Users can generate AI-powered images in real time by providing text prompts. The application leverages Supabase for database management and real-time updates and includes a robust architecture for generating and displaying content interactively.

## Features
- **Text-to-Image Generation**: Generate custom images using AI models.
- **Realtime Updates**: New images appear instantly without requiring a page refresh.
- **User Accounts**: Users can create unique usernames and save their images.
- **Likes System**: Users can like images to express their preferences.

## Lifecycle
User
  |
  |--[1] Enter name and username
  |    |
  |    v
  |  Frontend (React, TailwindCSS)
  |    |
  |--[2] Submit username -> Backend
  |    |
  |--[3] Save username to Supabase -> Supabase Database
  |    |
  |<--[4] Confirmation of username saved
  |    |
  |--[5] Enter text prompt (query)
  |    |
  |--[6] Submit query -> Backend
  |    |
  |--[7] Use Hugging Face API for Stable Diffusion 3.5 Large Turbo to generate AI image
  |    |
  |<--[8] Receive generated image
  |    |
  |--[9] Save image, prompt, and metadata -> Supabase Database
  |    |
  |<--[10] Confirmation of data saved
  |    |
  |--[11] Realtime update detected in Supabase -> Frontend
  |    |
  |<--[12] Display AI-generated image and allow likes
  |
  +-> [End]


### Description
1. **Frontend**: Built with React and TailwindCSS, providing a responsive UI.
2. **Backend**: Handles image generation requests and integrates with Supabase for database management.
3. **Database**: Supabase stores user information, images, and metadata (e.g., likes).
4. **Realtime Subscription**: Listens to database changes to provide live updates.

## Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/purohitamann/pentagram
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up Supabase:
   - Create a project on [Supabase](https://supabase.com/).
   - Add the required tables:
     - `images` with columns: `id`, `image_url`, `prompt`, `likes`, `username`, `created_at`.
     - `users` with columns: `username`, `email`.
   - Obtain your Supabase API key and URL.

4. Configure environment variables:
   Create a `.env.local` file with the following:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
   ```

5. Start the development server:
   ```bash
   npm run dev
   ```

6. Open your browser and navigate to `http://localhost:3000`.

## Usage
- Enter a text prompt in the input field and click "Generate" to create an image.
- Like images by clicking on the like button.
- If no username is set, the application will prompt you to create one.

## Technologies Used
- **Frontend**: React, TailwindCSS
- **Backend**: Node.js, Supabase Realtime
- **Database**: Supabase PostgreSQL

## Future Enhancements
- Add pagination for image gallery.
- Implement authentication for enhanced user security.
- Allow users to download generated images.

---

For any issues or feature requests, feel free to open an issue on GitHub.

