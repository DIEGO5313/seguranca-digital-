// Localiza os elementos do DOM
const campoSenha = document.querySelector("#campo-senha");
const numeroSenha = document.querySelector("#numero-senha");
const mensagem = document.querySelector("#mensagem");
const forcaSenha = document.querySelector("#forca-senha");

// Checkboxes de opções
const checkMaiusculas = document.querySelector("#maiusculas");
const checkMinusculas = document.querySelector("#minusculas");
const checkNumeros = document.querySelector("#numeros-check");
const checkEspeciais = document.querySelector("#especiais");

// Caracteres disponíveis
const letrasMaiusculas = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
const letrasMinusculas = "abcdefghijklmnopqrstuvwxyz";
const numeros = "0123456789";
const caractEspeciais = "!@#$%&*+-=;:,.?";

// Tamanho inicial da senha
let tamanhoSenha = 8;

// Gera a primeira senha quando a página abrir
document.addEventListener("DOMContentLoaded", function() {
  geraSenha();
});

// Função responsável por gerar a senha com opções selecionadas
function geraSenha() {
  // Valida se pelo menos uma opção está selecionada
  if (!checkMaiusculas.checked && !checkMinusculas.checked && 
      !checkNumeros.checked && !checkEspeciais.checked) {
    mostrarMensagem("Selecione pelo menos uma opção!", "erro");
    return;
  }

  let senha = "";
  let caracteresDisponiveis = "";

  // Monta a string com os caracteres disponíveis
  if (checkMaiusculas.checked) {
    caracteresDisponiveis += letrasMaiusculas;
  }
  if (checkMinusculas.checked) {
    caracteresDisponiveis += letrasMinusculas;
  }
  if (checkNumeros.checked) {
    caracteresDisponiveis += numeros;
  }
  if (checkEspeciais.checked) {
    caracteresDisponiveis += caractEspeciais;
  }

  // Gera a senha aleatória
  for (let i = 0; i < tamanhoSenha; i++) {
    let numeroAleatorio = Math.floor(Math.random() * caracteresDisponiveis.length);
    senha += caracteresDisponiveis[numeroAleatorio];
  }

  // Exibe a senha no campo
  campoSenha.value = senha;

  // Verifica a força da senha
  verificarForcaSenha(senha);

  // Limpa a mensagem anterior
  mensagem.textContent = "";
  mensagem.classList.remove("sucesso");
}

// Diminui o tamanho da senha
function diminuiTamanho() {
  if (tamanhoSenha > 4) {
    tamanhoSenha--;
  }
  numeroSenha.textContent = tamanhoSenha;
  geraSenha();
}

// Aumenta o tamanho da senha
function aumentaTamanho() {
  if (tamanhoSenha < 32) {
    tamanhoSenha++;
  }
  numeroSenha.textContent = tamanhoSenha;
  geraSenha();
}

// Copia a senha para a área de transferência
function copiarSenha() {
  if (campoSenha.value === "") {
    mostrarMensagem("Nenhuma senha para copiar!", "erro");
    return;
  }

  navigator.clipboard.writeText(campoSenha.value).then(() => {
    mostrarMensagem("✓ Senha copiada com sucesso!", "sucesso");
  }).catch(() => {
    mostrarMensagem("Erro ao copiar a senha", "erro");
  });
}

// Verifica a força da senha
function verificarForcaSenha(senha) {
  let forca = 0;

  // Verifica comprimento
  if (senha.length >= 8) forca++;
  if (senha.length >= 12) forca++;
  if (senha.length >= 16) forca++;

  // Verifica tipos de caracteres
  if (/[A-Z]/.test(senha)) forca++;
  if (/[a-z]/.test(senha)) forca++;
  if (/[0-9]/.test(senha)) forca++;
  if (/[!@#$%^&*()_+\-=\[\]{}|;:,.<>?]/.test(senha)) forca++;

  // Verifica sequências comuns
  if (testarSenha(senha)) forca++;

  // Exibe o resultado
  if (forca <= 2) {
    forcaSenha.className = "forca-senha fraca";
    forcaSenha.textContent = "🚫Força: FRACA";
  } else if (forca <= 4) {
    forcaSenha.className = "forca-senha media";
    forcaSenha.textContent = "🤔 Força: MÉDIA";
  } else {
    forcaSenha.className = "forca-senha forte";
    forcaSenha.textContent = "✅ Força: FORTE";
  }
}

// Valida se a senha contém caracteres sequenciais comuns
function testarSenha(senha) {
  const sequenciasComuns = [
    "ABCDE", "abcde", "12345", "000", "111", "abc", "ABC",
    "qwerty", "asdfgh", "zxcvbn"
  ];

  for (let sequencia of sequenciasComuns) {
    if (senha.includes(sequencia)) {
      return false;
    }
  }
  return true;
}

// Mostra mensagens ao usuário
function mostrarMensagem(texto, tipo) {
  mensagem.textContent = texto;
  mensagem.classList.remove("sucesso");
  
  if (tipo === "sucesso") {
    mensagem.classList.add("sucesso");
  }

  // Remove a mensagem após 3 segundos
  setTimeout(() => {
    mensagem.textContent = "";
    mensagem.classList.remove("sucesso");
  }, 3000);
}

// Event listeners para atualizar a senha quando mudam as opções
checkMaiusculas.addEventListener("change", geraSenha);
checkMinusculas.addEventListener("change", geraSenha);
checkNumeros.addEventListener("change", geraSenha);
checkEspeciais.addEventListener("change", geraSenha);