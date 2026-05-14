// backend/src/infrastructure/repositories/JobRepository.js
import { supabase } from '../supabaseClient.js';

export class JobRepository {
  // Guarda una vacante nueva
  async save(job) {
    const { data, error } = await supabase
      .from('jobs')
      .insert({
        id: job.id,
        employer_id: job.employerId,
        title: job.title,
        description: job.description,
        type: job.type,
        category: job.category,
        location: job.location,
        salary: job.salary,
        status: job.status,
        created_at: job.createdAt,
      })
      .select()
      .single();

    if (error) throw new Error(error.message);
    return this._toDomain(data);
  }

  // Todas las vacantes abiertas
  async findAll() {
    const { data, error } = await supabase
      .from('jobs')
      .select('*')
      .eq('status', 'open')
      .order('created_at', { ascending: false });

    if (error) throw new Error(error.message);
    return data.map(this._toDomain);
  }

  // Busca por ID
  async findById(id) {
    const { data, error } = await supabase
      .from('jobs')
      .select('*')
      .eq('id', id)
      .single();

    if (error) return null;
    return this._toDomain(data);
  }

  // Filtra por ubicación (case-insensitive)
  async findByLocation(location) {
    const { data, error } = await supabase
      .from('jobs')
      .select('*')
      .ilike('location', `%${location}%`)
      .eq('status', 'open')
      .order('created_at', { ascending: false });

    if (error) throw new Error(error.message);
    return data.map(this._toDomain);
  }

  // Filtra por categoría
  async findByCategory(category) {
    const { data, error } = await supabase
      .from('jobs')
      .select('*')
      .eq('category', category.toLowerCase())
      .eq('status', 'open')
      .order('created_at', { ascending: false });

    if (error) throw new Error(error.message);
    return data.map(this._toDomain);
  }

  // Convierte snake_case de Supabase a camelCase del dominio
  _toDomain(row) {
    return {
      id: row.id,
      employerId: row.employer_id,
      title: row.title,
      description: row.description,
      type: row.type,
      category: row.category,
      location: row.location,
      salary: row.salary,
      status: row.status,
      createdAt: row.created_at,
    };
  }
}
