<?php
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| contains the "web" middleware group. Now create something great!
|
*/

$mod = ucfirst(get_option('pagenow'));
$act = ucfirst(get_option('typenow'));
$nsp = sprintf('App\Modules\%s\Controllers', $mod);
Route::group(['namespace' => $nsp], function() use($mod, $act, $nsp) {
    if(file_exists(str_replace('\\', DS, $nsp.DS.$act.'Controller'.EXT))) {
        Route::get(WS_ADMIN, ['uses' => $act.'Controller@index']);
        Route::post(WS_ADMIN, ['uses' => $act.'Controller@index']);
    }
    else {
        if($mod !== $act) {
            $param = array_diff_key($_GET, ['act' => true]);
            ws_redirect(admin_url(http_build_query($param)));
        }
        Route::get(WS_ADMIN, function() {return view('404');});
    }
});