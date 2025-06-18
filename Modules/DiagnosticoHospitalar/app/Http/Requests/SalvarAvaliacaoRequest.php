<?php

namespace Modules\DiagnosticoHospitalar\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class SalvarAvaliacaoRequest extends FormRequest
{
    public function authorize()
    {
        return $this->user()->can('diagnostico.edit');
    }

    public function rules()
    {
        $rules = [
            'id_periodo_diagnostico' => 'required|integer|exists:periodo_diagnostico,id',
            'item_diagnostico_id' => 'required|integer|exists:items_diagnostico,id',
            'unidade_id' => 'required|integer|exists:unidade,id',
            'setor_id' => 'required|integer|exists:setores,id',
            'subsetor_id' => 'nullable|integer|exists:subsetores,id',
            'item' => 'required|string',
            'nao_se_aplica' => 'nullable|boolean',
            'observacoes' => 'nullable|string'
        ];

        // Se não for "não se aplica", então a avaliação é obrigatória
        if (!$this->nao_se_aplica) {
            $rules['avaliacao_resultado'] = 'required|in:conforme,nao_conforme,parcialmente_conforme';
        }

        // Se for "não conforme", então os problemas são obrigatórios
        if ($this->avaliacao_resultado === 'nao_conforme') {
            $rules['problemas'] = 'required|array|min:1';
            $rules['problemas.*'] = 'required|string|max:255';
        }

        return $rules;
    }

    public function messages()
    {
        return [
            'id_periodo_diagnostico.required' => 'O período é obrigatório',
            'id_periodo_diagnostico.exists' => 'O período selecionado não existe',
            'item_diagnostico_id.required' => 'O item de diagnóstico é obrigatório',
            'item_diagnostico_id.exists' => 'O item de diagnóstico selecionado não existe',
            'avaliacao_resultado.required' => 'O resultado da avaliação é obrigatório',
            'avaliacao_resultado.in' => 'O resultado da avaliação deve ser conforme, não conforme ou parcialmente conforme',
            'problemas.required' => 'Os problemas são obrigatórios para itens não conformes',
            'problemas.min' => 'É necessário informar pelo menos um problema'
        ];
    }
}
