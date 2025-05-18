import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm'
import { SUPABASE_URL, SUPABASE_KEY } from './config.js'

export const supabase = createClient(SUPABASE_URL, SUPABASE_KEY)

export async function signup() {
  const email = document.getElementById('email').value
  const password = document.getElementById('password').value
  const { error } = await supabase.auth.signUp({ email, password })
  document.getElementById('auth-msg').textContent = error ? error.message : 'Revisa tu correo para confirmar el registro'
}

export async function login() {
  const email = document.getElementById('email').value
  const password = document.getElementById('password').value
  const { data, error } = await supabase.auth.signInWithPassword({ email, password })

  if (error) {
    document.getElementById('auth-msg').textContent = error.message
  } else {
    document.getElementById('auth').style.display = 'none'
    document.getElementById('game').style.display = 'block'
    startGame()
  }
}

export async function logout() {
  await supabase.auth.signOut()
  document.getElementById('auth').style.display = 'block'
  document.getElementById('game').style.display = 'none'
}
