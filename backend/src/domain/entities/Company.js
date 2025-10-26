export class Company {
  constructor(data) {
    this.id = data.id;
    this.name = data.name;
    this.description = data.description;
    this.industry = data.industry;
    this.size = data.size;
    this.website = data.website;
    this.headquarters = data.headquarters;
    this.foundedYear = data.foundedYear;
    this.status = data.status || 'active';
    this.createdAt = data.createdAt;
    this.updatedAt = data.updatedAt;
    this.deletedAt = data.deletedAt;
  }

  toJSON() {
    return {
      id: this.id,
      name: this.name,
      description: this.description,
      industry: this.industry,
      size: this.size,
      website: this.website,
      headquarters: this.headquarters,
      foundedYear: this.foundedYear,
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
}
