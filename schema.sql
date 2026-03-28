-- Run this once to set up the database:
-- psql -U postgres -d jazzy -f schema.sql

CREATE TABLE IF NOT EXISTS users (
  id         SERIAL PRIMARY KEY,
  name       TEXT,
  email      TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS products (
  id         SERIAL PRIMARY KEY,
  name       TEXT NOT NULL,
  price      NUMERIC(10,2) NOT NULL,
  category   TEXT NOT NULL,
  image_url  TEXT,
  featured   BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS cart_items (
  id         SERIAL PRIMARY KEY,
  user_id    INTEGER REFERENCES users(id) ON DELETE CASCADE,
  product_id INTEGER REFERENCES products(id) ON DELETE CASCADE,
  quantity   INTEGER NOT NULL DEFAULT 1,
  UNIQUE(user_id, product_id)
);

-- Seed products (safe to re-run)
INSERT INTO products (name, price, category, image_url, featured) VALUES
  ('9060 "Black Castlerock" NB',  130.00, 'footwear',     'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600&h=500&fit=crop', true),
  ('9060 "Black/White" NB',       150.00, 'footwear',     'https://images.unsplash.com/photo-1491553895911-0055eca6402d?w=600&h=500&fit=crop', true),
  ('9060 "Red/Black" NB',         150.00, 'footwear',     'https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=600&h=500&fit=crop', true),
  ('9060 "Cream/Brown" NB',       150.00, 'footwear',     'https://images.unsplash.com/photo-1600185365483-26d7a4cc7519?w=600&h=500&fit=crop', true),
  ('9060 "Pink Overdye" NB',      150.00, 'footwear',     'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=600&h=500&fit=crop', false),
  ('9060 "Warped Multi-Color" NB',150.00, 'footwear',     'https://images.unsplash.com/photo-1512374382149-233c42b6a83b?w=600&h=500&fit=crop', false),
  ('AirPods Pro (2nd Gen)',        189.00, 'electronics',  'https://images.unsplash.com/photo-1603351154351-5e2d0600bb77?w=600&h=500&fit=crop', false),
  ('AirPods Max',                  299.00, 'electronics',  'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&h=500&fit=crop', false),
  ('Custom Hello Kitty Rug',        85.00, 'rugs',         'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=600&h=500&fit=crop', false),
  ('Custom Floral Rug',             95.00, 'rugs',         'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=600&h=500&fit=crop', false)
ON CONFLICT DO NOTHING;
