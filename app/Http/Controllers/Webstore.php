<?php

namespace App\Http\Controllers;

class Webstore extends Controller
{
    public $user;
    public $userid;
    public $locale;
    public $module;
    public $action;
    public $method;
    public $referer;

    /**
     * @param: void
     */
    public function __construct()
    {
        $this->locale = get_locale();
        $this->user = ws_get_current_user();
        $this->userid = get_current_user_id();
        $this->module = get_option('pagenow');
        $this->action = get_option('typenow');
        $this->method = request('sub', 'manage');
        $this->referer = admin_url($this->module, $this->action);
        
        if($action = request('action')) {
            do_action(WS_PREFIX.'_ajax_'.$action);
        }
    }

    /**
     * @param: string $key
     * @param: string $file
     */
    public function trans($key, $file = '')
    {
        $file = str_empty($file, $this->module);
        $name = sprintf('%s::%s.%s', $this->module, $file, $key);
        return __(ucfirst($name));
    }

    /**
     * @param: string $file
     */
    public function assets($file = '')
    {
        return modules_url($this->module.'/Assets/'.$file);
    }

    /**
     * @param: string $view
     * @param: array|object $data
     */
    public function output($view, $data = [])
    {
        if(! is_array( $data )) {
            $data = to_array($data);
        }
        
        $data = ws_parse_args($data, [
            'user' => $this->user,
            'userid' => $this->userid,
        ]);
        
        $view = str_replace('::', '.', $view);
        $view = sprintf('%s::%s', ucfirst($this->module), $view);

        $view = apply_filters($this->action.'_output_view', $view);
        $data = apply_filters($this->action.'_output_data', $data);

        ws_output($view, $data);
    }
}