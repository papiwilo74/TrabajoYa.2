// backend/src/domain/entities/User.js

export class User {
  constructor(id, name, email, role) {
    this.id = id;
    this.name = name;
    this.email = email;
    this.role = role; // 'candidate' | 'employer'
    this.createdAt = new Date().toISOString();
  }

  isEmployer() {
    return this.role === 'employer';
  }
}
