# 考古平台前端

## Requirements

- Node.js (20以上版本)
- pnpm

pnpm 下載方式:

```sh
npm install -g pnpm
```

## Installation

1. Clone repo:

   ```sh
   git clone https://github.com/gdsc-ncku/past-exam.git
   ```

2. Navigate into the project directory:

   ```sh
   cd past-exam/frontend
   ```

3. Install dependencies:
   ```sh
   pnpm install
   ```

## Environment Variables

本專案會使用 Environment Variable 來設置後段API位置
frontend 資料夾裡面會提供 template.env 該檔案包含所有必需的Environment Variable的佔位符。

Copy template.env to the appropriate .env file:

- For local development, copy it to .env.local
- For development/staging, copy it to .env.development
- For production, copy it to .env.production

## Running the Project

### Local Backend

To start with local backend, run:

```sh
pnpm dev:local
```

### Development Backend

To start with a development server , run:

```sh
pnpm dev
```

### Production

To start with a production server , run:

```sh
pnpm build
pnpm start
```

Where:

- pnpm build generates a production build.
- pnpm start serves the build locally.
