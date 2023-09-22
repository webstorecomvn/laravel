<?php get_header(); ?>
<section id="ws-content" class="ws-content content-wrapper">
    <section class="content-header">
        <?= heading(__('Dashboard::dashboard.dashboard')); ?>
    </section>
    <section class="content">
        <div id="box-welcome" class="box-welcome">
            <span><?= __('Dashboard::dashboard.welcome'); ?> <b><font color="red" size="+1"><?= $user->display_name; ?></font></b></span>
            <?= __('Dashboard::dashboard.lastlogin'); ?><font color="red"><?= get_user_meta($userid, 'lastlogin', true); ?></font>
        </div>
        
        <?php if($boxcounts) : ?>
        <div id="box-count" class="box-count">
            <?php foreach($boxcounts as $box) : ?>
            <div class="small-box bg-<?= $box->color; ?>">
                <div class="inner">
                    <?= heading(str_number($box->count), 3); ?>
                    <?= sprintf('<p>%s</p>', __('Dashboard::dashboard.'.$box->mod)); ?>
                </div>
                <div class="icon">
                    <?= sprintf('<i class="fa fa-%s"></i>', $box->icon); ?>
                </div>
                <a href="<?= admin_url($box->mod); ?>" class="small-box-footer">
                    <span><?= __('Dashboard::dashboard.viewall'); ?></span>
                    <i class="fa fa-arrow-circle-right"></i>
                </a>
            </div>
            <?php endforeach; ?>
        </div>
        <?php endif; ?>

        <div id="box-chart" class="box-chart metabox">
            <div class="handlediv down"></div>
            <?= heading(__('Dashboard::dashboard.statistics'), 3); ?>
            <div class="inside">
                <div class="box">
                    <div class="overlay" style="display: none;">
                        <i class="fa fa-refresh fa-spin"></i>
                    </div>
                    <div class="chart">
                        <canvas id="areaChartHits" style="height: 500px"></canvas>
                    </div>
                </div>
            </div>
        </div>
        
        <?php if($visitors) : ?>
        <div id="box-visitors" class="box-visitors metabox">
            <div class="handlediv down"></div>
            <?= heading(__('Dashboard::dashboard.visitors'), 3); ?>
            <div class="inside no-padding">
                <table class="table-list">
                    <thead>
                        <tr>
                            <th class="manage-column hidden-xs">Thứ tự</th>
                            <th class="manage-column">Lượt</th>
                            <th class="manage-column hidden-xs">Trình duyệt</th>
                            <th class="manage-column">Hệ điều hành</th>
                            <th class="manage-column hidden-xs">Phiên bản</th>
                            <th class="manage-column column-action">Địa chỉ IP</th>
                        </tr>
                    </thead>
                    <tbody id="box_top_visitors">
                        <?php foreach($visitors as $visitor) : dd($visitor); ?>
                        <tr class="row-1 row-item">
                            <td class="manage-column hidden-xs">1</td>
                            <td class="manage-column">687</td>
                            <td class="manage-column hidden-xs">Mozilla</td>
                            <td class="manage-column">Unknown Platform</td>
                            <td class="manage-column hidden-xs">5.0</td>
                            <td class="manage-column ip-address column-action">162.55.85.229</td>
                        </tr>
                        <?php endforeach; ?>
                    </tbody>
                </table>
            </div>
        </div>
        <?php endif; ?>

        <?php if($adminlogs) : ?>
        <div id="box-adminlogs" class="box-adminlogs metabox">
            <div class="handlediv down"></div>
            <?= heading(__('Dashboard::dashboard.adminlogs'), 3); ?>
            <div class="inside no-padding">
                <table class="table-list no-margin">
                    <thead>
                        <tr>
                            <th class="manage-column"><?= __('Dashboard::dashboard.userLoginColumn'); ?></th>
                            <th class="manage-column"><?= __('Dashboard::dashboard.catColumn'); ?></th>
                            <th class="manage-column"><?= __('Dashboard::dashboard.actionColumn'); ?></th>
                            <th class="manage-column"><?= __('Dashboard::dashboard.pidColumn'); ?></th>
                            <th class="manage-column"><?= __('Dashboard::dashboard.timeColumn'); ?></th>
                            <th class="manage-column column-action"><?= __('Dashboard::dashboard.ipColumn'); ?></th>
                        </tr>
                    </thead>
                    <tbody>
                        <?php foreach($adminlogs as $log) : ?>
                        <tr class="row_item">
                            <td class="manage-column text-bold"><?= get_user_meta($log->adminid, 'user_login', true); ?></td>
                            <td class="manage-column"><?= $log->cat; ?></td>
                            <td class="manage-column"><?= $log->action; ?></td>
                            <td class="manage-column"><?= $log->pid; ?></td>
                            <td class="manage-column"><?= date('H:i, d/m/Y', $log->time)?></td>
                            <td class="manage-column column-action last"><?= $log->ip; ?></td>
                        </tr>
                        <?php endforeach; ?>
                    </tbody>
                </table>
            </div>
        </div>
        <?php endif; ?>

        <div id="box-system" class="box-system metabox">
            <div class="handlediv down"></div>
            <?= heading(__('Dashboard::dashboard.system'), 3); ?>
            <div class="inside">
                <strong><i class="fa fa-book margin-r-5"></i>Domain</strong>
                <p class="text-muted"><?= get_option('domain'); ?></p>
                <hr style="margin-top: 10px; margin-bottom: 10px;" />
                <strong><i class="fa fa-book margin-r-5"></i>PHP</strong>
                <p class="text-muted"><?= phpversion(); ?></p>
                <hr style="margin-top: 10px; margin-bottom: 10px;" />
                <strong><i class="fa fa-book margin-r-5"></i>MySQL</strong>
                <p class="text-muted">5.5.5-10.4.12-MariaDB-log</p>
                <hr style="margin-top: 10px; margin-bottom: 10px;" />
                <strong><i class="fa fa-book margin-r-5"></i>Server Software</strong>
                <p class="text-muted"><?= $_SERVER['SERVER_SOFTWARE']; ?></p>
                <hr style="margin-top: 10px; margin-bottom: 10px;" />
                <strong><i class="fa fa-book margin-r-5"></i>Client IP</strong>
                <p class="text-muted"><?= Request::ip(); ?></p>
                <hr style="margin-top: 10px; margin-bottom: 10px;" />
                <strong><i class="fa fa-book margin-r-5"></i>Clien Browser</strong>
                <p class="text-muted no-margin"><?= request()->userAgent(); ?></p>
            </div>
        </div>
    </section>
</section>
<?php get_footer(); ?>