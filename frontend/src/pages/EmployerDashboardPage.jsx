// frontend/src/pages/EmployerDashboardPage.jsx
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getJobs } from '../services/api';
import styles from './EmployerDashboardPage.module.css';

const StatCard = ({ label, value, sub, color }) => (
  <div className={styles.statCard}>
    <div className={styles.statIconBar} style={{ background: color }} />
    <div>
      <p className={styles.statLabel}>{label}</p>
      <p className={styles.statValue}>{value}</p>
      {sub && <p className={styles.statSub}>{sub}</p>}
    </div>
  </div>
);

export const EmployerDashboardPage = () => {
  const [jobs, setJobs]       = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState(null);

  useEffect(() => {
    getJobs()
      .then(data => { setJobs(data); setLoading(false); })
      .catch(err  => { setError(err.message); setLoading(false); });
  }, []);

  const totalJobs    = jobs.length;
  const formalJobs   = jobs.filter(j => j.type === 'formal').length;
  const informalJobs = jobs.filter(j => j.type === 'informal').length;
  const avgSalary    = jobs.filter(j => j.salary).reduce(
    (acc, j, _, arr) => acc + j.salary / arr.length, 0
  );
  const categories   = [...new Set(jobs.map(j => j.category).filter(Boolean))];

  const AVATAR_COLORS = ['#FF5733', '#1A1F3C', '#7C3AED', '#0891B2'];

  const timeAgo = (date) => {
    const diff = Date.now() - new Date(date).getTime();
    const days = Math.floor(diff / 86400000);
    if (days === 0) return 'Hoy';
    if (days === 1) return 'Ayer';
    return `Hace ${days} dias`;
  };

  return (
    <div className={styles.page}>
      <div className={styles.pageHeader}>
        <div>
          <h1 className={styles.title}>Panel de empresa</h1>
          <p className={styles.sub}>Resumen de tus vacantes publicadas</p>
        </div>
        <Link to="/empresa/publicar" className={styles.publishBtn}>
          + Publicar vacante
        </Link>
      </div>

      {error && (
        <div className={styles.errorBanner}>
          No se pudo cargar la informacion. Verifica la conexion con el servidor.
        </div>
      )}

      <div className={styles.statsGrid}>
        <StatCard label="Vacantes activas"     value={totalJobs}   sub="en este momento"                                                              color="#FF5733" />
        <StatCard label="Contratos formales"   value={formalJobs}  sub={`${totalJobs > 0 ? Math.round(formalJobs / totalJobs * 100) : 0}% del total`}  color="#2E7D32" />
        <StatCard label="Contratos informales" value={informalJobs} sub={`${totalJobs > 0 ? Math.round(informalJobs / totalJobs * 100) : 0}% del total`} color="#E65100" />
        <StatCard
          label="Salario promedio"
          value={avgSalary > 0 ? `$${Math.round(avgSalary).toLocaleString('es-CO')}` : '--'}
          sub="de vacantes con salario"
          color="#1A1F3C"
        />
      </div>

      {categories.length > 0 && (
        <div className={styles.section}>
          <h2 className={styles.sectionTitle}>Categorias activas</h2>
          <div className={styles.categoryGrid}>
            {categories.map(cat => {
              const count = jobs.filter(j => j.category === cat).length;
              const pct   = Math.round((count / totalJobs) * 100);
              return (
                <div key={cat} className={styles.categoryCard}>
                  <div className={styles.categoryHeader}>
                    <span className={styles.categoryName}>{cat}</span>
                    <span className={styles.categoryCount}>{count} vacante{count !== 1 ? 's' : ''}</span>
                  </div>
                  <div className={styles.categoryBar}>
                    <div className={styles.categoryFill} style={{ width: `${pct}%` }} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      <div className={styles.section}>
        <h2 className={styles.sectionTitle}>Mis vacantes</h2>

        {loading ? (
          <p className={styles.loading}>Cargando...</p>
        ) : jobs.length === 0 ? (
          <div className={styles.empty}>
            <p>No has publicado vacantes todavia.</p>
            <Link to="/empresa/publicar" className={styles.publishBtn} style={{ marginTop: '1rem' }}>
              Publicar primera vacante
            </Link>
          </div>
        ) : (
          <div className={styles.jobList}>
            {jobs.map((job, i) => (
              <div key={job.id} className={styles.jobRow} style={{ animationDelay: `${i * 0.05}s` }}>
                <div
                  className={styles.jobAvatar}
                  style={{ background: AVATAR_COLORS[i % AVATAR_COLORS.length] }}
                >
                  {job.title.charAt(0).toUpperCase()}
                </div>
                <div className={styles.jobInfo}>
                  <p className={styles.jobTitle}>{job.title}</p>
                  <p className={styles.jobMeta}>
                    {job.location} &middot; {job.category} &middot; {timeAgo(job.createdAt)}
                  </p>
                </div>
                <div className={styles.jobRight}>
                  <span className={`${styles.jobBadge} ${job.type === 'formal' ? styles.formal : styles.informal}`}>
                    {job.type}
                  </span>
                  <span className={styles.jobSalary}>
                    {job.salary ? `$${Number(job.salary).toLocaleString('es-CO')}` : 'A convenir'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
