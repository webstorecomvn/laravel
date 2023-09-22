<?php
namespace App\Modules\Posts\Controllers;

use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use App\Modules\Posts\models\Posts;

class PostsController extends Controller
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
        get_template_part('Posts::posts.manage', [
            'ok' => 1
        ]);
    }
}