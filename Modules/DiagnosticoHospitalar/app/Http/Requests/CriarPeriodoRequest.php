<?php

namespace Modules\DiagnosticoHospitalar\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class CriarPeriodoRequest extends FormRequest
{
    public function authorize()
    {
        return $this->user()->can('diagnostico.periodo.create');
    }

    public function rules()
    {
        return [
            'id_unidade' => 'required|integer|exists:unidade,id',
            'data_inicio' => 'required|date',
            'data_fim' => 'required|date|after_or_equal:data_inicio',
            'is_frozen' => 'boolean'
        ];
    }

    public function messages()
    {
        return [
            'id_unidade.required' => 'A unidade é obrigatória',
            'id_unidade.exists' => 'A unidade selecionada não existe',
            'data_inicio.required' => 'A data de início é obrigatória',
            'data_inicio.date' => 'A data de início deve ser uma data válida',
            'data_fim.required' => 'A data de fim é obrigatória',
            'data_fim.date' => 'A data de fim deve ser uma data válida',
            'data_fim.after_or_equal' => 'A data de fim deve ser posterior ou igual à data de início'
        ];
    }
}
