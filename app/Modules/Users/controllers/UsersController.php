<?php
namespace App\Modules\Users\controllers;

use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use App\Modules\Users\models\Users;

class UsersController extends Controller
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
        get_template_part('Users::users.manage', [
            'ok' => 1
        ]);
    }
}