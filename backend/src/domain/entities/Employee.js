export class Employee {
  constructor(data) {
    this.id = data.id;
    this.firstName = data.firstName;
    this.lastName = data.lastName;
    this.email = data.email;
    this.phone = data.phone;
    this.employeeId = data.employeeId;
    this.role = data.role;
    this.jobTitle = data.jobTitle;
    this.level = data.level;
    this.departmentId = data.departmentId;
    this.teamId = data.teamId;
    this.managerId = data.managerId;
    this.companyId = data.companyId;
    this.hireDate = data.hireDate;
    this.status = data.status || 'active';
    this.skills = data.skills || [];
    this.competences = data.competences || [];
    this.enrichmentStatus = data.enrichmentStatus;
    this.relevanceScore = data.relevanceScore;
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
      phone: this.phone,
      employeeId: this.employeeId,
      role: this.role,
      jobTitle: this.jobTitle,
      level: this.level,
      departmentId: this.departmentId,
      teamId: this.teamId,
      managerId: this.managerId,
      companyId: this.companyId,
      hireDate: this.hireDate,
      status: this.status,
      skills: this.skills,
      competences: this.competences,
      enrichmentStatus: this.enrichmentStatus,
      relevanceScore: this.relevanceScore,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
      deletedAt: this.deletedAt
    };
  }

  update(data) {
    Object.keys(data).forEach(key => {
      if (key !== 'id' && key !== 'createdAt' && this.hasOwnProperty(key)) {
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

  addSkill(skill) {
    if (!this.skills.find(s => s.name === skill.name)) {
      this.skills.push(skill);
      this.updatedAt = new Date().toISOString();
    }
  }

  removeSkill(skillName) {
    this.skills = this.skills.filter(s => s.name !== skillName);
    this.updatedAt = new Date().toISOString();
  }
}
