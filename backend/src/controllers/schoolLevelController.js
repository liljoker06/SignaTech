const { SchoolLevel } = require('../models');

class schoolLevelController {
  /**
   * Récupérer tous les niveaux d'écoles
   */
  async getAllSchoolLevels() {
    return await SchoolLevel.findAll();
  }

  /**
   * Récupérer un niveau d'école par ID
   */
  async getSchoolLevelById(id) {
    const schoolLevel = await SchoolLevel.findByPk(id);
    
    if (!schoolLevel) {
      throw new Error('Niveau d\'école non trouvé');
    }
    
    return schoolLevel;
  }

  /**
   * Récupérer les niveaux d'une école spécifique
   */
  async getSchoolLevelsBySchoolId(schoolId) {
    return await SchoolLevel.findAll({
      where: { school_id: schoolId }
    });
  }

  /**
   * Créer un nouveau niveau d'école
   */
  async createSchoolLevel({ schoolId, name, description, durationMonths, schoolType }) {
    return await SchoolLevel.create({
      school_id: schoolId,
      name,
      description,
      duration_months: durationMonths,
      school_type: schoolType
    });
  }
}

module.exports = new schoolLevelController();
