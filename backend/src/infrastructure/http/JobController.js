// backend/src/infrastructure/http/JobController.js

export class JobController {
  constructor(createJobUseCase, getJobsUseCase, getJobByIdUseCase, createApplicationUseCase) {
    this.createJobUseCase = createJobUseCase;
    this.getJobsUseCase = getJobsUseCase;
    this.getJobByIdUseCase = getJobByIdUseCase;
    this.createApplicationUseCase = createApplicationUseCase;
  }

  // POST /api/jobs
  async createJob(req, res) {
    try {
      const newJob = await this.createJobUseCase.execute(req.body);
      res.status(201).json(newJob);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

  // GET /api/jobs?location=Barranquilla&category=tecnología
  async getJobs(req, res) {
    try {
      const { location, category } = req.query;
      const jobs = await this.getJobsUseCase.execute({ location, category });
      res.status(200).json(jobs);
    } catch (error) {
      res.status(500).json({ error: 'Error interno del servidor.' });
    }
  }

  // GET /api/jobs/:id
  async getJobById(req, res) {
    try {
      const job = await this.getJobByIdUseCase.execute(req.params.id);
      res.status(200).json(job);
    } catch (error) {
      const status = error.message === 'Vacante no encontrada.' ? 404 : 500;
      res.status(status).json({ error: error.message });
    }
  }

  // POST /api/applications
  async createApplication(req, res) {
    try {
      const application = await this.createApplicationUseCase.execute(req.body);
      res.status(201).json(application);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }
}
