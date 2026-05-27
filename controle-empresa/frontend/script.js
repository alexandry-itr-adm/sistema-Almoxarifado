const SENHA_ADMIN = "3012";

let acaoAtual = null;

let idAtual = null;

let ferramentaAtual = null;

/* NAVEGAÇÃO */

function mostrarSecao(secao, botao) {

  document
    .querySelectorAll(".secao")
    .forEach((item) => {

      item.classList.add("oculto");
    });

  document
    .getElementById(secao)
    .classList.remove("oculto");

  document
    .querySelectorAll(".menu")
    .forEach((item) => {

      item.classList.remove("active");
    });

  if (botao) {

    botao.classList.add("active");
  }

  const titulos = {

    funcionarios: "Funcionários",

    materiais: "Materiais",

    ferramentas: "Ferramentas"
  };

  document
    .getElementById("tituloPagina")
    .innerText = titulos[secao];
}

/* TEMA */

function trocarTema() {

  document.body.classList.toggle("dark");

  document.body.classList.toggle("light");
}

/* SENHA */

function abrirSenha(acao, id = null) {

  acaoAtual = acao;

  idAtual = id;

  document
    .getElementById("modalSenha")
    .classList.remove("oculto");

  document
    .getElementById("senhaAdmin")
    .value = "";
}

function fecharModal() {

  document
    .getElementById("modalSenha")
    .classList.add("oculto");
}

async function confirmarSenha() {

  const senha =
  document
    .getElementById("senhaAdmin")
    .value;

  if (senha !== SENHA_ADMIN) {

    alert("Senha incorreta");

    return;
  }

  fecharModal();

  if (acaoAtual === "addFuncionario") {

    await adicionarFuncionario();
  }

  if (acaoAtual === "delFuncionario") {

    await removerFuncionario(idAtual);
  }

  if (acaoAtual === "addMaterial") {

    await adicionarMaterial();
  }

  if (acaoAtual === "delMaterial") {

    await removerMaterial(idAtual);
  }

  if (acaoAtual === "addFerramenta") {

    await adicionarFerramenta();
  }

  if (acaoAtual === "delFerramenta") {

    await removerFerramenta(idAtual);
  }

  if (acaoAtual === "usarFerramenta") {

    abrirModalFerramenta(idAtual);
  }
}

/* FUNCIONÁRIOS */

async function carregarFuncionarios() {

  const { data } =
  await supabaseClient
    .from("employees")
    .select("*")
    .order("name");

  const lista =
  document
    .getElementById("listaFuncionarios");

  lista.innerHTML = "";

  const pesquisa =
  document
    .getElementById("pesquisaFuncionario")
    ?.value
    ?.toLowerCase() || "";

  const filtrados =
  data.filter((f) =>
    f.name.toLowerCase().includes(pesquisa)
  );

  filtrados.forEach((f) => {

    lista.innerHTML += `
      <div class="card">

        <h3>${f.name}</h3>

        <p>
          Cargo:
          ${f.role}
        </p>

        <button
          onclick="abrirSenha('delFuncionario','${f.id}')">

          Excluir

        </button>

      </div>
    `;
  });
}

async function adicionarFuncionario() {

  const nome =
  document
    .getElementById("funcionarioNome")
    .value;

  const cargo =
  document
    .getElementById("funcionarioCargo")
    .value;

  if (!nome || !cargo) {

    return;
  }

  await supabaseClient
    .from("employees")
    .insert({

      name: nome,

      role: cargo
    });

  document
    .getElementById("funcionarioNome")
    .value = "";

  document
    .getElementById("funcionarioCargo")
    .value = "";

  carregarFuncionarios();
}

async function removerFuncionario(id) {

  await supabaseClient
    .from("employees")
    .delete()
    .eq("id", id);

  carregarFuncionarios();
}

/* MATERIAIS */

async function carregarMateriais() {

  const { data } =
  await supabaseClient
    .from("materials")
    .select("*")
    .order("name");

  const lista =
  document
    .getElementById("listaMateriais");

  lista.innerHTML = "";

  const pesquisa =
  document
    .getElementById("pesquisaMaterial")
    ?.value
    ?.toLowerCase() || "";

  const filtrados =
  data.filter((m) =>
    m.name.toLowerCase().includes(pesquisa)
  );

  filtrados.forEach((m) => {

    lista.innerHTML += `
      <div class="card">

        <h3>${m.name}</h3>

        <p>
          Quantidade:
          ${m.quantity}
        </p>

        <button
          onclick="abrirSenha('delMaterial','${m.id}')">

          Excluir

        </button>

      </div>
    `;
  });
}

async function adicionarMaterial() {

  const nome =
  document
    .getElementById("materialNome")
    .value;

  const quantidade =
  document
    .getElementById("materialQuantidade")
    .value;

  if (!nome || !quantidade) {

    return;
  }

  await supabaseClient
    .from("materials")
    .insert({

      name: nome,

      quantity: quantidade
    });

  document
    .getElementById("materialNome")
    .value = "";

  document
    .getElementById("materialQuantidade")
    .value = "";

  carregarMateriais();
}

async function removerMaterial(id) {

  await supabaseClient
    .from("materials")
    .delete()
    .eq("id", id);

  carregarMateriais();
}

/* FERRAMENTAS */

async function carregarFerramentas() {

  const { data } =
  await supabaseClient
    .from("tools")
    .select("*")
    .order("name");

  const lista =
  document
    .getElementById("listaFerramentas");

  lista.innerHTML = "";

  const pesquisa =
  document
    .getElementById("pesquisaFerramenta")
    ?.value
    ?.toLowerCase() || "";

  const filtrados =
  data.filter((f) =>
    f.name.toLowerCase().includes(pesquisa)
  );

  filtrados.forEach((f) => {

    const status =
    f.status || "Livre";

    const classe =
    status === "Em uso"
      ? "emuso"
      : "livre";

    lista.innerHTML += `
      <div class="card">

        <span class="status ${classe}">
          ${status}
        </span>

        <h3>
          ${f.name}
        </h3>

        <p>
          Funcionário:
          ${f.employee || "Não definido"}
        </p>

        <button
          onclick="abrirSenha('usarFerramenta','${f.id}')">

          Colocar em uso

        </button>

        <button
          onclick="liberarFerramenta('${f.id}')">

          Liberar

        </button>

        <button
          onclick="abrirSenha('delFerramenta','${f.id}')">

          Excluir

        </button>

      </div>
    `;
  });
}

async function adicionarFerramenta() {

  const nome =
  document
    .getElementById("ferramentaNome")
    .value;

  if (!nome) {

    return;
  }

  await supabaseClient
    .from("tools")
    .insert({

      name: nome,

      status: "Livre",

      employee: null
    });

  document
    .getElementById("ferramentaNome")
    .value = "";

  carregarFerramentas();
}

async function abrirModalFerramenta(id) {

  ferramentaAtual = id;

  const select =
  document
    .getElementById("funcionarioFerramenta");

  select.innerHTML = `
    <option value="">
      Não definido
    </option>
  `;

  const { data } =
  await supabaseClient
    .from("employees")
    .select("*")
    .order("name");

  data.forEach((f) => {

    select.innerHTML += `
      <option value="${f.name}">
        ${f.name}
      </option>
    `;
  });

  document
    .getElementById("modalFerramenta")
    .classList.remove("oculto");
}

function fecharModalFerramenta() {

  document
    .getElementById("modalFerramenta")
    .classList.add("oculto");
}

async function salvarUsoFerramenta() {

  const funcionario =
  document
    .getElementById("funcionarioFerramenta")
    .value;

  await supabaseClient
    .from("tools")
    .update({

      status: "Em uso",

      employee: funcionario || null
    })
    .eq("id", ferramentaAtual);

  fecharModalFerramenta();

  carregarFerramentas();
}

async function liberarFerramenta(id) {

  await supabaseClient
    .from("tools")
    .update({

      status: "Livre",

      employee: null
    })
    .eq("id", id);

  carregarFerramentas();
}

async function removerFerramenta(id) {

  await supabaseClient
    .from("tools")
    .delete()
    .eq("id", id);

  carregarFerramentas();
}

document
  .getElementById("senhaAdmin")
  .addEventListener("keydown", function (e) {

    if (e.key === "Enter") {

      confirmarSenha();
    }
  });

/* INIT */

carregarFuncionarios();

carregarMateriais();

carregarFerramentas();