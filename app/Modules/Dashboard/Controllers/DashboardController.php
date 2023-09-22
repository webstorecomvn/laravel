<?php

namespace App\Modules\Dashboard\Controllers;

use App\Http\Controllers\Webstore;
use App\Modules\Dashboard\Models\Dashboard;

class DashboardController extends Webstore
{
    /**
     * @param: void
     */
    public function __construct()
    {
        parent::__construct();
    }

    /**
     * @param: void
     */
    public function index()
    {
        $method = 'do'.ucfirst($this->method);
        if(false == method_exists($this, $method)) {
            ws_redirect($this->referer);
        }
        $this->$method();
    }

    /**
     * @param: void
     */
    public function doManage()
    {
        // admin_title_tag
        add_filter('admin_title_tag', function(){
            return $this->trans($this->module);
        });

        // admin_menu_active
        add_filter('admin_menu_active', function(){
            return sprintf('%s::%s::%s', $this->module, $this->action, $this->method);
        });

        // admin_enqueue_scripts
        add_action('admin_enqueue_scripts', function(){
            ws_enqueue_script($this->module, $this->assets('js'.DS.$this->module.'.js'));
            ws_enqueue_style($this->module, $this->assets('css'.DS.$this->module.'.css'));
        });

        // Load data in view
        $this->output($this->action.'::'.$this->method, [
            'boxcounts' => Dashboard::boxCounts(),
            'visitors' => Dashboard::visitors(10),
            'adminlogs' => Dashboard::adminLogs(10)
        ]);
    }
}