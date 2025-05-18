import { saveProgress, loadProgress } from './progress.js'
import { supabase } from './supabaseClient.js'

const INGREDIENTS = [
  { name: "Cáscara de plátano", compostable: true },
  { name: "Papel", compostable: true },
  { name: "Restos de lechuga", compostable: true },
  { name: "Cáscara de huevo", compostable: true },
  { name: "Botella de plástico", compostable: false },
  { name: "Vidrio", compostable: false },
  { name: "Lata", compostable: false },
  { name: "Servilleta usada", compostable: true },
]

let inventory = []
let compost = []
let day = 1
let temperature = 20
let humidity = 50
let decomposition = 0

let currentUser = null
let timer = null

export function setCurrentUser(user) {
  currentUser = user
}

export function generateIngredients() {
  const container = document.getElementById("ingredient-list")
  container.innerHTML = ""

  const shuffled = INGREDIENTS.sort(() => 0.5 - Math.random()).slice(0, 3)

  for (let ing of shuffled) {
    const el = document.createElement("button")
    el.textContent = ing.name
    el.onclick = () => collectIngredient(ing)
    container.appendChild(el)
  }
}

function collectIngredient(ingredient) {
  if (!confirm(`¿Agregar ${ingredient.name} al compost?`)) return
  compost.push(ingredient)
  updateCompostUI()
  saveGameState()
}

function updateInventoryUI() {
  const list = document.getElementById("inventory-list")
  list.innerHTML = ""
  for (let ing of inventory) {
    const li = document.createElement("li")
    li.textContent = `${ing.name} ${ing.compostable ? '✅' : '❌'}`
    list.appendChild(li)
  }
}

function updateCompostUI() {
  const list = document.getElementById("compost-list")
  list.innerHTML = ""
  for (let ing of compost) {
    const li = document.createElement("li")
    li.textContent = `${ing.name} ${ing.compostable ? '✅' : '❌'}`
    list.appendChild(li)
  }
  updateCompostStatus()
}

function updateCompostStatus() {
  const status = document.getElementById("compost-status")
  if (compost.length === 0) {
    status.textContent = "Vacío"
    return
  }

  const good = compost.filter(i => i.compostable).length
  const bad = compost.length - good
  const balance = good - bad

  if (balance >= 3) {
    status.textContent = "Ideal ✅"
  } else if (balance >= 1) {
    status.textContent = "Regular ⚠️"
  } else {
    status.textContent = "Malo ❌"
  }
}

function updateParameters() {
  const good = compost.filter(i => i.compostable).length
  const bad = compost.length - good

  temperature += good * 1.5 - bad * 1
  if (temperature > 70) temperature = 70
  if (temperature < 10) temperature = 10

  humidity += Math.random() * 10 - 5
  if (humidity > 100) humidity = 100
  if (humidity < 0) humidity = 0

  const balance = good - bad
  if (balance > 0) {
    decomposition += balance * 2
  } else {
    decomposition -= Math.abs(balance)
  }

  if (decomposition > 100) decomposition = 100
  if (decomposition < 0) decomposition = 0

  document.getElementById("temp").textContent = `${temperature.toFixed(1)} °C`
  document.getElementById("humidity").textContent = `${humidity.toFixed(0)} %`
  document.getElementById("decomp").textContent = `${decomposition.toFixed(0)} %`
}

function updateUI() {
  document.getElementById("day-count").textContent = day
  updateInventoryUI()
  updateCompostUI()
  updateParameters()
}

async function saveGameState() {
  if (!currentUser) return
  await saveProgress(currentUser.id, {
    day,
    inventory,
    compost,
    temperature,
    humidity,
    decomposition,
  })
}

export async function startGame() {
  if (!currentUser) {
    alert("Debes iniciar sesión para comenzar el juego.")
    return
  }
  const progress = await loadProgress(currentUser.id)
  if (progress) {
    day = progress.day
    inventory = progress.inventory || []
    compost = progress.compost || []
    temperature = progress.temperature || 20
    humidity = progress.humidity || 50
    decomposition = progress.decomposition || 0
  } else {
    day = 1
    inventory = []
    compost = []
    temperature = 20
    humidity = 50
    decomposition = 0
  }

  updateUI()
  generateIngredients()

  if (timer) clearInterval(timer)
  timer = setInterval(async () => {
    if (day < 7) {
      day++
      generateIngredients()
      updateParameters()
      updateUI()
      await saveGameState()
    } else {
      clearInterval(timer)
      alert('¡Has completado los 7 días de compost!')
      await saveGameState()
    }
  }, 5 * 60 * 1000) // 5 minutos reales = 1 día en juego
}
