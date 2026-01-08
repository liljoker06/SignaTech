const { School } = require('../models');

class SchoolController {
  /**
   * Récupérer toutes les écoles
   */
  async getAllSchools() {
    return await School.findAll();
  }

  /**
   * Récupérer une école par ID
   */
  async getSchoolById(id) {
    const school = await School.findByPk(id);
    
    if (!school) {
      throw new Error('École non trouvée');
    }
    
    return school;
  }

  /**
   * Créer une nouvelle école
   */
  async createSchool({ name, description, longitude, latitude, city, country, website, contactEmail }) {
    return await School.create({ 
      name, 
      description,
      longitude,
      latitude,
      city,
      country,
      website,
      contact_email: contactEmail
    });
  }
}

module.exports = new SchoolController();
