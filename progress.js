import { supabase } from './supabaseClient.js'

export async function saveProgress(userId, data) {
  const { data: existing, error } = await supabase
    .from('user_progress')
    .select('*')
    .eq('user_id', userId)
    .single()

  if (error && error.code !== 'PGRST116') {
    console.error('Error al buscar progreso:', error)
    return false
  }

  if (existing) {
    const { error: updateError } = await supabase
      .from('user_progress')
      .update(data)
      .eq('user_id', userId)
    if (updateError) {
      console.error('Error al actualizar progreso:', updateError)
      return false
    }
  } else {
    const { error: insertError } = await supabase
      .from('user_progress')
      .insert([{ user_id: userId, ...data }])
    if (insertError) {
      console.error('Error al insertar progreso:', insertError)
      return false
    }
  }
  return true
}

export async function loadProgress(userId) {
  const { data, error } = await supabase
    .from('user_progress')
    .select('*')
    .eq('user_id', userId)
    .single()
  if (error) {
    console.error('Error al cargar progreso:', error)
    return null
  }
  return data
}
