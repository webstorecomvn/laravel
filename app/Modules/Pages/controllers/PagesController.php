<?php
namespace App\Modules\Pages\controllers;

use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use App\Modules\Pages\models\Pages;

class PagesController extends Controller
{
    /**
     * Create a new authentication controller instance.
     *
     * @return void
     */
    public function __construct()
    {
        # parent::__construct();
    }

    /**
     * @param: $request
     */
    public function index(Request $request)
    {
        get_template_part('Pages::pages.manage', [
            'ok' => 1
        ]);
    }
}