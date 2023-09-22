<?php

namespace App\Modules\Dashboard\Helpers;

use App\Http\Controllers\Webstore;

class DashboardHelper extends Webstore
{
    /**
     * @param: void
     */
    public function __construct()
    {
        parent::__construct();
        add_action('admin_enqueue_scripts', array($this, 'admin_scripts'));
        add_action(WS_PREFIX.'_ajax_chartHits', array($this, 'ajax_chartHits'));
    }

    /**
     * @param: void
     */
    public function admin_scripts()
    {
        $admin_color = get_user_meta($this->userid, 'admin_color', true);
        
        // ws_enqueue_style
        ws_enqueue_style('font-awesome', assets_url('fonts/font-awesome/css/font-awesome.min.css'));
        ws_enqueue_style('bootstrap', assets_url('js/bootstrap/css/bootstrap.min.css'));
        ws_enqueue_style('fancybox', assets_url('js/fancybox/fancybox.css'));
        ws_enqueue_style('global', assets_url('css/global.css'));
        ws_enqueue_style('skin', assets_url('css/skins/skin-'.$admin_color.'.min.css'));
        ws_enqueue_style('style', assets_url('css/style.css'));
        
        // ws_enqueue_script
        ws_enqueue_script('jquery', assets_url('js/jquery.min.js'));
        ws_enqueue_script('slimscroll', assets_url('js/slimscroll/jquery.slimscroll.js'));
        ws_enqueue_script('bootstrap', assets_url('js/bootstrap/js/bootstrap.min.js'));
        ws_enqueue_script('jquery-ui', assets_url('js/jquery-ui/jquery-ui.js'));
        ws_enqueue_script('chart', assets_url('js/chart/Chart.bundle.min.js'));
        ws_enqueue_script('fancybox', assets_url('js/fancybox/fancybox.js'));
        ws_enqueue_script('core', assets_url('js/core.min.js'));
        ws_enqueue_script('app', assets_url('js/app.min.js'));
        ws_enqueue_script('script', assets_url('js/script.js'));
    }

    /**
     * @param: void
     */
    public function ajax_chartHits()
    {
        $labels = [];
        $visits = [];
		$visitors = [];
		$days = request('days', 28);
		for($i = $days; $i >= 0; $i--) {
            $labels[] = date('d/m', strtotime("-{$i} day"));
            $where = ['last_counter' => date('Y-m-d', strtotime("-{$i} day"))];
            $visitors[] = ws_count_data('statistics_visitor', ['where' => $where]);
            $visit = ws_get_data('statistics_visit', ['fields' => 'visit', 'where' => $where]);
            $visits[] = isset($visit->visit) ? $visit->visit : 0;
		}
		
        ws_json([
			'success' => true,
			'results' => array(
                'data' => array(
                    'labels' => $labels,
                    'datasets' => array([
                        'data' => $visitors,
                        'borderWidth' => 1,
                        'borderColor' => 'rgba(0,156,226,1)',
                        'backgroundColor' => 'rgba(0,156,226,0.3)',
                        'label' => self::trans('chartVisitorsLabel'),
                    ], [
                        'data' => $visits,
                        'borderWidth' => 1,
                        'borderColor' => 'rgba(255,111,3,1)',
                        'backgroundColor' => 'rgba(255,111,3,0.3)',
                        'label' => self::trans('chartVisitsLabel'),
                    ]),
                ),
                'options' => array(
                    'title' => [
                        'text' => sprintf(self::trans('chartOptionsTitleText'), $days)
                    ],
                    'scales' => array(
                        'xAxes' => array([
                            'scaleLabel' => array(
                                'display' => true,
                                'labelString' => self::trans('chartOptionsScalesXAxesScaleLabelLabelString'),
                            )
                            ]),
                        'yAxes' => array([
                            'stacked' => true,
                            'scaleLabel' => array(
                                'display' => true,
                                'labelString' => self::trans('chartOptionsScalesYAxesScaleLabelLabelString'),
                            )
                        ])
                    )
                )
            )
		]);
    }
}
new DashboardHelper;