<?php
// Arquivo: implantacao_helpers.php


// Incluir configurações globais se ainda não foram incluídas
if (!isset($conn)) {
    require_once dirname(__FILE__, 2) . '/config/config.php';
}
/**
 * Ensures proper JSON response format with error handling
 * @param array $data The data to encode as JSON
 * @param int $status HTTP status code
 * @return void Outputs JSON and exits
 */
function jsonResponse($data, $status = 200) {
    // Clear any previous output to avoid JSON corruption
    if (ob_get_level()) ob_end_clean();
    
    // Set appropriate headers
    header('Content-Type: application/json; charset=utf-8');
    header('Cache-Control: no-cache, no-store, must-revalidate');
    header('Pragma: no-cache');
    header('Expires: 0');
    http_response_code($status);
    
    // Ensure valid UTF-8 encoding
    array_walk_recursive($data, function(&$item) {
        if (is_string($item)) {
            $item = mb_convert_encoding($item, 'UTF-8', 'UTF-8');
        }
    });
    
    // Log the data being sent
    error_log('JSON Response: ' . json_encode($data, JSON_PARTIAL_OUTPUT_ON_ERROR));
    
    // Output JSON and exit
    echo json_encode($data);
    exit;
}

/**
 * Handles API errors with proper JSON response
 * @param string $message Error message
 * @param int $status HTTP status code
 * @return void Outputs JSON and exits
 */
function jsonError($message, $status = 400) {
    jsonResponse(['error' => $message, 'success' => false], $status);
}
/**
 * Função para obter o ID do usuário de forma definitiva
 * Retorna um valor fixo (1) se nenhum ID for encontrado
 */
function getUsuarioId() {
    // Verificar todas as possíveis variáveis de sessão
    $userId = null;
    
    // Lista de possíveis locais onde o ID pode estar
    if (isset($_SESSION['usuario_id'])) {
        $userId = $_SESSION['usuario_id'];
    } elseif (isset($_SESSION['id_usuario'])) {
        $userId = $_SESSION['id_usuario'];
    } elseif (isset($_SESSION['id'])) {
        $userId = $_SESSION['id'];
    } elseif (isset($_SESSION['usuario_logado']['id'])) {
        $userId = $_SESSION['usuario_logado']['id'];
    }
    
    // Se não encontrar nenhum ID, usar 1 como fallback
    if (empty($userId)) {
        $userId = 1; // ID padrão (geralmente admin)
        
        // Para debugging (remova em produção)
        error_log("AVISO: ID de usuário não encontrado na sessão, usando ID padrão 1");
    }
    
    return intval($userId);
}

/**
 * Função de depuração para testar respostas da API
 * @param PDO $conn Conexão com o banco de dados
 */
function debugApiResponse($conn) {
    // Limpar todos os buffers de saída anteriores
    while (ob_get_level()) {
        ob_end_clean();
    }
    
    // Configurar cabeçalhos
    header('Content-Type: application/json; charset=utf-8');
    header('Cache-Control: no-cache, must-revalidate');
    
    // Coletar informações de diagnóstico
    $debug = [];
    $debug['timestamp'] = date('Y-m-d H:i:s');
    $debug['request_method'] = $_SERVER['REQUEST_METHOD'];
    $debug['request_uri'] = $_SERVER['REQUEST_URI'];
    $debug['headers_sent'] = headers_sent();
    $debug['request_params'] = $_GET;
    $debug['php_version'] = phpversion();
    
    // Testar conexão com banco de dados
    try {
        $stmt = $conn->query("SELECT 1 AS test");
        $result = $stmt->fetch(PDO::FETCH_ASSOC);
        $debug['database_connection'] = ($result && isset($result['test']) && $result['test'] == 1);
    } catch (PDOException $e) {
        $debug['database_connection'] = false;
        $debug['database_error'] = $e->getMessage();
    }
    
    // Verificar se podemos gerar JSON
    $test_array = ['test' => true, 'number' => 123, 'string' => 'test'];
    $json_test = json_encode($test_array);
    $debug['json_works'] = ($json_test !== false);
    if (!$debug['json_works']) {
        $debug['json_error'] = json_last_error_msg();
    }
    
    // Testar se conseguimos codificar o objeto de debug
    $response = json_encode($debug, JSON_PRETTY_PRINT);
    if ($response === false) {
        // Se falhar, tentar uma resposta mínima
        echo '{"error":"Failed to encode debug info","message":"' . json_last_error_msg() . '"}';
    } else {
        echo $response;
    }
    exit;
}

/**
 * Enhanced debug function to check for database inconsistencies
 */
function debugDiagnosticoQuery($conn) {
    header('Content-Type: application/json; charset=utf-8');
    
    $setor_id = isset($_GET['setor_id']) ? intval($_GET['setor_id']) : 0;
    $unidade_id = isset($_GET['unidade_id']) ? intval($_GET['unidade_id']) : 0;
    $periodo_id = isset($_GET['periodo_id']) ? intval($_GET['periodo_id']) : 0;
    $subsetor_id = isset($_GET['subsetor_id']) ? intval($_GET['subsetor_id']) : null;
    $nao_se_aplica = isset($_GET['nao_se_aplica']) ? intval($_GET['nao_se_aplica']) : null;
    
    if (!$setor_id || !$unidade_id || !$periodo_id) {
        echo json_encode(['error' => 'Missing required parameters']);
        exit;
    }
    
    try {
        // Direct query to diagnostico table
        $sql = "SELECT 
                d.id, 
                d.item,
                d.avaliacao_resultado AS status,
                d.nao_se_aplica AS nao_aplica,
                d.id AS diagnostico_id,
                d.observacoes,
                d.setor_id,
                d.subsetor_id,
                d.estado_avaliacao
                FROM diagnostico d
                WHERE 
                d.setor_id = ? AND 
                d.unidade_id = ? AND 
                d.id_periodo_diagnostico = ? AND 
                d.deletado = 0";
        
        $params = [$setor_id, $unidade_id, $periodo_id];
        
        // Add subsector condition if provided
        if ($subsetor_id !== null) {
            $sql .= " AND d.subsetor_id = ?";
            $params[] = $subsetor_id;
        }
        
        // Add nao_se_aplica filter if specified
        if ($nao_se_aplica !== null) {
            $sql .= " AND d.nao_se_aplica = ?";
            $params[] = $nao_se_aplica;
        }
        
        // Check for inconsistent data if requested
        if (isset($_GET['check_inconsistencies'])) {
            $sql .= " AND ((d.nao_se_aplica = 1 AND d.avaliacao_resultado != '') 
                       OR (d.nao_se_aplica = 0 AND (d.avaliacao_resultado IS NULL OR d.avaliacao_resultado = '')))";
        }
        
        $stmt = $conn->prepare($sql);
        $stmt->execute($params);
        $items = $stmt->fetchAll(PDO::FETCH_ASSOC);
        
        // Add count info
        $result = [
            'count' => count($items),
            'query_params' => [
                'setor_id' => $setor_id,
                'unidade_id' => $unidade_id,
                'periodo_id' => $periodo_id,
                'subsetor_id' => $subsetor_id,
                'nao_se_aplica' => $nao_se_aplica
            ],
            'items' => $items
        ];
        
        // Include the SQL query for debugging
        if (isset($_GET['debug'])) {
            $result['query'] = $sql;
            $result['params'] = $params;
        }
        
        echo json_encode($result);
        
    } catch (PDOException $e) {
        echo json_encode([
            'error' => 'Database error: ' . $e->getMessage(),
            'query_params' => [
                'setor_id' => $setor_id,
                'unidade_id' => $unidade_id,
                'periodo_id' => $periodo_id,
                'subsetor_id' => $subsetor_id
            ]
        ]);
    }
    exit;
}

/**
 * Processa as requisições AJAX
 * @param PDO $conn Conexão com o banco de dados
 */
function processarRequisicaoImplantacao($conn) {
    $action = isset($_GET['action']) ? $_GET['action'] : 
             (isset($_POST['action']) ? $_POST['action'] : '');
    
    switch($action) {
        case 'get_progress':
            getProgress($conn);
            break;
        case 'fetch_items':
            fetchItems($conn);
            break;
        case 'fetch_saved_items':
            fetchSavedItems($conn);
            break;
        case 'create_period':
            createPeriod($conn);
            break;
        case 'force_sync_items':
            forceSyncItems($conn);
            break;           
        case 'get_itens_tabela':
            getItensTabulatorFormat($conn);
            break;
        case 'check_period_frozen':
            checkPeriodFrozen($conn);
            break;
        case 'get_diagnostico_frozen':
            getDiagnosticoFrozen($conn);
            break;        
        case 'save_item':
            saveItem($conn);
            break;     
        case 'get_setores_with_subsectors':
            getSetoresWithSubsectors($conn);
            break;
        case 'save_evaluation':
            saveEvaluation($conn);
            break;
        case 'update_saved_item':
            updateSavedItem($conn);
            break;
        case 'delete_period':
            deletePeriod($conn);
            break;
        case 'debug_diagnostico_query':  // Add our new debug function
            debugDiagnosticoQuery($conn);
            break;
        case 'debug_api':
            debugApiResponse($conn);
            break;
        case 'fix_diagnostico_data':
            fixInconsistentDiagnosticoData($conn);
            break;    
        default:
            echo json_encode(['error' => 'Ação não reconhecida']);
            break;
    }   
}

/**
 * Salva um item no banco de dados - Atualizado para nova estrutura
 * @param PDO $conn Conexão com o banco de dados
 */
function saveItem($conn) {
    // Limpar qualquer buffer de saída anterior
    while (ob_get_level()) {
        ob_end_clean();
    }
    
    header('Content-Type: application/json; charset=utf-8');
    
    try {
        // Obter parâmetros do POST/GET
        $item_id = isset($_POST['item_id']) ? intval($_POST['item_id']) : 
                  (isset($_GET['item_id']) ? intval($_GET['item_id']) : 0);
                  
        $item = isset($_POST['item']) ? trim($_POST['item']) : 
               (isset($_GET['item']) ? trim($_GET['item']) : '');
               
        $status = isset($_POST['status']) ? trim($_POST['status']) : 
                 (isset($_GET['status']) ? trim($_GET['status']) : '');
                 
        $observacoes = isset($_POST['observacoes']) ? trim($_POST['observacoes']) : 
                      (isset($_GET['observacoes']) ? trim($_GET['observacoes']) : '');
                      
        $nao_se_aplica = isset($_POST['nao_se_aplica']) ? intval($_POST['nao_se_aplica']) : 
                        (isset($_GET['nao_se_aplica']) ? intval($_GET['nao_se_aplica']) : 0);
                        
        $setor_id = isset($_POST['setor_id']) ? intval($_POST['setor_id']) : 
                   (isset($_GET['setor_id']) ? intval($_GET['setor_id']) : 0);
                   
        $unidade_id = isset($_POST['unidade_id']) ? intval($_POST['unidade_id']) : 
                     (isset($_GET['unidade_id']) ? intval($_GET['unidade_id']) : 0);
                     
        $periodo_id = isset($_POST['periodo_id']) ? intval($_POST['periodo_id']) : 
                     (isset($_GET['periodo_id']) ? intval($_POST['periodo_id']) : 0);
                     
        $problema = isset($_POST['problema']) ? trim($_POST['problema']) : 
                  (isset($_GET['problema']) ? trim($_GET['problema']) : null);
                  
        $subsetor_id = isset($_POST['subsetor_id']) ? intval($_POST['subsetor_id']) : 
                      (isset($_GET['subsetor_id']) ? intval($_GET['subsetor_id']) : null);
        
        // Validações básicas
        if (empty($item)) {
            echo json_encode(['success' => false, 'message' => 'Nome do item não informado']);
            exit;
        }
        
        // Agora o subsetor_id é obrigatório em vez do setor_id
        if (!$subsetor_id) {
            echo json_encode(['success' => false, 'message' => 'Subsetor não informado']);
            exit;
        }
        
        if (!$unidade_id) {
            echo json_encode(['success' => false, 'message' => 'Unidade não informada']);
            exit;
        }
        
        if (!$periodo_id) {
            echo json_encode(['success' => false, 'message' => 'Período não informado']);
            exit;
        }
        
        // Obter ID do usuário para auditoria
        $usuario_id = getUsuarioId();
        
        // Iniciar transação
        $conn->beginTransaction();
        
        // 1. Verificar se o item já existe na tabela items_diagnostico
        $item_hash = md5(strtolower(trim($item)));
        
        $sqlCheckItem = "SELECT id FROM items_diagnostico 
                         WHERE subsetor_id = ? AND 
                               MD5(LOWER(TRIM(nome_item))) = ? AND 
                               deletado = 0";
        $stmtCheckItem = $conn->prepare($sqlCheckItem);
        $stmtCheckItem->execute([$subsetor_id, $item_hash]);
        $existing_item = $stmtCheckItem->fetch(PDO::FETCH_ASSOC);
        
        $items_diagnostico_id = 0;
        
        // Se não existir, inserir na tabela items_diagnostico
        if (!$existing_item) {
            $sqlInsertItem = "INSERT INTO items_diagnostico 
                             (nome_item, subsetor_id, criado_em, criado_por)
                             VALUES (?, ?, NOW(), ?)";
            $stmtInsertItem = $conn->prepare($sqlInsertItem);
            $stmtInsertItem->execute([$item, $subsetor_id, $usuario_id]);
            
            $items_diagnostico_id = $conn->lastInsertId();
            
            // Se problema foi fornecido, adicione-o
            // Note que a lógica de problemas_diagnostico precisará ser atualizada em uma etapa posterior
            if ($problema && $items_diagnostico_id) {
                // Verificar se a tabela problemas_diagnostico foi atualizada para a nova estrutura
                try {
                    $sqlInsertProblema = "INSERT INTO problemas_diagnostico 
                                         (id_items_diagnostico, nome, criado_em, criado_por)
                                         VALUES (?, ?, NOW(), ?)";
                    $stmtInsertProblema = $conn->prepare($sqlInsertProblema);
                    $stmtInsertProblema->execute([$items_diagnostico_id, $problema, $usuario_id]);
                } catch (PDOException $e) {
                    // Se houver erro, é possível que a tabela problemas_diagnostico não tenha sido atualizada ainda
                    // Log o erro mas continue com o processo
                    error_log("Erro ao inserir problema para o item (possível problema de compatibilidade): " . $e->getMessage());
                }
            }
        } else {
            $items_diagnostico_id = $existing_item['id'];
        }
        
        // 2. Verificar se o diagnóstico já existe
        // Obtém o setor_id do subsetor para usar na tabela diagnostico
        $sqlGetSetor = "SELECT setor_id FROM subsetores WHERE id = ?";
        $stmtGetSetor = $conn->prepare($sqlGetSetor);
        $stmtGetSetor->execute([$subsetor_id]);
        $setorResult = $stmtGetSetor->fetch(PDO::FETCH_ASSOC);
        
        if (!$setorResult) {
            throw new Exception("Subsetor não encontrado ou não está associado a um setor");
        }
        
        $setor_id = $setorResult['setor_id'];
        
        $sqlCheckDiag = "SELECT id FROM diagnostico 
                         WHERE unidade_id = ? AND id_periodo_diagnostico = ? AND 
                               setor_id = ? AND subsetor_id = ? AND 
                               item_hash = ? AND 
                               deletado = 0";
        $stmtCheckDiag = $conn->prepare($sqlCheckDiag);
        $stmtCheckDiag->execute([$unidade_id, $periodo_id, $setor_id, $subsetor_id, $item_hash]);
        $existing_diag = $stmtCheckDiag->fetch(PDO::FETCH_ASSOC);
        
        // 3. Definir estado da avaliação
        $estado_avaliacao = 'nao_avaliado';
        if (!empty($status) || $nao_se_aplica) {
            $estado_avaliacao = 'avaliado';
        }
        
        // 4. Inserir ou atualizar o diagnóstico
        if (!$existing_diag) {
            // Inserir novo diagnóstico
            $sqlInsertDiag = "INSERT INTO diagnostico 
                             (unidade_id, id_periodo_diagnostico, item, item_hash, 
                              setor_id, subsetor_id, avaliacao_resultado, observacoes, nao_se_aplica, 
                              estado_avaliacao, criado_em, criado_por, item_id)
                             VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW(), ?, ?)";
            $paramsInsertDiag = [
                $unidade_id, $periodo_id, $item, $item_hash, 
                $setor_id, $subsetor_id, $status, $observacoes, $nao_se_aplica, 
                $estado_avaliacao, $usuario_id, $items_diagnostico_id
            ];
            
            $stmtInsertDiag = $conn->prepare($sqlInsertDiag);
            $stmtInsertDiag->execute($paramsInsertDiag);
            
            $diagnostico_id = $conn->lastInsertId();
        } else {
            // Atualizar diagnóstico existente
            $diagnostico_id = $existing_diag['id'];
            
            $sqlUpdateDiag = "UPDATE diagnostico 
                             SET avaliacao_resultado = ?, 
                                 observacoes = ?, 
                                 nao_se_aplica = ?, 
                                 estado_avaliacao = ?, 
                                 atualizado_em = NOW(), 
                                 atualizado_por = ?,
                                 item_id = ?
                             WHERE id = ?";
            $paramsUpdateDiag = [
                $status, $observacoes, $nao_se_aplica, 
                $estado_avaliacao, $usuario_id, $items_diagnostico_id, $diagnostico_id
            ];
            
            $stmtUpdateDiag = $conn->prepare($sqlUpdateDiag);
            $stmtUpdateDiag->execute($paramsUpdateDiag);
        }
        
        // 5. Atualizar o cache de progresso
        try {
            if (function_exists('atualizarProgressoCache')) {
                atualizarProgressoCache($conn, $setor_id, $periodo_id, $unidade_id, $usuario_id);
            }
        } catch (Exception $e) {
            error_log("Erro ao atualizar cache de progresso: " . $e->getMessage());
            // Não falhar a transação por erro no cache
        }
        
        // Confirmar transação
        $conn->commit();
        
        // Retornar resultado
        echo json_encode([
            'success' => true,
            'message' => 'Item salvo com sucesso',
            'diagnostico_id' => $diagnostico_id,
            'item_id' => $items_diagnostico_id
        ]);
        
    } catch (PDOException $e) {
        // Reverter transação em caso de erro
        if ($conn->inTransaction()) {
            $conn->rollBack();
        }
        
        error_log("Erro ao salvar item: " . $e->getMessage());
        echo json_encode([
            'success' => false,
            'message' => 'Erro ao salvar item: ' . $e->getMessage()
        ]);
    } catch (Exception $e) {
        // Reverter transação em caso de erro geral
        if ($conn->inTransaction()) {
            $conn->rollBack();
        }
        
        error_log("Erro geral ao salvar item: " . $e->getMessage());
        echo json_encode([
            'success' => false,
            'message' => 'Erro: ' . $e->getMessage()
        ]);
    }
    exit;
}

/**
 * Fixes inconsistent data in the diagnostico table
 * Particularly useful when items have both nao_se_aplica=1 and an avaliacao_resultado
 * @param PDO $conn Database connection
 */
function fixInconsistentDiagnosticoData($conn) {
    header('Content-Type: application/json; charset=utf-8');
    
    try {
        // Start a transaction for safety
        $conn->beginTransaction();
        
        // 1. Find items with both nao_se_aplica=1 and a non-empty avaliacao_resultado
        $findSql = "SELECT id, item, nao_se_aplica, avaliacao_resultado 
                    FROM diagnostico 
                    WHERE nao_se_aplica = 1 
                    AND avaliacao_resultado != '' 
                    AND avaliacao_resultado IS NOT NULL 
                    AND deletado = 0";
        
        $findStmt = $conn->query($findSql);
        $inconsistentItems = $findStmt->fetchAll(PDO::FETCH_ASSOC);
        
        $itemCount = count($inconsistentItems);
        
        if ($itemCount === 0) {
            // No inconsistent items found
            $conn->commit();
            echo json_encode([
                'success' => true,
                'message' => 'No inconsistent items found in the database',
                'fixed_count' => 0
            ]);
            exit;
        }
        
        // 2. Fix these items - we'll set avaliacao_resultado to empty for nao_se_aplica items
        $updateSql = "UPDATE diagnostico 
                     SET avaliacao_resultado = '', 
                         atualizado_em = NOW() 
                     WHERE nao_se_aplica = 1 
                     AND avaliacao_resultado != '' 
                     AND avaliacao_resultado IS NOT NULL 
                     AND deletado = 0";
        
        $updateStmt = $conn->prepare($updateSql);
        $updateStmt->execute();
        
        $fixedCount = $updateStmt->rowCount();
        
        // Commit the transaction
        $conn->commit();
        
        // Return results
        echo json_encode([
            'success' => true,
            'message' => "Fixed $fixedCount inconsistent items in the database",
            'fixed_count' => $fixedCount,
            'examples' => array_slice($inconsistentItems, 0, 5) // Return first 5 examples
        ]);
        
    } catch (PDOException $e) {
        // Roll back in case of error
        if ($conn->inTransaction()) {
            $conn->rollBack();
        }
        
        echo json_encode([
            'success' => false,
            'message' => 'Database error: ' . $e->getMessage()
        ]);
    }
    exit;
}

/**
 * Atualiza um item previamente salvo
 * @param PDO $conn Conexão com o banco de dados
 */
function updateSavedItem($conn) {
    // Limpar qualquer buffer de saída anterior
    while (ob_get_level()) {
        ob_end_clean();
    }
    
    header('Content-Type: application/json; charset=utf-8');
    
    try {
        // Obter parâmetros
        $id = isset($_POST['id']) ? intval($_POST['id']) : 0;
        $status = isset($_POST['status']) ? trim($_POST['status']) : '';
        $observacoes = isset($_POST['observacoes']) ? trim($_POST['observacoes']) : '';
        $nao_se_aplica = isset($_POST['nao_se_aplica']) ? intval($_POST['nao_se_aplica']) : 0;
        
        // Validações
        if (!$id) {
            echo json_encode(['success' => false, 'message' => 'ID do diagnóstico não informado']);
            exit;
        }
        
        // Se nao_se_aplica for marcado, o status deve ser vazio
        if ($nao_se_aplica) {
            $status = '';
        }
        
        // Obter ID do usuário para auditoria
        $usuario_id = getUsuarioId();
        
        // Definir estado da avaliação
        $estado_avaliacao = 'nao_avaliado';
        if (!empty($status) || $nao_se_aplica) {
            $estado_avaliacao = 'avaliado';
        }
        
        // Iniciar transação
        $conn->beginTransaction();
        
        // Buscar o diagnóstico para obter setor e período
        $sqlGetDiag = "SELECT setor_id, id_periodo_diagnostico, unidade_id 
                       FROM diagnostico WHERE id = ? AND deletado = 0";
        $stmtGetDiag = $conn->prepare($sqlGetDiag);
        $stmtGetDiag->execute([$id]);
        $diagnostico = $stmtGetDiag->fetch(PDO::FETCH_ASSOC);
        
        if (!$diagnostico) {
            echo json_encode(['success' => false, 'message' => 'Diagnóstico não encontrado']);
            exit;
        }
        
        // Atualizar o diagnóstico
        $sqlUpdate = "UPDATE diagnostico 
                     SET avaliacao_resultado = ?, 
                         observacoes = ?, 
                         nao_se_aplica = ?,
                         estado_avaliacao = ?,
                         atualizado_em = NOW(), 
                         atualizado_por = ? 
                     WHERE id = ?";
        $stmtUpdate = $conn->prepare($sqlUpdate);
        $stmtUpdate->execute([
            $status, $observacoes, $nao_se_aplica, $estado_avaliacao, $usuario_id, $id
        ]);
        
        // Tentar atualizar o cache de progresso
        try {
            if (function_exists('atualizarProgressoCache')) {
                atualizarProgressoCache(
                    $conn, 
                    $diagnostico['setor_id'], 
                    $diagnostico['id_periodo_diagnostico'], 
                    $diagnostico['unidade_id'], 
                    $usuario_id
                );
            }
        } catch (Exception $e) {
            error_log("Erro ao atualizar cache de progresso: " . $e->getMessage());
            // Não interromper a transação por erro no cache
        }
        
        // Confirmar transação
        $conn->commit();
        
        echo json_encode([
            'success' => true,
            'message' => 'Item atualizado com sucesso',
            'id' => $id
        ]);
        
    } catch (PDOException $e) {
        // Reverter transação em caso de erro
        if ($conn->inTransaction()) {
            $conn->rollBack();
        }
        
        error_log("Erro ao atualizar item: " . $e->getMessage());
        echo json_encode([
            'success' => false,
            'message' => 'Erro ao atualizar item: ' . $e->getMessage()
        ]);
    }
    exit;
}

/**
 * Salva a avaliação de um item
 * @param PDO $conn Conexão com o banco de dados
 */
function saveEvaluation($conn) {
    // Limpar qualquer buffer de saída anterior
    while (ob_get_level()) {
        ob_end_clean();
    }
    
    header('Content-Type: application/json; charset=utf-8');
    
    try {
        // Obter parâmetros
        $item_id = isset($_POST['item_id']) ? intval($_POST['item_id']) : 0;
        $status = isset($_POST['status']) ? trim($_POST['status']) : '';
        $observacoes = isset($_POST['observacoes']) ? trim($_POST['observacoes']) : '';
        $nao_se_aplica = isset($_POST['nao_se_aplica']) ? intval($_POST['nao_se_aplica']) : 0;
        $setor_id = isset($_POST['setor_id']) ? intval($_POST['setor_id']) : 0;
        $periodo_id = isset($_POST['periodo_id']) ? intval($_POST['periodo_id']) : 0;
        $unidade_id = isset($_POST['unidade_id']) ? intval($_POST['unidade_id']) : 0;
        $diagnostico_id = isset($_POST['diagnostico_id']) ? intval($_POST['diagnostico_id']) : 0;
        $subsetor_id = isset($_POST['subsetor_id']) ? intval($_POST['subsetor_id']) : null;
        
        // Validações
        if (!$item_id && !$diagnostico_id) {
            echo json_encode(['success' => false, 'message' => 'ID do item ou do diagnóstico não informado']);
            exit;
        }
        
        if (!$setor_id) {
            echo json_encode(['success' => false, 'message' => 'Setor não informado']);
            exit;
        }
        
        if (!$periodo_id) {
            echo json_encode(['success' => false, 'message' => 'Período não informado']);
            exit;
        }
        
        if (!$unidade_id) {
            echo json_encode(['success' => false, 'message' => 'Unidade não informada']);
            exit;
        }
        
        // Se nao_se_aplica for marcado, o status deve ser vazio
        if ($nao_se_aplica) {
            $status = '';
        }
        
        // Obter o ID do usuário para auditoria
        $usuario_id = getUsuarioId();
        
        // Iniciar transação
        $conn->beginTransaction();
        
        // Verificar se o item existe em items_diagnostico
        $existingItem = null;
        if ($item_id) {
            $sqlCheckItem = "SELECT nome_item FROM items_diagnostico WHERE id = ? AND deletado = 0";
            $stmtCheckItem = $conn->prepare($sqlCheckItem);
            $stmtCheckItem->execute([$item_id]);
            $existingItem = $stmtCheckItem->fetch(PDO::FETCH_ASSOC);
        }
        
        // Verificar se já existe um diagnóstico
        if ($diagnostico_id) {
            // Atualizar diagnóstico existente
            $sqlUpdate = "UPDATE diagnostico 
                         SET avaliacao_resultado = ?, 
                             observacoes = ?, 
                             nao_se_aplica = ?, 
                             estado_avaliacao = 'avaliado', 
                             atualizado_em = NOW(), 
                             atualizado_por = ? 
                         WHERE id = ? AND deletado = 0";
            $stmtUpdate = $conn->prepare($sqlUpdate);
            $stmtUpdate->execute([$status, $observacoes, $nao_se_aplica, $usuario_id, $diagnostico_id]);
            
            // Verificar se foi realmente atualizado
            if ($stmtUpdate->rowCount() === 0) {
                echo json_encode(['success' => false, 'message' => 'Diagnóstico não encontrado ou não autorizado']);
                exit;
            }
        } elseif ($existingItem) {
            // Buscar o item e criar um hash
            $item_name = $existingItem['nome_item'];
            $item_hash = md5(strtolower(trim($item_name)));
            
            // Verificar se já existe um diagnóstico para este item/período/setor
            $sqlCheckDiag = "SELECT id FROM diagnostico 
                            WHERE item_hash = ? AND setor_id = ? AND 
                                  id_periodo_diagnostico = ? AND unidade_id = ? AND 
                                  deletado = 0";
            $paramsCheckDiag = [$item_hash, $setor_id, $periodo_id, $unidade_id];
            
            // Adicionar subsetor se fornecido
            if ($subsetor_id) {
                $sqlCheckDiag = "SELECT id FROM diagnostico 
                                WHERE item_hash = ? AND setor_id = ? AND subsetor_id = ? AND
                                      id_periodo_diagnostico = ? AND unidade_id = ? AND 
                                      deletado = 0";
                $paramsCheckDiag = [$item_hash, $setor_id, $subsetor_id, $periodo_id, $unidade_id];
            }
            
            $stmtCheckDiag = $conn->prepare($sqlCheckDiag);
            $stmtCheckDiag->execute($paramsCheckDiag);
            $existingDiag = $stmtCheckDiag->fetch(PDO::FETCH_ASSOC);
            
            if ($existingDiag) {
                // Atualizar diagnóstico existente
                $diagnostico_id = $existingDiag['id'];
                $sqlUpdate = "UPDATE diagnostico 
                             SET avaliacao_resultado = ?, 
                                 observacoes = ?, 
                                 nao_se_aplica = ?, 
                                 estado_avaliacao = 'avaliado', 
                                 atualizado_em = NOW(), 
                                 atualizado_por = ? 
                             WHERE id = ?";
                $stmtUpdate = $conn->prepare($sqlUpdate);
                $stmtUpdate->execute([$status, $observacoes, $nao_se_aplica, $usuario_id, $diagnostico_id]);
            } else {
                // Inserir novo diagnóstico
                $sqlInsert = "INSERT INTO diagnostico 
                             (unidade_id, id_periodo_diagnostico, item, item_hash, 
                              setor_id, avaliacao_resultado, observacoes, nao_se_aplica, 
                              estado_avaliacao, criado_em, criado_por)
                             VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'avaliado', NOW(), ?)";
                $paramsInsert = [
                    $unidade_id, $periodo_id, $item_name, $item_hash, 
                    $setor_id, $status, $observacoes, $nao_se_aplica, $usuario_id
                ];
                
                // Adicionar subsetor se fornecido
                if ($subsetor_id) {
                    $sqlInsert = "INSERT INTO diagnostico 
                                 (unidade_id, id_periodo_diagnostico, item, item_hash, 
                                  setor_id, subsetor_id, avaliacao_resultado, observacoes, nao_se_aplica, 
                                  estado_avaliacao, criado_em, criado_por)
                                 VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 'avaliado', NOW(), ?)";
                    $paramsInsert = [
                        $unidade_id, $periodo_id, $item_name, $item_hash, 
                        $setor_id, $subsetor_id, $status, $observacoes, $nao_se_aplica, $usuario_id
                    ];
                }
                
                $stmtInsert = $conn->prepare($sqlInsert);
                $stmtInsert->execute($paramsInsert);
                $diagnostico_id = $conn->lastInsertId();
            }
        } else {
            echo json_encode(['success' => false, 'message' => 'Item não encontrado']);
            exit;
        }
        
        // Atualizar cache de progresso
        try {
            if (function_exists('atualizarProgressoCache')) {
                atualizarProgressoCache($conn, $setor_id, $periodo_id, $unidade_id, $usuario_id);
            }
        } catch (Exception $e) {
            error_log("Erro ao atualizar cache de progresso: " . $e->getMessage());
            // Continuar mesmo com erro no cache
        }
        
        // Confirmar transação
        $conn->commit();
        
        // Buscar dados atualizados do diagnóstico
        $sqlGetDiag = "SELECT id, item, avaliacao_resultado as statu, observacoes, nao_se_aplica 
                       FROM diagnostico WHERE id = ?";
        $stmtGetDiag = $conn->prepare($sqlGetDiag);
        $stmtGetDiag->execute([$diagnostico_id]);
        $diagInfo = $stmtGetDiag->fetch(PDO::FETCH_ASSOC);
        
        echo json_encode([
            'success' => true,
            'message' => 'Avaliação salva com sucesso',
            'diagnostico_id' => $diagnostico_id,
            'data' => $diagInfo
        ]);
        
    } catch (PDOException $e) {
        // Reverter transação em caso de erro
        if ($conn->inTransaction()) {
            $conn->rollBack();
        }
        
        error_log("Erro ao salvar avaliação: " . $e->getMessage());
        echo json_encode([
            'success' => false,
            'message' => 'Erro ao salvar avaliação: ' . $e->getMessage()
        ]);
    }
    exit;
}

/**
 * Busca os itens já salvos para um setor
 * @param PDO $conn Conexão com o banco de dados
 */
function fetchSavedItems($conn) {
    // Obter parâmetros
    $setor = isset($_GET['setor']) ? $_GET['setor'] : '';
    $setor_id = isset($_GET['setor_id']) ? intval($_GET['setor_id']) : 0;
    $unidade = isset($_GET['unidade']) ? intval($_GET['unidade']) : 0;
    $periodo = isset($_GET['periodo']) ? intval($_GET['periodo']) : 0;
    $subsetor_id = isset($_GET['subsetor_id']) ? intval($_GET['subsetor_id']) : null;
    
    if (!$setor_id || !$unidade || !$periodo) {
        echo '<div class="alert alert-danger">Parâmetros insuficientes</div>';
        return;
    }
    
    try {
        // Construir query base
        $sql = "SELECT d.id, d.item, d.avaliacao_resultado AS status, 
                       d.observacoes, d.nao_se_aplica, d.estado_avaliacao
                FROM diagnostico d
                WHERE d.setor_id = ? AND d.unidade_id = ? AND 
                      d.id_periodo_diagnostico = ? AND d.deletado = 0";
                      
        $params = [$setor_id, $unidade, $periodo];
        
        // Adicionar filtro de subsetor se fornecido
        if ($subsetor_id) {
            $sql .= " AND d.subsetor_id = ?";
            $params[] = $subsetor_id;
        }
        
        // Adicionar ordenação
        $sql .= " ORDER BY d.item ASC";
        
        $stmt = $conn->prepare($sql);
        $stmt->execute($params);
        $items = $stmt->fetchAll(PDO::FETCH_ASSOC);
        
        if (count($items) === 0) {
            echo '<div class="alert alert-info">Nenhum item avaliado encontrado para este setor.</div>';
            return;
        }
        
        // Exibir resultados
        echo '<div class="table-responsive">';
        echo '<table class="table table-striped table-hover">';
        echo '<thead class="table-light">';
        echo '<tr>';
        echo '<th>Item</th>';
        echo '<th>Status</th>';
        echo '<th width="30%">Observações</th>';
        echo '<th>Ações</th>';
        echo '</tr>';
        echo '</thead>';
        echo '<tbody>';
        
        foreach ($items as $item) {
            $id = $item['id'];
            $nome_item = htmlspecialchars($item['item']);
            $status = $item['status'];
            $observacoes = htmlspecialchars($item['observacoes']);
            $nao_se_aplica = intval($item['nao_se_aplica']);
            
            echo '<tr>';
            
            // Coluna do nome do item
            echo '<td>';
            echo $nome_item;
            echo '</td>';
            
            // Coluna status
            echo '<td>';
            if ($nao_se_aplica == 1) {
                echo '<span class="badge bg-secondary p-2"><i class="fas fa-ban me-1"></i> Não se Aplica</span>';
            } else if ($status == 'conforme') {
                echo '<span class="badge bg-success p-2"><i class="fas fa-check-circle me-1"></i> Conforme</span>';
            } else if ($status == 'nao_conforme') {
                echo '<span class="badge bg-danger p-2"><i class="fas fa-times-circle me-1"></i> Não Conforme</span>';
            } else if ($status == 'parcialmente_conforme') {
                echo '<span class="badge bg-warning p-2"><i class="fas fa-exclamation-circle me-1"></i> Parcialmente Conforme</span>';
            } else {
                echo '<span class="badge bg-light text-dark p-2"><i class="far fa-circle me-1"></i> Pendente</span>';
            }
            echo '</td>';
            
            // Coluna observações
            echo '<td>';
            if (!empty($observacoes)) {
                echo '<div class="text-muted small">' . nl2br($observacoes) . '</div>';
            } else {
                echo '<span class="text-muted fst-italic">Nenhuma observação</span>';
            }
            echo '</td>';
            
            // Coluna ações
            echo '<td>';
            echo '<button class="btn btn-sm btn-warning" ';
            echo 'onclick="editItem(' . $id . ', \'' . addslashes($nome_item) . '\', \'' . $status . '\', \'' . addslashes($observacoes) . '\', ' . $nao_se_aplica . ')">';
            echo '<i class="fas fa-edit me-1"></i> Editar</button>';
            echo '</td>';
            
            echo '</tr>';
        }
        
        echo '</tbody>';
        echo '</table>';
        echo '</div>';
        
    } catch (PDOException $e) {
        error_log('Erro na função fetchSavedItems: ' . $e->getMessage());
        echo '<div class="alert alert-danger">';
        echo '<i class="fas fa-exclamation-triangle me-2"></i>';
        echo 'Erro ao buscar itens: ' . $e->getMessage();
        echo '</div>';
    }
}
/** 
 * Verifies if a period is frozen
 * @param PDO $conn Database connection
 */
function checkPeriodFrozen($conn) {
    header('Content-Type: application/json; charset=utf-8');
    
    $periodo_id = isset($_GET['periodo_id']) ? intval($_GET['periodo_id']) : 0;
    if (!$periodo_id) {
        echo json_encode(['error' => 'Period ID not provided', 'is_frozen' => false]);
        exit;
    }
    try {
        $sql = "SELECT is_frozen FROM periodo_diagnostico WHERE id = ? AND deletado = 0";
        $stmt = $conn->prepare($sql);
        $stmt->execute([$periodo_id]);
        $isFrozen = $stmt->fetchColumn();
        echo json_encode([
            'success' => true,
            'is_frozen' => (bool)$isFrozen,
            'periodo_id' => $periodo_id
        ]);
    } catch (PDOException $e) {
        echo json_encode([
            'success' => false,
            'error' => 'Database error: ' . $e->getMessage(),
            'is_frozen' => false
        ]);
    }
    exit;
}

/**
 * Verifica se um período está expirado (data_fim já passou)
 * 
 * @param PDO $conn Conexão com o banco de dados
 * @param int $periodoId ID do período a verificar
 * @return bool True se o período estiver expirado, false caso contrário
 */
function isPeriodoExpirado($conn, $periodoId) {
    try {
        // Buscar a data_fim do período
        $sql = "SELECT data_fim FROM periodo_diagnostico 
                WHERE id = ? AND deletado = 0";
        $stmt = $conn->prepare($sql);
        $stmt->execute([$periodoId]);
        $dataFim = $stmt->fetchColumn();
        if (!$dataFim) {
            return false; // Período não encontrado ou já deletado
        }
        // Comparar com a data atual
        $dataAtual = date('Y-m-d');
        return ($dataFim < $dataAtual);
    } catch (PDOException $e) {
        error_log('Erro ao verificar expiração do período: ' . $e->getMessage());
        return false; // Em caso de erro, assume que não está expirado
    }
}

/**
 * Retorna informações sobre o status de um período (expirado, dias restantes, etc)
 * 
 * @param PDO $conn Conexão com o banco de dados
 * @param int $periodoId ID do período
 * @return array Informações do período
 */
function getPeriodoStatus($conn, $periodoId) {
    try {
        $sql = "SELECT id, id_unidade, data_inicio, data_fim, 
                       is_frozen, 
                       DATEDIFF(data_fim, CURDATE()) as dias_restantes
                FROM periodo_diagnostico 
                WHERE id = ? AND deletado = 0";
        $stmt = $conn->prepare($sql);
        $stmt->execute([$periodoId]);
        $periodo = $stmt->fetch(PDO::FETCH_ASSOC);
        if (!$periodo) {
            return [
                'encontrado' => false,
                'mensagem' => 'Período não encontrado ou já deletado'
            ];
        }
        // Calcular estado do período
        $dataAtual = date('Y-m-d');
        $dataInicio = $periodo['data_inicio'];
        $dataFim = $periodo['data_fim'];
        $status = [
            'encontrado' => true,
            'id' => $periodo['id'],
            'id_unidade' => $periodo['id_unidade'],
            'data_inicio' => $dataInicio,
            'data_fim' => $dataFim,
            'is_frozen' => (bool)$periodo['is_frozen'],
            'dias_restantes' => (int)$periodo['dias_restantes'],
            'expirado' => ($dataFim < $dataAtual),
            'nao_iniciado' => ($dataInicio > $dataAtual),
            'em_andamento' => ($dataInicio <= $dataAtual && $dataFim >= $dataAtual),
            'pode_editar' => ($dataFim >= $dataAtual), // Só pode editar se não estiver expirado
        ];
        // Incluir mensagens informativas baseadas no status
        if ($status['expirado']) {
            $status['mensagem'] = 'Este período está expirado. Apenas visualização é permitida.';
            $status['tipo_alerta'] = 'warning';
        } elseif ($status['nao_iniciado']) {
            $status['mensagem'] = 'Este período ainda não iniciou. Você está configurando itens para uso futuro.';
            $status['tipo_alerta'] = 'info';
        } elseif ($status['em_andamento']) {
            if ($status['dias_restantes'] <= 5) {
                $status['mensagem'] = 'Atenção: Este período expira em ' . $status['dias_restantes'] . ' dias.';
                $status['tipo_alerta'] = 'warning';
            } else {
                $status['mensagem'] = 'Período em andamento. Restam ' . $status['dias_restantes'] . ' dias.';
                $status['tipo_alerta'] = 'success';
            }
        }
        return $status;
    } catch (PDOException $e) {
        error_log('Erro ao obter status do período: ' . $e->getMessage());
        return [
            'encontrado' => false,
            'mensagem' => 'Erro ao obter status do período: ' . $e->getMessage(),
            'tipo_alerta' => 'danger'
        ];
    }
}

/**
 * Função para sincronizar itens entre items_diagnostico e diagnostico para a nova estrutura
 */
function sincronizarItensPeriodo($conn, $periodoId, $unidadeId, $usuarioId = null, $forcarAtualizacao = false, $manageTransaction = false) {
    // Variável para controlar se a transação foi iniciada aqui
    $transactionStarted = false;
    try {
        // CORREÇÃO: Se usuarioId não foi fornecido, obter da função
        if ($usuarioId === null) {
            $usuarioId = getUsuarioId();
        }
        
        // Log para depuração
        error_log("Iniciando sincronização - Período: $periodoId, Unidade: $unidadeId, Força atualização: " . ($forcarAtualizacao ? 'Sim' : 'Não') . ", Usuário: $usuarioId");
        
        // Verificar se o período existe antes de iniciar a transação
        $sqlPeriodo = "SELECT id, data_inicio, data_fim FROM periodo_diagnostico 
                       WHERE id = ? AND id_unidade = ? AND deletado = 0";
        $stmtPeriodo = $conn->prepare($sqlPeriodo);
        $stmtPeriodo->execute([$periodoId, $unidadeId]);
        $periodo = $stmtPeriodo->fetch(PDO::FETCH_ASSOC);
        if (!$periodo) {
            throw new Exception("Período não encontrado ou já foi excluído.");
        }
        
        // Iniciar transação apenas se for para gerenciar aqui
        if ($manageTransaction) {
            $conn->beginTransaction();
            $transactionStarted = true;
            error_log("Transação iniciada na função sincronizarItensPeriodo");
        }
        
        // Verificar se o período está congelado
        $periodoCongelado = false;
        try {
            $sqlFrozen = "SELECT is_frozen FROM periodo_diagnostico WHERE id = ?";
            $stmtFrozen = $conn->prepare($sqlFrozen);
            $stmtFrozen->execute([$periodoId]);
            $periodoCongelado = (bool)$stmtFrozen->fetchColumn();
            error_log("Status de congelamento do período: " . ($periodoCongelado ? 'Congelado' : 'Não congelado'));
        } catch (PDOException $e) {
            error_log("Erro ao verificar congelamento do período: " . $e->getMessage());
            // Continuar mesmo com erro nesta verificação
        }
        
        // Se o período estiver congelado e não estamos forçando a atualização, retornar
        if ($periodoCongelado && !$forcarAtualizacao) {
            error_log("Período está congelado e a atualização não está sendo forçada. Sincronização cancelada.");
            
            // Se iniciou transação aqui, fazer commit (não há mudanças)
            if ($transactionStarted && $conn->inTransaction()) {
                $conn->commit();
                $transactionStarted = false;
                error_log("Transação finalizada (commit sem mudanças)");
            }
            
            return [
                'status' => 'info',
                'message' => 'Período está congelado. Use a opção de forçar atualização para sincronizar novos itens.',
                'itens_inseridos' => 0,
                'itens_atualizados' => 0,
                'setores_sincronizados' => 0
            ];
        }
        
        // Estatísticas para retorno
        $stats = [
            'itens_inseridos' => 0,
            'itens_atualizados' => 0,
            'setores_sincronizados' => 0
        ];
        
        // 1. Buscar todos os subsetores da unidade através da relação unidade_setores -> setores -> subsetores
        $sqlSubsetores = "
            SELECT DISTINCT ss.id AS subsetor_id, ss.setor_id
            FROM unidade_setores us
            INNER JOIN setores s ON us.setor = s.nome
            INNER JOIN subsetores ss ON ss.setor_id = s.id
            WHERE us.unidade_id = ? 
              AND us.deletado = 0
              AND s.deletado = 0
              AND ss.deletado = 0
            ORDER BY ss.setor_id, ss.id
        ";
        
        $stmtSubsetores = $conn->prepare($sqlSubsetores);
        $stmtSubsetores->execute([$unidadeId]);
        $subsetores = $stmtSubsetores->fetchAll(PDO::FETCH_ASSOC);
          error_log("Encontrados " . count($subsetores) . " subsetores para sincronizar");
        
        // 2. Para cada subsetor, sincronizar os itens
        foreach ($subsetores as $subsetor) {
            $setorId = $subsetor['setor_id'];
            $subsetorId = $subsetor['subsetor_id'];
            
            try {
                error_log("Processando setor ID: $setorId, Subsetor ID: $subsetorId");
                
                // 2.1 Inserir novos itens (que existem em items_diagnostico mas não em diagnostico)
                $sqlNovoItens = "
                    INSERT INTO diagnostico (
                        unidade_id, id_periodo_diagnostico, item, item_hash, 
                        setor_id, subsetor_id, avaliacao_resultado, nao_se_aplica, estado_avaliacao, 
                        criado_em, criado_por, item_id
                    )
                    SELECT 
                        ?, ?, i.nome_item, MD5(LOWER(TRIM(i.nome_item))),
                        ?, i.subsetor_id, NULL, 0, 'nao_avaliado',
                        NOW(), ?, i.id
                    FROM items_diagnostico i
                    WHERE i.subsetor_id = ? AND i.deletado = 0
                    AND NOT EXISTS (
                        SELECT 1 
                        FROM diagnostico d
                        WHERE d.id_periodo_diagnostico = ?
                        AND d.setor_id = ?
                        AND d.subsetor_id = i.subsetor_id
                        AND d.unidade_id = ?
                        AND d.item_hash = MD5(LOWER(TRIM(i.nome_item)))
                        AND d.deletado = 0
                    )
                ";
                
                $stmtNovosItens = $conn->prepare($sqlNovoItens);
                $stmtNovosItens->execute([
                    $unidadeId,           // unidade_id
                    $periodoId,           // id_periodo_diagnostico
                    $setorId,             // setor_id
                    $usuarioId,           // criado_por
                    $subsetorId,          // subsetor_id (where clause)
                    $periodoId,           // id_periodo_diagnostico (nested query)
                    $setorId,             // setor_id (nested query)
                    $unidadeId            // unidade_id (nested query)
                ]);
                
                $itensInseridos = $stmtNovosItens->rowCount();
                $stats['itens_inseridos'] += $itensInseridos;
                error_log("Setor $setorId, Subsetor $subsetorId: Inseridos $itensInseridos novos itens");
                
                // 2.2 Verificar e atualizar itens que foram modificados
                $sqlAtualizarItens = "
                    UPDATE diagnostico d
                    INNER JOIN items_diagnostico i ON d.item_hash = MD5(LOWER(TRIM(i.nome_item)))
                                                 AND d.subsetor_id = i.subsetor_id
                                                 AND d.unidade_id = ?
                    SET d.item = i.nome_item,
                        d.atualizado_em = NOW(),
                        d.atualizado_por = ?,
                        d.item_id = i.id
                    WHERE d.id_periodo_diagnostico = ?
                    AND d.item <> i.nome_item
                    AND d.setor_id = ?
                    AND d.subsetor_id = ?
                    AND d.deletado = 0
                    AND i.deletado = 0
                ";
                
                $stmtAtualizarItens = $conn->prepare($sqlAtualizarItens);
                $stmtAtualizarItens->execute([
                    $unidadeId,    // unidade_id (join condition)
                    $usuarioId,    // atualizado_por
                    $periodoId,    // id_periodo_diagnostico
                    $setorId,      // setor_id
                    $subsetorId    // subsetor_id
                ]);
                
                $itensAtualizados = $stmtAtualizarItens->rowCount();
                $stats['itens_atualizados'] += $itensAtualizados;
                error_log("Setor $setorId, Subsetor $subsetorId: Atualizados $itensAtualizados itens existentes");
                
                // Após processar o setor/subsetor, atualizar estatística
                $stats['setores_sincronizados']++;
            } catch (PDOException $e) {
                error_log("Erro ao processar setor $setorId, Subsetor $subsetorId: " . $e->getMessage());
                // Continuar com o próximo setor/subsetor mesmo se este falhar
            }
        }
        
        // 3. Marcar período como congelado se a atualização foi forçada
        if ($forcarAtualizacao) {
            try {
                $sqlCongelar = "UPDATE periodo_diagnostico 
                               SET is_frozen = 1,
                                   atualizado_em = NOW(),
                                   atualizado_por = ?
                               WHERE id = ?";
                $stmtCongelar = $conn->prepare($sqlCongelar);
                $stmtCongelar->execute([$usuarioId, $periodoId]);
                error_log("Período $periodoId marcado como congelado");
            } catch (PDOException $e) {
                error_log("Erro ao marcar período como congelado: " . $e->getMessage());
                // Continuar mesmo com este erro
            }
        }
        
        // 4. Atualizar o cache de progresso para todos os setores sincronizados
        $processedSetores = [];
        foreach ($subsetores as $subsetor) {
            $setorId = $subsetor['setor_id'];
            
            // Evitar atualizar o mesmo setor múltiplas vezes
            if (!in_array($setorId, $processedSetores)) {
                try {
                    if (function_exists('atualizarProgressoCache')) {
                        atualizarProgressoCache($conn, $setorId, $periodoId, $unidadeId, $usuarioId);
                        error_log("Cache de progresso atualizado para setor $setorId");
                    }
                    $processedSetores[] = $setorId;
                } catch (Exception $e) {
                    error_log("Erro ao atualizar cache de progresso para setor $setorId: " . $e->getMessage());
                    // Continuar mesmo com este erro
                }
            }
        }
        
        // Confirmar transação apenas se foi iniciada aqui
        if ($transactionStarted && $conn->inTransaction()) {
            $conn->commit();
            $transactionStarted = false;
            error_log("Transação confirmada - sincronização concluída com sucesso");
        }
        
        // Determinar tipo de mensagem com base nas estatísticas
        $status = ($stats['itens_inseridos'] > 0 || $stats['itens_atualizados'] > 0) ? 'success' : 'info';
        $message = sprintf(
            'Sincronização concluída: %d novos itens, %d itens atualizados em %d setores.',
            $stats['itens_inseridos'],
            $stats['itens_atualizados'],
            $stats['setores_sincronizados']
        );
        
        return array_merge($stats, [
            'status' => $status,
            'message' => $message
        ]);
    } catch (Exception $e) {
        // Reverter transação em caso de erro, apenas se foi iniciada aqui
        if ($transactionStarted && $conn->inTransaction()) {
            $conn->rollBack();
            $transactionStarted = false;
            error_log("Transação revertida devido a erro na sincronização");
        }
        
        error_log("Erro crítico durante sincronização: " . $e->getMessage());
        return [
            'status' => 'error',
            'message' => 'Erro durante sincronização: ' . $e->getMessage(),
            'itens_inseridos' => 0,
            'itens_atualizados' => 0,
            'setores_sincronizados' => 0
        ];
    }
}

/**
 * Adiciona a coluna de congelamento na tabela periodo_diagnostico se ela não existir
 * 
 * @param PDO $conn Conexão com o banco de dados
 * @return bool True se a coluna foi adicionada ou já existia
 */
function adicionarColunaCongelamento($conn) {
    try {
        // Verificar se a coluna já existe
        $sql = "SHOW COLUMNS FROM periodo_diagnostico LIKE 'is_frozen'";
        $result = $conn->query($sql);
        if ($result->rowCount() === 0) {
            // Coluna não existe, vamos adicioná-la
            $sql = "ALTER TABLE periodo_diagnostico ADD COLUMN is_frozen TINYINT(1) NOT NULL DEFAULT 0 AFTER data_fim";
            $conn->exec($sql);
            // Por padrão, marcar períodos antigos como não congelados (retrocompatibilidade)
            $sql = "UPDATE periodo_diagnostico SET is_frozen = 0 WHERE is_frozen IS NULL";
            $conn->exec($sql);
            return true;
        }
        return true; // Coluna já existe
    } catch (PDOException $e) {
        error_log('Erro ao adicionar coluna de congelamento: ' . $e->getMessage());
        return false;
    }
}

/**
 * Processa a requisição para forçar a sincronização de itens - Versão corrigida
 * @param PDO $conn Conexão com o banco de dados
 */
function forceSyncItems($conn) {
    // 1. Verificar se é uma requisição AJAX antes de QUALQUER saída
    $isAjax = !empty($_SERVER['HTTP_X_REQUESTED_WITH']) && 
              strtolower($_SERVER['HTTP_X_REQUESTED_WITH']) === 'xmlhttprequest';
    if (!$isAjax) {
        // Se não for AJAX, não fazer nada e deixar o fluxo normal da página continuar
        return;
    }
    // 2. Limpar qualquer buffer de saída existente
    while (ob_get_level()) {
        ob_end_clean();
    }
    // 3. Definir cabeçalhos para resposta JSON
    header('Content-Type: application/json; charset=utf-8');
    header('Cache-Control: no-cache, must-revalidate');
    header('Expires: 0');
    // 4. Verificar se é uma requisição POST
    if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
        echo json_encode(['success' => false, 'message' => 'Método de requisição inválido.']);
        exit;
    }
    try {
        // Obter parâmetros
        $periodoId = isset($_POST['periodo_id']) ? intval($_POST['periodo_id']) : 0;
        $unidadeId = isset($_POST['unidade_id']) ? intval($_POST['unidade_id']) : 0;
        error_log("Parâmetros: periodoId=$periodoId, unidadeId=$unidadeId");
        if (!$periodoId || !$unidadeId) {
            echo json_encode(['success' => false, 'message' => 'Parâmetros inválidos.']);
            exit;
        }
        // Verificar se o período existe
        $sqlCheck = "SELECT id, id_unidade FROM periodo_diagnostico WHERE id = ? AND deletado = 0";
        $stmtCheck = $conn->prepare($sqlCheck);
        $stmtCheck->execute([$periodoId]);
        $periodo = $stmtCheck->fetch(PDO::FETCH_ASSOC);
        if (!$periodo) {
            echo json_encode(['success' => false, 'message' => 'Período não encontrado.']);
            exit;
        }
        // Verificar se a unidade corresponde
        if ($periodo['id_unidade'] != $unidadeId) {
            echo json_encode(['success' => false, 'message' => 'A unidade não corresponde ao período.']);
            exit;
        }
        // Obter ID do usuário para auditoria
        $usuarioId = getUsuarioId();
        error_log("Usuário ID: $usuarioId");
        // Iniciar transação
        $conn->beginTransaction();
        
        try {
            // Obter todos os setores da unidade
            $sqlSetores = "SELECT id, nome_setor FROM setor_diagnostico 
                        WHERE unidade_id = ? AND deletado = 0
                        ORDER BY nome_setor";
            $stmtSetores = $conn->prepare($sqlSetores);
            $stmtSetores->execute([$unidadeId]);
            $setores = $stmtSetores->fetchAll(PDO::FETCH_ASSOC);
            $totalItensInseridos = 0;
            $totalItensAtualizados = 0;
            $setoresSincronizados = 0;
            // Verificar se o período está congelado
            $sqlCheckFrozen = "SELECT is_frozen FROM periodo_diagnostico WHERE id = ?";
            $stmtCheckFrozen = $conn->prepare($sqlCheckFrozen);
            $stmtCheckFrozen->execute([$periodoId]);
            $isFrozen = (bool)$stmtCheckFrozen->fetchColumn();
            // Temporariamente descongelar o período
            if ($isFrozen) {
                $sqlUnfreeze = "UPDATE periodo_diagnostico SET is_frozen = 0, 
                            atualizado_em = NOW(), atualizado_por = ? 
                            WHERE id = ?";
                $stmtUnfreeze = $conn->prepare($sqlUnfreeze);
                $stmtUnfreeze->execute([$usuarioId, $periodoId]);
                error_log("Período temporariamente descongelado para sincronização");
            }
            // Processar cada setor
            foreach ($setores as $setor) {
                $setorId = $setor['id'];
                $setorNome = $setor['nome_setor'];
                try {
                    // 1. Inserir novos itens
                    $sqlNovoItens = "
                        INSERT INTO diagnostico (
                            unidade_id, id_periodo_diagnostico, item, item_hash,
                            setor_id, avaliacao_resultado, nao_se_aplica, estado_avaliacao, 
                            criado_em, criado_por
                        )
                        SELECT 
                            i.unidade_id, ?, i.nome_item, MD5(LOWER(TRIM(i.nome_item))),
                            i.setor_id, NULL, 0, 'nao_avaliado',
                            NOW(), ?
                        FROM items_diagnostico i
                        WHERE i.unidade_id = ? AND i.setor_id = ? AND i.deletado = 0
                        AND NOT EXISTS (
                            SELECT 1 
                            FROM diagnostico d
                            WHERE d.id_periodo_diagnostico = ?
                            AND d.setor_id = i.setor_id
                            AND d.unidade_id = i.unidade_id
                            AND d.item_hash = MD5(LOWER(TRIM(i.nome_item)))
                            AND d.deletado = 0
                        )
                    ";
                    $stmtNovosItens = $conn->prepare($sqlNovoItens);
                    $stmtNovosItens->execute([
                        $periodoId,
                        $usuarioId,
                        $unidadeId,
                        $setorId,
                        $periodoId,
                    ]);
                    $itensInseridos = $stmtNovosItens->rowCount();
                    $totalItensInseridos += $itensInseridos;
                    
                    // 2. Atualizar itens modificados
                    $sqlAtualizarItens = "
                        UPDATE diagnostico d
                        INNER JOIN items_diagnostico i ON d.item_hash = MD5(LOWER(TRIM(i.nome_item)))
                                                    AND d.setor_id = i.setor_id
                                                    AND d.unidade_id = i.unidade_id
                        SET d.item = i.nome_item,
                            d.atualizado_em = NOW(),
                            d.atualizado_por = ?
                        WHERE d.id_periodo_diagnostico = ?
                        AND d.item <> i.nome_item
                        AND d.setor_id = ?
                        AND d.unidade_id = ?
                        AND d.deletado = 0
                        AND i.deletado = 0
                    ";
                    $stmtAtualizarItens = $conn->prepare($sqlAtualizarItens);
                    $stmtAtualizarItens->execute([
                        $usuarioId,
                        $periodoId,
                        $setorId,
                        $unidadeId,
                    ]);
                    $itensAtualizados = $stmtAtualizarItens->rowCount();
                    $totalItensAtualizados += $itensAtualizados;
                    
                    if ($itensInseridos > 0 || $itensAtualizados > 0) {
                        $setoresSincronizados++;
                    }
                    error_log("Setor '$setorNome': inseridos $itensInseridos, atualizados $itensAtualizados");
                } catch (PDOException $e) {
                    error_log("Erro ao processar setor $setorId ($setorNome): " . $e->getMessage());
                    // Continuar com o próximo setor
                }
            }
            // Sempre recongelar o período após a sincronização
            $sqlRefreeze = "UPDATE periodo_diagnostico SET is_frozen = 1, 
                        atualizado_em = NOW(), atualizado_por = ? 
                        WHERE id = ?";
            $stmtRefreeze = $conn->prepare($sqlRefreeze);
            $stmtRefreeze->execute([$usuarioId, $periodoId]);
            // Confirmar a transação
            $conn->commit();
            
            // Atualizar caches de progresso
            foreach ($setores as $setor) {
                try {
                    atualizarProgressoCache($conn, $setor['id'], $periodoId, $unidadeId, $usuarioId);
                } catch (Exception $e) {
                    error_log("Erro ao atualizar cache para setor {$setor['id']}: " . $e->getMessage());
                }
            }
            echo json_encode([
                'success' => true,
                'message' => sprintf(
                    'Sincronização concluída com sucesso! %d novos itens, %d itens atualizados em %d setores.',
                    $totalItensInseridos,
                    $totalItensAtualizados,
                    $setoresSincronizados
                ),
                'data' => [
                    'itens_inseridos' => $totalItensInseridos,
                    'itens_atualizados' => $totalItensAtualizados,
                    'setores_sincronizados' => $setoresSincronizados
                ]
            ]);
        } catch (Exception $e) {
            // Reverter em caso de erro
            if ($conn->inTransaction()) {
                $conn->rollBack();
            }
            echo json_encode([
                'success' => false,
                'message' => 'Erro na sincronização: ' . $e->getMessage()
            ]);
        }
    } catch (Exception $e) {
        echo json_encode([
            'success' => false,
            'message' => 'Erro ao sincronizar itens: ' . $e->getMessage()
        ]);
    }
    // Encerrar completamente o script após a resposta
    exit;
}

/**
 * Exclui um período utilizando soft delete e auditoria
 * @param PDO $conn Conexão com o banco de dados
 */
function deletePeriod($conn) {
    header('Content-Type: application/json; charset=utf-8');
    
    // Verificar se é uma requisição POST
    if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
        echo json_encode(['success' => false, 'message' => 'Método de requisição inválido.']);
        exit;
    }
    // Obter ID do período
    $periodo_id = isset($_POST['periodo_id']) ? intval($_POST['periodo_id']) : 0;
    
    if (!$periodo_id) {
        echo json_encode(['success' => false, 'message' => 'ID do período não fornecido.']);
        exit;
    }
    // Obter ID do usuário para auditoria - CORREÇÃO AQUI
    $usuarioId = getUsuarioId();
    error_log("Excluindo período ID $periodo_id pelo usuário ID $usuarioId");
    
    try {
        // Iniciar transação
        $conn->beginTransaction();
        
        // Verificar se o período existe
        $sql = "SELECT id, id_unidade FROM periodo_diagnostico WHERE id = ? AND deletado = 0";
        $stmt = $conn->prepare($sql);
        $stmt->execute([$periodo_id]);
        $periodo = $stmt->fetch(PDO::FETCH_ASSOC);
        if (!$periodo) {
            echo json_encode(['success' => false, 'message' => 'Período não encontrado ou já excluído.']);
            exit;
        }
        // 1. Contar quantos diagnósticos serão excluídos
        $sql = "SELECT COUNT(*) FROM diagnostico WHERE id_periodo_diagnostico = ? AND deletado = 0";
        $stmt = $conn->prepare($sql);
        $stmt->execute([$periodo_id]);
        $total_diagnosticos = $stmt->fetchColumn();
        
        // 2. Soft delete nos diagnósticos relacionados - CORREÇÃO AQUI
        $sql = "UPDATE diagnostico SET 
                deletado = 1, 
                deletado_em = NOW(), 
                deletado_por = ? 
                WHERE id_periodo_diagnostico = ? AND deletado = 0";
        $stmt = $conn->prepare($sql);
        $stmt->execute([$usuarioId, $periodo_id]);
        $diagnosticos_excluidos = $stmt->rowCount();
        
        // 3. Soft delete no período - CORREÇÃO AQUI
        $sql = "UPDATE periodo_diagnostico SET 
                deletado = 1, 
                deletado_em = NOW(), 
                deletado_por = ? 
                WHERE id = ? AND deletado = 0";
        $stmt = $conn->prepare($sql);
        $stmt->execute([$usuarioId, $periodo_id]);
        
        // Confirmar a transação
        $conn->commit();
        
        // Montar a mensagem de sucesso
        $mensagem = "Período excluído com sucesso! {$diagnosticos_excluidos} diagnósticos foram removidos.";
        
        echo json_encode([
            'success' => true,
            'message' => $mensagem,
            'total_diagnosticos' => $total_diagnosticos,
            'diagnosticos_excluidos' => $diagnosticos_excluidos,
            'usuario_id' => $usuarioId // Para verificação
        ]);
    } catch (PDOException $e) {
        // Reverter em caso de erro
        if ($conn->inTransaction()) {
            $conn->rollBack();
        }
        echo json_encode([
            'success' => false,
            'message' => 'Erro ao excluir período: ' . $e->getMessage()
        ]);
        // Registrar erro no log
        error_log('Erro ao excluir período: ' . $e->getMessage());
    }
    exit;
}

/**
 * Obtém o progresso para um setor usando o cache
 * @param PDO $conn Conexão com o banco de dados
 */
function getProgress($conn) {
    // Limpar qualquer buffer de saída anterior
    while (ob_get_level()) {
        ob_end_clean();
    }
    
    // Validar parâmetros
    $setor_id = isset($_GET['setor_id']) ? intval($_GET['setor_id']) : 0;
    $unidade_id = isset($_GET['unidade']) ? intval($_GET['unidade']) : 0;
    $periodo_id = isset($_GET['periodo']) ? intval($_GET['periodo']) : 0;
    $forceRefresh = isset($_GET['refresh']) && $_GET['refresh'] == '1';
    
    if (!$setor_id || !$unidade_id || !$periodo_id) {
        jsonError('Parâmetros insuficientes');
    }
    
    try {
        // Calcular as estatísticas
        $sql = "SELECT 
                COUNT(*) as total,
                SUM(CASE WHEN estado_avaliacao = 'avaliado' THEN 1 ELSE 0 END) as avaliados,
                SUM(CASE WHEN estado_avaliacao = 'em_avaliacao' THEN 1 ELSE 0 END) as em_avaliacao,
                SUM(CASE WHEN avaliacao_resultado = 'conforme' THEN 1 ELSE 0 END) as conformes,
                SUM(CASE WHEN avaliacao_resultado = 'nao_conforme' THEN 1 ELSE 0 END) as nao_conformes,
                SUM(CASE WHEN avaliacao_resultado = 'parcialmente_conforme' THEN 1 ELSE 0 END) as parcialmente_conformes,
                SUM(CASE WHEN nao_se_aplica = 1 THEN 1 ELSE 0 END) as nao_se_aplica
               FROM diagnostico 
               WHERE setor_id = ? 
               AND id_periodo_diagnostico = ? 
               AND unidade_id = ?
               AND deletado = 0";
        $stmt = $conn->prepare($sql);
        $stmt->execute([$setor_id, $periodo_id, $unidade_id]);
        $stats = $stmt->fetch(PDO::FETCH_ASSOC);
        
        // Garantir que todos os valores são números
        foreach ($stats as $key => $value) {
            $stats[$key] = is_numeric($value) ? intval($value) : 0;
        }
        
        // Adicionar campos calculados
        $stats['pendentes'] = $stats['total'] - $stats['avaliados'] - $stats['em_avaliacao'];
        $stats['percentual_progresso'] = ($stats['total'] > 0) ? 
            round(($stats['avaliados'] / $stats['total']) * 100) : 0;
        
        // Retornar sucesso
        jsonResponse($stats);
    } catch (PDOException $e) {
        error_log("ERRO ao obter progresso: " . $e->getMessage());
        jsonError('Erro ao obter progresso: ' . $e->getMessage());
    } catch (Exception $e) {
        error_log("Erro geral ao obter progresso: " . $e->getMessage());
        jsonError('Erro geral: ' . $e->getMessage());
    }
}

/**
 * Cria um novo período de diagnóstico com melhor tratamento de erros
 * 
 * @param PDO $conn Conexão com o banco de dados
 */
function createPeriod(PDO $conn) {
    // Validar entrada
    $unidade = isset($_POST['unidade']) ? intval($_POST['unidade']) : 0;
    $data_inicio = $_POST['data_inicio'] ?? '';
    $data_fim = $_POST['data_fim'] ?? '';
    $isCongelado = isset($_POST['is_frozen']) ? intval($_POST['is_frozen']) : 1; // Por padrão, novos períodos são congelados
    
    // CORREÇÃO: Obter ID do usuário de forma confiável
    $usuarioId = getUsuarioId();
    error_log("Criando período - Unidade: $unidade, Data início: $data_inicio, Data fim: $data_fim, Congelado: $isCongelado, Usuário: $usuarioId");
    
    if (!$unidade || !$data_inicio || !$data_fim) {
        $_SESSION['error'] = "Todos os campos são obrigatórios.";
        header("Location: implantacao.php");
        exit;
    }
    
    // Verificar se já existe um período com mesma unidade e datas
    try {
        $check = $conn->prepare("
            SELECT COUNT(*) FROM periodo_diagnostico
            WHERE id_unidade = ? AND data_inicio = ? AND data_fim = ? AND deletado = 0
        ");
        $check->execute([$unidade, $data_inicio, $data_fim]);
        if ($check->fetchColumn() > 0) {
            $_SESSION['error'] = "Já existe um período com essas datas para esta unidade.";
            header("Location: implantacao.php");
            exit;
        }
    } catch (PDOException $e) {
        error_log("Erro ao verificar período existente: " . $e->getMessage());
        $_SESSION['error'] = "Erro ao verificar período existente: " . $e->getMessage();
        header("Location: implantacao.php");
        exit;
    }
    
    // Variável para controlar se a transação foi iniciada
    $transactionStarted = false;

    try {
        // Iniciar transação e marcar a flag
        $conn->beginTransaction();
        $transactionStarted = true;
        
        // Garantir que a coluna is_frozen existe
        try {
            // Verificar se a coluna existe
            $checkColumn = $conn->query("SHOW COLUMNS FROM periodo_diagnostico LIKE 'is_frozen'");
            if ($checkColumn->rowCount() === 0) {
                // A coluna não existe, vamos adicioná-la
                $conn->exec("ALTER TABLE periodo_diagnostico ADD COLUMN is_frozen TINYINT(1) NOT NULL DEFAULT 0 AFTER data_fim");
                error_log("Coluna is_frozen adicionada com sucesso");
            }
        } catch (PDOException $e) {
            error_log("Erro ao verificar/adicionar coluna is_frozen: " . $e->getMessage());
            // Continuar mesmo com erro, pois a coluna pode já existir
        }
        
        // Inserir o novo período com a flag de congelamento
        $stmt = $conn->prepare("
            INSERT INTO periodo_diagnostico (
                id_unidade, data_inicio, data_fim, is_frozen, criado_em, criado_por
            ) VALUES (?, ?, ?, ?, NOW(), ?)
        ");
        $insertResult = $stmt->execute([$unidade, $data_inicio, $data_fim, $isCongelado, $usuarioId]);
        if (!$insertResult) {
            throw new Exception("Falha ao inserir novo período: " . implode(" ", $stmt->errorInfo()));
        }
        $periodo_id = $conn->lastInsertId();
        error_log("Período criado com ID: $periodo_id, usuário: $usuarioId");
        
        // Verificar se o ID do período foi obtido corretamente
        if (!$periodo_id) {
            throw new Exception("Não foi possível obter o ID do período criado");
        }
        
        // IMPORTANTE: Sincronizar todos os itens para este período
        // Aqui é que garantimos que todos os itens sejam copiados para a tabela diagnostico
        try {
            // O parâmetro TRUE para forçar a sincronização mesmo se o período for congelado
            $resultado = sincronizarItensPeriodo($conn, $periodo_id, $unidade, $usuarioId, true);
            error_log("Sincronização completada: " . json_encode($resultado));
            // Verificar o resultado para garantir que a sincronização foi bem-sucedida
            if ($resultado['status'] === 'error' || $resultado['itens_inseridos'] === 0) {
                error_log("ALERTA: Sincronização não inseriu nenhum item ou falhou: " . json_encode($resultado));
                // Tentar novamente, forçando a sincronização
                $resultado = sincronizarItensPeriodo($conn, $periodo_id, $unidade, $usuarioId, true, true);
                error_log("Resultado da segunda tentativa: " . json_encode($resultado));
            }
        } catch (Exception $e) {
            error_log("Erro durante sincronização: " . $e->getMessage());
            throw new Exception("Erro ao sincronizar itens: " . $e->getMessage());
        }
        
        $conn->commit();
        $transactionStarted = false;
        error_log("Transação confirmada com sucesso");
        $_SESSION['success'] = "Período criado com sucesso. " . ($resultado['itens_inseridos'] ?? 0) . " itens vinculados.";
        header("Location: implantacao.php?unidade=" . $periodo_id);
        exit;
    } catch (Exception $e) {
        // Verificar se a transação foi iniciada antes de tentar fazer rollback
        if ($transactionStarted && $conn->inTransaction()) {
            $conn->rollBack();
            error_log("Transação revertida devido a erro");
        }
        error_log("Erro ao criar período: " . $e->getMessage());
        $_SESSION['error'] = "Erro ao criar período: " . $e->getMessage();
        header("Location: implantacao.php");
        exit;
    }
}

/**
 * Função para buscar itens de um setor específico - Adaptada para nova estrutura
 * @param PDO $conn Conexão com o banco de dados
 */
function fetchItems($conn) {
    $setorId = isset($_GET['setor_id']) ? intval($_GET['setor_id']) : 0;
    $subsetorId = isset($_GET['subsetor_id']) ? intval($_GET['subsetor_id']) : null;
    $unidade = isset($_GET['unidade']) ? intval($_GET['unidade']) : 0;
    $periodo = isset($_GET['periodo']) ? intval($_GET['periodo']) : 0;
    $page = isset($_GET['page']) ? intval($_GET['page']) : 1;
    $limit = isset($_GET['limit']) ? intval($_GET['limit']) : 50;
    
    if (!$setorId || !$unidade || !$periodo) {
        echo '<div class="alert alert-danger">Parâmetros insuficientes</div>';
        return;
    }
    
    // Calcular offset para paginação
    $offset = ($page - 1) * $limit;
    
    try {
        // Consulta SQL adaptada para nova estrutura de dados
        // Agora buscamos itens através da hierarquia setor -> subsetor -> items_diagnostico
        $sql = "
            SELECT 
                i.id, 
                i.nome_item AS item,
                i.subsetor_id,
                s.setor_id,
                d.id as diagnostico_id, 
                d.avaliacao_resultado, 
                d.observacoes, 
                d.nao_se_aplica 
            FROM subsetores ss
            INNER JOIN items_diagnostico i ON i.subsetor_id = ss.id
            LEFT JOIN diagnostico d ON 
                d.item_hash = MD5(LOWER(TRIM(i.nome_item))) AND 
                d.id_periodo_diagnostico = ? AND
                d.setor_id = ss.setor_id AND
                d.subsetor_id = i.subsetor_id AND
                d.unidade_id = ?
            WHERE 
                ss.setor_id = ? AND
                ss.deletado = 0 AND
                i.deletado = 0
        ";
        
        $params = [$periodo, $unidade, $setorId];
        
        // Se um subsetor específico foi solicitado, filtre por ele
        if ($subsetorId !== null) {
            $sql .= " AND ss.id = ?";
            $params[] = $subsetorId;
        }
        
        // Adicionar ordenação e limites para paginação
        $sql .= " ORDER BY i.nome_item ASC LIMIT ? OFFSET ?";
        $params[] = $limit;
        $params[] = $offset;
        
        $stmt = $conn->prepare($sql);
        $stmt->execute($params);
        $items = $stmt->fetchAll(PDO::FETCH_ASSOC);
        
        // Contar total de registros (para paginação)
        $countSql = "
            SELECT COUNT(*) 
            FROM subsetores ss
            INNER JOIN items_diagnostico i ON i.subsetor_id = ss.id
            WHERE 
                ss.setor_id = ? AND
                ss.deletado = 0 AND
                i.deletado = 0
        ";
        
        $countParams = [$setorId];
        
        if ($subsetorId !== null) {
            $countSql .= " AND ss.id = ?";
            $countParams[] = $subsetorId;
        }
        
        $countStmt = $conn->prepare($countSql);
        $countStmt->execute($countParams);
        $totalItems = $countStmt->fetchColumn();
        
        if (count($items) === 0) {
            echo '<div class="alert alert-info">Nenhum item encontrado para este setor/subsetor.</div>';
            return;
        }
        
        // Exibir informações de paginação
        if ($totalItems > $limit) {
            $totalPages = ceil($totalItems / $limit);
            echo '<div class="d-flex justify-content-between align-items-center mb-3">';
            echo '<div>Mostrando ' . count($items) . ' de ' . $totalItems . ' itens</div>';
            echo '<nav aria-label="Navegação de página">';
            echo '<ul class="pagination pagination-sm mb-0">';
            
            // Botão Anterior
            $prevDisabled = ($page <= 1) ? 'disabled' : '';
            echo '<li class="page-item ' . $prevDisabled . '">';
            if ($page > 1) {
                echo '<a class="page-link" href="javascript:void(0)" onclick="loadItemsPage(' . ($page - 1) . ')">&laquo; Anterior</a>';
            } else {
                echo '<span class="page-link">&laquo; Anterior</span>';
            }
            echo '</li>';
            
            // Mostrar no máximo 5 páginas
            $startPage = max(1, min($page - 2, $totalPages - 4));
            $endPage = min($startPage + 4, $totalPages);
            for ($i = $startPage; $i <= $endPage; $i++) {
                $active = ($i == $page) ? 'active' : '';
                echo '<li class="page-item ' . $active . '">';
                if ($i != $page) {
                    echo '<a class="page-link" href="javascript:void(0)" onclick="loadItemsPage(' . $i . ')">' . $i . '</a>';
                } else {
                    echo '<span class="page-link">' . $i . '</span>';
                }
                echo '</li>';
            }
            
            // Botão Próximo
            $nextDisabled = ($page >= $totalPages) ? 'disabled' : '';
            echo '<li class="page-item ' . $nextDisabled . '">';
            if ($page < $totalPages) {
                echo '<a class="page-link" href="javascript:void(0)" onclick="loadItemsPage(' . ($page + 1) . ')">Próximo &raquo;</a>';
            } else {
                echo '<span class="page-link">Próximo &raquo;</span>';
            }
            echo '</li>';
            echo '</ul>';
            echo '</nav>';
            echo '</div>';
            
            // Adicionar a função JavaScript para carregar páginas
            echo '<script>
            function loadItemsPage(page) {
                let currentUrl = new URL(window.location.href);
                currentUrl.searchParams.set("page", page);
                fetch(currentUrl)
                    .then(response => response.text())
                    .then(html => {
                        document.getElementById("items-container").innerHTML = html;
                    })
                    .catch(error => console.error("Erro ao carregar itens:", error));
            }
            </script>';
        }
        
        // Cache para códigos HTML de status
        $statusHtml = [
            'nao_se_aplica' => '<span class="badge bg-secondary p-2"><i class="fas fa-ban me-1"></i> Não se Aplica</span>',
            'conforme' => '<span class="badge bg-success p-2"><i class="fas fa-check-circle me-1"></i> Conforme</span>',
            'nao_conforme' => '<span class="badge bg-danger p-2"><i class="fas fa-times-circle me-1"></i> Não Conforme</span>',
            'parcialmente_conforme' => '<span class="badge bg-warning p-2"><i class="fas fa-exclamation-circle me-1"></i> Parcialmente Conforme</span>',
            'pendente' => '<span class="badge bg-light text-dark p-2"><i class="far fa-circle me-1"></i> Pendente</span>'
        ];
        
        // Gerar HTML para cada item
        foreach ($items as $item) {
            $id = $item['id'];
            $nome_item = $item['item'];
            $diagnostico_id = $item['diagnostico_id'];
            $status = $item['avaliacao_resultado'] ?? '';
            $observacoes = $item['observacoes'] ?? '';
            $nao_se_aplica = (int)($item['nao_se_aplica'] ?? 0);
            $subsetorId = (int)($item['subsetor_id'] ?? 0);
            
            echo '<div id="item_' . $id . '" class="row mb-3 p-3 border rounded bg-white shadow-sm">';
            // Nome do item e detalhes
            echo '<div class="col-md-6 col-sm-12">';
            echo '<div class="fw-bold">' . htmlspecialchars($nome_item) . '</div>';
            if ($diagnostico_id) {
                echo '<div class="small text-muted mt-1">';
                echo '<i class="fas fa-check-circle me-1"></i> Item avaliado';
                echo '</div>';
                if ($observacoes) {
                    echo '<div class="small text-muted mt-1">';
                    echo '<i class="fas fa-comment-dots me-1"></i> <strong>Observações:</strong> ' . nl2br(htmlspecialchars($observacoes));
                    echo '</div>';
                }
            }
            echo '</div>';
            
            // Status
            echo '<div class="col-md-3 col-sm-6 text-center">';
            if ($nao_se_aplica == 1) {
                echo $statusHtml['nao_se_aplica'];
            } else if (!empty($status) && isset($statusHtml[$status])) {
                echo $statusHtml[$status];
            } else {
                echo $statusHtml['pendente'];
            }
            echo '</div>';
            
            // Botões de ação
            echo '<div class="col-md-3 col-sm-6 text-center">';
            $nome_item_js = addslashes($nome_item);
            if ($diagnostico_id) {
                echo '<button class="btn btn-warning btn-sm" onclick="openEvaluationModal(' . $id . ', \'' . $nome_item_js . '\', ' . $setorId . ', ' . $periodo . ', ' . $unidade . ', ' . $setorId . ', ' . $diagnostico_id . ', ' . $subsetorId . ')">';
                echo '<i class="fas fa-edit me-1"></i> Editar</button>';
            } else {
                echo '<button class="btn btn-primary btn-sm" onclick="openEvaluationModal(' . $id . ', \'' . $nome_item_js . '\', ' . $setorId . ', ' . $periodo . ', ' . $unidade . ', ' . $setorId . ', null, ' . $subsetorId . ')">';
                echo '<i class="fas fa-clipboard-check me-1"></i> Avaliar</button>';
            }
            echo '</div>';
            echo '</div>'; // Fim da row
        }
        
    } catch (PDOException $e) {
        error_log('Erro na função fetchItems: ' . $e->getMessage());
        echo '<div class="alert alert-danger">Erro ao buscar itens: ' . $e->getMessage() . '</div>';
    }
}

/**
 * Obtém APENAS itens da tabela diagnostico para períodos congelados
 * @param PDO $conn Conexão com o banco de dados
 */
function getDiagnosticoFrozen($conn) {
    header('Content-Type: application/json; charset=utf-8');
    
    $setor_id = isset($_GET['setor_id']) ? intval($_GET['setor_id']) : 0;
    $unidade_id = isset($_GET['unidade_id']) ? intval($_GET['unidade_id']) : 0;
    $periodo_id = isset($_GET['periodo_id']) ? intval($_GET['periodo_id']) : 0;
    $subsetor_id = isset($_GET['subsetor_id']) ? intval($_GET['subsetor_id']) : null;
    
    if (!$setor_id || !$periodo_id) {
        echo json_encode(['error' => 'Parâmetros inválidos']);
        exit;
    }
    try {
        // Verificar se o período realmente está congelado (medida de segurança)
        $checkFrozenSql = "SELECT is_frozen FROM periodo_diagnostico WHERE id = ? AND deletado = 0";
        $checkFrozenStmt = $conn->prepare($checkFrozenSql);
        $checkFrozenStmt->execute([$periodo_id]);
        $isFrozen = (bool)$checkFrozenStmt->fetchColumn();
        if (!$isFrozen) {
            error_log("ALERTA: Tentativa de usar rota exclusiva para um período não congelado!");
        }
        
        // Independente do status de congelamento, usar APENAS a tabela diagnostico
        $sql = "
            SELECT 
                d.id, 
                d.item,
                d.avaliacao_resultado AS status,
                d.nao_se_aplica AS nao_aplica,
                d.id AS diagnostico_id,
                d.observacoes,
                d.estado_avaliacao,
                d.setor_id,
                d.subsetor_id
            FROM diagnostico d
            WHERE 
                d.setor_id = ? AND 
                d.unidade_id = ? AND
                d.id_periodo_diagnostico = ? AND
                d.deletado = 0
        ";
        
        // Add subsector filter if provided
        $params = [$setor_id, $unidade_id, $periodo_id];
        if ($subsetor_id) {
            $sql .= " AND d.subsetor_id = ?";
            $params[] = $subsetor_id;
        }
        
        // Add ordering
        $sql .= " ORDER BY d.item ASC";
        
        $stmt = $conn->prepare($sql);
        $stmt->execute($params);
        $itens = $stmt->fetchAll(PDO::FETCH_ASSOC);
        
        // Depuração
        $logMessage = "Rota exclusiva: Total de itens diagnóstico encontrados: " . count($itens);
        if ($subsetor_id) {
            $logMessage .= " (para subsetor ID: $subsetor_id)";
        }
        error_log($logMessage);
        
        // Formatar para uso com Tabulator
        $resultado = [];
        foreach ($itens as $item) {
            // Converter alguns campos numéricos
            $item['id'] = intval($item['id']);
            $item['nao_aplica'] = intval($item['nao_aplica'] ?? 0);
            $item['diagnostico_id'] = $item['id']; // Para períodos congelados, o ID é o próprio ID do diagnóstico
            
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
            
            // Adicionar informação sobre congelamento do período (para uso do JS)
            $item['periodo_frozen'] = true;
            
            $resultado[] = $item;
        }
        
        echo json_encode($resultado);
    } catch (PDOException $e) {
        error_log("ERRO ao buscar diagnósticos: " . $e->getMessage());
        echo json_encode(['error' => 'Erro ao buscar diagnósticos: ' . $e->getMessage()]);
    }
}

/**
 * Endpoint dedicado para sincronização de itens - função movida de sync_items.php
 * Pode ser chamada diretamente via AJAX
 * @param PDO $conn Conexão com o banco de dados
 */
function syncItems($conn) {
    // Definir cabeçalho JSON
    header('Content-Type: application/json; charset=utf-8');
    
    try {
        // Obter parâmetros
        $periodoId = isset($_POST['periodo_id']) ? intval($_POST['periodo_id']) : 0;
        $unidadeId = isset($_POST['unidade_id']) ? intval($_POST['unidade_id']) : 0;
        
        // Log detalhado para depuração
        error_log("Iniciando syncItems: periodoId=$periodoId, unidadeId=$unidadeId");
        
        // Validação básica
        if (!$periodoId || !$unidadeId) {
            echo json_encode([
                'success' => false, 
                'message' => 'Parâmetros inválidos: período ou unidade não especificados'
            ]);
            exit;
        }
        
        // Obter ID do usuário para auditoria
        $usuarioId = getUsuarioId();
        error_log("Usuário para sincronização: $usuarioId");
        
        // Verificar período
        $sqlCheck = "SELECT id, id_unidade, is_frozen FROM periodo_diagnostico WHERE id = ? AND deletado = 0";
        $stmtCheck = $conn->prepare($sqlCheck);
        $stmtCheck->execute([$periodoId]);
        $periodo = $stmtCheck->fetch(PDO::FETCH_ASSOC);
        if (!$periodo) {
            echo json_encode([
                'success' => false, 
                'message' => 'Período não encontrado'
            ]);
            exit;
        }
        
        // Verificar unidade
        if ($periodo['id_unidade'] != $unidadeId) {
            echo json_encode([
                'success' => false, 
                'message' => 'A unidade não corresponde ao período'
            ]);
            exit;
        }
        
        // Realizar sincronização com controle de transação
        try {
            // Iniciar transação
            $conn->beginTransaction();
            
            // MELHORIA 1: Garantir que todos os setores da unidade sejam incluídos,
            // mesmo que não estejam ainda no diagnóstico
            $sqlSetores = "SELECT id FROM setor_diagnostico WHERE unidade_id = ? AND deletado = 0";
            $stmtSetores = $conn->prepare($sqlSetores);
            $stmtSetores->execute([$unidadeId]);
            $setores = $stmtSetores->fetchAll(PDO::FETCH_COLUMN);
            error_log("Setores encontrados para sincronização: " . implode(", ", $setores));
            
            // MELHORIA 2: Primeiro, marcar o período como não congelado temporariamente
            // para permitir a sincronização completa
            $originalFrozenState = $periodo['is_frozen'];
            if ($originalFrozenState) {
                $sqlUnfreeze = "UPDATE periodo_diagnostico SET is_frozen = 0, 
                               atualizado_em = NOW(), atualizado_por = ? 
                               WHERE id = ?";
                $stmtUnfreeze = $conn->prepare($sqlUnfreeze);
                $stmtUnfreeze->execute([$usuarioId, $periodoId]);
                error_log("Período temporariamente descongelado para sincronização");
            }
            
            // MELHORIA 3: Sincronizar itens com força total e gerenciar transação externa
            $resultado = sincronizarItensPeriodo($conn, $periodoId, $unidadeId, $usuarioId, true, false);
            
            // MELHORIA 4: Restaurar o estado original de congelamento, mas agora marcando
            // como congelado mesmo que não fosse antes (comportamento esperado após sincronização forçada)
            $sqlRefreeze = "UPDATE periodo_diagnostico SET is_frozen = 1, 
                           atualizado_em = NOW(), atualizado_por = ? 
                           WHERE id = ?";
            $stmtRefreeze = $conn->prepare($sqlRefreeze);
            $stmtRefreeze->execute([$usuarioId, $periodoId]);
            error_log("Período recongelado após sincronização");
            
            // MELHORIA 5: Verificar se há setores ou itens zero e forçar uma verificação adicional
            if ($resultado['itens_inseridos'] == 0 && $resultado['itens_atualizados'] == 0) {
                error_log("ATENÇÃO: Nenhum item inserido ou atualizado. Fazendo verificação adicional...");
                // Verificação adicional: Verificar se há itens não sincronizados
                $sqlVerificar = "SELECT COUNT(*) FROM items_diagnostico i 
                                WHERE i.unidade_id = ? AND i.deletado = 0
                                AND NOT EXISTS (
                                    SELECT 1 FROM diagnostico d 
                                    WHERE d.id_periodo_diagnostico = ? 
                                    AND d.unidade_id = i.unidade_id 
                                    AND d.setor_id = i.setor_id 
                                    AND d.item_hash = MD5(LOWER(TRIM(i.nome_item)))
                                    AND d.deletado = 0
                                )";
                $stmtVerificar = $conn->prepare($sqlVerificar);
                $stmtVerificar->execute([$unidadeId, $periodoId]);
                $itensFaltantes = $stmtVerificar->fetchColumn();
                
                if ($itensFaltantes > 0) {
                    error_log("Encontrados $itensFaltantes itens não sincronizados. Forçando nova sincronização...");
                    // Forçar sincronização item a item
                    $sqlItemsFaltantes = "SELECT i.id, i.nome_item, i.setor_id 
                                         FROM items_diagnostico i 
                                         WHERE i.unidade_id = ? AND i.deletado = 0
                                         AND NOT EXISTS (
                                             SELECT 1 FROM diagnostico d 
                                             WHERE d.id_periodo_diagnostico = ? 
                                             AND d.unidade_id = i.unidade_id 
                                             AND d.setor_id = i.setor_id 
                                             AND d.item_hash = MD5(LOWER(TRIM(i.nome_item)))
                                             AND d.deletado = 0
                                         )";
                    $stmtItemsFaltantes = $conn->prepare($sqlItemsFaltantes);
                    $stmtItemsFaltantes->execute([$unidadeId, $periodoId]);
                    $itensFaltantesList = $stmtItemsFaltantes->fetchAll(PDO::FETCH_ASSOC);
                    
                    $itensInseridos = 0;
                    foreach ($itensFaltantesList as $item) {
                        // Inserir item diretamente
                        $sqlInsert = "INSERT INTO diagnostico (
                                    unidade_id, id_periodo_diagnostico, item, item_hash,
                                    setor_id, avaliacao_resultado, nao_se_aplica, estado_avaliacao, 
                                    criado_em, criado_por
                                ) VALUES (
                                    ?, ?, ?, MD5(LOWER(TRIM(?))),
                                    ?, NULL, 0, 'nao_avaliado',
                                    NOW(), ?
                                )";
                        $stmtInsert = $conn->prepare($sqlInsert);
                        try {
                            $stmtInsert->execute([
                                $unidadeId, 
                                $periodoId, 
                                $item['nome_item'], 
                                $item['nome_item'], 
                                $item['setor_id'], 
                                $usuarioId
                            ]);
                            $itensInseridos++;
                        } catch (PDOException $e) {
                            error_log("Erro ao inserir item individual: " . $e->getMessage());
                            // Continuar mesmo com erro
                        }
                    }
                    // Atualizar resultado
                    $resultado['itens_inseridos'] += $itensInseridos;
                    error_log("Segunda sincronização: $itensInseridos itens inseridos");
                }
            }
            
            // Confirmar transação
            $conn->commit();
            error_log("Transação confirmada");
            
            // Atualizar todos os caches de progresso para todos os setores
            foreach ($setores as $setorId) {
                try {
                    atualizarProgressoCache($conn, $setorId, $periodoId, $unidadeId, $usuarioId);
                } catch (Exception $e) {
                    error_log("Erro ao atualizar cache para setor $setorId: " . $e->getMessage());
                    // Não interromper fluxo por erro no cache
                }
            }
            
            // Retornar resultado
            echo json_encode([
                'success' => true,
                'message' => 'Sincronização concluída com sucesso!',
                'data' => [
                    'itens_inseridos' => $resultado['itens_inseridos'] ?? 0,
                    'itens_atualizados' => $resultado['itens_atualizados'] ?? 0,
                    'setores_sincronizados' => $resultado['setores_sincronizados'] ?? 0,
                    'new_sync_items' => true // Flag para indicar nova implementação
                ]
            ]);
        } catch (Exception $e) {
            // Reverter transação em caso de erro
            if ($conn->inTransaction()) {
                $conn->rollBack();
                error_log("Transação revertida devido a erro");
            }
            echo json_encode([
                'success' => false,
                'message' => 'Erro ao sincronizar itens: ' . $e->getMessage(),
                'error_details' => $e->getTraceAsString()
            ]);
        }
    } catch (Exception $e) {
        // Capturar qualquer erro não tratado
        echo json_encode([
            'success' => false,
            'message' => 'Erro geral na sincronização: ' . $e->getMessage(),
            'error_details' => $e->getTraceAsString()
        ]);
    }
    exit;
}

/**
 * Obter items formatados para o Tabulator - Adaptado para nova estrutura
 * @param PDO $conn Conexão com o banco de dados
 */
function getItensTabulatorFormat($conn) {
    // Limpar buffer
    while (ob_get_level()) {
        ob_end_clean();
    }
    
    try {
        // Cabeçalhos
        header('Content-Type: application/json; charset=utf-8');
        header('Cache-Control: no-cache, no-store, must-revalidate');
        
        // Obter parâmetros
        $setor_id = isset($_GET['setor_id']) ? intval($_GET['setor_id']) : 0;
        $unidade_id = isset($_GET['unidade_id']) ? intval($_GET['unidade_id']) : 0;
        $periodo_id = isset($_GET['periodo_id']) ? intval($_GET['periodo_id']) : 0;
        $subsetor_id = isset($_GET['subsetor_id']) && $_GET['subsetor_id'] !== '' ? intval($_GET['subsetor_id']) : null;
        
        // Log de parâmetros
        error_log("getItensTabulatorFormat - Params: setor_id=$setor_id, unidade_id=$unidade_id, periodo_id=$periodo_id, subsetor_id=" . 
                  ($subsetor_id !== null ? $subsetor_id : "NULL"));
        
        // Validar parâmetros
        if (!$setor_id || !$periodo_id || !$unidade_id) {
            echo json_encode([
                'error' => 'Parâmetros obrigatórios não fornecidos',
                'params_received' => [
                    'setor_id' => $setor_id, 
                    'unidade_id' => $unidade_id, 
                    'periodo_id' => $periodo_id, 
                    'subsetor_id' => $subsetor_id
                ]
            ]);
            exit;
        }
        
        // Verificar se o período está congelado
        $isFrozen = false;
        try {
            $sqlFrozen = "SELECT is_frozen FROM periodo_diagnostico WHERE id = ? LIMIT 1";
            $stmtFrozen = $conn->prepare($sqlFrozen);
            $stmtFrozen->execute([$periodo_id]);
            $isFrozen = (bool)$stmtFrozen->fetchColumn();
            error_log("Status de congelamento do período $periodo_id: " . ($isFrozen ? "CONGELADO" : "NÃO CONGELADO"));
        } catch (PDOException $e) {
            error_log("Erro ao verificar congelamento: " . $e->getMessage());
        }
        
        // Consulta para períodos congelados ou quando especificado
        if ($isFrozen || isset($_GET['force_diagnostico']) || isset($_GET['debug'])) {
            $sql = "
                SELECT 
                    d.id, 
                    d.item,
                    COALESCE(d.avaliacao_resultado, '') AS status,
                    COALESCE(d.nao_se_aplica, 0) AS nao_aplica,
                    d.id AS diagnostico_id,
                    COALESCE(d.observacoes, '') AS observacoes,
                    COALESCE(d.estado_avaliacao, 'nao_avaliado') AS estado_avaliacao,
                    d.setor_id,
                    d.subsetor_id
                FROM diagnostico d
                INNER JOIN subsetores ss ON d.subsetor_id = ss.id
                WHERE 
                    ss.setor_id = ? AND 
                    d.unidade_id = ? AND
                    d.id_periodo_diagnostico = ? AND
                    d.deletado = 0
            ";
            
            $params = [$setor_id, $unidade_id, $periodo_id];
            
            // Adicionar filtro de subsetor se fornecido
            if ($subsetor_id !== null) {
                $sql .= " AND d.subsetor_id = ?";
                $params[] = $subsetor_id;
            }
            
            // Adicionar ordenação
            $sql .= " ORDER BY d.item ASC";
            
            $stmt = $conn->prepare($sql);
            $stmt->execute($params);
            
            // Log da consulta para depuração
            error_log("Consulta direta em diagnostico para período congelado - SQL: " . str_replace("\n", " ", $sql));
            error_log("Parâmetros da consulta: " . implode(", ", $params));
            
        } else {
            // Consulta normal com join entre items_diagnostico e diagnostico para períodos não congelados
            $sql = "
                SELECT 
                    i.id, 
                    i.nome_item AS item,
                    COALESCE(d.avaliacao_resultado, '') AS status,
                    COALESCE(d.nao_se_aplica, 0) AS nao_aplica,
                    d.id AS diagnostico_id,
                    COALESCE(d.observacoes, '') AS observacoes,
                    COALESCE(d.estado_avaliacao, 'nao_avaliado') AS estado_avaliacao,
                    ss.setor_id,
                    i.subsetor_id
                FROM items_diagnostico i 
                INNER JOIN subsetores ss ON i.subsetor_id = ss.id
                LEFT JOIN diagnostico d ON 
                    d.item_hash = MD5(LOWER(TRIM(i.nome_item))) AND 
                    d.unidade_id = ? AND 
                    d.id_periodo_diagnostico = ? AND
                    d.subsetor_id = i.subsetor_id
                WHERE 
                    ss.setor_id = ? AND
                    i.deletado = 0
            ";
            
            $params = [$unidade_id, $periodo_id, $setor_id];
            
            // Adicionar filtro de subsetor se fornecido
            if ($subsetor_id !== null) {
                $sql .= " AND i.subsetor_id = ?";
                $params[] = $subsetor_id;
            }
            
            // Adicionar ordenação
            $sql .= " ORDER BY i.nome_item ASC";
            
            $stmt = $conn->prepare($sql);
            $stmt->execute($params);
            
            // Log da consulta para depuração
            error_log("Consulta normal com join - SQL: " . str_replace("\n", " ", $sql));
            error_log("Parâmetros da consulta: " . implode(", ", $params));
        }
        
        // Buscar todos os itens
        $itens = $stmt->fetchAll(PDO::FETCH_ASSOC);
        
        // Log da contagem de resultados
        error_log("Consulta retornou " . count($itens) . " itens");
        
        // Retornar array vazio se não encontrar itens
        if (empty($itens)) {
            error_log("Nenhum item encontrado para os critérios especificados");
            echo json_encode([]);
            exit;
        }
        
        // Formatar para Tabulator
        $resultado = [];
        foreach ($itens as $item) {
            // Converter campos numéricos
            $item['id'] = intval($item['id']);
            $item['nao_aplica'] = intval($item['nao_aplica'] ?? 0);
            $item['diagnostico_id'] = !empty($item['diagnostico_id']) ? intval($item['diagnostico_id']) : null;
            $item['subsetor_id'] = !empty($item['subsetor_id']) ? intval($item['subsetor_id']) : null;
            $item['setor_id'] = !empty($item['setor_id']) ? intval($item['setor_id']) : null;
            
            // Adicionar informações de exibição baseadas no status
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
        
        // Retornar JSON
        echo json_encode($resultado);
        
    } catch (PDOException $e) {
        error_log("Erro PDO em getItensTabulatorFormat: " . $e->getMessage());
        echo json_encode(['error' => 'Erro de banco de dados: ' . $e->getMessage()]);
    } catch (Exception $e) {
        error_log("Erro geral em getItensTabulatorFormat: " . $e->getMessage());
        echo json_encode(['error' => 'Erro da aplicação: ' . $e->getMessage()]);
    }
    exit;
}

/**
 * Atualiza o cache de progresso para um setor - Adaptada para nova estrutura
 * @param PDO $conn Conexão com o banco de dados
 * @param int $setorId ID do setor
 * @param int $periodoId ID do período
 * @param int $unidadeId ID da unidade
 * @param int $usuarioId ID do usuário que está realizando a operação
 * @return bool Sucesso da operação
 */
function atualizarProgressoCache($conn, $setorId, $periodoId, $unidadeId, $usuarioId) {
    try {
        // Log para debug
        error_log("Atualizando cache de progresso - Setor: $setorId, Período: $periodoId, Unidade: $unidadeId");
        
        // Calcular as estatísticas baseadas na nova estrutura hierárquica
        $sql = "SELECT 
                COUNT(*) as total,
                SUM(CASE WHEN estado_avaliacao = 'avaliado' THEN 1 ELSE 0 END) as avaliados,
                SUM(CASE WHEN estado_avaliacao = 'em_avaliacao' THEN 1 ELSE 0 END) as em_avaliacao,
                SUM(CASE WHEN avaliacao_resultado = 'conforme' THEN 1 ELSE 0 END) as conformes,
                SUM(CASE WHEN avaliacao_resultado = 'nao_conforme' THEN 1 ELSE 0 END) as nao_conformes,
                SUM(CASE WHEN avaliacao_resultado = 'parcialmente_conforme' THEN 1 ELSE 0 END) as parcialmente_conformes,
                SUM(CASE WHEN nao_se_aplica = 1 THEN 1 ELSE 0 END) as nao_se_aplica
               FROM diagnostico d
               INNER JOIN subsetores ss ON d.subsetor_id = ss.id 
               WHERE ss.setor_id = ? 
               AND d.id_periodo_diagnostico = ? 
               AND d.unidade_id = ?
               AND d.deletado = 0";
        
        $stmt = $conn->prepare($sql);
        $stmt->execute([$setorId, $periodoId, $unidadeId]);
        $stats = $stmt->fetch(PDO::FETCH_ASSOC);
        
        // Adicionar campos calculados
        $stats['pendentes'] = $stats['total'] - $stats['avaliados'] - $stats['em_avaliacao'];
        $stats['percentual_progresso'] = ($stats['total'] > 0) ? 
            round(($stats['avaliados'] / $stats['total']) * 100) : 0;
            
        // Garantir que todos os valores sejam numéricos para evitar erros de JSON
        foreach ($stats as $key => $value) {
            $stats[$key] = is_numeric($value) ? intval($value) : 0;
        }
        
        // Converter para JSON (com tratamento de erro)
        $jsonStats = json_encode($stats);
        if ($jsonStats === false) {
            throw new Exception("Erro ao codificar JSON: " . json_last_error_msg());
        }
        
        // Atualizar o cache em todos os registros de diagnóstico para este setor/período
        $updateSql = "UPDATE diagnostico d
                     INNER JOIN subsetores ss ON d.subsetor_id = ss.id
                     SET d.progresso_cache = ?, 
                         d.progresso_atualizado_em = NOW(),
                         d.atualizado_em = NOW(),
                         d.atualizado_por = ?
                     WHERE ss.setor_id = ? 
                     AND d.id_periodo_diagnostico = ? 
                     AND d.unidade_id = ?
                     AND d.deletado = 0";
        
        $updateStmt = $conn->prepare($updateSql);
        $result = $updateStmt->execute([$jsonStats, $usuarioId, $setorId, $periodoId, $unidadeId]);
        
        $rowCount = $updateStmt->rowCount();
        error_log("Cache de progresso atualizado para $rowCount registros");
        
        // Se não houver registros atualizados, talvez não haja diagnósticos para este setor
        if ($rowCount === 0) {
            error_log("AVISO: Nenhum registro atualizado no cache de progresso!");
        }
        
        return $result;
    } catch (Exception $e) {
        error_log("ERRO ao atualizar cache de progresso: " . $e->getMessage());
        return false;
    }
}



/**
 * Obtém os setores e subsetores para uma unidade
 * @param PDO $conn Conexão com o banco de dados
 */
function getSetoresWithSubsectors($conn) {
    // Limpar qualquer buffer de saída
    while (ob_get_level()) {
        ob_end_clean();
    }
    
    $unidadeId = isset($_GET['unidade_id']) ? intval($_GET['unidade_id']) : 0;
    
    if (!$unidadeId) {
        jsonError('ID da unidade é obrigatório');
    }
    
    try {
        // Nova consulta que usa as tabelas unidade_setores, setores e subsetores
        $sql = "SELECT DISTINCT 
                s.id as id, 
                s.nome as nome,
                ss.id as subsetor_id,
                ss.nome as subsetor_nome 
                FROM unidade_setores us
                INNER JOIN setores s ON us.setor = s.nome
                LEFT JOIN subsetores ss ON ss.setor_id = s.id
                WHERE us.unidade_id = ? 
                AND s.deletado = 0 
                AND (ss.deletado = 0 OR ss.deletado IS NULL)
                AND us.deletado = 0
                ORDER BY s.nome, ss.nome";
        
        $stmt = $conn->prepare($sql);
        $stmt->execute([$unidadeId]);
        
        // Agrupar resultados por setor
        $setores = [];
        while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
            if (!isset($setores[$row['id']])) {
                $setores[$row['id']] = [
                    'id' => $row['id'],
                    'nome' => $row['nome'],
                    'subsetores' => []
                ];
            }
            
            if ($row['subsetor_id']) {
                $setores[$row['id']]['subsetores'][] = [
                    'id' => $row['subsetor_id'],
                    'nome' => $row['subsetor_nome']
                ];
            }
        }
        
        // Converter para array indexado
        $setores = array_values($setores);
        
        jsonResponse(['success' => true, 'setores' => $setores]);
    } catch (PDOException $e) {
        error_log("Erro de banco de dados em getSetoresWithSubsectors: " . $e->getMessage());
        jsonError('Erro de banco de dados: ' . $e->getMessage());
    }
}
?>