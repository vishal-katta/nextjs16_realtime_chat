# 🔒 Private Chat - Real-time Self-Destructing Chat Rooms

A modern, real-time chat application built with Next.js 16 that creates private, self-destructing chat rooms. Share a room link and chat securely with automatic message deletion after 10 minutes.

![Next.js](https://img.shields.io/badge/Next.js-16.0-black?style=flat-square&logo=next.js)
![React](https://img.shields.io/badge/React-19.2-blue?style=flat-square&logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?style=flat-square&logo=typescript)
![Upstash](https://img.shields.io/badge/Upstash-Redis-orange?style=flat-square)

## ✨ Features

- **🔐 Private Chat Rooms** - Create secure, temporary chat rooms with unique IDs
- **⏱️ Self-Destructing** - Rooms automatically expire after 10 minutes
- **👥 User Limits** - Configure room capacity (1-20 users)
- **⚡ Real-time Messaging** - Instant message delivery using Upstash Realtime
- **🎨 Modern UI** - Beautiful interface with dark/light theme support
- **🌈 Theme Colors** - Customizable theme colors with smooth transitions
- **💣 Manual Destruction** - Option to destroy rooms immediately
- **📱 Responsive Design** - Works seamlessly on desktop and mobile devices

## 🛠️ Tech Stack

### Frontend
- **Next.js 16** - React framework with App Router
- **React 19** - UI library
- **TypeScript** - Type safety
- **Tailwind CSS 4** - Styling
- **shadcn/ui** - UI component library
- **TanStack Query** - Data fetching and state management
- **React Hook Form** - Form handling
- **Zod** - Schema validation

### Backend
- **Elysia.js** - Fast web framework for API routes
- **Upstash Redis** - Serverless Redis for data persistence
- **Upstash Realtime** - Real-time pub/sub messaging
- **Eden Treaty** - Type-safe API client

## 📋 Prerequisites

- **Node.js** 18+ or **Bun** runtime
- **Upstash Account** - For Redis and Realtime services
  - Create a Redis database at [Upstash Console](https://console.upstash.com/)
  - Get your REST URL and token

## 🚀 Getting Started

### 1. Clone the Repository

```bash
git clone https://github.com/vishal-katta/nextjs16_realtime_chat.git
cd nextjs16_realtime_chat
```

### 2. Install Dependencies

Using Bun (recommended):
```bash
bun install
```

Or using npm:
```bash
npm install
```

### 3. Environment Variables

Create a `.env.local` file in the root directory:

```env
# Upstash Redis Configuration
UPSTASH_REDIS_REST_URL=your_redis_rest_url
UPSTASH_REDIS_REST_TOKEN=your_redis_rest_token

# Optional: Custom API URL (for production)
NEXT_PUBLIC_API_URL=https://your-domain.com
```

Get your Upstash credentials:
1. Go to [Upstash Console](https://console.upstash.com/)
2. Create a new Redis database
3. Copy the `UPSTASH_REDIS_REST_URL` and `UPSTASH_REDIS_REST_TOKEN`

### 4. Run Development Server

Using Bun:
```bash
bun run dev
```

Or using npm:
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## 📖 Usage

### Creating a Chat Room

1. Enter your username (auto-generated if not set)
2. Set the maximum number of users (1-20)
3. Click **"CREATE SECURE ROOM"**
4. Share the room link with others

### Joining a Chat Room

1. Open the shared room link
2. You'll automatically join if the room has available slots
3. Start chatting in real-time!

### Room Features

- **Self-Destruct Timer** - Countdown shows remaining time (10 minutes)
- **Copy Link** - Easily share the room URL
- **Destroy Now** - Manually destroy the room and all messages
- **Theme Toggle** - Switch between light and dark modes
- **Color Themes** - Customize theme colors

## 📁 Project Structure

```
nextjs16_realtime_chat/
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── (app)/              # Main app routes
│   │   │   ├── page.tsx        # Home page (room creation)
│   │   │   └── layout.tsx      # App layout
│   │   ├── room/
│   │   │   └── [roomId]/      # Dynamic room route
│   │   │       └── page.tsx    # Chat room interface
│   │   └── api/                # API routes
│   │       ├── [[...slugs]]/   # Elysia API handler
│   │       └── realtime/       # Realtime WebSocket handler
│   ├── components/
│   │   ├── custom/             # Custom components
│   │   │   ├── theme-color-toggle.tsx
│   │   │   └── animated-theme-toggler.tsx
│   │   └── ui/                 # shadcn/ui components
│   ├── lib/
│   │   ├── client.ts           # Eden Treaty API client
│   │   ├── redis.ts            # Upstash Redis client
│   │   ├── realtime.ts         # Realtime server setup
│   │   └── realtime-client.ts  # Realtime client hooks
│   ├── hooks/                  # Custom React hooks
│   └── context/                # React context providers
├── public/                     # Static assets
├── package.json
├── tsconfig.json
└── next.config.ts
```

## 🔧 Development

### Available Scripts

```bash
# Start development server
bun run dev

# Build for production
bun run build

# Start production server
bun run start

# Run linter
bun run lint
```

### Key Implementation Details

- **Room Management**: Rooms are stored in Redis with a 10-minute TTL
- **Authentication**: Token-based auth using HTTP-only cookies
- **Real-time Updates**: Upstash Realtime for instant message delivery
- **Message History**: Messages stored in Redis lists, synced with room TTL
- **User Tracking**: Connected users tracked per room with max capacity

## 🌐 Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Import project in [Vercel](https://vercel.com)
3. Add environment variables:
   - `UPSTASH_REDIS_REST_URL`
   - `UPSTASH_REDIS_REST_TOKEN`
4. Deploy!

### Other Platforms

The app can be deployed to any platform supporting Next.js:
- **Netlify**
- **Railway**
- **Render**
- **AWS Amplify**

Make sure to set the environment variables in your deployment platform.

## 🔒 Security Features

- **Token-based Authentication** - HTTP-only cookies for secure room access
- **Room Capacity Limits** - Prevents unauthorized access
- **Automatic Expiration** - Rooms and messages auto-delete after TTL
- **No Persistent Storage** - All data is temporary and ephemeral

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is open source and available under the [MIT License](LICENSE).

## 🙏 Acknowledgments

- [Upstash](https://upstash.com/) for Redis and Realtime services
- [shadcn/ui](https://ui.shadcn.com/) for beautiful UI components
- [Elysia.js](https://elysiajs.com/) for the fast API framework
- [Next.js](https://nextjs.org/) team for the amazing framework

## 📧 Contact

For questions or suggestions, please open an issue on [GitHub](https://github.com/vishal-katta/nextjs16_realtime_chat/issues).

---

Made with ❤️ using Next.js 16 and Upstash
