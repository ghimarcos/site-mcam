import './input.css'
import { products } from './products.js' // CORREÇÃO: Adicionado .js para compatibilidade com módulos no navegador

// --- Seletores de Elementos do DOM ---
const categoryListEl = document.getElementById('category-list')
const productGridEl = document.getElementById('product-grid')
const categoryTitleEl = document.getElementById('category-title')
const paginationControlsEl = document.getElementById('pagination-controls')
const searchInputEl = document.getElementById('search-input') as HTMLInputElement

// --- Estado da Aplicação (a "memória" do site) ---
let currentCategory = 'Todos'
let currentPage = 1
let currentSearchTerm = ''
const productsPerPage = 6

// --- Lógica Principal de Renderização ---

/**
 * Função principal que redesenha a tela inteira com base no estado atual.
 */
function render() {
  if (!productGridEl || !categoryListEl || !categoryTitleEl || !paginationControlsEl) {
    console.error('Um ou mais elementos do DOM não foram encontrados. Verifique os IDs no seu HTML.')
    return
  }
  
  // 1. Renderiza a lista de categorias e destaca a ativa
  const categories = ['Todos', ...new Set(products.map(p => p.category))]
  categoryListEl.innerHTML = categories.map(category => `
    <li>
      <a href="#" 
        class="block p-2 text-slate-600 hover:bg-slate-100 rounded-md transition ${currentCategory === category ? 'category-active' : ''}" 
        data-category="${category}">
        ${category}
      </a>
    </li>
  `).join('')

  // 2. Filtra os produtos
  let filteredProducts = products
  // ...por categoria
  if (currentCategory !== 'Todos') {
    filteredProducts = filteredProducts.filter(p => p.category === currentCategory)
  }
  // ...por termo de busca
  if (currentSearchTerm) {
    const term = currentSearchTerm.toLowerCase()
    filteredProducts = filteredProducts.filter(p =>
      p.name.toLowerCase().includes(term) ||
      p.code.toLowerCase().includes(term)
    )
  }
  
  // 3. Atualiza o título da categoria
  categoryTitleEl.textContent = currentSearchTerm ? `Resultados para "${currentSearchTerm}"` : currentCategory

  // 4. Pagina os resultados
  const totalPages = Math.ceil(filteredProducts.length / productsPerPage)
  const startIndex = (currentPage - 1) * productsPerPage
  const paginatedProducts = filteredProducts.slice(startIndex, startIndex + productsPerPage)

  // 5. Renderiza os cards de produtos
  if (paginatedProducts.length === 0) {
    productGridEl.innerHTML = `<p class="col-span-full text-center text-slate-500 py-10">Nenhum produto encontrado.</p>`
  } else {
    productGridEl.innerHTML = paginatedProducts.map(product => `
      <div class="bg-white border border-slate-200 rounded-lg shadow-sm text-center flex flex-col transition hover:shadow-lg hover:-translate-y-1">
        <img src="${product.image}" alt="${product.name}" class="w-full h-48 object-contain p-4 rounded-t-lg">
        <div class="p-4 flex-grow flex flex-col">
          <h3 class="font-semibold text-slate-800 flex-grow">${product.name}</h3>
          <p class="text-sm text-slate-400 mt-1 mb-4">Cód: ${product.code}</p>
          <button data-code="${product.code}" data-name="${product.name}" class="whatsapp-btn mt-auto w-full bg-green-500 text-white font-bold py-2 px-4 rounded-md hover:bg-green-600 transition flex items-center justify-center gap-2">
            <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 16 16"><path d="M13.601 2.326A7.85 7.85 0 0 0 7.994 0C3.627 0 .068 3.558.064 7.926c0 1.399.366 2.76 1.057 3.965L0 16l4.204-1.102a7.9 7.9 0 0 0 3.79.965h.004c4.368 0 7.926-3.558 7.93-7.93A7.9 7.9 0 0 0 13.6 2.326zM7.994 14.521a6.6 6.6 0 0 1-3.356-.92l-.24-.144-2.494.654.666-2.433-.156-.251a6.56 6.56 0 0 1-1.007-3.505c0-3.626 2.957-6.584 6.591-6.584a6.56 6.56 0 0 1 4.66 1.931 6.56 6.56 0 0 1 1.928 4.66c-.004 3.639-2.961 6.592-6.592 6.592m3.615-4.934c-.197-.099-1.17-.578-1.353-.646-.182-.065-.315-.099-.445.099-.133.197-.513.646-.627.775-.114.133-.232.148-.43.05-.197-.1-.836-.308-1.592-.985-.59-.525-.985-1.175-1.103-1.372-.114-.198-.011-.304.088-.403.087-.088.197-.232.296-.346.1-.114.133-.198.198-.33.065-.134.034-.248-.015-.347-.05-.099-.445-1.076-.612-1.47-.16-.389-.323-.335-.445-.34-.114-.007-.247-.007-.38-.007a.73.73 0 0 0-.529.247c-.182.198-.691.677-.691 1.654 0 .977.71 1.916.81 2.049.098.133 1.394 2.132 3.383 2.992.47.205.84.326 1.129.418.475.152.904.129 1.246.08.38-.058 1.171-.48 1.338-.943.164-.464.164-.86.114-.943-.049-.084-.182-.133-.38-.232"/></svg>
            <span>WhatsApp</span>
          </button>
        </div>
      </div>
    `).join('')
  }
  
  // 6. Renderiza a paginação
  paginationControlsEl.innerHTML = ''
  if (totalPages > 1) {
    let paginationHTML = '<div class="flex items-center justify-center space-x-1">'
    for (let i = 1; i <= totalPages; i++) {
      const isActive = i === currentPage ? 'bg-blue-600 text-white' : 'bg-slate-200 text-slate-700 hover:bg-slate-300'
      paginationHTML += `<button class="w-10 h-10 rounded-md transition ${isActive}" data-page="${i}">${i}</button>`
    }
    paginationHTML += '</div>'
    paginationControlsEl.innerHTML = paginationHTML
  }
}

// --- Funções de Manipulação de Eventos ---

function setupEventListeners() {
  // Evento para os cliques nas categorias
  categoryListEl?.addEventListener('click', e => {
    e.preventDefault()
    const target = (e.target as HTMLElement).closest('a')
    if (target?.dataset.category) {
      currentCategory = target.dataset.category
      currentPage = 1
      render()
    }
  })

  // Evento para a busca (com debounce para performance)
  const debouncedSearch = debounce(() => {
    currentPage = 1
    currentSearchTerm = searchInputEl.value
    render()
  }, 300)
  searchInputEl?.addEventListener('input', debouncedSearch)

  // Evento para os cliques na paginação
  paginationControlsEl?.addEventListener('click', e => {
    const target = (e.target as HTMLElement).closest('button')
    if (target?.dataset.page) {
      currentPage = parseInt(target.dataset.page, 10)
      render()
    }
  })
  
  // Evento para os botões de WhatsApp (usando delegação de eventos)
  productGridEl?.addEventListener('click', e => {
    const target = (e.target as HTMLElement).closest('.whatsapp-btn') as HTMLElement | null
    if (target?.dataset.code && target?.dataset.name) {
      const { code, name } = target.dataset
      const message = encodeURIComponent(`Olá! Gostaria de solicitar um orçamento para o produto: ${name} (código: ${code})`)
      window.open(`https://wa.me/5543996639255?text=${message}`, '_blank')
    }
  })
}

// --- Função de Debounce (Otimização da Busca) ---
function debounce<F extends (...args: any[]) => any>(func: F, waitFor: number) {
  let timeout: ReturnType<typeof setTimeout> | null = null
  return (...args: Parameters<F>): void => {
    if (timeout) clearTimeout(timeout)
    timeout = setTimeout(() => func(...args), waitFor)
  }
}

// --- Inicialização ---
document.addEventListener('DOMContentLoaded', () => {
  setupEventListeners()
  render()
})