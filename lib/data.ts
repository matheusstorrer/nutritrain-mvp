export interface MealItem {
  name: string
  quantity: string
  kcal: number
  protein: number
  carbs: number
  fat: number
}

export interface Meal {
  name: string
  time: string
  icon: string
  items: MealItem[]
}

export interface DietPlan {
  id: string
  name: string
  totalKcal: number
  protein: number
  carbs: number
  fat: number
  meals: Meal[]
  updatedAt: string
}

export interface Exercise {
  name: string
  muscle: string
  sets: number
  reps: string
  rest: string
  load: string
  emoji: string
}

export interface WorkoutDay {
  focus: string
  duration: number
  exercises: Exercise[]
}

export interface WorkoutPlan {
  id: string
  name: string
  daysPerWeek: number
  days: Partial<Record<string, WorkoutDay>>
  updatedAt: string
}

export interface Student {
  id: string
  name: string
  email: string
  password: string
  age: number
  height: number
  weight: number
  goal: string
  phone: string
  nutritionist: string
  trainer: string
  plans: ('diet' | 'workout')[]
  status: 'active' | 'pending' | 'new'
  lastUpdate: string
  initials: string
  avatarColor: string
  dietPlanId: string | null
  workoutPlanId: string | null
  obs: string
}

export const WEEK_DAYS = ['Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado', 'Domingo']

export const dietPlans: Record<string, DietPlan> = {
  dp1: {
    id: 'dp1',
    name: 'Emagrecimento Progressivo',
    totalKcal: 1600,
    protein: 120,
    carbs: 180,
    fat: 44,
    updatedAt: '23/04/2025',
    meals: [
      {
        name: 'Café da Manhã',
        time: '07:00',
        icon: '🌅',
        items: [
          { name: 'Aveia em flocos', quantity: '40g', kcal: 148, protein: 5, carbs: 27, fat: 3 },
          { name: 'Banana prata', quantity: '1 un (120g)', kcal: 89, protein: 1, carbs: 22, fat: 0 },
          { name: 'Leite desnatado', quantity: '200ml', kcal: 83, protein: 7, carbs: 12, fat: 1 },
        ],
      },
      {
        name: 'Lanche da Manhã',
        time: '10:00',
        icon: '🥛',
        items: [
          { name: 'Iogurte grego natural', quantity: '170g', kcal: 120, protein: 12, carbs: 8, fat: 4 },
          { name: 'Frutas vermelhas mistas', quantity: '50g', kcal: 28, protein: 0, carbs: 6, fat: 0 },
          { name: 'Mel', quantity: '1 col chá (5g)', kcal: 15, protein: 0, carbs: 4, fat: 0 },
        ],
      },
      {
        name: 'Almoço',
        time: '12:30',
        icon: '🍽️',
        items: [
          { name: 'Arroz integral cozido', quantity: '120g', kcal: 156, protein: 3, carbs: 34, fat: 1 },
          { name: 'Feijão carioca', quantity: '80g', kcal: 58, protein: 4, carbs: 10, fat: 0 },
          { name: 'Frango grelhado', quantity: '150g', kcal: 248, protein: 37, carbs: 0, fat: 5 },
          { name: 'Salada folhosa variada', quantity: 'à vontade', kcal: 20, protein: 1, carbs: 3, fat: 0 },
          { name: 'Azeite de oliva extra virgem', quantity: '1 col sopa', kcal: 90, protein: 0, carbs: 0, fat: 10 },
        ],
      },
      {
        name: 'Lanche da Tarde',
        time: '16:00',
        icon: '🍎',
        items: [
          { name: 'Maçã fuji', quantity: '1 un (180g)', kcal: 95, protein: 0, carbs: 25, fat: 0 },
          { name: 'Castanha do Pará', quantity: '3 un (9g)', kcal: 62, protein: 1, carbs: 1, fat: 6 },
        ],
      },
      {
        name: 'Jantar',
        time: '19:30',
        icon: '🌙',
        items: [
          { name: 'Omelete de claras', quantity: '3 claras + 1 ovo', kcal: 140, protein: 18, carbs: 0, fat: 7 },
          { name: 'Quinoa cozida', quantity: '80g', kcal: 92, protein: 4, carbs: 16, fat: 1 },
          { name: 'Mix de legumes grelhados', quantity: '150g', kcal: 60, protein: 2, carbs: 12, fat: 0 },
        ],
      },
    ],
  },
  dp2: {
    id: 'dp2',
    name: 'Ganho de Massa',
    totalKcal: 2800,
    protein: 200,
    carbs: 320,
    fat: 70,
    updatedAt: '20/04/2025',
    meals: [
      {
        name: 'Café da Manhã',
        time: '07:00',
        icon: '🌅',
        items: [
          { name: 'Ovos mexidos', quantity: '3 ovos', kcal: 215, protein: 18, carbs: 0, fat: 14 },
          { name: 'Pão integral', quantity: '2 fatias (60g)', kcal: 140, protein: 6, carbs: 26, fat: 2 },
          { name: 'Whey protein', quantity: '1 scoop (30g)', kcal: 120, protein: 24, carbs: 3, fat: 2 },
          { name: 'Banana', quantity: '1 un', kcal: 89, protein: 1, carbs: 22, fat: 0 },
        ],
      },
      {
        name: 'Almoço',
        time: '12:00',
        icon: '🍽️',
        items: [
          { name: 'Arroz branco', quantity: '200g', kcal: 260, protein: 5, carbs: 56, fat: 0 },
          { name: 'Carne bovina magra', quantity: '180g', kcal: 270, protein: 36, carbs: 0, fat: 14 },
          { name: 'Feijão', quantity: '100g', kcal: 76, protein: 5, carbs: 13, fat: 0 },
          { name: 'Legumes', quantity: '100g', kcal: 40, protein: 2, carbs: 8, fat: 0 },
        ],
      },
      {
        name: 'Lanche Pré-Treino',
        time: '16:00',
        icon: '⚡',
        items: [
          { name: 'Tapioca com frango', quantity: '80g tapioca + 100g frango', kcal: 320, protein: 28, carbs: 44, fat: 3 },
          { name: 'Suco de laranja natural', quantity: '300ml', kcal: 130, protein: 2, carbs: 30, fat: 0 },
        ],
      },
      {
        name: 'Pós-Treino',
        time: '19:30',
        icon: '💪',
        items: [
          { name: 'Whey protein', quantity: '2 scoops (60g)', kcal: 240, protein: 48, carbs: 6, fat: 4 },
          { name: 'Batata doce cozida', quantity: '150g', kcal: 135, protein: 2, carbs: 31, fat: 0 },
        ],
      },
    ],
  },
}

export const workoutPlans: Record<string, WorkoutPlan> = {
  wp1: {
    id: 'wp1',
    name: 'Hipertrofia ABC',
    daysPerWeek: 4,
    updatedAt: '22/04/2025',
    days: {
      Segunda: {
        focus: 'Peito & Tríceps',
        duration: 60,
        exercises: [
          { name: 'Supino Reto com Barra', muscle: 'Peitoral maior, deltóide anterior, tríceps', sets: 4, reps: '10–12', rest: '60s', load: '40kg', emoji: '🏋️' },
          { name: 'Supino Inclinado Halteres', muscle: 'Peitoral superior', sets: 3, reps: '12', rest: '60s', load: '14kg', emoji: '🏋️' },
          { name: 'Crucifixo Inclinado', muscle: 'Peitoral, amplitude', sets: 3, reps: '12–15', rest: '45s', load: '10kg', emoji: '🤸' },
          { name: 'Tríceps Corda na Polia', muscle: 'Tríceps — cabeça lateral', sets: 3, reps: '15', rest: '45s', load: '25kg', emoji: '💪' },
          { name: 'Mergulho no Banco', muscle: 'Tríceps, peitoral inferior', sets: 3, reps: 'Até falha', rest: '60s', load: 'Peso corporal', emoji: '🔄' },
        ],
      },
      Terça: {
        focus: 'Costas & Bíceps',
        duration: 65,
        exercises: [
          { name: 'Puxada Frontal (Barra)', muscle: 'Latíssimo do dorso', sets: 4, reps: '10', rest: '60s', load: '50kg', emoji: '🏋️' },
          { name: 'Remada Curvada com Barra', muscle: 'Trapézio, rombóides', sets: 3, reps: '10–12', rest: '60s', load: '40kg', emoji: '🏋️' },
          { name: 'Remada Unilateral Halter', muscle: 'Dorsais, bíceps', sets: 3, reps: '12', rest: '45s', load: '18kg', emoji: '🏋️' },
          { name: 'Rosca Direta com Barra', muscle: 'Bíceps braquial', sets: 3, reps: '12', rest: '45s', load: '20kg', emoji: '💪' },
          { name: 'Rosca Martelo Alternada', muscle: 'Braquiorradial, bíceps', sets: 3, reps: '12', rest: '45s', load: '12kg', emoji: '💪' },
        ],
      },
      Quarta: undefined,
      Quinta: {
        focus: 'Pernas Completo',
        duration: 75,
        exercises: [
          { name: 'Agachamento Livre', muscle: 'Quadríceps, glúteos, isquitiotibiais', sets: 4, reps: '10', rest: '90s', load: '60kg', emoji: '🏋️' },
          { name: 'Leg Press 45°', muscle: 'Quadríceps, glúteos', sets: 3, reps: '15', rest: '60s', load: '120kg', emoji: '🦵' },
          { name: 'Extensora', muscle: 'Quadríceps isolado', sets: 3, reps: '15', rest: '45s', load: '40kg', emoji: '🦵' },
          { name: 'Cadeira Flexora', muscle: 'Isquiotibiais', sets: 3, reps: '15', rest: '45s', load: '30kg', emoji: '🦵' },
          { name: 'Elevação de Panturrilha', muscle: 'Gastrocnêmio, sóleo', sets: 4, reps: '20', rest: '30s', load: '60kg', emoji: '🦶' },
        ],
      },
      Sexta: {
        focus: 'Ombro & Abdômen',
        duration: 55,
        exercises: [
          { name: 'Desenvolvimento Militar Barra', muscle: 'Deltóide anterior e médio', sets: 4, reps: '10', rest: '60s', load: '30kg', emoji: '🏋️' },
          { name: 'Elevação Lateral com Halter', muscle: 'Deltóide médio', sets: 3, reps: '15', rest: '45s', load: '8kg', emoji: '🤸' },
          { name: 'Elevação Frontal', muscle: 'Deltóide anterior', sets: 3, reps: '12', rest: '45s', load: '6kg', emoji: '🤸' },
          { name: 'Abdominal Supra', muscle: 'Reto abdominal superior', sets: 3, reps: '20', rest: '30s', load: 'Peso corporal', emoji: '🔥' },
          { name: 'Prancha Isométrica', muscle: 'Core completo', sets: 3, reps: '40s', rest: '30s', load: 'Peso corporal', emoji: '🔥' },
        ],
      },
      Sábado: undefined,
      Domingo: undefined,
    },
  },
  wp2: {
    id: 'wp2',
    name: 'Funcional Iniciante',
    daysPerWeek: 3,
    updatedAt: '18/04/2025',
    days: {
      Segunda: {
        focus: 'Membros Superiores',
        duration: 45,
        exercises: [
          { name: 'Flexão de Braço', muscle: 'Peitoral, tríceps', sets: 3, reps: '10', rest: '60s', load: 'Peso corporal', emoji: '💪' },
          { name: 'Agachamento com Halteres', muscle: 'Pernas completo', sets: 3, reps: '15', rest: '60s', load: '6kg', emoji: '🏋️' },
          { name: 'Remada com Elástico', muscle: 'Costas, bíceps', sets: 3, reps: '12', rest: '45s', load: 'Elástico médio', emoji: '🤸' },
        ],
      },
      Quarta: {
        focus: 'Core & Cardio',
        duration: 40,
        exercises: [
          { name: 'Abdominal Supra', muscle: 'Reto abdominal', sets: 3, reps: '20', rest: '30s', load: 'Peso corporal', emoji: '🔥' },
          { name: 'Prancha', muscle: 'Core completo', sets: 3, reps: '30s', rest: '30s', load: 'Peso corporal', emoji: '🔥' },
          { name: 'Burpee', muscle: 'Corpo todo', sets: 3, reps: '10', rest: '60s', load: 'Peso corporal', emoji: '⚡' },
        ],
      },
      Sexta: {
        focus: 'Membros Inferiores',
        duration: 45,
        exercises: [
          { name: 'Agachamento Sumo', muscle: 'Glúteos, adutores', sets: 3, reps: '15', rest: '60s', load: '8kg', emoji: '🦵' },
          { name: 'Avanço Alternado', muscle: 'Quadríceps, glúteos', sets: 3, reps: '12 cada', rest: '60s', load: 'Peso corporal', emoji: '🦵' },
          { name: 'Elevação de Quadril', muscle: 'Glúteos, isquiotibiais', sets: 3, reps: '20', rest: '45s', load: 'Peso corporal', emoji: '🍑' },
        ],
      },
    },
  },
}

export const students: Student[] = [
  {
    id: '1',
    name: 'Maria Fernanda Costa',
    email: 'maria@email.com',
    password: 'aluno123',
    age: 28,
    height: 165,
    weight: 68.5,
    goal: 'Emagrecimento',
    phone: '(11) 98765-4321',
    nutritionist: 'Ana Paula',
    trainer: 'Juliana Torres',
    plans: ['diet', 'workout'],
    status: 'active',
    lastUpdate: 'Hoje, 09:42',
    initials: 'MF',
    avatarColor: 'from-orange-400 to-red-500',
    dietPlanId: 'dp1',
    workoutPlanId: 'wp1',
    obs: 'Intolerante à lactose. Prefere proteínas magras. Treina às 18h.',
  },
  {
    id: '2',
    name: 'João Pedro Silva',
    email: 'joao@email.com',
    password: 'aluno123',
    age: 34,
    height: 178,
    weight: 82,
    goal: 'Ganho de massa',
    phone: '(21) 91234-5678',
    nutritionist: 'Ana Paula',
    trainer: '',
    plans: ['diet'],
    status: 'active',
    lastUpdate: 'Ontem, 16:30',
    initials: 'JP',
    avatarColor: 'from-blue-400 to-violet-500',
    dietPlanId: 'dp2',
    workoutPlanId: null,
    obs: 'Vegetariano. Trabalha em home office, prefere treinar pela manhã.',
  },
  {
    id: '3',
    name: 'Carla Beatriz Lima',
    email: 'carla@email.com',
    password: 'aluno123',
    age: 25,
    height: 162,
    weight: 58,
    goal: 'Condicionamento físico',
    phone: '(31) 99876-5432',
    nutritionist: 'Ana Paula',
    trainer: 'Juliana Torres',
    plans: ['diet', 'workout'],
    status: 'active',
    lastUpdate: '21/04, 11:15',
    initials: 'CB',
    avatarColor: 'from-emerald-400 to-teal-500',
    dietPlanId: 'dp1',
    workoutPlanId: 'wp2',
    obs: 'Pratica corrida nos fins de semana. Objetivo: 10km em setembro.',
  },
  {
    id: '4',
    name: 'Paulo Rodrigues',
    email: 'paulo@email.com',
    password: 'aluno123',
    age: 42,
    height: 175,
    weight: 95,
    goal: 'Emagrecimento',
    phone: '(51) 98877-6655',
    nutritionist: '',
    trainer: 'Juliana Torres',
    plans: ['workout'],
    status: 'pending',
    lastUpdate: '20/04, 08:50',
    initials: 'PR',
    avatarColor: 'from-purple-400 to-pink-500',
    dietPlanId: null,
    workoutPlanId: 'wp2',
    obs: 'Hipertensão controlada. Médico liberou exercícios aeróbicos e musculação leve.',
  },
  {
    id: '5',
    name: 'Roberta Mendes',
    email: 'roberta@email.com',
    password: 'aluno123',
    age: 30,
    height: 168,
    weight: 63,
    goal: 'Definição muscular',
    phone: '(41) 97766-8899',
    nutritionist: 'Ana Paula',
    trainer: 'Juliana Torres',
    plans: ['diet', 'workout'],
    status: 'new',
    lastUpdate: 'Hoje, 10:00',
    initials: 'RM',
    avatarColor: 'from-cyan-400 to-blue-500',
    dietPlanId: null,
    workoutPlanId: null,
    obs: 'Nova aluna. Aguardando consulta inicial para definir planos.',
  },
]

export const professionals = [
  { email: 'ana@nutritrain.pro', password: 'pro123', name: 'Ana Paula', role: 'Nutricionista' },
  { email: 'juliana@nutritrain.pro', password: 'pro123', name: 'Juliana Torres', role: 'Personal Trainer' },
]

export function getStoredStudents(): Student[] {
  if (typeof window === 'undefined') return []
  try {
    const raw = localStorage.getItem('nt_extra_students')
    return raw ? JSON.parse(raw) : []
  } catch { return [] }
}

export function getAllStudents(): Student[] {
  const extras = getStoredStudents()
  if (typeof window === 'undefined') return [...students, ...extras]
  try {
    const overrides: Record<string, Partial<Student>> = JSON.parse(localStorage.getItem('nt_student_overrides') ?? '{}')
    const base = students.map(s => overrides[s.id] ? { ...s, ...overrides[s.id] } : s)
    return [...base, ...extras]
  } catch {
    return [...students, ...extras]
  }
}

export function getStudent(id: string) {
  return getAllStudents().find((s) => s.id === id) ?? null
}

export function saveStudentPlanUpdate(studentId: string, updates: Partial<Pick<Student, 'dietPlanId' | 'workoutPlanId' | 'plans'>>) {
  if (typeof window === 'undefined') return
  try {
    const extras: Student[] = JSON.parse(localStorage.getItem('nt_extra_students') ?? '[]')
    const idx = extras.findIndex(s => s.id === studentId)
    if (idx >= 0) {
      extras[idx] = { ...extras[idx], ...updates }
      localStorage.setItem('nt_extra_students', JSON.stringify(extras))
      return
    }
    const overrides: Record<string, Partial<Student>> = JSON.parse(localStorage.getItem('nt_student_overrides') ?? '{}')
    overrides[studentId] = { ...(overrides[studentId] ?? {}), ...updates }
    localStorage.setItem('nt_student_overrides', JSON.stringify(overrides))
  } catch {}
}

export function getStoredExercises(planId: string, day: string): Exercise[] {
  if (typeof window === 'undefined') return []
  try {
    const raw = localStorage.getItem(`nt_ex_${planId}_${day}`)
    return raw ? JSON.parse(raw) : []
  } catch { return [] }
}

export function saveExercise(planId: string, day: string, exercise: Exercise) {
  if (typeof window === 'undefined') return
  try {
    const existing = getStoredExercises(planId, day)
    localStorage.setItem(`nt_ex_${planId}_${day}`, JSON.stringify([...existing, exercise]))
  } catch {}
}

export function getDietPlan(id: string | null) {
  if (!id) return null
  return dietPlans[id] ?? null
}

export function getWorkoutPlan(id: string | null) {
  if (!id) return null
  return workoutPlans[id] ?? null
}

export function totalKcal(meals: Meal[]) {
  return meals.reduce((sum, m) => sum + m.items.reduce((s, i) => s + i.kcal, 0), 0)
}
