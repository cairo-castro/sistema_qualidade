<?php

use Illuminate\Support\Facades\Route;
use Modules\DiagnosticoHospitalar\Http\Controllers\DiagnosticoHospitalarController;

Route::middleware(['auth:sanctum'])->prefix('v1')->group(function () {
    Route::apiResource('diagnosticohospitalars', DiagnosticoHospitalarController::class)->names('diagnosticohospitalar');
});
