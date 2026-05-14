// frontend/src/components/ApplicationModal.jsx
import { useState, useEffect, useRef } from 'react';
import { createApplication } from '../services/api';
import styles from './ApplicationModal.module.css';

export const ApplicationModal = ({ job, onClose }) => {
  const [step, setStep]         = useState(1); // 1 = form, 2 = success
  const [formData, setFormData] = useState({ name: '', email: '', phone: '', message: '' });
  const [loading, setLoading]   = useState(false);
  const [error, setError]       = useState(null);
  const overlayRef              = useRef(null);

  useEffect(() => {
    const onKey = (e) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [onClose]);

  const handleChange = (e) =>
    setFormData(p => ({ ...p, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      await createApplication({
        jobId:          job.id,
        candidateName:  formData.name,
        candidateEmail: formData.email,
        candidatePhone: formData.phone,
        message:        formData.message,
      });
      setStep(2);
    } catch (err) {
      setError(err.message ?? 'No se pudo enviar la postulacion. Intenta de nuevo.');
    } finally {
      setLoading(false);
    }
  };

  const handleOverlayClick = (e) => {
    if (e.target === overlayRef.current) onClose();
  };

  return (
    <div
      className={styles.overlay}
      ref={overlayRef}
      onClick={handleOverlayClick}
      role="dialog"
      aria-modal="true"
    >
      <div className={styles.modal}>
        <button className={styles.closeBtn} onClick={onClose} aria-label="Cerrar">x</button>

        {step === 1 ? (
          <>
            <div className={styles.modalHeader}>
              <div className={styles.jobAvatar}>
                {job.title.charAt(0).toUpperCase()}
              </div>
              <div>
                <p className={styles.modalLabel}>Postulacion para</p>
                <h2 className={styles.modalTitle}>{job.title}</h2>
                <div className={styles.modalMeta}>
                  <span className={styles.metaTag}>{job.location}</span>
                  {job.salary && (
                    <span className={styles.metaTag}>
                      ${Number(job.salary).toLocaleString('es-CO')}
                    </span>
                  )}
                  <span className={`${styles.metaTag} ${job.type === 'formal' ? styles.formal : styles.informal}`}>
                    {job.type}
                  </span>
                </div>
              </div>
            </div>

            <div className={styles.divider} />

            {error && (
              <div className={styles.errorBanner}>{error}</div>
            )}

            <form onSubmit={handleSubmit} className={styles.form}>
              <div className={styles.row}>
                <div className={styles.field}>
                  <label className={styles.label}>Nombre completo *</label>
                  <input
                    className={styles.input}
                    type="text" name="name"
                    value={formData.name} onChange={handleChange}
                    placeholder="Maria Garcia"
                    required autoFocus
                  />
                </div>
                <div className={styles.field}>
                  <label className={styles.label}>Telefono</label>
                  <input
                    className={styles.input}
                    type="tel" name="phone"
                    value={formData.phone} onChange={handleChange}
                    placeholder="300 123 4567"
                  />
                </div>
              </div>

              <div className={styles.field}>
                <label className={styles.label}>Correo electronico *</label>
                <input
                  className={styles.input}
                  type="email" name="email"
                  value={formData.email} onChange={handleChange}
                  placeholder="tu@correo.com"
                  required
                />
              </div>

              <div className={styles.field}>
                <label className={styles.label}>
                  Por que eres el candidato ideal?
                  <span className={styles.optional}> (opcional)</span>
                </label>
                <textarea
                  className={`${styles.input} ${styles.textarea}`}
                  name="message"
                  value={formData.message} onChange={handleChange}
                  placeholder="Cuentale al empleador sobre tu experiencia y motivacion..."
                  rows={4}
                />
              </div>

              <div className={styles.formFooter}>
                <p className={styles.privacy}>
                  Tu informacion es privada y solo se comparte con el empleador.
                </p>
                <button type="submit" className={styles.submitBtn} disabled={loading}>
                  {loading ? <span className={styles.spinner} /> : 'Enviar postulacion'}
                </button>
              </div>
            </form>
          </>
        ) : (
          <div className={styles.success}>
            <h2 className={styles.successTitle}>Postulacion enviada</h2>
            <p className={styles.successText}>
              Tu aplicacion para <strong>{job.title}</strong> fue recibida con exito.
              El empleador se pondra en contacto contigo pronto.
            </p>
            <div className={styles.successCard}>
              <span className={styles.successLabel}>Confirmacion enviada a</span>
              <span className={styles.successEmail}>{formData.email}</span>
            </div>
            <button className={styles.doneBtn} onClick={onClose}>
              Ver mas vacantes
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
