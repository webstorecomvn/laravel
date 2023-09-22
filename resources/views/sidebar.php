<?php
    $data = [];
    $query = [];
    $table = 'admin_menu';
    $user_id = get_current_user_id();
    $user_role = get_user_role($user_id);
    $orderby = 'menu_order asc, id desc';
    $str_title = sprintf('title_%s', get_locale());
    $where = array('display' => 1, 'parentid' => 0);
    $menu_active = apply_filters('admin_menu_active');
    if( empty( $menu_active ) ) {
        $cur_mod = get_option('pagenow');
        $cur_act = get_option('typenow');
        $cur_sub = request('sub', 'manage');
        $menu_active = sprintf('%s::%s::%s', $cur_mod, $cur_act, $cur_sub);
    }
    $menu_active = str_lower($menu_active);
    $menus = ws_get_results($table, function($query) use($where) {
        $user_id = get_current_user_id();
        $user_role = get_user_role($user_id);
        if($user_role === 'administrator') {
            $query->whereNotIn('g_name', ['g_profile']);
        }
        $query->whereIn('module', ['dashboard', 'news', 'page', 'media', 'comment', 'users', 'options', 'themes']);
        $query->where($where);
        $query->orderBy('menu_order', 'asc');
        $query->orderBy('id', 'desc');
        return $query->get();
    });
    foreach($menus as $menu) {
        $k=0;
        $options = [];
        $id = $menu->id;
        $group = $menu->g_name;
        $module = $menu->module;
        $title = $menu->$str_title;
        $link = admin_url($module);
        $action = str_empty($menu->act, $module);
        $icon = str_empty($menu->menu_icon, 'book');
        if($action != $module) {
            $link = admin_url($module, '&act='.$action);
        }
        $where = ws_parse_args(['parentid' => $id,'g_name' => $group], $where);
        $subs = ws_get_results($table, ['where' => $where, 'orderby' => $orderby]);
        
        $data['?mod='.$module]['id'] = $id;
        $data['?mod='.$module]['icon'] = $icon;
        $data['?mod='.$module]['link'] = $link;
        $data['?mod='.$module]['title'] = $title;
        $data['?mod='.$module]['group'] = $group;
        $data['?mod='.$module]['module'] = $module;

        if($subs) {
            $active = '';
            foreach($subs as $submenu) {
                $sub_active = '';
                $id = $submenu->id;
                $act = $submenu->act;
                $mod = $submenu->module;
                $link = admin_url($mod);
                $title = $submenu->$str_title;
                $sub = str_empty($submenu->sub, 'manage');
                $icon = str_empty($submenu->menu_icon, 'circle-o');
                if($act != $mod) {
                    $link .= '&act='.$act;
                }
                if($sub != 'manage') {
                    $link .= '&sub='.$sub;
                }
                $str_active = sprintf('%s::%s::%s', $mod, $act, $sub);
                if($menu_active == $str_active) {
                    $active = 'active';
                    $sub_active = 'active';
                }
                $options[$k]['id'] = $id;
                $options[$k]['link'] = $link;
                $options[$k]['icon'] = $icon;
                $options[$k]['title'] = $title;
                $options[$k]['class'] = $sub_active;
                $k++;
            }
        }
        else {
            $str_active = sprintf('%s::%s::manage', $module, $action);
            $active = ($menu_active == $str_active) ? 'active' : null;
        }
        $data['?mod='.$module]['active'] = $active;
        $data['?mod='.$module]['options'] = $options;
    }
    $menus = apply_filters($table, $data);
?>
<aside id="ws-sidebar" class="ws-sidebar main-sidebar slimScroll">
    <section class="sidebar">
        <div class="scroll-menu">
            <ul class="sidebar-menu">
                <?php foreach($menus as $key => $menu) : ?>
                <li id="menu-<?= $menu['module']; ?>" class="treeview <?= $menu['active']; ?>">
                    <a href="<?= $menu['link']; ?>">
                        <i class="fa fa-<?= $menu['icon']; ?>"></i>
                        <span><?= $menu['title']; ?></span>
                        <?php do_action('admin_menu_notice', $menu['module']); ?>
                        <?php if($menu['options']) { ?>
                            <span class="pull-right-container">
                                <i class="fa fa-angle-left pull-right"></i>
                            </span>
                        <?php } ?>
                    </a>
                    <?php if($menu['options']) { ?>
                        <ul class="treeview-menu">
                            <?php foreach($menu['options'] as $submenu) { ?>
                                <li class="<?= $submenu['class']; ?>">
                                    <a href="<?= $submenu['link']; ?>">
                                        <span><?= $submenu['title']; ?></span>
                                    </a>
                                </li>
                            <?php } ?>
                        </ul>
                    <?php } ?>
                </li>
                <?php endforeach; ?>
                <li id="collapse-menu" class="hide-if-no-js">
                    <a href="#" class="sidebar-toggle" data-toggle="offcanvas" role="button">
                        <i class="fa fa-arrow-circle-left"></i>
                        <span><?= __('global.collapseMenu'); ?></span>
                    </a>
                </li>
            </ul>
        </div>
    </section>
</aside>