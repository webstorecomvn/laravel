<?php
namespace App\Modules\Dashboard\Models;

use App\Http\Controllers\Webstore;

class Dashboard extends Webstore
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
    public static function boxCounts()
    {
        return [
            to_object([
                'mod' => 'orders',
                'color' => 'red',
                'icon' => 'shopping-cart',
                'count' => ws_count_posts('order_sum'),
            ]),
            to_object([
                'mod' => 'comments',
                'color' => 'yellow',
                'icon' => 'commenting',
                'count' => ws_count_posts('comment'),
            ]),
            to_object([
                'mod' => 'posts',
                'color' => 'aqua',
                'icon' => 'book',
                'count' => ws_count_posts('news'),
            ]),
            to_object([
                'mod' => 'pages',
                'color' => 'green',
                'icon' => 'file-text',
                'count' => ws_count_posts('page'),
            ])
        ];
    }

    /**
     * @param: $limit
     */
    public static function adminLogs($limit = 10)
    {
        return ws_get_results('admin_log', [
            'limit' => $limit,
            'orderby' => 'id asc',
        ]);
    }

    /**
     * @param: $limit
     */
	public static function visitors($limit = 10)
	{
		return ws_get_results('statistics_visitor', [
            'limit' => $limit,
            'key' => 'last_counter',
            'value' => date('Y-m-d'),
            'orderby' => 'hits desc',
        ]);
	}
}