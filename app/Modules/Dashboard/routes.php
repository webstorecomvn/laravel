<?php

Route::group(['namespace' => 'App\Modules\\'.ucfirst(get_option('pagenow')).'\Controllers'], function() {
    Route::get(DS, function() {
        return view('index');
    });
});