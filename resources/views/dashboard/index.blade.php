@extends('layouts.admin')

@section('title', 'Dashboard')

@section('breadcrumb')
    <li class="breadcrumb-item active">Dashboard</li>
@endsection

@section('content')
    <!-- Statistics Cards -->
    @include('dashboard.partials.statistics-cards')

    <!-- Chart Row -->
    <div class="row">
        <div class="col-lg-8">
            @include('dashboard.partials.diagnostics-chart')
        </div>
        
        <div class="col-lg-4">
            @include('dashboard.partials.quick-actions')
        </div>
    </div>

    <!-- Data Tables Row -->
    <div class="row">
        <div class="col-lg-8">
            @include('dashboard.partials.recent-diagnostics-table')
        </div>
        
        <div class="col-lg-4">
            @include('dashboard.partials.recent-activities')
            @include('dashboard.partials.system-status')
        </div>
    </div>
@endsection