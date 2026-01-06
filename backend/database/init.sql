-- créer la base de données signatech avant de commencer
-- Table users
CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  username VARCHAR(255) NOT NULL UNIQUE,
  email VARCHAR(255) NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  birth_date DATE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Table images
CREATE TABLE IF NOT EXISTS images (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  image_path VARCHAR(255) NOT NULL,
  uploaded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Table models
CREATE TABLE IF NOT EXISTS models (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  version VARCHAR(50) NOT NULL,
  accuracy FLOAT,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Table classes
CREATE TABLE IF NOT EXISTS classes (
  id SERIAL PRIMARY KEY,
  label VARCHAR(255) NOT NULL UNIQUE,
  description TEXT
);

-- Table predictions
CREATE TABLE IF NOT EXISTS predictions (
  id SERIAL PRIMARY KEY,
  image_id INTEGER NOT NULL REFERENCES images(id) ON DELETE CASCADE,
  model_id INTEGER NOT NULL REFERENCES models(id) ON DELETE CASCADE,
  predicted_class_id INTEGER NOT NULL REFERENCES classes(id) ON DELETE CASCADE,
  confidence_score FLOAT NOT NULL,
  predicted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Table schools
CREATE TABLE IF NOT EXISTS schools (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  address VARCHAR(255),
  city VARCHAR(100),
  country VARCHAR(100),
  website VARCHAR(255),
  contact_email VARCHAR(255)
);

-- Table schools_levels
CREATE TABLE IF NOT EXISTS schools_levels (
  id SERIAL PRIMARY KEY,
  school_id INTEGER NOT NULL REFERENCES schools(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  duration_months INTEGER,
  price FLOAT
);


CREATE INDEX IF NOT EXISTS idx_images_user_id ON images(user_id);
CREATE INDEX IF NOT EXISTS idx_predictions_image_id ON predictions(image_id);
CREATE INDEX IF NOT EXISTS idx_predictions_model_id ON predictions(model_id);
CREATE INDEX IF NOT EXISTS idx_predictions_class_id ON predictions(predicted_class_id);
CREATE INDEX IF NOT EXISTS idx_schools_levels_school_id ON schools_levels(school_id);

