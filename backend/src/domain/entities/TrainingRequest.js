export class TrainingRequest {
  constructor(data) {
    this.id = data.id;
    this.requesterId = data.requesterId;
    this.companyId = data.companyId;
    this.type = data.type;
    this.title = data.title;
    this.description = data.description;
    this.skillCategories = data.skillCategories;
    this.targetAudience = data.targetAudience;
    this.expectedOutcomes = data.expectedOutcomes || [];
    this.budget = data.budget;
    this.currency = data.currency || 'USD';
    this.preferredStartDate = data.preferredStartDate;
    this.preferredEndDate = data.preferredEndDate;
    this.maxParticipants = data.maxParticipants;
    this.location = data.location;
    this.deliveryMode = data.deliveryMode;
    this.urgency = data.urgency || 'medium';
    this.businessJustification = data.businessJustification;
    this.status = data.status || 'pending';
    this.approverId = data.approverId;
    this.approvedAt = data.approvedAt;
    this.rejectionReason = data.rejectionReason;
    this.trainerId = data.trainerId;
    this.assignedAt = data.assignedAt;
    this.createdAt = data.createdAt;
    this.updatedAt = data.updatedAt;
    this.deletedAt = data.deletedAt;
  }

  toJSON() {
    return {
      id: this.id,
      requesterId: this.requesterId,
      companyId: this.companyId,
      type: this.type,
      title: this.title,
      description: this.description,
      skillCategories: this.skillCategories,
      targetAudience: this.targetAudience,
      expectedOutcomes: this.expectedOutcomes,
      budget: this.budget,
      currency: this.currency,
      preferredStartDate: this.preferredStartDate,
      preferredEndDate: this.preferredEndDate,
      maxParticipants: this.maxParticipants,
      location: this.location,
      deliveryMode: this.deliveryMode,
      urgency: this.urgency,
      businessJustification: this.businessJustification,
      status: this.status,
      approverId: this.approverId,
      approvedAt: this.approvedAt,
      rejectionReason: this.rejectionReason,
      trainerId: this.trainerId,
      assignedAt: this.assignedAt,
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
    this.status = 'cancelled';
  }

  isActive() {
    return !this.deletedAt && !['cancelled', 'completed'].includes(this.status);
  }

  approve(approverId, _comments = '') {
    this.status = 'approved';
    this.approverId = approverId;
    this.approvedAt = new Date().toISOString();
    this.updatedAt = new Date().toISOString();
  }

  reject(approverId, reason, _comments = '') {
    this.status = 'rejected';
    this.approverId = approverId;
    this.rejectionReason = reason;
    this.updatedAt = new Date().toISOString();
  }

  assignTrainer(trainerId, _assignedBy) {
    this.trainerId = trainerId;
    this.status = 'assigned';
    this.assignedAt = new Date().toISOString();
    this.updatedAt = new Date().toISOString();
  }

  start() {
    this.status = 'in-progress';
    this.updatedAt = new Date().toISOString();
  }

  complete() {
    this.status = 'completed';
    this.updatedAt = new Date().toISOString();
  }

  cancel(reason = '') {
    this.status = 'cancelled';
    this.rejectionReason = reason;
    this.updatedAt = new Date().toISOString();
  }
}