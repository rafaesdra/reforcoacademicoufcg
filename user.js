// user.js - Gerenciamento de usuários, login e progresso
let usuarioAtivo = null;
let metaDiaria = 3;

// === USUÁRIOS / LOGIN ===
function carregarUsuarios(){
  if(!localStorage.getItem("usuarios")) localStorage.setItem("usuarios", JSON.stringify([]));
}

function criarUsuario(){
  let nome = document.getElementById("username").value.trim();
  let senha = document.getElementById("password").value.trim();
  if(!nome || !senha){ document.getElementById("loginMsg").innerText="Preencha nome e senha."; return; }

  let usuarios = JSON.parse(localStorage.getItem("usuarios"));
  if(usuarios.find(u=>u.nome===nome)){ document.getElementById("loginMsg").innerText="Usuário já existe."; return; }

  usuarios.push({nome, senha, xp:0, streak:0, ultimaData:null, progresso:{}});
  localStorage.setItem("usuarios", JSON.stringify(usuarios));
  document.getElementById("loginMsg").innerText="Usuário criado! Agora faça login.";
}

function loginUsuario(){
  let nome = document.getElementById("username").value.trim();
  let senha = document.getElementById("password").value.trim();
  let usuarios = JSON.parse(localStorage.getItem("usuarios"));
  let user = usuarios.find(u=>u.nome===nome && u.senha===senha);

  if(!user){ document.getElementById("loginMsg").innerText="Usuário ou senha incorretos."; return; }
  usuarioAtivo = user;
  localStorage.setItem("usuarioAtivo", JSON.stringify(usuarioAtivo));
  mostrarDashboard();
}

function logout(){ localStorage.removeItem("usuarioAtivo"); location.reload(); }

// === DASHBOARD ===
function mostrarDashboard(){
  document.getElementById("loginCard").style.display = "none";
  document.getElementById("dashboard").style.display = "block";
  document.getElementById("usuarioAtivo").innerText = usuarioAtivo.nome;
  atualizarXPStreak();
  atualizarRanking();
  
  // Carregar disciplinas quando o dashboard é mostrado
  if(window.carregarDisciplinas){
    window.carregarDisciplinas();
  }
}

// Atualiza XP e streak
function atualizarXPStreak(){
  document.getElementById("xpUsuario").innerText = usuarioAtivo.xp;
  document.getElementById("streakUsuario").innerText = usuarioAtivo.streak;
}

// Atualiza ranking histórico
function atualizarRanking(){
  let usuarios = JSON.parse(localStorage.getItem("usuarios"));
  usuarios.sort((a,b)=>b.xp - a.xp);
  let ol = document.getElementById("rankingHistorico");
  ol.innerHTML = "";
  usuarios.forEach(u=>{
    let li = document.createElement("li");
    li.innerText = `${u.nome} - ${u.xp} XP`;
    ol.appendChild(li);
  });
}

// === STREAK ===
function atualizarStreak(){
  let hoje = new Date().toDateString();
  if(usuarioAtivo.ultimaData !== hoje){
    let ontem = new Date();
    ontem.setDate(ontem.getDate()-1);
    if(usuarioAtivo.ultimaData === ontem.toDateString()){
      usuarioAtivo.streak += 1;
    } else {
      usuarioAtivo.streak = 1;
    }
    usuarioAtivo.ultimaData = hoje;
  }
}

// === META AUTOMÁTICA ===
function registrarQuestaoDoDia(){
  let hoje = new Date().toDateString();
  let progressoHoje = JSON.parse(localStorage.getItem("progressoHoje")) || {};
  if(progressoHoje.data !== hoje){
    progressoHoje = { data: hoje, acertos: 0 };
  }
  progressoHoje.acertos += 1;
  localStorage.setItem("progressoHoje", JSON.stringify(progressoHoje));
  atualizarMeta();
}

function atualizarMeta(){
  let progressoHoje = JSON.parse(localStorage.getItem("progressoHoje"));
  if(!progressoHoje){
    document.getElementById("metaAtual").innerText = `Meta de hoje: 0 / ${metaDiaria} questões`;
    return;
  }
  let texto = `Meta de hoje: ${progressoHoje.acertos} / ${metaDiaria} questões`;
  if(progressoHoje.acertos >= metaDiaria){
    texto += " ✅ Meta concluída!";
  }
  document.getElementById("metaAtual").innerText = texto;
}

// === META ===
function salvarMeta(){
  metaDiaria = parseInt(document.getElementById("metaDiaria").value)||3;
  atualizarMeta();
}
function mostrarMeta(){ document.getElementById("metaAtual").innerText = ""; }

// === CALENDÁRIO 2026 ===
function gerarCalendario(){
  const calendario = document.getElementById("calendario2026");
  calendario.innerHTML = "";
  const diasSemana = ["Dom","Seg","Ter","Qua","Qui","Sex","Sab"];
  diasSemana.forEach(d=>{
    let el = document.createElement("div");
    el.innerText = d;
    el.className="font-bold";
    calendario.appendChild(el);
  });

  let data = new Date("2026-01-01");
  while(data.getFullYear() === 2026){
    let dia = document.createElement("div");
    dia.innerText = data.getDate();
    dia.className="p-2 rounded";
    calendario.appendChild(dia);
    data.setDate(data.getDate()+1);
  }
}

export { usuarioAtivo, metaDiaria, carregarUsuarios, criarUsuario, loginUsuario, logout, mostrarDashboard, atualizarXPStreak, atualizarRanking, atualizarStreak, registrarQuestaoDoDia, atualizarMeta, salvarMeta, mostrarMeta, gerarCalendario };

// Função para definir usuarioAtivo (usada pelo main.js)
export function definirUsuarioAtivo(user) {
  usuarioAtivo = user;
}

// Tornar funções globais para onclick no HTML
window.criarUsuario = criarUsuario;
window.loginUsuario = loginUsuario;
window.logout = logout;
window.salvarMeta = salvarMeta;
window.logout = logout;
window.salvarMeta = salvarMeta;