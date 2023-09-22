<!DOCTYPE html>
<html lang="<?= get_locale(); ?>">
<head>
<?php admin_head(); ?>
</head>
<body <?php admin_body_class(); ?>>
<div id="ws-app" class="ws-app webstore">
<header id="ws-header" class="ws-header main-header">
    <a href="javascript:void(0)" class="logo" data-toggle="offcanvas" role="button">
        <span class="logo-mini">
            <?= get_the_post_thumbnail(get_option('favicon'), ['class' => 'logo-small']); ?>
        </span>
    </a>
    <nav class="navbar navbar-static-top pull-left">
        <a href="<?= home_url(); ?>" class="site-name fa-globe" title="Xem trang" target="_blank">
            <?= get_option('blogname'); ?>
        </a>
        <?php
            $items = [];
            $actived = '';
            $languages = ws_get_results('language');
            foreach($languages as $language) {
                $code = $language->name; $title = $language->title;
                $class = ($code === get_locale()) ? 'active' : '';
                $attrs = ['alt' => $title, 'style' => 'width: 20px'];
                $url = admin_url(get_option('pagenow'), '&lang='.$code);
                $url = apply_filters('admin_language_url', $url, $language);
                $image = get_the_post_thumbnail($language->picture, $attrs);
                if($code === get_locale()) {
                    $actived = str_wrap([$image, $title, '<span class="caret"></span>'], [
                        'el' => 'button',
                        'type' => 'button',
                        'data-toggle' => 'dropdown',
                        'class' => 'btn btn-default dropdown-toggle',
                    ]);
                }
                $anchor = anchor($url, $image.$title, ['class' => 'lang-item']);
                $items[] = str_wrap($anchor, ['el' => 'li', 'class' => $class]);
            }
            $items = str_wrap($items, ['el' => 'ul', 'class' => 'dropdown-menu']);
            echo str_wrap([$actived, $items], ['id' => 'ws-languages', 'class' => 'ws-languages btn-group hidden-xs']);
        ?>
    </nav>
    <div class="navbar-custom-menu pull-right">
        <ul class="nav navbar-nav">
            <li class="dropdown user user-menu">
                <a href="javascript:void(0)" class="dropdown-toggle" data-toggle="dropdown">
                    <span class="hidden-xs"><?= sprintf(__('global.userLoggedIn'), get_user_meta(get_current_user_id(), 'display_name', true)); ?></span>
                    <?= get_user_avatar(get_current_user_id(), ['class' => 'user-image']); ?>
                </a>
                <ul class="dropdown-menu">
                    <li><?= anchor(admin_url('profile'), __('global.editProfile'), ['class' => 'fa-user-circle']); ?></li>
                    <li><?= anchor('admin?act=logout', __('global.logout'), ['class' => 'fa-sign-out']); ?></li>
                </ul>
            </li>
        </ul>
    </div>
</header>
<?php get_sidebar(); ?>