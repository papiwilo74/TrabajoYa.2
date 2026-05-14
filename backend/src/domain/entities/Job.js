// backend/src/domain/entities/Job.js

export class Job {
  constructor(id, employerId, title, description, type, category, location, salary) {
    this.id = id;
    this.employerId = employerId;
    this.title = title;
    this.description = description;
    this.type = type;       // 'formal' | 'informal'
    this.category = category;
    this.location = location;
    this.salary = salary ?? null;
    this.status = 'open';
    this.createdAt = new Date().toISOString();
  }

  closeJob() {
    this.status = 'closed';
  }
}
