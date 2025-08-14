// ===== NUTRI KIDS - SCRIPT PRINCIPAL =====

// === FUNÇÃO PARA LIMPAR COMENTÁRIOS ===
function limparTodosComentariosLocalStorage() {
  console.log('🧹 Limpando todos os comentários do localStorage...');
  
  // Buscar todas as chaves do localStorage que são de comentários
  const chaves = Object.keys(localStorage);
  let comentariosRemovidos = 0;
  
  chaves.forEach(chave => {
    if (chave.includes('_comentarios')) {
      localStorage.removeItem(chave);
      comentariosRemovidos++;
    }
  });
  
  console.log(`✅ ${comentariosRemovidos} armazenamentos de comentários foram limpos do localStorage`);
}

// Executar limpeza de comentários quando a página carregar
document.addEventListener('DOMContentLoaded', () => {
  limparTodosComentariosLocalStorage();
});

// === CONFIGURAÇÃO DO MENU DROPDOWN ===
class MenuDropdown {
  constructor() {
    this.btnMenu = document.getElementById('btn-menu');
    this.menu = document.getElementById('menu');
    this.init();
  }

  init() {
    if (this.btnMenu && this.menu) {
      this.btnMenu.addEventListener('click', (e) => {
        e.stopPropagation();
        this.alternarMenu();
      });
      
      // Fechar menu ao clicar fora dele
      document.addEventListener('click', (e) => {
        if (!this.menu.contains(e.target) && !this.btnMenu.contains(e.target)) {
          this.fecharMenu();
        }
      });
    }
  }

  alternarMenu() {
    this.menu.classList.toggle('menu-visivel');
  }

  fecharMenu() {
    this.menu.classList.remove('menu-visivel');
  }
}

// === SISTEMA DE RECEITAS ===
class SistemaReceitas {
  constructor() {
    this.receitas = document.querySelectorAll('.item-receita');
    this.init();
  }

  init() {
    this.receitas.forEach((receita, index) => {
      // Adicionar delay na animação
      receita.style.animationDelay = `${index * 0.1}s`;
      
      const gerenciadorReceita = new GerenciadorReceita(receita);
    });
  }
}

// === GERENCIADOR DE RECEITA INDIVIDUAL ===
class GerenciadorReceita {
  constructor(elementoReceita) {
    this.receita = elementoReceita;
    this.btnCurtir = this.receita.querySelector('.btn-curtir');
    this.btnComentar = this.receita.querySelector('.btn-comentar');
    this.areaComentarios = this.receita.querySelector('.area-comentarios');
    this.curtidas = 0;
    this.jaCurtiu = false;
    this.comentarios = [];
    
    this.init();
  }

  init() {
    if (this.btnCurtir) {
      this.btnCurtir.addEventListener('click', () => this.curtirReceita());
    }

    if (this.btnComentar) {
      this.btnComentar.addEventListener('click', () => this.adicionarComentario());
    }

    // Carregar dados salvos
    this.carregarDados();
  }

  deletarComentario(comentarioId) {
    const usuarioLogado = JSON.parse(localStorage.getItem('usuarioLogado') || '{}');
    
    if (!usuarioLogado.id) {
      alert('❌ Você precisa estar logado para deletar comentários.');
      return;
    }

    // Encontrar o comentário no DOM
    const comentarioElement = this.areaComentarios.querySelector(`[data-comentario-id="${comentarioId}"]`);
    if (!comentarioElement) {
      alert('❌ Comentário não encontrado.');
      return;
    }

    // Verificar se o usuário é o autor do comentário
    const autorId = comentarioElement.dataset.autorId;
    if (autorId && parseInt(autorId) !== parseInt(usuarioLogado.id)) {
      alert('❌ Você só pode deletar seus próprios comentários.');
      return;
    }

    // Confirmar exclusão
    const confirmar = confirm('🗑️ Tem certeza que deseja deletar este comentário?\n\nEsta ação não pode ser desfeita.');
    if (!confirmar) {
      return;
    }

    // Remover comentário do DOM com animação
    comentarioElement.style.transition = 'all 0.3s ease';
    comentarioElement.style.transform = 'scale(0)';
    comentarioElement.style.opacity = '0';
    
    setTimeout(() => {
      comentarioElement.remove();
    }, 300);

    // Remover do array de comentários
    this.comentarios = this.comentarios.filter(comentario => 
      comentario.id !== comentarioId
    );

    // Atualizar localStorage
    this.salvarComentarios();

    // Enviar para o backend (se implementado)
    this.deletarComentarioBackend(comentarioId);

    console.log('🗑️ Comentário deletado:', comentarioId);
  }

  async deletarComentarioBackend(comentarioId) {
    const usuarioLogado = JSON.parse(localStorage.getItem('usuarioLogado') || '{}');
    const receitaId = this.receita.dataset.id;

    if (usuarioLogado.id) {
      try {
        const response = await fetch('http://localhost:3000/comment/delete', {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            userId: usuarioLogado.id,
            recipeId: receitaId,
            commentId: comentarioId
          })
        });

        if (response.ok) {
          const result = await response.json();
          console.log('✅ Comentário deletado no servidor!', result);
        }
      } catch (error) {
        console.warn('⚠️ Erro ao deletar comentário no servidor:', error);
      }
    }
  }

  curtirReceita() {
    if (!this.jaCurtiu) {
      // CURTIR
      this.curtidas++;
      this.btnCurtir.innerHTML = `<i class="fas fa-heart"></i> Curtido (${this.curtidas})`;
      this.btnCurtir.classList.add('curtido');
      this.jaCurtiu = true;

      // Animação de curtida
      this.btnCurtir.style.transform = 'scale(1.2)';
      setTimeout(() => {
        this.btnCurtir.style.transform = 'scale(1)';
      }, 200);

      console.log('❤️ Receita curtida!');
    } else {
      // DESCURTIR
      this.curtidas = Math.max(0, this.curtidas - 1);
      this.btnCurtir.innerHTML = `<i class="far fa-heart"></i> Curtir (${this.curtidas})`;
      this.btnCurtir.classList.remove('curtido');
      this.jaCurtiu = false;

      // Animação de descurtida
      this.btnCurtir.style.transform = 'scale(0.9)';
      setTimeout(() => {
        this.btnCurtir.style.transform = 'scale(1)';
      }, 200);

      console.log('💔 Receita descurtida!');
    }

    // Salvar no localStorage e backend
    this.salvarCurtida();
  }

  adicionarComentario() {
    const comentario = prompt('💬 Digite seu comentário:');
    if (comentario && comentario.trim()) {
      this.criarComentario(comentario.trim());
    }
  }

  criarComentario(texto) {
    // Obter nome do usuário logado
    const usuarioLogado = JSON.parse(localStorage.getItem('usuarioLogado') || '{}');
    const nomeUsuario = usuarioLogado.name || 'Usuário';
    
    console.log(`💬 Novo comentário de ${nomeUsuario}: "${texto}"`);
    
    const comentario = document.createElement('div');
    comentario.className = 'comentario-item';
    const comentarioId = Date.now(); // ID único baseado no timestamp
    comentario.dataset.comentarioId = comentarioId;
    comentario.dataset.autorId = usuarioLogado.id || '';
    
    comentario.innerHTML = `
      <div class="comentario-conteudo">
        <strong>${nomeUsuario}:</strong> ${texto}
        <span class="timestamp">${this.obterTimestamp()}</span>
      </div>
      <button class="btn-deletar-comentario" onclick="this.closest('.item-receita').gerenciadorReceita.deletarComentario(${comentarioId})" style="
        background-color: #dc3545;
        color: white;
        border: none;
        padding: 4px 8px;
        border-radius: 4px;
        font-size: 11px;
        cursor: pointer;
        margin-left: 10px;
        transition: all 0.2s;
      ">
        <i class="fas fa-trash"></i>
      </button>
    `;
    
    // Estilo do comentário
    comentario.style.cssText = `
      background: #f8fafc;
      padding: 10px;
      margin: 8px 0;
      border-radius: 8px;
      border-left: 3px solid #a44dd8;
      font-size: 14px;
      line-height: 1.4;
      display: flex;
      justify-content: space-between;
      align-items: center;
    `;
    
    // Estilo do timestamp
    const timestamp = comentario.querySelector('.timestamp');
    if (timestamp) {
      timestamp.style.cssText = `
        font-size: 11px;
        color: #666;
        margin-left: 10px;
        font-weight: normal;
      `;
    }

    // Estilo hover para o botão deletar
    const btnDeletar = comentario.querySelector('.btn-deletar-comentario');
    if (btnDeletar) {
      btnDeletar.addEventListener('mouseenter', () => {
        btnDeletar.style.backgroundColor = '#c82333';
        btnDeletar.style.transform = 'scale(1.1)';
      });
      btnDeletar.addEventListener('mouseleave', () => {
        btnDeletar.style.backgroundColor = '#dc3545';
        btnDeletar.style.transform = 'scale(1)';
      });
    }

    if (this.areaComentarios) {
      this.areaComentarios.appendChild(comentario);
    }
    
    // Salvar referência do gerenciador no elemento da receita
    this.receita.gerenciadorReceita = this;
    
    this.comentarios.push({ 
      id: comentarioId,
      texto, 
      usuario: nomeUsuario, 
      timestamp: this.obterTimestamp(),
      autorId: usuarioLogado.id || ''
    });

    // Salvar no localStorage e backend
    this.salvarComentarios();
    this.enviarComentarioBackend(texto);
  }

  async enviarComentarioBackend(texto) {
    const usuarioLogado = JSON.parse(localStorage.getItem('usuarioLogado') || '{}');
    const receitaId = this.receita.dataset.id || Math.floor(Math.random() * 1000);

    if (usuarioLogado.id) {
      try {
        const response = await fetch('http://localhost:3000/comment', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            userId: usuarioLogado.id,
            recipeId: receitaId,
            comment: texto
          })
        });

        if (response.ok) {
          const result = await response.json();
          console.log('💬 Comentário salvo no servidor!', result);
        }
      } catch (error) {
        console.warn('Erro ao salvar comentário no servidor:', error);
      }
    }
  }

  async salvarCurtida() {
    const receitaId = this.receita.dataset.id || Math.floor(Math.random() * 1000);
    
    // Salvar localmente
    localStorage.setItem(`receita_${receitaId}_curtidas`, this.curtidas);
    localStorage.setItem(`receita_${receitaId}_curtiu`, this.jaCurtiu);

    // Enviar para o backend se usuário logado
    const usuarioLogado = JSON.parse(localStorage.getItem('usuarioLogado') || '{}');
    if (usuarioLogado.id) {
      try {
        const response = await fetch('http://localhost:3000/like', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            user_id: usuarioLogado.id,
            recipe_id: receitaId,
            liked: this.jaCurtiu
          })
        });

        if (response.ok) {
          const result = await response.json();
          console.log(`${this.jaCurtiu ? '❤️ Curtida' : '💔 Descurtida'} salva no servidor!`);
        }
      } catch (error) {
        console.warn('Erro ao salvar curtida no servidor:', error);
      }
    }
  }

  salvarComentarios() {
    const receitaId = this.receita.dataset.id || Math.floor(Math.random() * 1000);
    localStorage.setItem(`receita_${receitaId}_comentarios`, JSON.stringify(this.comentarios));
  }

  carregarDados() {
    const receitaId = this.receita.dataset.id || Math.floor(Math.random() * 1000);
    
    // Carregar curtidas
    const curtidasSalvas = localStorage.getItem(`receita_${receitaId}_curtidas`);
    const jaCurtiuSalvo = localStorage.getItem(`receita_${receitaId}_curtiu`);
    
    if (curtidasSalvas && jaCurtiuSalvo === 'true') {
      this.curtidas = parseInt(curtidasSalvas);
      this.jaCurtiu = true;
      this.btnCurtir.innerHTML = `<i class="fas fa-heart"></i> Curtido (${this.curtidas})`;
      this.btnCurtir.classList.add('curtido');
    }

    // Carregar comentários
    const comentariosSalvos = localStorage.getItem(`receita_${receitaId}_comentarios`);
    if (comentariosSalvos) {
      this.comentarios = JSON.parse(comentariosSalvos);
      this.comentarios.forEach(comentarioData => {
        if (typeof comentarioData === 'string') {
          this.criarComentarioSalvo(comentarioData, 'Usuário', 'Carregado');
        } else {
          this.criarComentarioSalvo(comentarioData.texto, comentarioData.usuario, comentarioData.timestamp, comentarioData);
        }
      });
    }
  }

  criarComentarioSalvo(texto, usuario, timestamp, comentarioData = null) {
    const usuarioLogado = JSON.parse(localStorage.getItem('usuarioLogado') || '{}');
    const comentarioId = comentarioData?.id || Date.now();
    const autorId = comentarioData?.autorId || '';
    
    const comentario = document.createElement('div');
    comentario.className = 'comentario-item';
    comentario.dataset.comentarioId = comentarioId;
    comentario.dataset.autorId = autorId;
    
    comentario.innerHTML = `
      <div class="comentario-conteudo">
        <strong>${usuario}:</strong> ${texto}
        <span class="timestamp">${timestamp}</span>
      </div>
      <button class="btn-deletar-comentario" onclick="this.closest('.item-receita').gerenciadorReceita.deletarComentario(${comentarioId})" style="
        background-color: #dc3545;
        color: white;
        border: none;
        padding: 4px 8px;
        border-radius: 4px;
        font-size: 11px;
        cursor: pointer;
        margin-left: 10px;
        transition: all 0.2s;
      ">
        <i class="fas fa-trash"></i>
      </button>
    `;
    
    // Estilo do comentário
    comentario.style.cssText = `
      background: #f8fafc;
      padding: 10px;
      margin: 8px 0;
      border-radius: 8px;
      border-left: 3px solid #a44dd8;
      font-size: 14px;
      line-height: 1.4;
      display: flex;
      justify-content: space-between;
      align-items: center;
    `;
    
    // Estilo do timestamp
    const timestampEl = comentario.querySelector('.timestamp');
    if (timestampEl) {
      timestampEl.style.cssText = `
        font-size: 11px;
        color: #666;
        margin-left: 10px;
        font-weight: normal;
      `;
    }

    // Estilo hover para o botão deletar
    const btnDeletar = comentario.querySelector('.btn-deletar-comentario');
    if (btnDeletar) {
      btnDeletar.addEventListener('mouseenter', () => {
        btnDeletar.style.backgroundColor = '#c82333';
        btnDeletar.style.transform = 'scale(1.1)';
      });
      btnDeletar.addEventListener('mouseleave', () => {
        btnDeletar.style.backgroundColor = '#dc3545';
        btnDeletar.style.transform = 'scale(1)';
      });
    }

    // Salvar referência do gerenciador no elemento da receita
    this.receita.gerenciadorReceita = this;

    if (this.areaComentarios) {
      this.areaComentarios.appendChild(comentario);
    }
  }

  obterTimestamp() {
    const agora = new Date();
    return agora.toLocaleTimeString('pt-BR', { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  }
}

// === INICIALIZAÇÃO ===
document.addEventListener('DOMContentLoaded', () => {
  // Inicializar componentes
  new MenuDropdown();
  new SistemaReceitas();
  
  // Adicionar classe de carregamento concluído
  document.body.classList.add('loaded');
});
