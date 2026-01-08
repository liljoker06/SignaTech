const User = require('./modelUser');
const Image = require('./modelImage');
const Model = require('./modelModel');
const Class = require('./modelClass');
const Prediction = require('./modelPrediction');
const School = require('./modelSchool');
const SchoolLevel = require('./modelSchoolLevel');
const Video = require('./modalVideo');

// Définir les associations
const setupAssociations = () => {
  // User - Image (1:N)
  User.hasMany(Image, { 
    foreignKey: 'user_id', 
    as: 'images' 
  });
  Image.belongsTo(User, { 
    foreignKey: 'user_id', 
    as: 'user' 
  });

  // Image - Prediction (1:N)
  Image.hasMany(Prediction, { 
    foreignKey: 'image_id', 
    as: 'predictions' 
  });
  Prediction.belongsTo(Image, { 
    foreignKey: 'image_id', 
    as: 'image' 
  });

  // Model - Prediction (1:N)
  Model.hasMany(Prediction, { 
    foreignKey: 'model_id', 
    as: 'predictions' 
  });
  Prediction.belongsTo(Model, { 
    foreignKey: 'model_id', 
    as: 'model' 
  });

  // Class - Prediction (1:N)
  Class.hasMany(Prediction, { 
    foreignKey: 'predicted_class_id', 
    as: 'predictions' 
  });
  Prediction.belongsTo(Class, { 
    foreignKey: 'predicted_class_id', 
    as: 'predictedClass' 
  });

  // School - SchoolLevel (1:N)
  School.hasMany(SchoolLevel, { 
    foreignKey: 'school_id', 
    as: 'levels' 
  });
  SchoolLevel.belongsTo(School, { 
    foreignKey: 'school_id', 
    as: 'school' 
  });

  // Video - Class (1:N)
  Video.hasMany(Class, { 
    foreignKey: 'video_id', 
    as: 'classes' 
  });
  Class.belongsTo(Video, { 
    foreignKey: 'video_id', 
    as: 'video' 
  });
};

setupAssociations();

module.exports = {
  User,
  Image,
  Model,
  Class,
  Prediction,
  School,
  SchoolLevel,
  Video
};
