// main.js - Inicialização da aplicação
import { carregarUsuarios, mostrarDashboard, gerarCalendario, mostrarMeta, atualizarMeta, definirUsuarioAtivo } from './user.js';
import './disciplinas.js';
import './exercicios.js';

// === INICIALIZAÇÃO ===
window.onload = ()=>{
  carregarUsuarios();
  gerarCalendario();
  mostrarMeta();
  atualizarMeta();

  let usuario = JSON.parse(localStorage.getItem("usuarioAtivo"));
  if(usuario){
    definirUsuarioAtivo(usuario);
    mostrarDashboard();
  }
};