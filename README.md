# NutriTrain Pro — MVP

## Como fazer deploy no Vercel

### 1. Criar repositório no GitHub
- Acesse github.com → New repository
- Nome: `nutritrain-mvp`
- Clique em "Create repository"

### 2. Subir o código
```bash
cd nutritrain-mvp
git init
git add .
git commit -m "feat: MVP NutriTrain Pro"
git remote add origin https://github.com/SEU_USUARIO/nutritrain-mvp.git
git push -u origin main
```

### 3. Deploy no Vercel
- Acesse vercel.com → "Add New Project"
- Importe o repositório do GitHub
- **Root Directory:** `nutritrain-mvp` (ou deixe em branco se já for a raiz)
- Clique em "Deploy"

Pronto! URL gerada automaticamente.

---

## Credenciais de demonstração

| Perfil | Email | Senha |
|--------|-------|-------|
| Profissional (Ana) | ana@nutritrain.pro | pro123 |
| Profissional (Juliana) | juliana@nutritrain.pro | pro123 |
| Aluno (Maria) | maria@email.com | aluno123 |
| Aluno (João) | joao@email.com | aluno123 |
| Aluno (Carla) | carla@email.com | aluno123 |

## Rotas

- `/` — Login
- `/dashboard` — Painel da profissional
- `/alunos` — Lista de alunos
- `/alunos/[1-5]` — Perfil do aluno (dieta + treino)
- `/portal` — Portal do aluno (mobile)
