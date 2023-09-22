<?php
    $admin_footer_text = str_wrap(get_option('blogname'), ['el' => 'strong']);
    $admin_footer_text = sprintf('&copy; %u %s', date('Y'), $admin_footer_text);
    $admin_footer_text = str_wrap($admin_footer_text, ['class' => 'pull-left']);
    $admin_footer_text = apply_filters('admin_footer_text', $admin_footer_text);
?>
<footer id="ws-footer" class="ws-footer main-footer">
    <?= $admin_footer_text; ?>
    <?= str_wrap(sprintf(__('global.versionText'), WS_VERSION), ['class' => 'pull-right hidden-xs']); ?>
</footer>
</div>
<script type="text/javascript">
    var locale = '<?= get_locale(); ?>';
    var _token = '<?= csrf_token(); ?>';
    var ajaxurl = '<?= current_url(); ?>';
</script>
<?php admin_footer(); ?>