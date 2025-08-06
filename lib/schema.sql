-- إنشاء ENUM لأنواع أدوار المستخدمين
CREATE TYPE user_role AS ENUM ('sender_receiver', 'receiver_only');

-- إنشاء ENUM لحالة الطلب
CREATE TYPE request_status AS ENUM ('new', 'in_progress', 'done', 'rejected');

-- جدول المنازل
CREATE TABLE homes (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL
);

-- جدول المستخدمين 
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  role user_role NOT NULL,
  home_id INT NOT NULL REFERENCES homes(id) ON DELETE CASCADE
);

-- جدول العناصر (الأغراض)
CREATE TABLE items (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  image TEXT,
  home_id INT NOT NULL REFERENCES homes(id) ON DELETE CASCADE
);

-- جدول أماكن التوصيل
CREATE TABLE locations (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  image TEXT,
  home_id INT NOT NULL REFERENCES homes(id) ON DELETE CASCADE
);

-- جدول الطلبات
CREATE TABLE requests (
  id SERIAL PRIMARY KEY,
  sender_id INT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  receiver_id INT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  item_ids INT[] NOT NULL,
  location_id INT NOT NULL REFERENCES locations(id) ON DELETE CASCADE,
  status request_status NOT NULL DEFAULT 'new',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  home_id INT NOT NULL REFERENCES homes(id) ON DELETE CASCADE
);-- and have also this column name :no  data type:integer number	desc :number of item
-- إنشاء ENUM لأنواع العناصر



CREATE TYPE item_type AS ENUM (
  'cups',         -- كاسات
  'plates',       -- صحون
  'spices',       -- بهارات
  'spoons',       -- ملاعق
  'forks',        -- شوك
  'food'          -- أكل
); 

-- تعديل جدول العناصر لإضافة العمود الجديد
ALTER TABLE items
ADD COLUMN type item_type NOT NULL;
ALTER TYPE item_type ADD VALUE 'drink';
-- جدول يربط الطلبات بالعناصر وتسجيل الصوت الخاص بكل عنصر
CREATE TABLE request_item_audio (
  id SERIAL PRIMARY KEY,
  request_id INT NOT NULL REFERENCES requests(id) ON DELETE CASCADE,
  item_id INT NOT NULL REFERENCES items(id) ON DELETE CASCADE,
  audio_url TEXT -- رابط أو مسار ملف الصوت
);
ALTER TABLE request_item_audio
ADD COLUMN quantity INT NOT NULL DEFAULT 1;
ALTER TABLE requests
DROP COLUMN item_ids;

CREATE POLICY "Allow uploads for all"
ON storage.objects
FOR INSERT
TO public
WITH CHECK (true);

ALTER TABLE requests
ADD COLUMN is_seen_by_receiver BOOLEAN NOT NULL DEFAULT FALSE;
-- 📦 Supabase Storage Explanation:
-- A storage bucket named `public-images` was created to store public image files.
-- This bucket contains two folders:
--   1. `items/`      → stores images for entries in the `items` table.
--   2. `locations/`  → stores images for entries in the `locations` table.
--
-- Each image is uploaded to the appropriate folder, and the public URL of the uploaded image
-- is stored in the `image` TEXT column of the corresponding table (`items.image` or `locations.image`).
--
-- All images in this bucket are public, so they can be directly used in frontend applications
-- via <img src="..."> tags or CSS backgrounds.
--
-- Example image URL format:
--   https://<your-project-id>.supabase.co/storage/v1/object/public/public-images/items/example.jpg

-- 📦 Supabase Storage Explanation for Audio Files:
-- تم إنشاء فولدر جديد باسم `audio/` داخل البكت `public-images` لتخزين ملفات الصوت الخاصة بكل عنصر في الطلب.
-- عند رفع ملف صوتي، يتم حفظه في المسار التالي:
--   public-images/audio/
-- ويتم تخزين الرابط الكامل للملف الصوتي في عمود `audio_url` في جدول `request_item_audio`.
--
-- مثال على رابط ملف صوتي:
--   https://<your-project-id>.supabase.co/storage/v1/object/public/public-images/audio/example.mp3
--
-- جدول الربط بين الطلبات والعناصر وتسجيل الصوت:
--   request_item_audio(request_id, item_id, audio_url)