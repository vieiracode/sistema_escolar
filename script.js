            let alunos = JSON.parse(localStorage.getItem('alunos')) || [];
            let relatorios = JSON.parse(localStorage.getItem('relatorios')) || [];
            let usuarioLogado = null;
            document.getElementById('loginForm').onsubmit = function(e){
              e.preventDefault();
              login();
            }



            // login
            function login(){
              const senha = document.getElementById('senhaLogin').value;
              if(senha === 'direcao123') usuarioLogado='direcao';
      else if(senha === 'prof123') usuarioLogado='professor';

            else {
          document.getElementById('erroLogin').textContent = 'Senha incorreta!';
          return;
          





  }




            document.getElementById('loginScreen').style.display = 'none';
            document.getElementById('mainScreen').style.display = 'flex';
            montarMenu();
            mostrarSecao('home');
             montarHome();
              montarCadastro();
            montarListaAlunos();
            montarFrequencia();
            montarMensalidades();
            montarRelatorios();



          }




        // logout
        function logout(){
       salvarDados();
      location.reload();

}

          // salvar dados

      function salvarDados(){
  localStorage.setItem('alunos', JSON.stringify(alunos));
  localStorage.setItem('relatorios', JSON.stringify(relatorios));

}

            // menu 

            function montarMenu(){
              const navList = document.getElementById('navList');
              navList.innerHTML = '';
              const menus=[
      {nome:'Início', secao:'home'},
      {nome:'Cadastro de Alunos', secao:'cadastro', permissao:'direcao'},
       {nome:'Lista de Alunos', secao:'listaAlunos'},
    {nome:'Frequência', secao:'frequencia'},
         {nome:'Mensalidades', secao:'mensalidades', permissao:'direcao'},
    {nome:'Relatórios', secao:'relatorios'}

  ];
         menus.forEach(m=>{
    if(m.permissao && m.permissao !== usuarioLogado) return;
    const li = document.createElement('li');
    li.textContent = m.nome;
    li.onclick = () => mostrarSecao(m.secao);
    navList.appendChild(li);
  });
}

      // mostrar seção
    function mostrarSecao(id){
    document.querySelectorAll('main section').forEach(s => s.classList.add('hidden'));
    document.getElementById(id).classList.remove('hidden');
}

        // pagina inicial
        
        function montarHome(){      
       const home = document.getElementById('home');
  home.innerHTML = `<h2 class="text-3xl font-bold mb-4">Bem-vindo(a), ${usuarioLogado}</h2>
    <p>Use o menu para navegar pelo sistema.</p>`;
}

        // cadstro de alunos
        function montarCadastro(){
    if(usuarioLogado !== 'direcao') return;
  const cadastro = document.getElementById('cadastro');
      cadastro.innerHTML = `
       <h2 class="text-2xl font-bold mb-4">Cadastro de Aluno</h2>
        <form id="formCadastro" class="flex flex-col gap-3 max-w-md">
      <input type="text" id="nome" placeholder="Nome" required class="p-2 border rounded" />
      <input type="date" id="nascimento" required class="p-2 border rounded" />
      <input type="text" id="turma" placeholder="Turma" class="p-2 border rounded" />
      <input type="text" id="nivel" placeholder="Nível" class="p-2 border rounded" />
       <input type="text" id="responsavel" placeholder="Responsável" class="p-2 border rounded" />
       <input type="tel" id="telefone" placeholder="Telefone" class="p-2 border rounded" />
      <input type="text" id="endereco" placeholder="Endereço" class="p-2 border rounded" />
      <input type="text" id="observacao" placeholder="Observação" class="p-2 border rounded" />
      <input type="file" id="foto" accept="image/*" class="p-2" />
        <button type="submit" class="bg-blue-600 hover:bg-blue-700 text-white py-2 rounded font-semibold">Salvar</button>
    </form>



  `;


  document.getElementById('formCadastro').onsubmit = salvarAluno;
}



function salvarAluno(e){
  e.preventDefault();

  const nome = document.getElementById("nome").value.trim();
  if (!nome) {
    alert("Nome é obrigatório.");
    return;
  }

        const nascimento = document.getElementById("nascimento").value;
        const turma = document.getElementById("turma").value;
        const nivel = document.getElementById("nivel").value;
        const responsavel = document.getElementById("responsavel").value;
        const telefone = document.getElementById("telefone").value;
        const endereco = document.getElementById("endereco").value;
        const observacao = document.getElementById("observacao").value;
        const fotoInput = document.getElementById("foto");

          if(document.getElementById("formCadastro").dataset.editIndex !== undefined){

    // editar aluno

    const index = parseInt(document.getElementById("formCadastro").dataset.editIndex);
    const aluno = alunos[index];

              aluno.nome = nome;
              aluno.nascimento = nascimento;
              aluno.turma = turma;
              aluno.nivel = nivel;
                aluno.responsavel = responsavel;
                aluno.telefone = telefone;
              aluno.endereco = endereco;
              aluno.observacao = observacao;

      if(fotoInput.files && fotoInput.files[0]){
      const reader = new FileReader();
      reader.onload = function(evt){
        aluno.foto = evt.target.result;
        salvarDados();
        alert("Aluno atualizado!");
        document.getElementById('formCadastro').reset();
        delete document.getElementById("formCadastro").dataset.editIndex;
        montarListaAlunos();
        mostrarSecao('listaAlunos');
      }
      reader.readAsDataURL(fotoInput.files[0]);
    } else {
      salvarDados();
      alert("Aluno atualizado!");
      document.getElementById('formCadastro').reset();
      delete document.getElementById("formCadastro").dataset.editIndex;
      montarListaAlunos();
      mostrarSecao('listaAlunos');
    }

                    } else {



                // novo aluno 

          const id = crypto.randomUUID();
          if(fotoInput.files && fotoInput.files[0]){
          const reader = new FileReader();
          reader.onload = function(evt){
        alunos.push({id,nome,nascimento,turma,nivel,responsavel,telefone,endereco,observacao,foto:evt.target.result,frequencia:[],mensalidade:[]});
        salvarDados();
        alert("Aluno cadastrado!");
        document.getElementById('formCadastro').reset();
        montarListaAlunos();
        mostrarSecao('listaAlunos');
      }
      reader.readAsDataURL(fotoInput.files[0]);
    } else {
      alunos.push({id,nome,nascimento,turma,nivel,responsavel,telefone,endereco,observacao,foto:null,frequencia:[],mensalidade:[]});
      salvarDados();
      alert("Aluno cadastrado!");
      document.getElementById('formCadastro').reset();
      montarListaAlunos();
      mostrarSecao('listaAlunos');
    }

  }

}

                  // lista de alunos do nav

      function montarListaAlunos(){
    const lista = document.getElementById('listaAlunos');
    lista.innerHTML = `
    <h2 class="text-2xl font-bold mb-4">Lista de Alunos</h2>
    <input type="text" id="buscarAluno" placeholder="Buscar..." oninput="buscarAlunos()" class="mb-3 p-2 border rounded max-w-md" />
  `;

  if(alunos.length === 0){
    lista.innerHTML += "<p>Nenhum aluno cadastrado.</p>";
    return;
  }

            const tabela = document.createElement('table');
            tabela.className = "w-full border-collapse border border-gray-300";
            tabela.innerHTML = `
              <thead>
                <tr class="bg-blue-200"><th class="border border-gray-300 p-2">Foto</th><th class="border border-gray-300 p-2">Nome</th><th class="border border-gray-300 p-2">Turma</th><th class="border border-gray-300 p-2">Nível</th><th class="border border-gray-300 p-2">Responsável</th><th class="border border-gray-300 p-2">Telefone</th><th class="border border-gray-300 p-2">Ações</th></tr>
              </thead>
              <tbody></tbody>
            `;

              const tbody = tabela.querySelector('tbody');

             alunos.forEach((aluno, i) => {
              const tr = document.createElement('tr');
              tr.className = "odd:bg-white even:bg-gray-100";
              const tdFoto = document.createElement('td');
              tdFoto.className = "border border-gray-300 p-1 text-center";
              if(aluno.foto){
                const img = document.createElement('img');
                  img.src = aluno.foto;
                  img.width = 50;
                  img.height = 50;
                  img.className = "rounded-full mx-auto";
                  tdFoto.appendChild(img);
            }
            tr.appendChild(tdFoto);
            tr.innerHTML += `

                <td class="border border-gray-300 p-2">${aluno.nome}</td>
                <td class="border border-gray-300 p-2">${aluno.turma}</td>
                <td class="border border-gray-300 p-2">${aluno.nivel}</td>
                <td class="border border-gray-300 p-2">${aluno.responsavel}</td>
                <td class="border border-gray-300 p-2">${aluno.telefone}</td>`;
              const tdAcoes = document.createElement('td');

     tdAcoes.className = "border border-gray-300 p-2 text-center";

      const btnEditar = document.createElement('button');
        btnEditar.textContent = 'Editar';
       btnEditar.className = "bg-yellow-400 hover:bg-yellow-500 text-white px-3 py-1 rounded mr-2";
        btnEditar.onclick = () => editarAluno(i);
        tdAcoes.appendChild(btnEditar);

      tr.appendChild(tdAcoes);
      tbody.appendChild(tr);
   });


    lista.appendChild(tabela);
}




  function buscarAlunos(){
  const filtro = document.getElementById('buscarAluno').value.toLowerCase();
  const trs = document.querySelectorAll('#listaAlunos table tbody tr');
  trs.forEach(tr => {
    const nome = tr.children[1].textContent.toLowerCase();
    tr.style.display = nome.includes(filtro) ? '' : 'none';
  });
}

function editarAluno(index){
  const aluno = alunos[index];
  mostrarSecao('cadastro');
  montarCadastro();

  const form = document.getElementById('formCadastro');
  form.dataset.editIndex = index;

    document.getElementById('nome').value = aluno.nome;
    document.getElementById('nascimento').value = aluno.nascimento;
   document.getElementById('turma').value = aluno.turma;
      document.getElementById('nivel').value = aluno.nivel;
      document.getElementById('responsavel').value = aluno.responsavel;
       document.getElementById('telefone').value = aluno.telefone;
   document.getElementById('endereco').value = aluno.endereco;
  document.getElementById('observacao').value = aluno.observacao;
}

// frequencia
function montarFrequencia(){
  const sec = document.getElementById('frequencia');
  sec.innerHTML = `<h2 class="text-2xl font-bold mb-4">Frequência</h2>`;
  alunos.forEach((aluno,i)=>{
    const div = document.createElement('div');
    div.className = "mb-4";
    div.innerHTML = `
      <span class="font-semibold">${aluno.nome}</span> - Presença: <span id="pres${i}">${aluno.frequencia.filter(f=>f==='P').length}</span> / Falta: <span id="falt${i}">${aluno.frequencia.filter(f=>f==='F').length}</span>
    `;
    const btn = document.createElement('button');
    btn.textContent = 'Marcar Presença/Falta';
    btn.className = "ml-4 bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded";
    btn.onclick=()=>{
      const prox = aluno.frequencia.length===0 || aluno.frequencia[aluno.frequencia.length-1]==='F' ? 'P' : 'F';
      aluno.frequencia.push(prox);
      document.getElementById(`pres${i}`).textContent = aluno.frequencia.filter(f=>f==='P').length;
      document.getElementById(`falt${i}`).textContent = aluno.frequencia.filter(f=>f==='F').length;
      salvarDados();
    }
    div.appendChild(btn);
    sec.appendChild(div);
  });
}

      // mensalidades

      function montarMensalidades(){
        const sec = document.getElementById('mensalidades');
        sec.innerHTML = `<h2 class="text-2xl font-bold mb-4">Mensalidades</h2>`;
        alunos.forEach((aluno,i)=>{
          if(!aluno.mensalidade) aluno.mensalidade = [];
          if(aluno.mensalidade.length===0) aluno.mensalidade.push('Pendente');
          const div = document.createElement('div');
          div.className = "mb-4";
          const status = document.createElement('span');
          status.textContent = aluno.mensalidade[aluno.mensalidade.length-1];
           status.className = aluno.mensalidade[aluno.mensalidade.length-1] === 'Pago' ? 'text-green-600 font-semibold' : 'text-red-600 font-semibold';
          const btn = document.createElement('button');
            btn.textContent = 'Alterar Status';
             btn.className = "ml-4 bg-indigo-600 hover:bg-indigo-700 text-white px-3 py-1 rounded";
            btn.onclick = ()=>{

      aluno.mensalidade[aluno.mensalidade.length-1] = aluno.mensalidade[aluno.mensalidade.length-1] === 'Pago' ? 'Pendente' : 'Pago';
      status.textContent = aluno.mensalidade[aluno.mensalidade.length-1];
      status.className = aluno.mensalidade[aluno.mensalidade.length-1] === 'Pago' ? 'text-green-600 font-semibold' : 'text-red-600 font-semibold';
      salvarDados();
    };

    div.textContent = aluno.nome + ' - ';
    div.appendChild(status);
    div.appendChild(btn);
    sec.appendChild(div);
      });
    }

              // relatorios
              function montarRelatorios(){
                const sec = document.getElementById('relatorios');
                sec.innerHTML = `<h2 class="text-2xl font-bold mb-4">Relatórios</h2>`;
      relatorios.forEach((r,i)=>{
        const div = document.createElement('div');
        div.className = "mb-3 p-2 border rounded bg-gray-50";
        div.innerHTML = `<b>${r.autor}:</b> ${r.texto}`;
        sec.appendChild(div);
      });
  const form = document.createElement('form');
  form.className = "flex flex-col max-w-md";
  form.innerHTML = `
    <textarea id="txtRelatorio" placeholder="Escreva aqui..." rows="4" class="p-2 border rounded mb-3"></textarea>
    <button type="submit" class="bg-sky-600 hover:bg-sky-700 text-white py-2 rounded font-semibold">Enviar</button>
  `;
  form.onsubmit = e=>{
    e.preventDefault();
    const txt = document.getElementById('txtRelatorio').value.trim();
    if(txt==='') return;
    relatorios.push({autor:usuarioLogado,texto:txt});
    salvarDados();
    document.getElementById('txtRelatorio').value='';
    montarRelatorios();
  }
  sec.appendChild(form);
}
