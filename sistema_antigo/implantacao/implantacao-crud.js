/**
 * implantacao-crud.js
 * Responsável por operações de dados (Create, Read, Update, Delete)
 */

// Objeto para operações CRUD
const ImplantacaoCRUD = {
    // Configurações
    config: {
        baseUrl: '', // Será definido na inicialização
        debug: false
    },
  
    /**
     * Inicializa o módulo CRUD
     * @param {Object} options Opções de configuração
     */
    init: function(options = {}) {
        // Mesclar opções fornecidas com padrões
        this.config = {...this.config, ...options};
        
        // Definir o caminho base
        this.config.baseUrl = '/';
        
        if (this.config.debug) {
            console.log("CRUD inicializado:", this.config);
        }
    },
  
    getApiUrl: function() {
      // More robust path detection
      let basePath = '';
      
      // Try to determine the path from the current URL
      const pathSegments = window.location.pathname.split('/');
      const currentFile = pathSegments[pathSegments.length - 1];
      
      // If we're in implantacao.php
      if (currentFile === 'implantacao.php') {
          // We're in core/implantacao, so helpers is ../../helpers
          basePath = '../../helpers/implantacao_helpers.php';
      }
      // If we're already in the helpers directory
      else if (pathSegments.includes('helpers')) {
          basePath = 'implantacao_helpers.php';
      }
      // If we're in the admin area
      else if (pathSegments.includes('admin')) {
          basePath = '/helpers/implantacao_helpers.php';
      }
      // Default fallback
      else {
          basePath = '../../helpers/implantacao_helpers.php';
      }
      
      console.log("API URL determined as:", basePath);
      return basePath;
  },
  logApiResponse: function(url, response, label) {
    console.log(`[${label || 'API'}] Fetching from URL:`, url);
    console.log(`[${label || 'API'}] Response status:`, response.status);
    console.log(`[${label || 'API'}] Response headers:`, 
        Object.fromEntries([...response.headers.entries()]));
    
    return response.text().then(text => {
        try {
            const json = JSON.parse(text);
            console.log(`[${label || 'API'}] Valid JSON response:`, json);
            return json;
        } catch (e) {
            console.error(`[${label || 'API'}] Invalid JSON:`, e);
            console.log(`[${label || 'API'}] Raw response:`, text.substring(0, 500));
            throw new Error(`Invalid JSON response: ${e.message}`);
        }
    });
  },
  
   // Adicionar método para forçar sincronização de itens
  // Replace the existing forcarSincronizacaoItens method in ImplantacaoCRUD
  forcarSincronizacaoItens: function(periodoId, unidadeId) {
    const formData = new FormData();
    formData.append('action', 'force_sync_items');
    formData.append('periodo_id', periodoId);
    formData.append('unidade_id', unidadeId);
    
    console.log(`Forçando sincronização de itens para período ${periodoId}, unidade ${unidadeId}`);
    
    // Add explicit headers to identify as AJAX request
    return fetch(`${this.getApiUrl()}`, {
      method: 'POST',
      headers: {
        'X-Requested-With': 'XMLHttpRequest'  // This is crucial for PHP to recognize as AJAX
      },
      body: formData
    })
    .then(response => {
      if (!response.ok) {
        throw new Error(`Erro HTTP: ${response.status}`);
      }
      return response.text();
    })
    .then(text => {
      // Check if response is HTML (error page)
      if (text.includes("<br />") || text.includes("<!DOCTYPE") || text.includes("<html")) {
        console.error("Recebeu HTML em vez de JSON:", text.substring(0, 200));
        return { success: false, message: "Erro do servidor. Verifique os logs para mais detalhes." };
      }
      
      try {
        return JSON.parse(text);
      } catch (e) {
        console.error("Resposta não é JSON válido:", text.substring(0, 200));
        
        // Check if text contains "sucesso" to provide a more useful response
        if (text.includes('sucesso')) {
          return { 
            success: true, 
            message: "Sincronização realizada com sucesso",
            data: {
              itens_inseridos: "N/A",
              itens_atualizados: "N/A",
              setores_sincronizados: "N/A"
            }
          };
        }
        
        return { 
          success: false, 
          message: "Resposta inválida do servidor: " + text.substring(0, 100)
        };
      }
    })
    .catch(error => {
      console.error("Erro ao forçar sincronização:", error);
      return { success: false, message: error.message };
    });
  },
  
    
  /**
   * Carrega dados para a tabela Tabulator
   * @param {string} setorId ID do setor
   * @param {string} unidadeId ID da unidade
   * @param {string} periodoId ID do período
   * @returns {Promise} Promise com os dados
   */
  carregarDadosTabela: function(setorId, unidadeId, periodoId) {
    // Verificar se o período está congelado
    const isPeriodoCongelado = window.periodoInfo && window.periodoInfo.is_frozen;
    
    console.log("Carregando dados para período", periodoId, 
                "Congelado:", isPeriodoCongelado ? "SIM" : "NÃO");
    
    // Para períodos congelados, usar uma URL diferente que busca APENAS da tabela diagnóstico
    let url;
    if (isPeriodoCongelado) {
        url = `${this.getApiUrl()}?action=get_diagnostico_frozen&setor_id=${setorId}&unidade_id=${unidadeId}&periodo_id=${periodoId}`;
        console.log("Usando rota exclusiva para diagnóstico (período congelado)");
    } else {
        url = `${this.getApiUrl()}?action=get_itens_tabela&setor_id=${setorId}&unidade_id=${unidadeId}&periodo_id=${periodoId}`;
        console.log("Usando rota padrão (período não congelado)");
    }
    
    console.log("Carregando dados da tabela de:", url);
    
    return fetch(url)
      .then(response => {
        if (!response.ok) {
          throw new Error(`Erro HTTP: ${response.status}`);
        }
        return response.text();
      })
      .then(text => {
        // Verificar se a resposta é HTML (erro)
        if (text.includes("<br />") || text.includes("<!DOCTYPE") || text.includes("<html")) {
          console.error("Recebeu HTML em vez de JSON:", text.substring(0, 200));
          return []; // Retornar array vazio para não quebrar o Tabulator
        }
        
        try {
          const resposta = JSON.parse(text);
          
          // Se recebemos um objeto com campo 'data', retornar os dados diretamente
          if (resposta.data && Array.isArray(resposta.data)) {
            return resposta.data;
          }
          
          // Se recebemos um array diretamente, retornar o array
          if (Array.isArray(resposta)) {
            return resposta;
          }
          
          // Se recebemos um objeto com erro, retornar array vazio
          if (resposta.error) {
            console.error("Erro retornado pelo servidor:", resposta.error);
            return [];
          }
          
          // Caso padrão
          return resposta;
        } catch (e) {
          console.error("Resposta não é JSON válido:", text.substring(0, 200));
          return [];
        }
      })
      .catch(error => {
        console.error("Erro ao carregar dados:", error);
        return [];
      });
  },
  
    /**
       * Obtém dados de progresso para um setor
       * @param {string} setorId ID do setor
       * @param {string} setorNome Nome do setor (sanitizado)
       * @param {string} unidadeId ID da unidade
       * @param {string} periodoId ID do período
       * @returns {Promise} Promise com os dados de progresso
       */
    obterProgresso: function(setorId, setorNome, unidadeId, periodoId) {
      // Corrigir a URL para usar o caminho correto sem duplicação
      const url = `${this.getApiUrl()}?action=get_progress&setor=${setorNome}&setor_id=${setorId}&unidade=${unidadeId}&periodo=${periodoId}`;
      
      console.log("Obtendo progresso de:", url);
      
      return fetch(url)
        .then(response => {
          if (!response.ok) {
            throw new Error(`Erro HTTP: ${response.status}`);
          }
          return response.text(); // Alterar para text primeiro
        })
        .then(text => {
          // Verificar se a resposta é HTML (contém tag de erro PHP)
          if (text.includes("<br />") || text.includes("<!DOCTYPE") || text.includes("<html")) {
            console.error("Recebeu HTML em vez de JSON:", text.substring(0, 200));
            // Criar objeto de erro personalizado
            return { error: "Erro do servidor. Verifique os logs para mais detalhes." };
          }
          
          try {
            // Tentar fazer parse do JSON
            return JSON.parse(text);
          } catch (e) {
            console.error("Resposta não é JSON válido:", text.substring(0, 200));
            return { error: "Resposta inválida do servidor" };
          }
        })
        .catch(error => {
          console.error("Erro ao obter progresso:", error);
          return { error: error.message };
        });
    },
  
     /**
       * Obtém um diagnóstico por ID
       * @param {number} diagnosticoId ID do diagnóstico
       * @returns {Promise} Promise com os dados do diagnóstico
       */
     obterDiagnostico: function(diagnosticoId) {
      const formData = new FormData();
      formData.append('action', 'get_diagnostico_by_id');
      formData.append('diagnostico_id', diagnosticoId);
      
      console.log(`Obtendo diagnóstico ID ${diagnosticoId}`);
      
      return fetch(`${this.config.baseUrl}core/implantacao/implantacao.php`, {
        method: 'POST',
        body: formData
      })
      .then(response => {
        if (!response.ok) {
          throw new Error(`Erro HTTP: ${response.status}`);
        }
        return response.text(); // Alterar para text primeiro
      })
      .then(text => {
        // Verificar se a resposta é HTML
        if (text.includes("<br />") || text.includes("<!DOCTYPE") || text.includes("<html")) {
          console.error("Recebeu HTML em vez de JSON:", text.substring(0, 200));
          throw new Error("Erro do servidor. Verifique os logs para mais detalhes.");
        }
        
        try {
          // Tentar fazer parse do JSON
          return JSON.parse(text);
        } catch (e) {
          console.error("Resposta não é JSON válido:", text.substring(0, 200));
          throw new Error("Resposta inválida do servidor");
        }
      })
      .catch(error => {
        console.error("Erro ao obter diagnóstico:", error);
        throw error;
      });
    },
  
     /**
       * Salva um item de avaliação
       * @param {Object} dadosItem Dados do item a ser salvo
       * @returns {Promise} Promise com a resposta da operação
       */
     salvarItem: function(dadosItem) {
      const formData = new FormData();
      
      // Adicionar todos os dados ao FormData
      Object.keys(dadosItem).forEach(key => {
        formData.append(key, dadosItem[key]);
      });
      
      // Garantir que a ação está definida
      if (!formData.has('action')) {
        formData.append('action', 'save_item');
      }
      
      console.log("Salvando item:", dadosItem);
      
      // Primeiro, verificar se o período está congelado
      return this.verificarPeriodoCongelado(dadosItem.id_periodo_diagnostico || dadosItem.periodo_id)
        .then(isFrozen => {
          // Se o período estiver congelado e não for uma requisição de AVALIAÇÃO de item existente
          // (ou seja, é um novo item), bloquear a operação
          if (isFrozen && formData.get('action') === 'save_new_item') {
            console.log("Operação bloqueada: período congelado, não é possível adicionar novos itens");
            return { 
              status: "Erro", 
              message: "Este período está congelado. Novos itens só podem ser adicionados usando a opção de Sincronização Forçada." 
            };
          }
          
          // Se não for bloqueado, continuar com a operação normal
          return fetch(`${this.config.baseUrl}core/implantacao/implantacao.php`, {
            method: 'POST',
            headers: {
              'X-Requested-With': 'XMLHttpRequest'
            },
            body: formData
          })
          .then(response => {
            if (!response.ok) {
              throw new Error(`Erro HTTP: ${response.status}`);
            }
            return response.text();
          })
          .then(text => {
            // Verificar se a resposta é HTML
            if (text.includes("<br />") || text.includes("<!DOCTYPE") || text.includes("<html")) {
              console.error("Recebeu HTML em vez de JSON:", text.substring(0, 200));
              return { status: "Erro", message: "Erro do servidor. Verifique os logs para mais detalhes." };
            }
            
            // Tentativa de parsear como JSON
            try {
              return JSON.parse(text);
            } catch (e) {
              // Se não for JSON, retornar um objeto com o texto
              return { status: (text.includes('sucesso') || text === 'Salvo' || text === 'Atualizado') ? "Sucesso" : "Erro", message: text };
            }
          })
          .catch(error => {
            console.error("Erro ao salvar item:", error);
            return { status: "Erro", message: error.message };
          });
        });
    },
    /**
       * Verifica se um período está congelado
       * @param {number} periodoId ID do período
       * @returns {Promise<boolean>} Promise que resolve para true se congelado, false caso contrário
       */
    verificarPeriodoCongelado: function(periodoId) {
      if (!periodoId) return Promise.resolve(false);
      
      // Se já temos a informação no objeto window, usar diretamente
      if (window.periodoInfo && window.periodoInfo.id == periodoId) {
        console.log(`Verificação de congelamento usando cache: ${window.periodoInfo.is_frozen}`);
        return Promise.resolve(!!window.periodoInfo.is_frozen);
      }
      
      // Caso contrário, buscar do servidor
      const url = `${this.getApiUrl()}?action=check_period_frozen&periodo_id=${periodoId}`;
      
      return fetch(url)
        .then(response => {
          if (!response.ok) {
            throw new Error(`Erro HTTP: ${response.status}`);
          }
          return response.text();
        })
        .then(text => {
          try {
            const data = JSON.parse(text);
            return !!data.is_frozen;
          } catch (e) {
            console.error("Erro ao verificar congelamento do período:", e);
            return false; // Em caso de erro, assume não congelado para evitar bloqueios indevidos
          }
        })
        .catch(error => {
          console.error("Erro ao verificar congelamento do período:", error);
          return false;
        });
    },
  
  /**
       * Salva um novo item criado pelo usuário
       * @param {Object} dadosNovoItem Dados do novo item
       * @returns {Promise} Promise com a resposta da operação
       */
  salvarNovoItem: function(dadosNovoItem) {
      const formData = new FormData();
      
      // Adicionar todos os dados ao FormData
      Object.keys(dadosNovoItem).forEach(key => {
        formData.append(key, dadosNovoItem[key]);
      });
      
      // Garantir que a ação está definida
      if (!formData.has('action')) {
        formData.append('action', 'save_new_item');
      }
      
      console.log("Salvando novo item:", dadosNovoItem);
      
      // Verificar primeiro se o período está congelado
      const periodoId = dadosNovoItem.id_periodo_diagnostico || dadosNovoItem.periodo_id;
      
      return this.verificarPeriodoCongelado(periodoId)
        .then(isFrozen => {
          // Se o período estiver congelado, bloquear a adição de novos itens
          if (isFrozen) {
            console.log("Operação bloqueada: período congelado, não é possível adicionar novos itens");
            return { 
              status: "Erro", 
              message: "Este período está congelado. Novos itens só podem ser adicionados usando a opção de Sincronização Forçada." 
            };
          }
          
          // Se não estiver congelado, continuar com a operação normal
          return fetch(`${this.config.baseUrl}core/implantacao/implantacao.php`, {
            method: 'POST',
            body: formData
          })
          .then(response => {
            if (!response.ok) {
              throw new Error(`Erro HTTP: ${response.status}`);
            }
            return response.text();
          })
          .then(text => {
            // Verificar se a resposta é HTML
            if (text.includes("<br />") || text.includes("<!DOCTYPE") || text.includes("<html")) {
              console.error("Recebeu HTML em vez de JSON:", text.substring(0, 200));
              return { status: "Erro", message: "Erro do servidor. Verifique os logs para mais detalhes." };
            }
            
            // Tentativa de parsear como JSON
            try {
              return JSON.parse(text);
            } catch (e) {
              // Se não for JSON, retornar um objeto com o texto
              return { 
                status: (text.includes('sucesso') || text === 'Salvo' || text === 'Atualizado') ? "Sucesso" : "Erro", 
                message: text 
              };
            }
          })
          .catch(error => {
            console.error("Erro ao salvar novo item:", error);
            return { status: "Erro", message: error.message };
          });
        });
    },
   /**
       * Carrega a lista de itens salvos para um setor
       * @param {string} setorSafe ID sanitizado do setor
       * @param {number} setorId ID do setor no banco
       * @param {number} unidadeId ID da unidade
       * @param {number} periodoId ID do período
       * @returns {Promise} Promise com o HTML dos itens salvos
       */
   carregarItensSalvos: function(setorSafe, setorId, unidadeId, periodoId) {
      const url = `${this.config.baseUrl}core/implantacao/implantacao.php?action=fetch_saved_items&setor=${encodeURIComponent(setorSafe)}&setor_id=${encodeURIComponent(setorId)}&unidade=${encodeURIComponent(unidadeId)}&periodo=${encodeURIComponent(periodoId)}`;
      
      console.log("Carregando itens salvos de:", url);
      
      return fetch(url)
        .then(response => {
          if (!response.ok) {
            throw new Error(`Erro HTTP: ${response.status}`);
          }
          return response.text();
        })
        .catch(error => {
          console.error("Erro ao carregar itens salvos:", error);
          throw error;
        });
    },
  
    /**
       * Exclui um período e todos os diagnósticos relacionados
       * @param {number} periodoId ID do período a ser excluído
       * @returns {Promise} Promise com a resposta da operação
       */
    excluirPeriodo: function(periodoId) {
      const formData = new FormData();
      formData.append('action', 'delete_period');
      formData.append('periodo_id', periodoId);
      
      console.log(`Excluindo período ID ${periodoId}`);
      
      return fetch(`${this.config.baseUrl}core/implantacao/implantacao.php`, {
        method: 'POST',
        body: formData
      })
      .then(response => {
        if (!response.ok) {
          throw new Error(`Erro HTTP: ${response.status}`);
        }
        return response.text();
      })
      .then(text => {
        // Verificar se a resposta é HTML
        if (text.includes("<br />") || text.includes("<!DOCTYPE") || text.includes("<html")) {
          console.error("Recebeu HTML em vez de JSON:", text.substring(0, 200));
          return { success: false, message: "Erro do servidor. Verifique os logs para mais detalhes." };
        }
        
        // Tentativa de parsear como JSON
        try {
          return JSON.parse(text);
        } catch (e) {
          return { 
            success: text.includes('sucesso'), 
            message: text 
          };
        }
      })
      .catch(error => {
        console.error("Erro ao excluir período:", error);
        return { success: false, message: error.message };
      });
    },
  
    /**
       * Atualiza um item salvo no banco
       * @param {Object} dadosItem Dados do item a ser atualizado
       * @returns {Promise} Promise com a resposta da operação
       */
    atualizarItem: function(dadosItem) {
      const formData = new FormData();
      
      // Adicionar todos os dados ao FormData
      Object.keys(dadosItem).forEach(key => {
        formData.append(key, dadosItem[key]);
      });
      
      // Garantir que a ação está definida
      if (!formData.has('action')) {
        formData.append('action', 'update_saved_item');
      }
      
      console.log("Atualizando item:", dadosItem);
      
      return fetch(`${this.config.baseUrl}core/implantacao/implantacao.php`, {
        method: 'POST',
        body: formData
      })
      .then(response => {
        if (!response.ok) {
          throw new Error(`Erro HTTP: ${response.status}`);
        }
        return response.text();
      })
      .then(text => {
        // Verificar se a resposta é HTML
        if (text.includes("<br />") || text.includes("<!DOCTYPE") || text.includes("<html")) {
          console.error("Recebeu HTML em vez de JSON:", text.substring(0, 200));
          return { success: false, message: "Erro do servidor. Verifique os logs para mais detalhes." };
        }
        
        try {
          return JSON.parse(text);
        } catch (e) {
          return { success: text.includes('sucesso'), message: text };
        }
      })
      .catch(error => {
        console.error("Erro ao atualizar item:", error);
        return { success: false, message: error.message };
      });
    },
  
    /**
     * Exclui um diagnóstico
     * @param {number} diagnosticoId ID do diagnóstico a ser excluído
     * @returns {Promise} Promise com a resposta da operação
     */
    excluirDiagnostico: function(diagnosticoId) {
      const formData = new FormData();
      formData.append('action', 'delete_diagnostico');
      formData.append('id', diagnosticoId);
      
      console.log(`Excluindo diagnóstico ID ${diagnosticoId}`);
      
      return fetch(`${this.config.baseUrl}core/implantacao/implantacao.php`, {
        method: 'POST',
        body: formData
      })
      .then(response => {
        if (!response.ok) {
          throw new Error(`Erro HTTP: ${response.status}`);
        }
        return response.text();
      })
      .then(text => {
        // Verificar se a resposta é HTML
        if (text.includes("<br />") || text.includes("<!DOCTYPE") || text.includes("<html")) {
          console.error("Recebeu HTML em vez de texto puro:", text.substring(0, 200));
          return { success: false, message: "Erro do servidor. Verifique os logs para mais detalhes." };
        }
        
        try {
          return JSON.parse(text);
        } catch (e) {
          return { success: true, message: text };
        }
      })
      .catch(error => {
        console.error("Erro ao excluir diagnóstico:", error);
        return { success: false, message: error.message };
      });
    },
  
    // Add these functions to ImplantacaoCRUD object
  
    getSetoresWithSubsectors: function(unidadeId) {
      return new Promise((resolve, reject) => {
          if (!unidadeId) {
              reject(new Error("Unidade ID is required"));
              return;
          }
          
          fetch(`${this.getApiUrl()}?action=get_setores_with_subsectors&unidade_id=${unidadeId}`)
              .then(response => {
                  if (!response.ok) {
                      throw new Error(`HTTP error! status: ${response.status}`);
                  }
                  return response.json();
              })
              .then(data => {
                  if (data.error) {
                      reject(new Error(data.error));
                  } else {
                      resolve(data);
                  }
              })
              .catch(error => {
                  console.error("Error getting sectors with subsectors:", error);
                  reject(error);
              });
      });
    },
  
    // Updated to support subsectors
   // Updated to support subsectors
  getItensBySubsetor: function(setorId, subsetorId, unidadeId, periodoId) {
    return new Promise((resolve, reject) => {
        if (!setorId || !unidadeId || !periodoId) {
            reject(new Error("Setor ID, Unidade ID and Periodo ID are required"));
            return;
        }
        
        const params = new URLSearchParams({
            action: 'get_itens_tabela',
            setor_id: setorId,
            unidade_id: unidadeId,
            periodo_id: periodoId
        });
        
        if (subsetorId) {
            params.append('subsetor_id', subsetorId);
        }
        
        fetch(`${this.getApiUrl()}?${params}`, {
            method: 'GET',
            headers: {
                'X-Requested-With': 'XMLHttpRequest'
            }
        })
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            // First get as text for debugging
            return response.text();
        })
        .then(text => {
            try {
                const data = JSON.parse(text);
                if (data.error) {
                    reject(new Error(data.error));
                } else {
                    resolve(data);
                }
            } catch (e) {
                console.error("JSON parse error:", e, "Text:", text.substring(0, 200));
                reject(new Error("Failed to parse server response"));
            }
        })
        .catch(error => {
            console.error("Error getting items by sector/subsector:", error);
            reject(error);
        });
    });
  },
  
    // Updated to support subsector progress
    obterProgresso: function(setorId, tabId, unidadeId, periodoId, subsetorId = null) {
      return new Promise((resolve, reject) => {
          if (!setorId || !unidadeId || !periodoId) {
              reject(new Error("Missing required parameters"));
              return;
          }
          
          const params = new URLSearchParams({
              action: 'get_progress',
              setor_id: setorId,
              unidade: unidadeId,
              periodo: periodoId
          });
          
          if (subsetorId) {
              params.append('subsetor_id', subsetorId);
          }
          
          fetch(`${this.getApiUrl()}?${params}`, {
              method: 'GET',
              headers: {
                  'X-Requested-With': 'XMLHttpRequest'
              }
          })
          .then(response => {
              if (!response.ok) {
                  throw new Error(`HTTP error! status: ${response.status}`);
              }
              return response.json();
          })
          .then(data => {
              resolve(data);
          })
          .catch(error => {
              console.error("Error getting progress:", error);
              reject(error);
          });
      });
    },
  
    // Updated to save item with subsector
    salvarItem: function(dadosItem) {
      return new Promise((resolve, reject) => {
          if (!dadosItem.item_id && !dadosItem.item) {
              reject(new Error("Item ID or name is required"));
              return;
          }
          
          const formData = new FormData();
          
          // Add all item data to FormData
          for (const key in dadosItem) {
              if (dadosItem.hasOwnProperty(key)) {
                  formData.append(key, dadosItem[key]);
              }
          }
          
          // Make sure subsetor_id is included if available
          if (window.currentSubsetorId && !formData.has('subsetor_id')) {
              formData.append('subsetor_id', window.currentSubsetorId);
          }
          
          fetch(this.getApiUrl(), {
              method: 'POST',
              headers: {
                  'X-Requested-With': 'XMLHttpRequest'
              },
              body: formData
          })
          .then(response => {
              if (!response.ok) {
                  throw new Error(`HTTP error! status: ${response.status}`);
              }
              return response.text();
          })
          .then(text => {
              try {
                  const data = JSON.parse(text);
                  resolve(data);
              } catch (e) {
                  // If the response is not valid JSON, try to determine if it was successful
                  const success = text.toLowerCase().includes('sucesso') || 
                                text.toLowerCase().includes('salvo com') ||
                                text.toLowerCase().includes('atualizado');
                  
                  resolve({
                      success: success,
                      status: success ? 'Sucesso' : 'Erro',
                      message: text
                  });
              }
          })
          .catch(error => {
              console.error("Error saving item:", error);
              reject(error);
          });
      });
    }
  };