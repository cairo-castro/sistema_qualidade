<?php

// Incluir configurações globais
require_once dirname(__FILE__, 3) . '/config/config.php';

// Primeiro, vamos definir caminhos absolutos
require_once dirname(__FILE__, 3) . '/helpers/implantacao_helpers.php';

// Verificar se é uma requisição AJAX
$isAjax = !empty($_SERVER['HTTP_X_REQUESTED_WITH']) && 
    strtolower($_SERVER['HTTP_X_REQUESTED_WITH']) == 'xmlhttprequest';

// Iniciar buffer de saída para capturar qualquer saída indesejada
ob_start();

// Verificar se é uma requisição POST para obter diagnóstico por ID
if ($_SERVER['REQUEST_METHOD'] === 'POST' && 
    isset($_POST['action']) && $_POST['action'] === 'get_diagnostico_by_id') {
    
    header('Content-Type: application/json; charset=utf-8');
    
    $diagnostico_id = isset($_POST['diagnostico_id']) ? intval($_POST['diagnostico_id']) : 0;
    
    if (!$diagnostico_id) {
        echo json_encode(['error' => 'ID não fornecido']);
        exit;
    }
    
    try {
        $sql = "SELECT id, item, statu, observacoes, nao_se_aplica, setor_id, unidade_id, id_periodo_diagnostico 
                FROM diagnostico 
                WHERE id = ?";
                
        $stmt = $conn->prepare($sql);
        $stmt->execute([$diagnostico_id]);
        $data = $stmt->fetch(PDO::FETCH_ASSOC);
        
        if (!$data) {
            echo json_encode(['error' => 'Diagnóstico não encontrado']);
            exit;
        }
        
        // Converter para o formato esperado
        echo json_encode([
            'id' => $data['id'],
            'item' => $data['item'],
            'statu' => $data['statu'],
            'observacoes' => $data['observacoes'],
            'nao_se_aplica' => (int)$data['nao_se_aplica'],
            'setor_id' => $data['setor_id'],
            'unidade_id' => $data['unidade_id'],
            'id_periodo_diagnostico' => $data['id_periodo_diagnostico']
        ]);
        
    } catch (PDOException $e) {
        echo json_encode(['error' => 'Erro ao buscar dados: ' . $e->getMessage()]);
    }
    exit;
}

// Handler para buscar problemas de diagnóstico
if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['action']) && $_POST['action'] === 'get_problemas_diagnostico') {
    header('Content-Type: application/json; charset=utf-8');
    
    $search = isset($_POST['search']) ? trim($_POST['search']) : '';
    $itemId = isset($_POST['id_item']) ? intval($_POST['id_item']) : 0;
    $page = isset($_POST['page']) ? intval($_POST['page']) : 1;
    $perPage = 10;
    $offset = ($page - 1) * $perPage;
    
    try {
        // Construir a consulta
        $params = [];
        $whereClause = '';
        
        if ($itemId) {
            $whereClause = "WHERE id_items_diagnostico = ?";
            $params[] = $itemId;
        }
        
        if (!empty($search)) {
            if ($whereClause) {
                $whereClause .= " AND nome LIKE ?";
            } else {
                $whereClause = "WHERE nome LIKE ?";
            }
            $params[] = "%$search%";
        }
        
        // Consulta para obter os problemas filtrados
        $sql = "SELECT id, nome as text 
                FROM problemas_diagnostico 
                $whereClause 
                ORDER BY nome 
                LIMIT ? OFFSET ?";
        
        $params[] = $perPage;
        $params[] = $offset;
        
        $stmt = $conn->prepare($sql);
        $stmt->execute($params);
        $problemas = $stmt->fetchAll(PDO::FETCH_ASSOC);
        
        // Consulta para contar o total de resultados
        $countSql = "SELECT COUNT(*) FROM problemas_diagnostico $whereClause";
        $countStmt = $conn->prepare($countSql);
        $countStmt->execute(array_slice($params, 0, -2)); // Remover limit e offset
        $total = $countStmt->fetchColumn();
        
        echo json_encode([
            'problemas' => $problemas,
            'total' => intval($total),
            'pagination' => [
                'more' => ($offset + $perPage) < $total
            ]
        ]);
        
    } catch (PDOException $e) {
        echo json_encode(['error' => 'Erro ao buscar problemas: ' . $e->getMessage()]);
    }
    exit;
}

// Handler para buscar problemas já selecionados para um item
if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['action']) && $_POST['action'] === 'get_selected_problemas') {
    header('Content-Type: application/json; charset=utf-8');
    
    $itemId = isset($_POST['id_item']) ? intval($_POST['id_item']) : 0;
    
    if (!$itemId) {
        echo json_encode(['error' => 'ID do item não fornecido']);
        exit;
    }
    
    try {
        // Verificar se existe a tabela de relacionamento
        $checkTableSql = "SHOW TABLES LIKE 'item_problema_rel'";
        $checkTableStmt = $conn->query($checkTableSql);
        $tableExists = $checkTableStmt->rowCount() > 0;
        
        if ($tableExists) {
            // Usar a tabela de relacionamento para buscar problemas
            $sql = "SELECT p.id, p.nome 
                    FROM problemas_diagnostico p
                    JOIN item_problema_rel r ON p.id = r.problema_id
                    WHERE r.item_id = ?
                    ORDER BY p.nome";
            $stmt = $conn->prepare($sql);
            $stmt->execute([$itemId]);
        } else {
            // Buscar problemas diretamente pela coluna id_items_diagnostico
            $sql = "SELECT id, nome 
                    FROM problemas_diagnostico 
                    WHERE id_items_diagnostico = ?
                    ORDER BY nome";
            $stmt = $conn->prepare($sql);
            $stmt->execute([$itemId]);
        }
        
        $problemas = $stmt->fetchAll(PDO::FETCH_ASSOC);
        
        echo json_encode(['problemas' => $problemas]);
        
    } catch (PDOException $e) {
        echo json_encode(['error' => 'Erro ao buscar problemas selecionados: ' . $e->getMessage()]);
    }
    exit;
}

// Handler para salvar avaliação
if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['action']) && $_POST['action'] === 'save_evaluation') {
    // Incluir o arquivo de helpers se ainda não foi incluído
    require_once dirname(__FILE__, 3) . '/helpers/implantacao_helpers.php';
    
    // Chamar a função que salva avaliação
    saveEvaluation($conn);
    exit;
}

/// Endpoint para obter dados da tabela (NOVO para Tabulator)
if ($_SERVER['REQUEST_METHOD'] === 'GET' && isset($_GET['action']) && $_GET['action'] === 'get_itens_tabela') {
  header('Content-Type: application/json; charset=utf-8');

  $setor_id = isset($_GET['setor_id']) ? intval($_GET['setor_id']) : 0;
  $unidade_id = isset($_GET['unidade_id']) ? intval($_GET['unidade_id']) : 0;
  $periodo_id = isset($_GET['periodo_id']) ? intval($_GET['periodo_id']) : 0;

  if (!$setor_id || !$periodo_id) {
      echo json_encode(['error' => 'Parâmetros inválidos']);
      exit;
  }

  try {
      // Query - Change 'd.statu' to 'd.avaliacao_resultado'
      $sql = "
          SELECT 
              i.id, 
              i.nome_item AS item,
              COALESCE(d.avaliacao_resultado, '') AS status, /* Changed from d.statu to d.avaliacao_resultado */
              COALESCE(d.nao_se_aplica, 0) AS nao_aplica,
              d.id AS diagnostico_id,
              COALESCE(d.observacoes, '') AS observacoes
          FROM items_diagnostico i 
          LEFT JOIN diagnostico d ON 
              d.item_hash = MD5(LOWER(TRIM(i.nome_item))) AND 
              d.unidade_id = i.unidade_id AND 
              d.id_periodo_diagnostico = ? AND
              d.setor_id = i.setor_id
          WHERE 
              i.setor_id = ? AND 
              i.unidade_id = ?
          ORDER BY 
              i.nome_item ASC
      ";
      
      $stmt = $conn->prepare($sql);
      $stmt->execute([$periodo_id, $setor_id, $unidade_id]);
      $itens = $stmt->fetchAll(PDO::FETCH_ASSOC);
      
      // Formatar para uso com Tabulator
      $resultado = [];
      foreach ($itens as $item) {
          // Converter alguns campos numéricos
          $item['id'] = intval($item['id']);
          $item['nao_aplica'] = intval($item['nao_aplica']);
          $item['diagnostico_id'] = $item['diagnostico_id'] ? intval($item['diagnostico_id']) : null;
          
          // Para facilitar a renderização, adicionar uma descrição do status
          if ($item['nao_aplica'] == 1) {
              $item['status_desc'] = 'Não se aplica';
              $item['status_class'] = 'bg-secondary';
              $item['status_icon'] = 'ban';
          } else if ($item['status'] == 'conforme') {
              $item['status_desc'] = 'Conforme';
              $item['status_class'] = 'bg-success';
              $item['status_icon'] = 'check-circle';
          } else if ($item['status'] == 'nao_conforme') {
              $item['status_desc'] = 'Não Conforme';
              $item['status_class'] = 'bg-danger';
              $item['status_icon'] = 'times-circle';
          } else if ($item['status'] == 'parcialmente_conforme') {
              $item['status_desc'] = 'Parcialmente Conforme';
              $item['status_class'] = 'bg-warning';
              $item['status_icon'] = 'exclamation-circle';
          } else {
              $item['status_desc'] = 'Pendente';
              $item['status_class'] = 'bg-light text-dark';
              $item['status_icon'] = 'circle';
          }
          
          $resultado[] = $item;
      }
      
      echo json_encode($resultado);
      
  } catch (PDOException $e) {
      echo json_encode(['error' => 'Erro ao buscar itens: ' . $e->getMessage()]);
  }
  exit;
}

// Verificar se é uma requisição para helpers
if (isset($_GET['action']) && $_GET['action'] == 'get_progress') {
  // Redirecionar para o arquivo de helpers
  require_once dirname(__FILE__, 3) . '/helpers/implantacao_helpers.php';
  // Chamar a função de atualizar do arquivo de helpers
  getProgress($conn);
  exit;
}

// Handler para atualizar item salvo
if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['action']) && $_POST['action'] === 'update_saved_item') {
  // Incluir o arquivo de helpers
  require_once dirname(__FILE__, 3) . '/helpers/implantacao_helpers.php';
  
  // Chamar a função de atualizar do arquivo de helpers
  updateSavedItem($conn);
  exit;
}

// Handler para excluir período
if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['action']) && $_POST['action'] === 'delete_period') {
  require_once dirname(__FILE__, 3) . '/helpers/implantacao_helpers.php';
  deletePeriod($conn);
  exit;
}

// Handler para salvar avaliação (modificado para incluir problemas)
if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['action']) && $_POST['action'] === 'save_evaluation') {
    header('Content-Type: application/json; charset=utf-8');
    
    try {
        // Extrair dados do POST
        $itemId = isset($_POST['item_id']) ? intval($_POST['item_id']) : 0;
        $status = isset($_POST['status']) ? $_POST['status'] : '';
        $observacao = isset($_POST['observacao']) ? $_POST['observacao'] : '';
        $naoSeAplica = isset($_POST['nao_se_aplica']) ? intval($_POST['nao_se_aplica']) : 0;
        $unidadeId = isset($_POST['unidade_id']) ? intval($_POST['unidade_id']) : 0;
        $periodoId = isset($_POST['periodo_id']) ? intval($_POST['periodo_id']) : 0;
        $problemas = isset($_POST['problemas']) ? $_POST['problemas'] : [];
        
        // Validar dados
        if (!$itemId) {
            echo json_encode(['success' => false, 'message' => 'ID do item não fornecido']);
            exit;
        }
        
        if (!$naoSeAplica && empty($status)) {
            echo json_encode(['success' => false, 'message' => 'Status não fornecido']);
            exit;
        }
        
        // Se nao_se_aplica for marcado, o status deve ser vazio
        if ($naoSeAplica) {
            $status = '';
        }
        
        // Iniciar transação
        $conn->beginTransaction();
        
        // Atualizar a avaliação
        $sql = "UPDATE diagnostico 
                SET statu = ?, observacoes = ?, nao_se_aplica = ? 
                WHERE id = ?";
        $stmt = $conn->prepare($sql);
        $stmt->execute([$status, $observacao, $naoSeAplica, $itemId]);
        
        // Salvar os problemas relacionados
        // Primeiro, verificar se a tabela de relacionamento existe
        $checkTableSql = "SHOW TABLES LIKE 'item_problema_rel'";
        $checkTableStmt = $conn->query($checkTableSql);
        $tableExists = $checkTableStmt->rowCount() > 0;
        
        if (!$tableExists) {
            // Criar a tabela se não existir
            $createTableSql = "CREATE TABLE item_problema_rel (
                id INT AUTO_INCREMENT PRIMARY KEY,
                item_id INT NOT NULL,
                problema_id INT NOT NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                UNIQUE KEY unique_item_problema (item_id, problema_id)
            )";
            $conn->exec($createTableSql);
        }
        
        // Remover relações antigas
        $deleteSql = "DELETE FROM item_problema_rel WHERE item_id = ?";
        $deleteStmt = $conn->prepare($deleteSql);
        $deleteStmt->execute([$itemId]);
        
        // Inserir novas relações
        if (!empty($problemas)) {
            $insertSql = "INSERT INTO item_problema_rel (item_id, problema_id) VALUES (?, ?)";
            $insertStmt = $conn->prepare($insertSql);
            
            foreach ($problemas as $problemaId) {
                $insertStmt->execute([$itemId, intval($problemaId)]);
            }
        }
        
        // Confirmar transação
        $conn->commit();
        
        // Buscar os dados atualizados do item
        $itemSql = "SELECT id, item, statu, observacoes, nao_se_aplica, setor_id, unidade_id 
                    FROM diagnostico 
                    WHERE id = ?";
        $itemStmt = $conn->prepare($itemSql);
        $itemStmt->execute([$itemId]);
        $itemData = $itemStmt->fetch(PDO::FETCH_ASSOC);
        
        echo json_encode([
            'success' => true, 
            'message' => 'Avaliação salva com sucesso',
            'item_data' => $itemData
        ]);
        
    } catch (PDOException $e) {
        // Desfazer mudanças em caso de erro
        if ($conn->inTransaction()) {
            $conn->rollBack();
        }
        
        echo json_encode([
            'success' => false, 
            'message' => 'Erro ao salvar avaliação: ' . $e->getMessage()
        ]);
    }
    exit;
}

// Se for uma requisição AJAX, processar e encerrar
if (isset($_GET['action'])) {
    // Limpar qualquer saída antes de processar a requisição
    if (ob_get_length()) ob_end_clean();
    
    // Processar a requisição
    processarRequisicaoImplantacao($conn);
    
    // Encerrar o script após processar a requisição AJAX
    exit;
}

// Isso normalmente ficaria na parte onde você obtém os dados do período
if (isset($selected_period) && isset($selected_period_id)) {
  // Verificar se já temos as informações de congelamento
  if (!isset($periodoStatus) || !isset($periodoStatus['is_frozen'])) {
    // Se a função getPeriodoStatus existe e retorna is_frozen, use-a
    if (function_exists('getPeriodoStatus')) {
      $periodoStatus = getPeriodoStatus($conn, $selected_period_id);
    }
    // Caso contrário, você precisará consultar o banco de dados diretamente
    else {
      try {
        $sqlFrozen = "SELECT is_frozen FROM periodo_diagnostico WHERE id = ? LIMIT 1";
        $stmtFrozen = $conn->prepare($sqlFrozen);
        $stmtFrozen->execute([$selected_period_id]);
        $isFrozen = (bool)$stmtFrozen->fetchColumn();
        
        // Se $periodoStatus já existe, apenas adicione a propriedade
        if (isset($periodoStatus)) {
          $periodoStatus['is_frozen'] = $isFrozen;
        }
        // Caso contrário, crie o array
        else {
          $periodoStatus = [
            'is_frozen' => $isFrozen
          ];
        }
      } catch (PDOException $e) {
        // Em caso de erro, assume que não está congelado
        if (isset($periodoStatus)) {
          $periodoStatus['is_frozen'] = false;
        } else {
          $periodoStatus = ['is_frozen' => false];
        }
        error_log("Erro ao verificar estado de congelamento do período: " . $e->getMessage());
      }
    }
  }
}


// Se não for AJAX, exibir a interface do usuário

// Obter dados para a interface
// Verificar se as funções estão disponíveis ou definir alternativas
if (!function_exists('getPeriodosAtivos')) {
    function getPeriodosAtivos($conn) {
        $sql = "SELECT p.id AS id_periodo_diagnostico, p.id_unidade, p.data_inicio, p.data_fim, u.unidade AS nome_unidade 
                FROM periodo_diagnostico p 
                JOIN unidade u ON p.id_unidade = u.id 
                WHERE p.data_fim >= CURDATE()
                ORDER BY p.data_inicio DESC";
        $stmt = $conn->query($sql);
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }
}

if (!function_exists('getPeriodos')) {
    function getPeriodos($conn) {
        $sql = "SELECT p.id AS id_periodo_diagnostico, p.id_unidade, p.data_inicio, p.data_fim, u.unidade AS nome_unidade 
                FROM periodo_diagnostico p 
                JOIN unidade u ON p.id_unidade = u.id 
                ORDER BY p.data_inicio DESC";
        $stmt = $conn->query($sql);
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }
}

if (!function_exists('getUnidades')) {
    function getUnidades($conn) {
        $sql = "SELECT id, unidade FROM unidade ORDER BY unidade";
        $stmt = $conn->query($sql);
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }
}

if (!function_exists('getPeriodoById')) {
    function getPeriodoById($conn, $periodoId) {
        if (!$periodoId) return null;
        
        $sql = "SELECT p.id AS id_periodo_diagnostico, p.id_unidade, p.data_inicio, p.data_fim, u.unidade AS nome_unidade 
                FROM periodo_diagnostico p 
                JOIN unidade u ON p.id_unidade = u.id
                WHERE p.id = ?";
        $stmt = $conn->prepare($sql);
        $stmt->execute([$periodoId]);
        return $stmt->fetch(PDO::FETCH_ASSOC);
    }
}

if (!function_exists('sanitizeId')) {
    function sanitizeId($string) {
        // Converter acentos para seus equivalentes sem acento
        $string = iconv('UTF-8', 'ASCII//TRANSLIT//IGNORE', $string);
        
        // Substituir caracteres não alfanuméricos por underscore
        $string = preg_replace('/[^a-zA-Z0-9]/', '_', $string);
        
        // Remover underscores múltiplos
        $string = preg_replace('/_+/', '_', $string);
        
        // Remover underscores no início e no fim
        $string = trim($string, '_');
        
        return strtolower($string);
    }
}

if (!function_exists('getSetoresByUnidade')) {
  function getSetoresByUnidade($conn, $unidadeId) {
    if (!$unidadeId) return [];
    
    // Updated query to use the correct column name 'nome' instead of 'nome_setor'
    $sql = "SELECT DISTINCT 
            s.id as setor_id, 
            s.nome as setor_nome,  /* Changed from 's.nome_setor' to 's.nome' */
            ss.id as subsetor_id,
            ss.nome as subsetor_nome 
            FROM unidade_setores us
            INNER JOIN setores s ON us.setor_id = s.id
            LEFT JOIN subsetores ss ON ss.setor_id = s.id
            WHERE us.unidade_id = ? 
            AND s.deletado = 0 
            AND (ss.deletado = 0 OR ss.deletado IS NULL)
            ORDER BY s.nome, ss.nome";  /* Also changed sorting from s.nome_setor to s.nome */
    
    $stmt = $conn->prepare($sql);
    $stmt->execute([$unidadeId]);
    
    // Group results by sector
    $setores = [];
    while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
        if (!isset($setores[$row['setor_id']])) {
            $setores[$row['setor_id']] = [
                'id' => $row['setor_id'],
                'nome' => $row['setor_nome'],
                'subsetores' => []
            ];
        }
        if ($row['subsetor_id']) {
            $setores[$row['setor_id']]['subsetores'][] = [
                'id' => $row['subsetor_id'],
                'nome' => $row['subsetor_nome']
            ];
        }
    }
    
    return array_values($setores);
}
}

// Nova função para buscar problemas por item
if (!function_exists('getProblemasByItem')) {
    function getProblemasByItem($conn, $itemId) {
        if (!$itemId) return [];
        
        try {
            // Verificar se existe a tabela de relacionamento
            $checkTableSql = "SHOW TABLES LIKE 'item_problema_rel'";
            $checkTableStmt = $conn->query($checkTableSql);
            $tableExists = $checkTableStmt->rowCount() > 0;
            
            if ($tableExists) {
                // Usar a tabela de relacionamento para buscar problemas
                $sql = "SELECT p.id, p.nome 
                        FROM problemas_diagnostico p
                        JOIN item_problema_rel r ON p.id = r.problema_id
                        WHERE r.item_id = ?
                        ORDER BY p.nome";
            } else {
                // Buscar problemas diretamente pela coluna id_items_diagnostico
                $sql = "SELECT id, nome 
                        FROM problemas_diagnostico 
                        WHERE id_items_diagnostico = ?
                        ORDER BY nome";
            }
            
            $stmt = $conn->prepare($sql);
            $stmt->execute([$itemId]);
            return $stmt->fetchAll(PDO::FETCH_ASSOC);
            
        } catch (PDOException $e) {
            error_log('Erro ao buscar problemas: ' . $e->getMessage());
            return [];
        }
    }
}

$periodos = getPeriodosAtivos($conn);
$periodos_todos = getPeriodos($conn);
$unidades = getUnidades($conn);

// Verificar se um período foi selecionado na URL
$selected_period_id = isset($_GET['unidade']) ? intval($_GET['unidade']) : null;
$selected_period = getPeriodoById($conn, $selected_period_id);
$selected_unidade = ($selected_period && isset($selected_period['id_unidade'])) ? $selected_period['id_unidade'] : '';


// Buscar setores se um período foi selecionado
$setores = [];
if ($selected_period) {
    $setores = getSetoresByUnidade($conn, $selected_period['id_unidade']);
}

// Verificar status do período, se um período estiver selecionado
if ($selected_period) {
  // Carregar informações do período selecionado
  $periodoStatus = getPeriodoStatus($conn, $selected_period_id);
  $selected_period['status'] = $periodoStatus;
  
  // Para uso nas seções HTML e JS
  $periodoExpirado = $periodoStatus['expirado'] ?? false;
  $periodoMensagem = $periodoStatus['mensagem'] ?? '';
  $periodoTipoAlerta = $periodoStatus['tipo_alerta'] ?? 'info';
   // Adicionar script para passar informações para o JavaScript
   echo '<script>
   // Informações do período atual
   window.periodoInfo = ' . json_encode($periodoStatus) . ';
   </script>';
}


// Configurar o título da página e incluir o cabeçalho
$pageTitle = "Diagnóstico de Implantação";
if (!defined('INCLUDED_HEAD')) {
    define('INCLUDED_HEAD', true);
    include __DIR__ . '/../../includes/head.php';
}

// Incluir componentes da interface
if (!defined('INCLUDED_COMPONENTS')) {
    define('INCLUDED_COMPONENTS', true);
    include __DIR__ . '/../../includes/header.php';
    include __DIR__ . '/../../includes/navbar.php';
    include __DIR__ . '/../../includes/sidebar.php';
}

?>
<!-- Incluir Tabulator CSS -->
<link href="https://unpkg.com/tabulator-tables@5.4.4/dist/css/tabulator.min.css" rel="stylesheet">

<!-- ProgressJS - CSS -->
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/progressjs@1.1.0/src/progressjs.min.css">
<!-- Incluir arquivo CSS customizado (a ser criado posteriormente) -->
<link href="../../css/implantacao.css" rel="stylesheet">

<!-- Modal de Sincronização - Replace or update the existing modal in implantacao.php -->
<!-- Make sure the modal exists in the DOM -->
<div class="modal fade" id="forceSyncModal" tabindex="-1" aria-labelledby="forceSyncModalLabel" aria-hidden="true">
  <div class="modal-dialog">
    <div class="modal-content">
      <div class="modal-header bg-warning text-dark">
        <h5 class="modal-title" id="forceSyncModalLabel">Forçar Sincronização de Itens</h5>
        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Fechar"></button>
      </div>
      <div class="modal-body">
        <div class="alert alert-warning">
          <i class="fas fa-exclamation-triangle me-2"></i>
          <strong>Atenção!</strong> Esta ação irá sincronizar todos os novos itens e alterações desde a criação do período congelado.
        </div>
        
        <p><strong>Período:</strong> <span id="sync-periodo-info"></span></p>
        
        <div class="mb-3">
          <div class="form-check">
            <input class="form-check-input" type="checkbox" id="confirmarSincronizacao" required>
            <label class="form-check-label" for="confirmarSincronizacao">
              Confirmo que desejo sincronizar todos os itens novos e modificados para este período.
            </label>
          </div>
        </div>
        
        <div id="sync-result" class="d-none alert mt-3"></div>
      </div>
      <div class="modal-footer">
        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancelar</button>
        <button type="button" class="btn btn-warning" id="btnForceSyncItems" onclick="submitSyncForm()">
          <i class="fas fa-sync-alt me-2"></i>Forçar Sincronização
        </button>
      </div>
    </div>
  </div>
</div>


<!-- Modal de Período -->
<div class="modal fade" id="periodoModal" data-bs-backdrop="static" data-bs-keyboard="false" tabindex="-1" aria-labelledby="periodoModalLabel" aria-hidden="true">
  <div class="modal-dialog modal-dialog-centered">
    <div class="modal-content">
      <div class="modal-header bg-primary text-white">
        <h5 class="modal-title" id="periodoModalLabel">Selecione ou Crie um Período</h5>
        <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal" aria-label="Close"></button>
      </div>
      <div class="modal-body">
        <ul class="nav nav-tabs" id="periodoTab" role="tablist">
          <li class="nav-item" role="presentation">
            <button class="nav-link active" id="selecionar-tab" data-bs-toggle="tab" data-bs-target="#selecionar" type="button" role="tab" aria-controls="selecionar" aria-selected="true">
                <i class="fas fa-calendar-check me-2"></i>Selecionar Período
            </button>
          </li>
          <li class="nav-item" role="presentation">
             <button class="nav-link" id="criar-tab" data-bs-toggle="tab" data-bs-target="#criar" type="button" role="tab" aria-controls="criar" aria-selected="false">
                <i class="fas fa-calendar-plus me-2"></i>Criar Período
            </button>
          </li>
          <li class="nav-item" role="presentation">
             <button class="nav-link" id="excluir-tab" data-bs-toggle="tab" data-bs-target="#excluir" type="button" role="tab" aria-controls="excluir" aria-selected="false">
                <i class="fas fa-calendar-times me-2"></i>Excluir Período
            </button>
          </li>
        </ul>
        <div class="tab-content pt-4" id="periodoTabContent">
          <!-- Aba Selecionar -->
          <div class="tab-pane fade show active" id="selecionar" role="tabpanel" aria-labelledby="selecionar-tab">
            <form id="formSelecionar" method="GET" action="implantacao.php">
              <div class="mb-3">
                <label for="unidadeSelectModal" class="form-label">Período Disponível</label>
                <select class="form-select" name="unidade" id="unidadeSelectModal" required>
                  <option value="">-- Selecione um período --</option>
                  <?php foreach ($periodos_todos as $p): ?>
                    <option value="<?php echo $p['id_periodo_diagnostico']; ?>">
                      <?php echo htmlspecialchars($p['nome_unidade']); ?> (<?php echo date("d/m/Y", strtotime($p['data_inicio'])); ?> - <?php echo date("d/m/Y", strtotime($p['data_fim'])); ?>)
                    </option>
                  <?php endforeach; ?>
                </select>
              </div>
              <button type="submit" class="btn btn-primary w-100">
                <i class="fas fa-check-circle me-2"></i>Selecionar
              </button>
            </form>
          </div>
          
          <!-- Aba Criar -->
          <div class="tab-pane fade" id="criar" role="tabpanel" aria-labelledby="criar-tab">
            <form id="formCriar" method="POST" action="implantacao.php?action=create_period">
              <div class="mb-3">
                <label for="unidadeInput" class="form-label">Unidade</label>
                <select class="form-select" name="unidade" id="unidadeInput" required>
                  <option value="">-- Selecione a Unidade --</option>
                  <?php foreach ($unidades as $unit): ?>
                  <option value="<?php echo $unit['id']; ?>">
                    <?php echo htmlspecialchars($unit['unidade']); ?>
                  </option>
                  <?php endforeach; ?>
                </select>
              </div>
              <div class="row">
                <div class="col-md-6 mb-3">
                  <label for="dataInicio" class="form-label">Data Início</label>
                  <input type="date" class="form-control" name="data_inicio" id="dataInicio" required>
                </div>
                <div class="col-md-6 mb-3">
                  <label for="dataFim" class="form-label">Data Fim</label>
                  <input type="date" class="form-control" name="data_fim" id="dataFim" required>
                </div>
              </div>
              
              <!-- Nova opção para controle de congelamento -->
              <div class="mb-3">
              <label class="form-label">Configuração de Itens:</label>
              <div class="form-check">
                <input class="form-check-input" type="radio" name="is_frozen" id="congelado" value="1" checked>
                <label class="form-check-label" for="congelado">
                  <i class="fas fa-lock me-1 text-warning"></i> Congelar itens (recomendado)
                  <small class="form-text text-muted d-block">
                    Apenas os itens que existem atualmente serão incluídos no período. 
                    Novos itens precisarão ser sincronizados manualmente.
                  </small>
                </label>
              </div>
              <div class="form-check mt-2">
                <input class="form-check-input" type="radio" name="is_frozen" id="nao_congelado" value="0">
                <label class="form-check-label" for="nao_congelado">
                  <i class="fas fa-lock-open me-1 text-success"></i> Não congelar itens
                  <small class="form-text text-muted d-block">
                    Novos itens cadastrados serão automaticamente sincronizados com este período.
                    Use com cuidado para avaliações em andamento.
                  </small>
                </label>
              </div>
            </div>
              
              <button type="submit" class="btn btn-success w-100" id="btnCriarPeriodo">
                <i class="fas fa-plus-circle me-2"></i>Criar Período
              </button>
            </form>
          </div>
          
          <!-- Aba Excluir -->
          <div class="tab-pane fade" id="excluir" role="tabpanel" aria-labelledby="excluir-tab">
            <div class="alert alert-danger">
              <i class="fas fa-exclamation-triangle me-2"></i>
              <strong>Atenção!</strong> Excluir um período também removerá todos os diagnósticos associados a ele.
            </div>
            <form id="formExcluir" onsubmit="return false;">
              <div class="mb-3">
                <label for="periodoExcluirSelect" class="form-label">Selecione o período a excluir</label>
                <select class="form-select" name="periodo_id" id="periodoExcluirSelect" required>
                  <option value="">-- Selecione um período --</option>
                  <?php foreach ($periodos_todos as $p): ?>
                    <option value="<?php echo $p['id_periodo_diagnostico']; ?>">
                      <?php echo htmlspecialchars($p['nome_unidade']); ?> (<?php echo date("d/m/Y", strtotime($p['data_inicio'])); ?> - <?php echo date("d/m/Y", strtotime($p['data_fim'])); ?>)
                    </option>
                  <?php endforeach; ?>
                </select>
                </select>
              </div>
              <div class="form-check mb-3">
                <input class="form-check-input" type="checkbox" id="confirmarExclusao" required>
                <label class="form-check-label" for="confirmarExclusao">
                  Confirmo que desejo excluir este período e todos os diagnósticos relacionados.
                </label>
              </div>
              <button type="button" class="btn btn-danger w-100" id="btnExcluirPeriodo" onclick="excluirPeriodo()">
                <i class="fas fa-trash me-2"></i>Excluir Período
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  </div>
</div>


<!-- Modal de Avaliação -->
<div class="modal fade" id="evaluationModal" tabindex="-1" aria-labelledby="evaluationModalLabel" aria-hidden="true">
  <div class="modal-dialog">
    <div class="modal-content">
      <div class="modal-header">
        <h5 class="modal-title" id="evaluationModalLabel">Avaliação</h5>
        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Fechar"></button>
      </div>
      <div class="modal-body">
        <!-- O conteúdo do formulário será injetado dinamicamente aqui -->
      </div>
      <div class="modal-footer">
        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Fechar</button>
        <button type="button" class="btn btn-primary" onclick="window.saveEvaluation()">Salvar</button>
      </div>
    </div>
  </div>
</div>
<!-- Modal para Editar Itens Salvos -->
<div class="modal fade" id="editSavedItemsModal" tabindex="-1" aria-labelledby="editSavedItemsModalLabel" aria-hidden="true">
  <div class="modal-dialog modal-xl">
    <div class="modal-content">
      <div class="modal-header">
        <h5 class="modal-title" id="editSavedItemsModalLabel">Editar Itens Salvos</h5>
        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Fechar"></button>
      </div>
      <div class="modal-body" id="editSavedItemsContent">
        <div class="d-flex justify-content-center">
          <div class="spinner-border text-primary" role="status">
            <span class="visually-hidden">Carregando...</span>
          </div>
        </div>
      </div>
      <div class="modal-footer">
        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Fechar</button>
      </div>
    </div>
  </div>
</div>

<div class="modal fade" id="savedItemsModal" tabindex="-1" aria-labelledby="savedItemsModalLabel" aria-hidden="true">
  <div class="modal-dialog modal-lg">
    <div class="modal-content">
      <div class="modal-header">
        <h5 class="modal-title" id="savedItemsModalLabel">Itens Salvos</h5>
        <button type="button" class="btn btn-sm btn-outline-primary me-2 refresh-saved-items" onclick="refreshSavedItemsFromModal()">
          <i class="fas fa-sync-alt"></i> Atualizar
        </button>
        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Fechar"></button>
      </div>
      <div class="modal-body">
        <div id="savedItemsTableContainer">
          <!-- A tabela de itens salvos será carregada aqui -->
        </div>
      </div>
      <div class="modal-footer">
        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Fechar</button>
      </div>
    </div>
  </div>
</div>

<!-- Adicionar também um modal para edição de itens -->
<div class="modal fade" id="editItemModal" tabindex="-1" aria-labelledby="editItemModalLabel" aria-hidden="true">
  <div class="modal-dialog">
    <div class="modal-content">
      <div class="modal-header">
        <h5 class="modal-title" id="editItemModalLabel">Editar Item</h5>
        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Fechar"></button>
      </div>
      <div class="modal-body">
        <form id="editItemForm">
          <input type="hidden" id="edit_item_id">
          <input type="hidden" id="edit_item_name">
          
          <div class="mb-3">
            <label class="form-label">Item:</label>
            <div id="edit_item_display" class="form-control-plaintext"></div>
          </div>
          
          <div class="mb-3">
            <div class="form-check">
              <input class="form-check-input" type="checkbox" id="edit_nao_se_aplica" onchange="toggleStatusRadios(this.checked)">
              <label class="form-check-label" for="edit_nao_se_aplica">
                Não se aplica
              </label>
            </div>
          </div>
          
          <div class="mb-3 status-radios">
            <label class="form-label">Status:</label>
            <div class="form-check">
              <input class="form-check-input" type="radio" name="edit_status" id="edit_conforme" value="conforme">
              <label class="form-check-label" for="edit_conforme">
                Conforme
              </label>
            </div>
            <div class="form-check">
              <input class="form-check-input" type="radio" name="edit_status" id="edit_nao_conforme" value="nao_conforme">
              <label class="form-check-label" for="edit_nao_conforme">
                Não Conforme
              </label>
            </div>
            <div class="form-check">
              <input class="form-check-input" type="radio" name="edit_status" id="edit_parcialmente_conforme" value="parcialmente_conforme">
              <label class="form-check-label" for="edit_parcialmente_conforme">
                Parcialmente Conforme
              </label>
            </div>
          </div>
          <div class="mb-3">
            <label for="edit_observacoes" class="form-label">Observações:</label>
            <textarea class="form-control" id="edit_observacoes" rows="3"></textarea>
          </div>
        </form>
      </div>
      <div class="modal-footer">
        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancelar</button>
        <button type="button" class="btn btn-primary" id="saveEditedItemBtn" onclick="saveEditedItem()">Salvar</button>
      </div>
    </div>
  </div>
</div>

<main class="content-wrapper">
  <div class="content-header">
    <div class="container-fluid">
      <div class="row mb-2">
        <div class="col-sm-6">
          <h1 class="m-0">Diagnóstico de Implantação</h1>
        </div>
        <div class="col-sm-6">
          <ol class="breadcrumb float-sm-right">
            <li class="breadcrumb-item"><a href="index.php">Home</a></li>
            <li class="breadcrumb-item active">Implantação</li>
          </ol>
        </div>
      </div>
    </div>
  </div>
  
  <div class="content">
    <div class="container-fluid">
      <?php if ($selected_period): 
              $selected_unidade = $selected_period['id_unidade'];
      ?>
        <!-- Campos ocultos para armazenar informações do período selecionado -->
        <input type="hidden" id="unidadeSelect" value="<?php echo $selected_unidade; ?>">
        <input type="hidden" id="periodoId" value="<?php echo $selected_period['id_periodo_diagnostico']; ?>">

         <!-- Nova seção: Alerta de Status do Período -->
         <?php if (isset($periodoStatus) && !empty($periodoMensagem)): ?>
        <div class="alert alert-<?php echo $periodoTipoAlerta; ?> alert-dismissible fade show periodo-status-alert" role="alert">
            <i class="fas <?php echo $periodoExpirado ? 'fa-clock' : 'fa-info-circle'; ?> me-2"></i>
            <?php echo htmlspecialchars($periodoMensagem); ?>
            <?php if ($periodoExpirado): ?>
            <strong>Modo somente visualização ativado.</strong>
            <?php endif; ?>
            <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
        </div>
        <?php endif; ?>
        
        <!-- Card principal com informações do período e tabs de setores -->
        <div class="card mb-4">
          <div class="card-header bg-primary bg-gradient text-white">
            <div class="d-flex justify-content-between align-items-center">
              <h5 class="mb-0">
                <i class="fas fa-clipboard-check me-2"></i>
                <?php 
                  echo htmlspecialchars($selected_period['nome_unidade']) . " (" .
                       date("d/m/Y", strtotime($selected_period['data_inicio'])) . " - " .
                       date("d/m/Y", strtotime($selected_period['data_fim'])) . ")";
                ?>
              </h5>
              <button class="btn btn-light" onclick="openPeriodoModal()">
                <i class="fas fa-exchange-alt me-2"></i>Trocar Período
              </button>
            </div>
          </div>
          
          <div class="card-body p-0">
            <div class="row g-0">
              <!-- Menu de tabs vertical para os setores -->
              <div class="col-lg-3 tab-scroll-container">
                  <div class="list-group list-group-flush nav nav-pills" id="setores-tab" role="tablist">
                      <?php if (empty($setores)): ?>
                          <div class="alert alert-info m-3">
                              <i class="fas fa-info-circle me-2"></i>
                              Nenhum setor com itens encontrado para esta unidade.
                          </div>
                      <?php else: ?>
                          <?php foreach ($setores as $index => $setor): 
                                  // Sanitizar o nome do setor para ID HTML usando nossa função consistente
                                  $setorSafe = sanitizeId($setor['nome']);
                                  $isActive = ($index === 0) ? 'active' : '';
                          ?>
                              <!-- Setor Principal -->
                              <div class="setor-group mb-2">
                                  <a class="list-group-item list-group-item-action nav-link <?php echo $isActive; ?>" 
                                     id="tab-<?php echo $setorSafe; ?>" 
                                     data-bs-toggle="collapse" 
                                     href="#collapse-<?php echo $setorSafe; ?>"
                                     role="button"
                                     data-setor-id="<?php echo $setor['id']; ?>"
                                     aria-expanded="<?php echo $index === 0 ? 'true' : 'false'; ?>"
                                     aria-controls="collapse-<?php echo $setorSafe; ?>">
                                      <i class="fas fa-layer-group me-2"></i>
                                      <?php echo htmlspecialchars($setor['nome']); ?>
                                      <?php if (!empty($setor['subsetores'])): ?>
                                          <span class="badge bg-secondary float-end"><?php echo count($setor['subsetores']); ?></span>
                                      <?php endif; ?>
                                  </a>
                                  
                                  <!-- Subsetores -->
                                  <?php if (!empty($setor['subsetores'])): ?>
                                      <div class="collapse <?php echo $index === 0 ? 'show' : ''; ?>" id="collapse-<?php echo $setorSafe; ?>">
                                          <div class="list-group list-group-flush ps-4">
                                              <?php foreach ($setor['subsetores'] as $subsetor): 
                                                  $subsetorSafe = sanitizeId($subsetor['nome']);
                                              ?>
                                        <a class="list-group-item list-group-item-action subsector-link" 
                                            href="#"
                                            data-setor-id="<?php echo $setor['id']; ?>"
                                            data-subsetor-id="<?php echo $subsetor['id']; ?>">
                                            <i class="fas fa-chevron-right me-2"></i>
                                            <?php echo htmlspecialchars($subsetor['nome']); ?>
                                          </a>
                                              <?php endforeach; ?>
                                          </div>
                                      </div>
                                  <?php endif; ?>
                              </div>
                          <?php endforeach; ?>
                      <?php endif; ?>
                  </div>
              </div>

              <!-- Conteúdo das tabs -->
              <div class="col-lg-9">
                  <div class="tab-content p-3" id="setores-tabContent">
                      <?php if (empty($setores)): ?>
                          <div class="alert alert-info">
                              <i class="fas fa-info-circle me-2"></i>
                              Selecione uma unidade com setores e itens cadastrados.
                          </div>
                      <?php else: ?>
                          <?php foreach ($setores as $index => $setor): 
                                  $setorSafe = sanitizeId($setor['nome']);
                                  $isActive = ($index === 0) ? 'show active' : '';
                          ?>
                              <div class="tab-pane fade <?php echo $isActive; ?>" 
                                  id="<?php echo $setorSafe; ?>" 
                                  data-setor-id="<?php echo $setor['id']; ?>"
                                  data-setor-original="<?php echo htmlspecialchars($setor['nome']); ?>"
                                  role="tabpanel" 
                                  aria-labelledby="tab-<?php echo $setorSafe; ?>"
                                  data-loaded="false">
                                  
                                  <!-- Container para a barra de progresso -->
                                  <div class="periodo-info bg-light p-3 mb-3 rounded" style="overflow: visible;"></div>
                                  
                                  <!-- Container para a tabela Tabulator -->
                                  <div id="tabulator-<?php echo $setorSafe; ?>"></div>
                                  
                                  <!-- Botão para adicionar novo item (manter a funcionalidade) -->
                                  <div class="d-flex justify-content-center mt-3">
                                    <button id="toggleButton_<?php echo $setorSafe; ?>" 
                                            type="button" 
                                            class="btn btn-secondary" 
                                            onclick="toggleNewItem('<?php echo $setorSafe; ?>')">
                                      <i class="fas fa-plus-circle me-1"></i> Adicionar item excepcional
                                    </button>
                                    <button type="button" class="btn btn-outline-info btn-sm ms-2" 
                                            data-bs-toggle="tooltip" data-bs-placement="top"
                                            title="Use esta opção apenas para adicionar itens excepcionais encontrados durante a avaliação. É necessário informar o problema identificado.">
                                      <i class="fas fa-info-circle"></i>
                                    </button>
                                  </div>
                                  
                                  <!-- Container para novo item (inicialmente escondido) -->
                                  <div id="newItemContainer_<?php echo $setorSafe; ?>" style="display: none;" class="p-3 mt-3 border rounded bg-light">
                                    <div class="alert alert-info">
                                      <i class="fas fa-info-circle me-2"></i>
                                      <strong>Atenção:</strong> Este recurso deve ser usado apenas para adicionar itens excepcionais encontrados durante a avaliação que não existem na lista padrão. É necessário informar pelo menos um problema.
                                    </div>
                                    
                                    <form id="newItemForm_<?php echo $setorSafe; ?>" class="needs-validation" novalidate>
                                      <div class="row mb-3">
                                        <div class="col-md-12">
                                          <label for="new_item_name_<?php echo $setorSafe; ?>" class="form-label">Nome do Item <span class="text-danger">*</span></label>
                                          <input type="text" class="form-control" id="new_item_name_<?php echo $setorSafe; ?>" required>
                                          <div class="invalid-feedback">Por favor, informe o nome do item.</div>
                                        </div>
                                      </div>
                                      
                                      <div class="row mb-3">
                                        <div class="col-md-12">
                                          <label for="new_problema_<?php echo $setorSafe; ?>" class="form-label">Problema Identificado <span class="text-danger">*</span></label>
                                          <textarea class="form-control" id="new_problema_<?php echo $setorSafe; ?>" rows="2" required></textarea>
                                          <div class="invalid-feedback">É necessário informar pelo menos um problema para este item.</div>
                                        </div>
                                      </div>
                                      
                                      <div class="row mb-3">
                                        <div class="col-md-12">
                                          <label class="form-label">Status</label>
                                          <div>
                                            <div class="form-check form-check-inline">
                                              <input class="form-check-input" type="radio" name="radio_new_<?php echo $setorSafe; ?>" id="conforme_new_<?php echo $setorSafe; ?>" value="conforme">
                                              <label class="form-check-label status-conforme" for="conforme_new_<?php echo $setorSafe; ?>">Conforme</label>
                                            </div>
                                            <div class="form-check form-check-inline">
                                              <input class="form-check-input" type="radio" name="radio_new_<?php echo $setorSafe; ?>" id="parcialmente_conforme_new_<?php echo $setorSafe; ?>" value="parcialmente_conforme">
                                              <label class="form-check-label status-parcial" for="parcialmente_conforme_new_<?php echo $setorSafe; ?>">Parcialmente Conforme</label>
                                            </div>
                                            <div class="form-check form-check-inline">
                                              <input class="form-check-input" type="radio" name="radio_new_<?php echo $setorSafe; ?>" id="nao_conforme_new_<?php echo $setorSafe; ?>" value="nao_conforme">
                                              <label class="form-check-label status-nao-conforme" for="nao_conforme_new_<?php echo $setorSafe; ?>">Não Conforme</label>
                                            </div>
                                          </div>
                                        </div>
                                      </div>
                                      
                                      <div class="row mb-3">
                                        <div class="col-md-12">
                                          <label for="new_observacoes_<?php echo $setorSafe; ?>" class="form-label">Observações</label>
                                          <textarea class="form-control" id="new_observacoes_<?php echo $setorSafe; ?>" rows="3"></textarea>
                                        </div>
                                      </div>
                                      
                                      <div class="d-grid gap-2 d-md-flex justify-content-md-end">
                                        <button type="button" class="btn btn-primary" onclick="saveNewItem('<?php echo $setorSafe; ?>', <?php echo $setor['id']; ?>)">
                                          <i class="fas fa-save me-1"></i> Salvar Novo Item
                                        </button>
                                      </div>
                                    </form>
                                  </div>
                              </div>
                          <?php endforeach; ?>
                      <?php endif; ?>
                  </div>
              </div>
        
      <?php else: ?>
        <!-- Mensagem quando nenhum período está selecionado -->
        <div class="card">
          <div class="card-body text-center py-5">
            <h4 class="text-muted mb-4"><i class="fas fa-calendar-alt me-2"></i>Nenhum período selecionado</h4>
            <p class="mb-4">Você precisa selecionar ou criar um período para continuar.</p>
            <button class="btn btn-primary btn-lg" onclick="openPeriodoModal()">
              <i class="fas fa-calendar-plus me-2"></i>Selecionar Período
            </button>
          </div>
        </div>
      <?php endif; ?>
    </div>
  </div>
</main>
<?php 
// Incluir rodapé da página
include __DIR__ . '/../../includes/footer.php'; 
?>
<!-- LoadingBar.js - CSS -->
<link href="../../assets/libs/loading-bar/loading-bar.min.css" rel="stylesheet">
<!-- LoadingBar.js - JavaScript -->
<script src="../../assets/libs/loading-bar/loading-bar.min.js"></script>
<!-- Tabulator JS -->
<script src="https://unpkg.com/tabulator-tables@5.4.4/dist/js/tabulator.min.js"></script>


<!-- Script principal (será movido para arquivo separado) -->
<script src="../../js/implantacao/implantacao-crud.js "></script>
<script src="../../js/implantacao/implantacao-ui.js "></script>
<script src="../../js/implantacao/implantacao-tabulator.js "></script>
<script src="../../js/implantacao/implantacao-utils.js "></script>
<script src="../../js/implantacao/implantacao-data.js "></script>
<script src="../../js/implantacao/implantacao-core.js "></script>
