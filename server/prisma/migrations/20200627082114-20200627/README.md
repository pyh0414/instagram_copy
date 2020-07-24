# Migration `20200627082114-20200627`

This migration has been generated by yeonho Park at 6/27/2020, 8:21:14 AM.
You can check out the [state of the schema](./schema.prisma) after the migration.

## Database Steps

```sql

```

## Changes

```diff
diff --git schema.prisma schema.prisma
migration ..20200627082114-20200627
--- datamodel.dml
+++ datamodel.dml
@@ -1,0 +1,85 @@
+// This is your Prisma schema file,
+// learn more about it in the docs: https://pris.ly/d/prisma-schema
+
+datasource mysql {
+  provider = "mysql"
+  url = "***"
+}
+
+generator client {
+  provider = "prisma-client-js"
+}
+
+// schema 정의
+
+model User {
+  id         Int          @id @default(autoincrement())
+  name       String
+  userId     String       @unique
+  userPw     String
+  profile    String
+  createdAt  DateTime     @default(now())
+  myPosts    Post[]       @relation("_PostToUser")
+  comments   Comment[]    @relation("_CommentToUser")
+  follower   User[]       @relation("followerFollowing", references: [id]) // 나를 등록한 사람
+  following  User[]       @relation("followerFollowing", references: [id]) // 내가 등록한 사람
+  likedPosts likeToPost[]
+}
+
+model Post {
+  id        Int             @id @default(autoincrement())
+  content   String
+  createdAt DateTime        @default(now())
+  author    User            @relation("_PostToUser", fields: [authorId], references: [id])
+  authorId  Int
+  comments  Comment[]       @relation("_CommentToPost")
+  images    Image[]         @relation("_ImageToPost")
+  likers    likeToPost[]
+  hashtags  hashtagToPost[]
+}
+
+model Comment {
+  id        Int      @id @default(autoincrement())
+  content   String
+  createdAt DateTime @default(now())
+  author    User     @relation("_CommentToUser", fields: [authorId], references: [id])
+  authorId  Int
+  Post      Post?    @relation("_CommentToPost", fields: [postId], references: [id])
+  postId    Int?
+}
+
+model HashTag {
+  id             Int             @id @default(autoincrement())
+  content        String
+  createdAt      DateTime        @default(now())
+  hashtagedPosts hashtagToPost[]
+}
+
+model Image {
+  id        Int      @id @default(autoincrement())
+  src       String
+  createdAt DateTime @default(now())
+  post      Post     @relation("_ImageToPost", fields: [postId], references: [id])
+  postId    Int
+}
+
+// user[] <--> post[]
+model likeToPost {
+  post      Post     @relation(fields: [postId], references: [id])
+  postId    Int
+  user      User     @relation(fields: [userId], references: [id])
+  userId    Int
+  createdAt DateTime @default(now())
+
+  @@id([postId, userId])
+}
+
+// user[] <--> post[]
+model hashtagToPost {
+  post      Post    @relation(fields: [postId], references: [id])
+  postId    Int
+  hashtag   HashTag @relation(fields: [hashtagId], references: [id])
+  hashtagId Int
+
+  @@id([postId, hashtagId])
+}
```

