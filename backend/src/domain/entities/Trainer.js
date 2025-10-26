export class Trainer {
  constructor(data) {
    this.id = data.id;
    this.firstName = data.firstName;
    this.lastName = data.lastName;
    this.email = data.email;
    this.companyId = data.companyId;
    this.trainerType = data.trainerType;
    this.teachingMode = data.teachingMode;
    this.verifiedTeachingSkills = data.verifiedTeachingSkills;
    this.certifications = data.certifications || [];
    this.languages = data.languages || ['English'];
    this.availability = data.availability;
    this.pricing = data.pricing;
    this.aiEditingEnabled = data.aiEditingEnabled || false;
    this.publishPermission = data.publishPermission || false;
    this.averageRating = data.averageRating || 0.0;
    this.reviewCount = data.reviewCount || 0;
    this.totalStudentsTaught = data.totalStudentsTaught || 0;
    this.status = data.status || 'active';
    this.createdAt = data.createdAt;
    this.updatedAt = data.updatedAt;
    this.deletedAt = data.deletedAt;
  }

  toJSON() {
    return {
      id: this.id,
      firstName: this.firstName,
      lastName: this.lastName,
      email: this.email,
      companyId: this.companyId,
      trainerType: this.trainerType,
      teachingMode: this.teachingMode,
      verifiedTeachingSkills: this.verifiedTeachingSkills,
      certifications: this.certifications,
      languages: this.languages,
      availability: this.availability,
      pricing: this.pricing,
      aiEditingEnabled: this.aiEditingEnabled,
      publishPermission: this.publishPermission,
      averageRating: this.averageRating,
      reviewCount: this.reviewCount,
      totalStudentsTaught: this.totalStudentsTaught,
      status: this.status,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
      deletedAt: this.deletedAt
    };
  }

  update(data) {
    Object.keys(data).forEach(key => {
      if (key !== 'id' && key !== 'createdAt' && Object.prototype.hasOwnProperty.call(this, key)) {
        this[key] = data[key];
      }
    });
    this.updatedAt = new Date().toISOString();
  }

  softDelete() {
    this.deletedAt = new Date().toISOString();
    this.status = 'inactive';
  }

  isActive() {
    return this.status === 'active' && !this.deletedAt;
  }

  getFullName() {
    return `${this.firstName} ${this.lastName}`;
  }

  addCertification(certification) {
    this.certifications.push(certification);
    this.updatedAt = new Date().toISOString();
  }

  removeCertification(certificationId) {
    this.certifications = this.certifications.filter(c => c.id !== certificationId);
    this.updatedAt = new Date().toISOString();
  }

  updateRating(newRating) {
    this.reviewCount += 1;
    this.averageRating = ((this.averageRating * (this.reviewCount - 1)) + newRating) / this.reviewCount;
    this.updatedAt = new Date().toISOString();
  }
}
