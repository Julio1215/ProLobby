-- CreateEnum
CREATE TYPE "Role" AS ENUM ('USER', 'ADMIN');

-- CreateEnum
CREATE TYPE "RpgSystem" AS ENUM ('DND5E', 'TORMENTA20', 'CALL_OF_CTHULHU', 'ORDEM_PARANORMAL');

-- CreateEnum
CREATE TYPE "QcdCategory" AS ENUM ('EXCELLENT', 'GOOD', 'REASONABLE', 'NOT_WORTH');

-- CreateEnum
CREATE TYPE "PostType" AS ENUM ('REVIEW', 'SCREENSHOT', 'ARTWORK', 'DISCUSSION');

-- CreateTable
CREATE TABLE "users" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "displayName" TEXT,
    "password" TEXT NOT NULL,
    "bio" TEXT,
    "avatarUrl" TEXT,
    "role" "Role" NOT NULL DEFAULT 'USER',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "rpg_characters" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "system" "RpgSystem" NOT NULL,
    "name" TEXT NOT NULL,
    "data" JSONB NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "rpg_characters_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "qcd_games" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "coverUrl" TEXT,
    "genres" TEXT[],
    "platforms" TEXT[],
    "metacriticScore" INTEGER,
    "igdbRating" DOUBLE PRECISION,
    "criticScore" INTEGER,
    "hoursMain" DOUBLE PRECISION,
    "hoursComplete" DOUBLE PRECISION,
    "hoursNote" TEXT,
    "priceUsd" DOUBLE PRECISION,
    "priceBrl" DOUBLE PRECISION,
    "storeUrl" TEXT,
    "qcdScore" DOUBLE PRECISION,
    "qcdCategory" "QcdCategory",
    "avgScore" DOUBLE PRECISION,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "qcd_games_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "community_posts" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "type" "PostType" NOT NULL,
    "title" TEXT,
    "content" TEXT,
    "imageUrl" TEXT,
    "gameTitle" TEXT,
    "rating" DOUBLE PRECISION,
    "likesCount" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "community_posts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "post_likes" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "postId" TEXT NOT NULL,

    CONSTRAINT "post_likes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "password_reset_tokens" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "used" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "password_reset_tokens_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "users_username_key" ON "users"("username");

-- CreateIndex
CREATE UNIQUE INDEX "qcd_games_slug_key" ON "qcd_games"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "post_likes_userId_postId_key" ON "post_likes"("userId", "postId");

-- CreateIndex
CREATE UNIQUE INDEX "password_reset_tokens_token_key" ON "password_reset_tokens"("token");

-- AddForeignKey
ALTER TABLE "rpg_characters" ADD CONSTRAINT "rpg_characters_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "community_posts" ADD CONSTRAINT "community_posts_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "post_likes" ADD CONSTRAINT "post_likes_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "post_likes" ADD CONSTRAINT "post_likes_postId_fkey" FOREIGN KEY ("postId") REFERENCES "community_posts"("id") ON DELETE CASCADE ON UPDATE CASCADE;
