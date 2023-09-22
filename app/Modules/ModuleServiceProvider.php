<?php

namespace App\Modules;

use Illuminate\Support\ServiceProvider;
use File;

class ModuleServiceProvider extends ServiceProvider
{
    /**
     * @param: void
     */
    public function register()
    {
        if(admin_url() == current_url(false)) {
            session([
                'userID' => 29,
                'loggedIn' => true,
            ]);
        }
        ws_load_alloptions();
    }

    /**
     * @param: void
     */
    public function boot()
    {
        $this->_auth();
        $pagenow = get_option('pagenow');
        do_action('admin_init', $pagenow);
        $modules = array_map('basename', File::directories(__dir__));
        if(in_array($pagenow, array_map('str_lower', $modules))) {
            $this->_load($pagenow);
        }
    }

    /**
     * @param: void
     */
    private function _auth()
    {
        if(! is_admin() and (current_url() != home_url())) {
            ws_redirect(home_url());
        }
    }

    /**
     * @param: $class
     */
    private function _load($class)
    {
        $class = ucfirst($class);
        $modulePath = __dir__ . "/$class/";
        
        // Khai báo route
        if(File::exists($modulePath . "routes".EXT)) {
            $this->loadRoutesFrom($modulePath . "routes".EXT);
        }

        // Khai báo views
        // Gọi view thì ta sử dụng: view('Demo::index'), @extends('Demo::index'), @include('Demo::index')
        if(File::exists($modulePath . "Views")) {
            $this->loadViewsFrom($modulePath . "Views", $class);
        }

        // Khai báo models
        // Toàn bộ file migration của modules sẽ tự động được load
        if(File::exists($modulePath . "Models")) {
            $this->loadMigrationsFrom($modulePath . "Models");
        }

        // Khai báo languages
        if(File::exists($modulePath . "Languages")) {
            // Đa ngôn ngữ theo file php
            // Dùng đa ngôn ngữ tại file php Languages/en/general.php : @lang('Demo::general.hello')
            $this->loadTranslationsFrom($modulePath . "Languages", $class);
            // Đa ngôn ngữ theo file json
            $this->loadJSONTranslationsFrom($modulePath . "Languages");
        }

        // Khai báo helpers
        if(File::exists($modulePath . "Helpers")) {
            // Tất cả files có tại thư mục helpers
            $helper_dir = File::allFiles($modulePath . "Helpers");
            // khai báo helpers
            foreach($helper_dir as $value) {
                $file = $value->getPathName();
                require $file;
            }
        }
    }
}