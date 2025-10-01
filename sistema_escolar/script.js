/* === Variáveis Globais === */
let alunos = [];
let usuarioLogado = null;
let currentSlide = 0;

/* === LOGIN === */
function login() {
  const senha = document.getElementById("senhaLogin").value;
  const erroLogin = document.getElementById("erroLogin");

  if (senha === "direcao123") {
    usuarioLogado = "direcao";
  } else if (senha === "prof123") {
    usuarioLogado = "professor";
  } else {
    erroLogin.textContent = "Senha incorreta!";
    return;
  }

  document.getElementById("loginScreen").style.display = "none";
  document.getElementById("mainScreen").style.display = "block";
  montarMenu();
}

/* === MENU === */
function montarMenu() {
  const navList = document.getElementById("navList");
  navList.innerHTML = "";

  const menus = [
    {nome: "Início", secao: "home"},
    {nome: "Cadastro de Alunos", secao: "cadastro", permissao: "direcao"},
    {nome: "Lista de Alunos", secao: "listaAlunos"},
    {nome: "Frequência", secao: "frequencia"},
    {nome: "Mensalidades", secao: "mensalidades", permissao: "direcao"},
    {nome: "Pendências", secao: "pendencias", permissao: "direcao"},
    {nome: "Relatórios", secao: "relatorios", permissao: "direcao"},
    {nome: "Contato", secao: "contato"}
  ];

  menus.forEach(menu => {
    if (menu.permissao && menu.permissao !== usuarioLogado) return;

    const li = document.createElement("li");
    const a = document.createElement("a");
    a.textContent = menu.nome;
    a.href = "#";
    a.className = "hover:text-yellow-300 transition";
    a.onclick = () => mostrarSecao(menu.secao);
    li.appendChild(a);
    navList.appendChild(li);
  });
}

/* === NAVEGAÇÃO === */
function mostrarSecao(secaoId) {
  document.querySelectorAll("main section").forEach(sec => sec.classList.add("hidden"));
  document.getElementById(secaoId).classList.remove("hidden");

  if (secaoId === "cadastro") montarFormularioCadastro();
  if (secaoId === "listaAlunos") montarListaAlunos();
  if (secaoId === "mensalidades") montarMensalidades();
  if (secaoId === "pendencias") montarPendencias();
}

/* === CADASTRO DE ALUNOS === */
function montarFormularioCadastro() {
  const cadastro = document.getElementById("cadastro");
  cadastro.innerHTML = `
    <h2 class="text-2xl font-bold mb-4">Cadastro de Aluno</h2>
    <form onsubmit="salvarAluno(event)" class="grid grid-cols-1 md:grid-cols-2 gap-4 bg-white shadow-md rounded-lg p-6">
      <label class="flex flex-col">Nome: <input type="text" id="nome" required class="border rounded px-3 py-2"></label>
      <label class="flex flex-col">Data de Nascimento: <input type="date" id="nascimento" required class="border rounded px-3 py-2"></label>
      <label class="flex flex-col">Turma: <input type="text" id="turma" class="border rounded px-3 py-2"></label>
      <label class="flex flex-col">Nível: <input type="text" id="nivel" class="border rounded px-3 py-2"></label>
      <label class="flex flex-col">Responsável: <input type="text" id="responsavel" class="border rounded px-3 py-2"></label>
      <label class="flex flex-col">Telefone: <input type="tel" id="telefone" class="border rounded px-3 py-2"></label>
      <label class="flex flex-col md:col-span-2">Endereço: <input type="text" id="endereco" class="border rounded px-3 py-2"></label>
      <label class="flex flex-col md:col-span-2">Observação: <input type="text" id="observacao" class="border rounded px-3 py-2"></label>
      <label class="flex flex-col">Foto: <input type="file" id="foto" accept="image/*" class="border rounded px-3 py-2"></label>
      <div class="md:col-span-2 text-right">
        <button type="submit" class="bg-green-600 hover:bg-green-700 text-white font-semibold px-6 py-2 rounded-lg transition">
          Salvar
        </button>
      </div>
    </form>
  `;
}

function salvarAluno(event) {
  event.preventDefault();

  const id = crypto.randomUUID();
  const nome = document.getElementById("nome").value;
  const nascimento = document.getElementById("nascimento").value;
  const turma = document.getElementById("turma").value;
  const nivel = document.getElementById("nivel").value;
  const responsavel = document.getElementById("responsavel").value;
  const telefone = document.getElementById("telefone").value;
  const endereco = document.getElementById("endereco").value;
  const observacao = document.getElementById("observacao").value;
  const fotoInput = document.getElementById("foto");

  let novoAluno = {id, nome, nascimento, turma, nivel, responsavel, telefone, endereco, observacao, foto: null, pago: false};

  if (fotoInput.files && fotoInput.files[0]) {
    const reader = new FileReader();
    reader.onload = function(e) {
      novoAluno.foto = e.target.result;
      alunos.push(novoAluno);
      alert("Aluno cadastrado com sucesso!");
    };
    reader.readAsDataURL(fotoInput.files[0]);
  } else {
    alunos.push(novoAluno);
    alert("Aluno cadastrado com sucesso!");
  }

  document.querySelector("#cadastro form").reset();
}

/* === LISTA DE ALUNOS === */
function montarListaAlunos() {
  const lista = document.getElementById("listaAlunos");
  lista.innerHTML = "<h2 class='text-2xl font-bold mb-4'>Lista de Alunos</h2>";

  if (alunos.length === 0) {
    lista.innerHTML += "<p class='text-gray-600'>Nenhum aluno cadastrado.</p>";
    return;
  }

  const tabela = document.createElement("table");
  tabela.className = "min-w-full bg-white shadow-md rounded-lg overflow-hidden";
  tabela.innerHTML = `
    <thead class="bg-blue-600 text-white">
      <tr>
        <th>Foto</th>
        <th>Nome</th>
        <th>Turma</th>
        <th>Nível</th>
        <th>Responsável</th>
        <th>Telefone</th>
      </tr>
    </thead>
    <tbody></tbody>
  `;

  const tbody = tabela.querySelector("tbody");
  alunos.forEach(aluno => {
    const tr = document.createElement("tr");
    tr.className = "border-b hover:bg-gray-50";
    const tdFoto = document.createElement("td");
    if (aluno.foto) {
      const img = document.createElement("img");
      img.src = aluno.foto;
      img.className = "w-12 h-12 rounded-full object-cover";
      tdFoto.appendChild(img);
    }
    tr.appendChild(tdFoto);
    tr.innerHTML += `
      <td>${aluno.nome}</td>
      <td>${aluno.turma}</td>
      <td>${aluno.nivel}</td>
      <td>${aluno.responsavel}</td>
      <td>${aluno.telefone}</td>
    `;
    tbody.appendChild(tr);
  });

  lista.appendChild(tabela);
}

/* === MENSALIDADES === */
function montarMensalidades() {
  const sec = document.getElementById("mensalidades");
  sec.innerHTML = "<h2 class='text-2xl font-bold mb-4'>Mensalidades</h2>";

  if (alunos.length === 0) {
    sec.innerHTML += "<p class='text-gray-600'>Nenhum aluno cadastrado.</p>";
    return;
  }

  const tabela = document.createElement("table");
  tabela.className = "min-w-full bg-white shadow-md rounded-lg overflow-hidden";
  tabela.innerHTML = `
    <thead class="bg-blue-600 text-white">
      <tr>
        <th>Nome</th>
        <th>Turma</th>
        <th>Status</th>
        <th>Ação</th>
      </tr>
    </thead>
    <tbody></tbody>
  `;

  const tbody = tabela.querySelector("tbody");
  alunos.forEach(aluno => {
    const tr = document.createElement("tr");
    tr.className = "border-b hover:bg-gray-50";
    tr.innerHTML = `
      <td>${aluno.nome}</td>
      <td>${aluno.turma}</td>
      <td class="${aluno.pago ? 'text-green-600' : 'text-red-600'}">${aluno.pago ? 'Pago' : 'Pendente'}</td>
      <td>
        ${aluno.pago ? '' : `<button onclick="marcarPago('${aluno.id}')" class="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded">Marcar como Pago</button>`}
      </td>
    `;
    tbody.appendChild(tr);
  });

  sec.appendChild(tabela);
}

function marcarPago(id) {
  const aluno = alunos.find(a => a.id === id);
  if (aluno) {
    aluno.pago = true;
    montarMensalidades();
    montarPendencias();
  }
}

/* === PENDÊNCIAS === */
function montarPendencias() {
  const sec = document.getElementById("pendencias");
  sec.innerHTML = "<h2 class='text-2xl font-bold mb-4'>Pendências</h2>";

  const pendentes = alunos.filter(a => !a.pago);

  if (pendentes.length === 0) {
    sec.innerHTML += "<p class='text-green-600'>Nenhuma pendência. Todos pagos!</p>";
    return;
  }

  const ul = document.createElement("ul");
  ul.className = "list-disc pl-6";
  pendentes.forEach(aluno => {
    const li = document.createElement("li");
    li.textContent = `${aluno.nome} - Turma: ${aluno.turma}`;
    ul.appendChild(li);
  });

  sec.appendChild(ul);
}

/* === CARROSSEL === */
function showSlide(index) {
  const carousel = document.getElementById("carousel");
  const totalSlides = carousel.children.length;
  if (index >= totalSlides) index = 0;
  if (index < 0) index = totalSlides - 1;
  currentSlide = index;
  carousel.style.transform = `translateX(-${index * 100}%)`;
}

function nextSlide() {
  showSlide(currentSlide + 1);
}

function prevSlide() {
  showSlide(currentSlide - 1);
}

setInterval(nextSlide, 5000); // troca automática a cada 5s
showSlide(0); // mostra o primeiro slide inicialmente

/* === INICIALIZAÇÃO === */
document.getElementById("loginScreen").style.display = "block";
document.getElementById("mainScreen").style.display = "none";