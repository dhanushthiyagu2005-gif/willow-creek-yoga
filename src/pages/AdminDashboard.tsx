import { useEffect, useState, useCallback } from 'react';
import {
  Shield, Plus, Pencil, Trash2, X, Calendar, Users, Dumbbell,
  GraduationCap, Clock, DollarSign, CheckCircle2, XCircle
} from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/context/AuthContext';
import { Spinner, EmptyState } from '@/components/ui/Feedback';
import Modal from '@/components/ui/Modal';
import { DAYS, DIFFICULTY_LABELS } from '@/lib/constants';
import type {
  YogaClass, Trainer, Schedule, Booking, DayOfWeek, ClassDifficulty,
} from '@/lib/types';
import type { ToastType } from '@/components/ui/Toast';

interface AdminDashboardProps {
  showToast: (type: ToastType, message: string) => void;
}

type Tab = 'classes' | 'schedules' | 'trainers' | 'bookings';

export default function AdminDashboard({ showToast }: AdminDashboardProps) {
  const { profile } = useAuth();
  const [tab, setTab] = useState<Tab>('classes');
  const [classes, setClasses] = useState<YogaClass[]>([]);
  const [trainers, setTrainers] = useState<Trainer[]>([]);
  const [schedules, setSchedules] = useState<Schedule[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<any>(null);

  const loadData = useCallback(async () => {
    const [c, t, s, b] = await Promise.all([
      supabase.from('classes').select('*').order('name'),
      supabase.from('trainers').select('*').order('name'),
      supabase.from('schedules').select('*').order('day_of_week'),
      supabase.from('bookings').select('*').order('created_at', { ascending: false }),
    ]);
    setClasses((c.data || []) as YogaClass[]);
    setTrainers((t.data || []) as Trainer[]);
    setSchedules((s.data || []) as Schedule[]);
    setBookings((b.data || []) as Booking[]);
    setLoading(false);
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const classMap: Record<string, YogaClass> = {};
  classes.forEach((c) => (classMap[c.id] = c));
  const trainerMap: Record<string, Trainer> = {};
  trainers.forEach((t) => (trainerMap[t.id] = t));

  const handleDelete = async (table: string, id: string, name: string) => {
    if (!confirm(`Delete "${name}"? This cannot be undone.`)) return;
    const { error } = await supabase.from(table).delete().eq('id', id);
    if (error) {
      showToast('error', `Could not delete: ${error.message}`);
    } else {
      showToast('success', 'Deleted successfully.');
      loadData();
    }
  };

  const openCreate = () => {
    setEditingItem(null);
    setModalOpen(true);
  };

  const openEdit = (item: any) => {
    setEditingItem(item);
    setModalOpen(true);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-cream pt-20">
        <Spinner size={40} className="text-sage-600" />
      </div>
    );
  }

  const tabs: { key: Tab; label: string; icon: typeof Shield; count: number }[] = [
    { key: 'classes', label: 'Classes', icon: Dumbbell, count: classes.length },
    { key: 'schedules', label: 'Schedules', icon: Calendar, count: schedules.length },
    { key: 'trainers', label: 'Trainers', icon: GraduationCap, count: trainers.length },
    { key: 'bookings', label: 'Bookings', icon: Users, count: bookings.length },
  ];

  return (
    <div className="min-h-screen bg-sage-50/30 pt-24 pb-20">
      <div className="max-w-6xl mx-auto px-6">
        {/* Header */}
        <div className="mb-10">
          <div className="flex items-center gap-3 mb-3">
            <Shield className="text-clay-600" size={28} />
            <p className="section-label !text-clay-600">Admin Panel</p>
          </div>
          <h1 className="text-4xl text-ink mb-2">
            Manage <span className="italic text-sage-600">Willow Creek</span>
          </h1>
          <p className="text-ink/50">Signed in as {profile?.email}</p>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-8 overflow-x-auto scrollbar-hide">
          {tabs.map((t) => (
            <button
              key={t.key}
              onClick={() => setTab(t.key)}
              className={`flex items-center gap-2 px-5 py-3 rounded-xl text-sm font-medium whitespace-nowrap transition-all ${
                tab === t.key
                  ? 'bg-sage-600 text-cream shadow-lg shadow-sage-900/15'
                  : 'bg-white text-ink/60 hover:bg-sage-50 border border-sage-100'
              }`}
            >
              <t.icon size={16} />
              {t.label}
              <span className={`text-xs px-2 py-0.5 rounded-full ${tab === t.key ? 'bg-cream/20' : 'bg-sage-50'}`}>
                {t.count}
              </span>
            </button>
          ))}
        </div>

        {/* Classes Tab */}
        {tab === 'classes' && (
          <AdminSection
            title="Yoga Classes"
            onAdd={openCreate}
            addLabel="Add Class"
          >
            {classes.length === 0 ? (
              <EmptyState icon={<Dumbbell size={40} />} title="No classes yet" />
            ) : (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
                {classes.map((cls) => (
                  <div key={cls.id} className="card overflow-hidden">
                    <div className="relative h-36">
                      <img src={cls.image_url} alt={cls.name} className="w-full h-full object-cover" />
                      <span className="absolute top-3 left-3 bg-cream/90 text-ink text-xs px-2.5 py-1 rounded-full font-medium">
                        {DIFFICULTY_LABELS[cls.difficulty]}
                      </span>
                    </div>
                    <div className="p-4">
                      <h4 className="text-lg text-ink mb-1">{cls.name}</h4>
                      <p className="text-xs text-ink/50 mb-3 line-clamp-2">{cls.description}</p>
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-ink/40">{cls.duration_min} min</span>
                        <div className="flex gap-2">
                          <button onClick={() => openEdit(cls)} className="p-2 rounded-lg text-ink/50 hover:bg-sage-50 hover:text-sage-700">
                            <Pencil size={16} />
                          </button>
                          <button onClick={() => handleDelete('classes', cls.id, cls.name)} className="p-2 rounded-lg text-ink/50 hover:bg-clay-50 hover:text-clay-600">
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </AdminSection>
        )}

        {/* Schedules Tab */}
        {tab === 'schedules' && (
          <AdminSection title="Class Schedule" onAdd={openCreate} addLabel="Add Schedule">
            {schedules.length === 0 ? (
              <EmptyState icon={<Calendar size={40} />} title="No schedules yet" />
            ) : (
              <div className="card overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-sage-100 text-left text-ink/50">
                        <th className="px-5 py-3 font-medium">Class</th>
                        <th className="px-5 py-3 font-medium">Day</th>
                        <th className="px-5 py-3 font-medium">Time</th>
                        <th className="px-5 py-3 font-medium">Trainer</th>
                        <th className="px-5 py-3 font-medium">Capacity</th>
                        <th className="px-5 py-3 font-medium">Price</th>
                        <th className="px-5 py-3 font-medium">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {schedules.map((s) => (
                        <tr key={s.id} className="border-b border-sage-50 hover:bg-sage-50/40">
                          <td className="px-5 py-4 text-ink/70">{classMap[s.class_id]?.name || '—'}</td>
                          <td className="px-5 py-4 text-ink/50 capitalize">{s.day_of_week}</td>
                          <td className="px-5 py-4 text-ink/50">{s.start_time}–{s.end_time}</td>
                          <td className="px-5 py-4 text-ink/50">{s.trainer_id ? trainerMap[s.trainer_id]?.name || '—' : 'TBA'}</td>
                          <td className="px-5 py-4 text-ink/50">{s.capacity}</td>
                          <td className="px-5 py-4 text-ink/50">${s.price}</td>
                          <td className="px-5 py-4">
                            <div className="flex gap-2">
                              <button onClick={() => openEdit(s)} className="p-1.5 rounded-lg text-ink/50 hover:bg-sage-50 hover:text-sage-700">
                                <Pencil size={15} />
                              </button>
                              <button onClick={() => handleDelete('schedules', s.id, 'schedule')} className="p-1.5 rounded-lg text-ink/50 hover:bg-clay-50 hover:text-clay-600">
                                <Trash2 size={15} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </AdminSection>
        )}

        {/* Trainers Tab */}
        {tab === 'trainers' && (
          <AdminSection title="Trainers" onAdd={openCreate} addLabel="Add Trainer">
            {trainers.length === 0 ? (
              <EmptyState icon={<GraduationCap size={40} />} title="No trainers yet" />
            ) : (
              <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
                {trainers.map((t) => (
                  <div key={t.id} className="card overflow-hidden">
                    <div className="relative h-48">
                      <img src={t.image_url} alt={t.name} className="w-full h-full object-cover" />
                    </div>
                    <div className="p-4">
                      <h4 className="text-lg text-ink">{t.name}</h4>
                      <p className="text-xs text-sage-600 mb-2">{t.specialty}</p>
                      <p className="text-xs text-ink/40 line-clamp-2 mb-3">{t.bio}</p>
                      <div className="flex justify-end gap-2">
                        <button onClick={() => openEdit(t)} className="p-2 rounded-lg text-ink/50 hover:bg-sage-50 hover:text-sage-700">
                          <Pencil size={16} />
                        </button>
                        <button onClick={() => handleDelete('trainers', t.id, t.name)} className="p-2 rounded-lg text-ink/50 hover:bg-clay-50 hover:text-clay-600">
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </AdminSection>
        )}

        {/* Bookings Tab */}
        {tab === 'bookings' && (
          <AdminSection title="User Bookings">
            {bookings.length === 0 ? (
              <EmptyState icon={<Users size={40} />} title="No bookings yet" />
            ) : (
              <div className="card overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-sage-100 text-left text-ink/50">
                        <th className="px-5 py-3 font-medium">User ID</th>
                        <th className="px-5 py-3 font-medium">Class</th>
                        <th className="px-5 py-3 font-medium">Date</th>
                        <th className="px-5 py-3 font-medium">Amount</th>
                        <th className="px-5 py-3 font-medium">Payment</th>
                        <th className="px-5 py-3 font-medium">Status</th>
                        <th className="px-5 py-3 font-medium">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {bookings.map((b) => (
                        <tr key={b.id} className="border-b border-sage-50 hover:bg-sage-50/40">
                          <td className="px-5 py-4 text-ink/50 font-mono text-xs">{b.user_id.slice(0, 8)}</td>
                          <td className="px-5 py-4 text-ink/70">{classMap[b.class_id]?.name || '—'}</td>
                          <td className="px-5 py-4 text-ink/50">{new Date(b.booking_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</td>
                          <td className="px-5 py-4 text-ink/50">${b.amount}</td>
                          <td className="px-5 py-4">
                            <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${
                              b.payment_status === 'paid' ? 'bg-forest-100 text-forest-700'
                              : b.payment_status === 'failed' ? 'bg-clay-100 text-clay-700'
                              : 'bg-sand-100 text-sand-700'
                            }`}>{b.payment_status}</span>
                          </td>
                          <td className="px-5 py-4">
                            <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${
                              b.status === 'confirmed' ? 'bg-sage-100 text-sage-700'
                              : b.status === 'cancelled' ? 'bg-clay-100 text-clay-700'
                              : 'bg-forest-100 text-forest-700'
                            }`}>{b.status}</span>
                          </td>
                          <td className="px-5 py-4">
                            {b.status === 'confirmed' && (
                              <button
                                onClick={async () => {
                                  await supabase.from('bookings').update({ status: 'cancelled' }).eq('id', b.id);
                                  showToast('success', 'Booking cancelled.');
                                  loadData();
                                }}
                                className="text-xs text-clay-600 hover:text-clay-700 font-medium"
                              >
                                Cancel
                              </button>
                            )}
                            {b.status === 'cancelled' && (
                              <button
                                onClick={async () => {
                                  await supabase.from('bookings').update({ status: 'confirmed' }).eq('id', b.id);
                                  showToast('success', 'Booking restored.');
                                  loadData();
                                }}
                                className="text-xs text-sage-600 hover:text-sage-700 font-medium"
                              >
                                Restore
                              </button>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </AdminSection>
        )}
      </div>

      <EditModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        tab={tab}
        item={editingItem}
        classes={classes}
        trainers={trainers}
        showToast={showToast}
        onSaved={loadData}
      />
    </div>
  );
}

function AdminSection({ title, onAdd, addLabel, children }: {
  title: string; onAdd?: () => void; addLabel?: string; children: React.ReactNode;
}) {
  return (
    <div>
      <div className="flex items-center justify-between mb-5">
        <h2 className="text-2xl text-ink">{title}</h2>
        {onAdd && (
          <button onClick={onAdd} className="btn-primary !py-2.5 text-sm">
            <Plus size={18} /> {addLabel}
          </button>
        )}
      </div>
      {children}
    </div>
  );
}

function EditModal({
  isOpen, onClose, tab, item, classes, trainers, showToast, onSaved,
}: {
  isOpen: boolean;
  onClose: () => void;
  tab: Tab;
  item: any;
  classes: YogaClass[];
  trainers: Trainer[];
  showToast: (type: ToastType, message: string) => void;
  onSaved: () => void;
}) {
  if (!isOpen) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={item ? 'Edit' : 'Create New'} maxWidth="max-w-xl">
      {tab === 'classes' && (
        <ClassForm item={item} showToast={showToast} onSaved={() => { onSaved(); onClose(); }} />
      )}
      {tab === 'schedules' && (
        <ScheduleForm item={item} classes={classes} trainers={trainers} showToast={showToast} onSaved={() => { onSaved(); onClose(); }} />
      )}
      {tab === 'trainers' && (
        <TrainerForm item={item} showToast={showToast} onSaved={() => { onSaved(); onClose(); }} />
      )}
    </Modal>
  );
}

function FormField({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="block text-sm font-medium text-ink mb-2">{label}</label>
      {children}
    </div>
  );
}

function ClassForm({ item, showToast, onSaved }: { item: YogaClass | null; showToast: (t: ToastType, m: string) => void; onSaved: () => void }) {
  const [form, setForm] = useState({
    name: item?.name || '',
    description: item?.description || '',
    difficulty: item?.difficulty || 'beginner',
    duration_min: item?.duration_min || 60,
    image_url: item?.image_url || '',
    trainer_id: item?.trainer_id || '',
  });
  const [saving, setSaving] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    const payload = { ...form, trainer_id: form.trainer_id || null, duration_min: Number(form.duration_min) };
    const { error } = item
      ? await supabase.from('classes').update(payload).eq('id', item.id)
      : await supabase.from('classes').insert(payload);
    setSaving(false);
    if (error) { showToast('error', error.message); return; }
    showToast('success', item ? 'Class updated.' : 'Class created.');
    onSaved();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <FormField label="Name"><input className="input-field" required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} /></FormField>
      <FormField label="Description"><textarea className="input-field resize-none" rows={3} required value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} /></FormField>
      <div className="grid grid-cols-2 gap-4">
        <FormField label="Difficulty">
          <select className="input-field" value={form.difficulty} onChange={(e) => setForm({ ...form, difficulty: e.target.value as ClassDifficulty })}>
            <option value="beginner">Beginner</option>
            <option value="intermediate">Intermediate</option>
            <option value="advanced">Advanced</option>
            <option value="all">All Levels</option>
          </select>
        </FormField>
        <FormField label="Duration (min)"><input type="number" className="input-field" required value={form.duration_min} onChange={(e) => setForm({ ...form, duration_min: Number(e.target.value) })} /></FormField>
      </div>
      <FormField label="Image URL"><input className="input-field" value={form.image_url} onChange={(e) => setForm({ ...form, image_url: e.target.value })} placeholder="https://..." /></FormField>
      <button type="submit" disabled={saving} className="btn-primary w-full disabled:opacity-60">{saving ? <Spinner size={18} /> : 'Save'}</button>
    </form>
  );
}

function ScheduleForm({ item, classes, trainers, showToast, onSaved }: {
  item: Schedule | null; classes: YogaClass[]; trainers: Trainer[];
  showToast: (t: ToastType, m: string) => void; onSaved: () => void;
}) {
  const [form, setForm] = useState({
    class_id: item?.class_id || '',
    trainer_id: item?.trainer_id || '',
    day_of_week: item?.day_of_week || 'monday',
    start_time: item?.start_time || '07:00',
    end_time: item?.end_time || '08:00',
    capacity: item?.capacity || 15,
    price: item?.price || 25,
  });
  const [saving, setSaving] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    const payload = { ...form, trainer_id: form.trainer_id || null, capacity: Number(form.capacity), price: Number(form.price) };
    const { error } = item
      ? await supabase.from('schedules').update(payload).eq('id', item.id)
      : await supabase.from('schedules').insert(payload);
    setSaving(false);
    if (error) { showToast('error', error.message); return; }
    showToast('success', item ? 'Schedule updated.' : 'Schedule created.');
    onSaved();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <FormField label="Class">
        <select className="input-field" required value={form.class_id} onChange={(e) => setForm({ ...form, class_id: e.target.value })}>
          <option value="">Select a class</option>
          {classes.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
        </select>
      </FormField>
      <FormField label="Trainer">
        <select className="input-field" value={form.trainer_id} onChange={(e) => setForm({ ...form, trainer_id: e.target.value })}>
          <option value="">No trainer assigned</option>
          {trainers.map((t) => <option key={t.id} value={t.id}>{t.name}</option>)}
        </select>
      </FormField>
      <div className="grid grid-cols-2 gap-4">
        <FormField label="Day">
          <select className="input-field" value={form.day_of_week} onChange={(e) => setForm({ ...form, day_of_week: e.target.value as DayOfWeek })}>
            {DAYS.map((d) => <option key={d.value} value={d.value}>{d.label}</option>)}
          </select>
        </FormField>
        <FormField label="Capacity"><input type="number" className="input-field" required value={form.capacity} onChange={(e) => setForm({ ...form, capacity: Number(e.target.value) })} /></FormField>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <FormField label="Start Time"><input type="time" className="input-field" required value={form.start_time} onChange={(e) => setForm({ ...form, start_time: e.target.value })} /></FormField>
        <FormField label="End Time"><input type="time" className="input-field" required value={form.end_time} onChange={(e) => setForm({ ...form, end_time: e.target.value })} /></FormField>
      </div>
      <FormField label="Price ($)"><input type="number" step="0.01" className="input-field" required value={form.price} onChange={(e) => setForm({ ...form, price: Number(e.target.value) })} /></FormField>
      <button type="submit" disabled={saving} className="btn-primary w-full disabled:opacity-60">{saving ? <Spinner size={18} /> : 'Save'}</button>
    </form>
  );
}

function TrainerForm({ item, showToast, onSaved }: { item: Trainer | null; showToast: (t: ToastType, m: string) => void; onSaved: () => void }) {
  const [form, setForm] = useState({
    name: item?.name || '',
    bio: item?.bio || '',
    specialty: item?.specialty || '',
    image_url: item?.image_url || '',
    experience: item?.experience || 0,
  });
  const [saving, setSaving] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    const payload = { ...form, experience: Number(form.experience) };
    const { error } = item
      ? await supabase.from('trainers').update(payload).eq('id', item.id)
      : await supabase.from('trainers').insert(payload);
    setSaving(false);
    if (error) { showToast('error', error.message); return; }
    showToast('success', item ? 'Trainer updated.' : 'Trainer added.');
    onSaved();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <FormField label="Name"><input className="input-field" required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} /></FormField>
      <FormField label="Specialty"><input className="input-field" required value={form.specialty} onChange={(e) => setForm({ ...form, specialty: e.target.value })} placeholder="Hatha & Vinyasa" /></FormField>
      <FormField label="Bio"><textarea className="input-field resize-none" rows={3} required value={form.bio} onChange={(e) => setForm({ ...form, bio: e.target.value })} /></FormField>
      <div className="grid grid-cols-2 gap-4">
        <FormField label="Experience (years)"><input type="number" className="input-field" value={form.experience} onChange={(e) => setForm({ ...form, experience: Number(e.target.value) })} /></FormField>
        <FormField label="Image URL"><input className="input-field" value={form.image_url} onChange={(e) => setForm({ ...form, image_url: e.target.value })} placeholder="https://..." /></FormField>
      </div>
      <button type="submit" disabled={saving} className="btn-primary w-full disabled:opacity-60">{saving ? <Spinner size={18} /> : 'Save'}</button>
    </form>
  );
}
