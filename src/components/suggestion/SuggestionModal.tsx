'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { createPortal } from 'react-dom';
import type { Character } from '@/types';

/* ─── Tipos ────────────────────────────────────────────────────── */

type CharacterContext = {
  tipo: 'character';
  character: Character;
};

type TreeContext = {
  tipo: 'tree';
  treeId: string;
  treeName: string;
};

export type SuggestionContext = CharacterContext | TreeContext;

interface Props {
  context: SuggestionContext;
  onClose: () => void;
}

/* ─── Campos para personajes ──────────────────────────────────── */

const CHARACTER_FIELDS = [
  { id: 'nombre', label: 'Nombre (español)', get: (c: Character) => c.name },
  { id: 'nombre-griego', label: 'Nombre griego', get: (c: Character) => c.greekName },
  { id: 'titulo', label: 'Título / Epíteto', get: (c: Character) => c.title },
  { id: 'categoria', label: 'Categoría', get: (c: Character) => c.category },
  { id: 'descripcion', label: 'Descripción principal', get: (c: Character) => c.description },
  { id: 'padres', label: 'Padres', get: (c: Character) => c.parents.join(', ') || '—' },
  { id: 'parejas', label: 'Parejas', get: (c: Character) => c.partners.join(', ') || '—' },
  { id: 'hijos', label: 'Hijos', get: (c: Character) => c.children.join(', ') || '—' },
  { id: 'versiones', label: 'Versiones del mito', get: (c: Character) => c.versions.map(v => v.source).join(', ') || '—' },
  { id: 'imagen', label: 'Imagen del personaje', get: () => '' },
  { id: 'arbol', label: 'Árbol genealógico', get: (c: Character) => c.trees.join(', ') || '—' },
  { id: 'otro', label: 'Otro (especificar abajo)', get: () => '' },
] as const;

const TREE_FIELDS = [
  { id: 'conexion', label: 'Conexión incorrecta entre personajes' },
  { id: 'faltante', label: 'Personaje que falta en el árbol' },
  { id: 'nombre-nodo', label: 'Nombre incorrecto en un nodo' },
  { id: 'relacion', label: 'Tipo de relación incorrecta (padre/pareja/hijo)' },
  { id: 'posicion', label: 'Posición o jerarquía incorrecta' },
  { id: 'otro', label: 'Otro (especificar abajo)' },
] as const;

const TIPOS_CHARACTER = [
  'Corrección de dato existente',
  'Información que falta',
  'Error en la imagen',
  'Dato duplicado o confuso',
  'Otro',
];

const TIPOS_TREE = [
  'Dato incorrecto',
  'Personaje o nodo faltante',
  'Conexión o relación incorrecta',
  'Otro',
];

/* ─── Estado del formulario ───────────────────────────────────── */

interface FormState {
  tipo: string;
  campo: string;
  sugerencia: string;
  fuente: string;
  urlFuente: string;
  notas: string;
  nombre: string;
  emailContacto: string;
}

const EMPTY_FORM: FormState = {
  tipo: '',
  campo: '',
  sugerencia: '',
  fuente: '',
  urlFuente: '',
  notas: '',
  nombre: '',
  emailContacto: '',
};

/* ─── Componente ──────────────────────────────────────────────── */

export default function SuggestionModal({ context, onClose }: Props) {
  const [form, setForm] = useState<FormState>(EMPTY_FORM);
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [errorMsg, setErrorMsg] = useState('');
  const [mounted, setMounted] = useState(false);
  const overlayRef = useRef<HTMLDivElement>(null);
  const firstInputRef = useRef<HTMLSelectElement>(null);

  useEffect(() => {
    setMounted(true);
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = ''; };
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose]);

  useEffect(() => {
    if (mounted) setTimeout(() => firstInputRef.current?.focus(), 50);
  }, [mounted]);

  const set = useCallback((field: keyof FormState, value: string) => {
    setForm(prev => ({ ...prev, [field]: value }));
  }, []);

  const isCharacter = context.tipo === 'character';
  const tipos = isCharacter ? TIPOS_CHARACTER : TIPOS_TREE;
  const fields = isCharacter ? CHARACTER_FIELDS : TREE_FIELDS;
  const contextoNombre = isCharacter ? context.character.name : context.treeName;
  const contextoTipo = context.tipo;

  const selectedField = isCharacter
    ? CHARACTER_FIELDS.find(f => f.id === form.campo)
    : TREE_FIELDS.find(f => f.id === form.campo);

  const currentValue = isCharacter && selectedField && 'get' in selectedField
    ? selectedField.get(context.character)
    : '';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.sugerencia.trim()) { setErrorMsg('La sugerencia no puede estar vacía.'); return; }
    if (!form.fuente.trim()) { setErrorMsg('La fuente es obligatoria para poder verificar la información.'); return; }

    setStatus('loading');
    setErrorMsg('');

    try {
      const payload = {
        ...form,
        contextoTipo,
        contextoNombre,
        ...(isCharacter ? { contextoId: context.character.id } : { contextoId: context.treeId }),
      };

      const res = await fetch('/api/sugerencia', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const body = await res.json() as { error?: string };
        throw new Error(body.error ?? 'Error desconocido');
      }

      setStatus('success');
    } catch (err) {
      setStatus('error');
      setErrorMsg(err instanceof Error ? err.message : 'No se pudo enviar. Inténtalo más tarde.');
    }
  };

  const labelClass = 'block text-[0.7rem] font-semibold uppercase tracking-[0.1em] text-text-muted mb-1.5';
  const inputClass = 'w-full bg-bg py-2.5 px-3.5 border border-border-base rounded-lg text-text-primary text-[0.88rem] font-body focus:outline-none focus:border-gold focus:shadow-[0_0_0_3px_rgba(212,168,67,0.12)] transition-all duration-150 placeholder:text-text-muted';
  const textareaClass = `${inputClass} resize-none`;

  if (!mounted) return null;

  const modal = (
    <div
      ref={overlayRef}
      className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center p-0 sm:p-4"
      style={{ background: 'rgba(7,7,15,0.85)', backdropFilter: 'blur(6px)' }}
      onMouseDown={e => { if (e.target === overlayRef.current) onClose(); }}
    >
      <div
        className="relative w-full sm:max-w-2xl max-h-[95dvh] sm:max-h-[90dvh] bg-bg-card border border-border-base rounded-t-2xl sm:rounded-2xl overflow-hidden flex flex-col shadow-lg"
        style={{ boxShadow: '0 0 40px rgba(212,168,67,0.08)' }}
      >
        {/* Header */}
        <div className="flex items-start justify-between px-6 py-5 border-b border-border-base shrink-0">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-[0.65rem] font-semibold uppercase tracking-widest px-2.5 py-0.5 rounded-full border"
                style={isCharacter
                  ? { background: 'rgba(212,168,67,0.12)', color: '#d4a843', borderColor: 'rgba(212,168,67,0.3)' }
                  : { background: 'rgba(8,145,178,0.12)', color: '#38bdf8', borderColor: 'rgba(8,145,178,0.3)' }
                }
              >
                {isCharacter ? 'Personaje' : 'Árbol genealógico'}
              </span>
            </div>
            <h2 className="font-display text-[1.05rem] text-text-primary leading-tight">
              Sugerir corrección
              <span className="text-gold"> — {contextoNombre}</span>
            </h2>
            <p className="text-[0.75rem] text-text-muted mt-0.5">
              Tu sugerencia será revisada antes de aplicarse. Los campos marcados con <span className="text-gold">*</span> son obligatorios.
            </p>
          </div>
          <button
            onClick={onClose}
            className="ml-4 shrink-0 w-8 h-8 flex items-center justify-center rounded-lg text-text-muted hover:text-text-primary hover:bg-bg-hover transition-all duration-150 text-lg leading-none"
            aria-label="Cerrar"
          >
            ×
          </button>
        </div>

        {/* Success state */}
        {status === 'success' ? (
          <div className="flex flex-col items-center justify-center gap-4 py-16 px-8 text-center">
            <div className="text-4xl">✓</div>
            <h3 className="font-display text-lg text-gold">¡Sugerencia enviada!</h3>
            <p className="text-text-secondary text-sm max-w-xs">
              Gracias por contribuir a mejorar Olimpo. Revisaremos tu sugerencia y la aplicaremos si está verificada.
            </p>
            <button
              onClick={onClose}
              className="mt-2 px-6 py-2.5 bg-gold text-bg font-display text-sm rounded-lg hover:bg-gold-light transition-colors duration-150"
            >
              Cerrar
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="overflow-y-auto flex-1">
            <div className="px-6 py-5 space-y-5">

              {/* Tipo */}
              <div>
                <label className={labelClass}>
                  Tipo de sugerencia <span className="text-gold">*</span>
                </label>
                <select
                  ref={firstInputRef}
                  value={form.tipo}
                  onChange={e => set('tipo', e.target.value)}
                  className={inputClass}
                  required
                >
                  <option value="">Selecciona el tipo...</option>
                  {tipos.map(t => <option key={t} value={t}>{t}</option>)}
                </select>
              </div>

              {/* Campo */}
              <div>
                <label className={labelClass}>
                  {isCharacter ? 'Dato afectado' : 'Aspecto afectado'} <span className="text-gold">*</span>
                </label>
                <select
                  value={form.campo}
                  onChange={e => set('campo', e.target.value)}
                  className={inputClass}
                  required
                >
                  <option value="">Selecciona...</option>
                  {fields.map(f => <option key={f.id} value={f.label}>{f.label}</option>)}
                </select>

                {/* Valor actual del campo seleccionado */}
                {currentValue && (
                  <div className="mt-2 px-3.5 py-2.5 bg-bg rounded-lg border border-border-base">
                    <span className="text-[0.68rem] text-text-muted uppercase tracking-wider">Valor actual: </span>
                    <span className="text-[0.82rem] text-text-secondary italic">{currentValue.length > 200 ? currentValue.slice(0, 200) + '…' : currentValue}</span>
                  </div>
                )}
              </div>

              {/* Para árbol: personaje(s) afectado(s) */}
              {!isCharacter && (
                <div>
                  <label className={labelClass}>Personaje(s) o nodo(s) involucrado(s)</label>
                  <input
                    type="text"
                    value={form.notas}
                    onChange={e => set('notas', e.target.value)}
                    placeholder="Ej: Zeus, Cronos, nodo entre Zeus y Hera..."
                    className={inputClass}
                  />
                </div>
              )}

              {/* Sugerencia */}
              <div>
                <label className={labelClass}>
                  Tu sugerencia <span className="text-gold">*</span>
                </label>
                <textarea
                  value={form.sugerencia}
                  onChange={e => set('sugerencia', e.target.value)}
                  placeholder={isCharacter
                    ? 'Describe qué debería decir o qué información falta...'
                    : 'Describe el cambio que propones en el árbol...'}
                  rows={4}
                  className={textareaClass}
                  required
                />
              </div>

              {/* Fuente */}
              <div className="space-y-3">
                <div>
                  <label className={labelClass}>
                    Fuente de la información <span className="text-gold">*</span>
                  </label>
                  <input
                    type="text"
                    value={form.fuente}
                    onChange={e => set('fuente', e.target.value)}
                    placeholder="Ej: Teogonía de Hesíodo, Wikipedia en español, Biblioteca de Apolodoro..."
                    className={inputClass}
                    required
                  />
                </div>
                <div>
                  <label className={labelClass}>URL de la fuente (opcional)</label>
                  <input
                    type="url"
                    value={form.urlFuente}
                    onChange={e => set('urlFuente', e.target.value)}
                    placeholder="https://..."
                    className={inputClass}
                  />
                </div>
              </div>

              {/* Notas — solo personaje (árbol ya lo usa arriba para nodos) */}
              {isCharacter && (
                <div>
                  <label className={labelClass}>Contexto adicional (opcional)</label>
                  <textarea
                    value={form.notas}
                    onChange={e => set('notas', e.target.value)}
                    placeholder="Cualquier detalle extra que ayude a entender o verificar la sugerencia..."
                    rows={2}
                    className={textareaClass}
                  />
                </div>
              )}

              {/* Separador identidad */}
              <div className="relative flex items-center gap-3 py-1">
                <div className="h-px flex-1 bg-border-base" />
                <span className="text-[0.68rem] text-text-muted uppercase tracking-widest shrink-0">Sobre ti (opcional)</span>
                <div className="h-px flex-1 bg-border-base" />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className={labelClass}>Tu nombre</label>
                  <input
                    type="text"
                    value={form.nombre}
                    onChange={e => set('nombre', e.target.value)}
                    placeholder="Anónimo si lo prefieres"
                    className={inputClass}
                  />
                </div>
                <div>
                  <label className={labelClass}>Email de contacto</label>
                  <input
                    type="email"
                    value={form.emailContacto}
                    onChange={e => set('emailContacto', e.target.value)}
                    placeholder="Para hacerte saber si se aplica"
                    className={inputClass}
                  />
                </div>
              </div>

              {/* Error */}
              {status === 'error' && errorMsg && (
                <div className="px-4 py-3 bg-[rgba(220,38,38,0.1)] border border-[rgba(220,38,38,0.3)] rounded-lg text-[0.82rem] text-[#fca5a5]">
                  {errorMsg}
                </div>
              )}
              {errorMsg && status === 'idle' && (
                <div className="px-4 py-3 bg-[rgba(220,38,38,0.1)] border border-[rgba(220,38,38,0.3)] rounded-lg text-[0.82rem] text-[#fca5a5]">
                  {errorMsg}
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="px-6 py-4 border-t border-border-base flex items-center justify-between gap-3 shrink-0 bg-bg">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2.5 text-text-muted text-[0.82rem] font-display hover:text-text-primary transition-colors duration-150"
              >
                Cancelar
              </button>
              <button
                type="submit"
                disabled={status === 'loading'}
                className="px-6 py-2.5 bg-gold text-bg font-display text-[0.82rem] rounded-lg hover:bg-gold-light transition-colors duration-150 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                {status === 'loading' ? (
                  <>
                    <span className="inline-block w-3.5 h-3.5 border-2 border-bg border-t-transparent rounded-full animate-spin" />
                    Enviando...
                  </>
                ) : (
                  'Enviar sugerencia →'
                )}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );

  return createPortal(modal, document.body);
}
