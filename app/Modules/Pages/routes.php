<?php
Route::group(['module' => 'Dashboard', 'namespace' => 'App\Modules\Dashboard\Controllers'], function() {
    Route::get('/admin?mod=dashboard', [
        # middle here
        'as' => 'index',
        'uses' => 'DashboardController@index'
    ]);
});