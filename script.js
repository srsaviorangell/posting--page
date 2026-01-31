// seletores
const form = document.querySelector('#form-post')
const titulo = document.querySelector('#titulo')
const conteudo = document.querySelector('#conteudo')
const postsList = document.querySelector('#posts-list')

// modal
const modal = document.querySelector('#modal')
const modalTitle = document.querySelector('#modal-title')
const modalBody = document.querySelector('#modal-body')
const modalClose = document.querySelector('#modal-close')

// cria um card de post e adiciona à lista
function renderPost(post) {
  const wrapper = document.createElement('div')
  wrapper.className = 'post card'
  wrapper.dataset.id = post.id

  wrapper.innerHTML = `
    <h3 class="post-title">${escapeHtml(post.title)}</h3>
    <p class="post-body">${escapeHtml(post.body)}</p>
    <div class="post-meta">
      <span class="muted">Usuário ${post.userId}</span>
      <button class="info-btn" aria-label="Ver mais">Mais</button>
    </div>
  `

  postsList.prepend(wrapper)
}

// escapa HTML para segurança mínima
function escapeHtml(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;')
}

// evento de submit: cria post via API e renderiza em lista
form.addEventListener('submit', function (event) {
  event.preventDefault()

  const data = {
    title: titulo.value,
    body: conteudo.value,
    userId: 1
  }

  fetch('https://jsonplaceholder.typicode.com/posts', {
    method: 'POST',
    body: JSON.stringify(data),
    headers: {
      'Content-type': 'application/json; charset=UTF-8'
    }
  })
    .then(response => response.json())
    .then(created => {
      renderPost(created)
      form.reset()
    })
})

// delegação de evento para abrir modal ao clicar em 'Mais'
postsList.addEventListener('click', function (e) {
  const btn = e.target.closest('.info-btn')
  if (!btn) return

  const postEl = btn.closest('.post')
  if (!postEl) return

  const title = postEl.querySelector('.post-title').textContent
  const body = postEl.querySelector('.post-body').textContent

  modalTitle.textContent = title
  modalBody.textContent = body
  openModal()
})

function openModal() {
  modal.classList.add('open')
  modal.setAttribute('aria-hidden', 'false')
}

function closeModal() {
  modal.classList.remove('open')
  modal.setAttribute('aria-hidden', 'true')
}

modalClose.addEventListener('click', closeModal)
modal.addEventListener('click', (e) => {
  if (e.target === modal) closeModal()
})

document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && modal.classList.contains('open')) closeModal()
})
