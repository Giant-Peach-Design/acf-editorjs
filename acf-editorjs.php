<?php
/**
 * Plugin Name: ACF EditorJS Field
 * Plugin URI: https://github.com/giantpeach/acf-editorjs
 * Description: Adds EditorJS field type to Advanced Custom Fields
 * Version: 1.0.0
 * Author: Giant Peach
 * Author URI: https://giantpeach.agency
 * Text Domain: acf-editorjs
 * License: MIT
 * License URI: https://opensource.org/licenses/MIT
 * Requires PHP: 7.4
 */

// Exit if accessed directly
if (!defined('ABSPATH')) {
    exit;
}

// Define plugin constants
define('ACF_EDITORJS_VERSION', '1.0.0');
define('ACF_EDITORJS_URL', plugin_dir_url(__FILE__));
define('ACF_EDITORJS_PATH', plugin_dir_path(__FILE__));

// Load plugin
add_action('plugins_loaded', function() {
    // Check if ACF is active
    if (!class_exists('ACF')) {
        add_action('admin_notices', function() {
            ?>
            <div class="notice notice-error">
                <p><?php _e('ACF EditorJS Field requires Advanced Custom Fields to be installed and activated.', 'acf-editorjs'); ?></p>
            </div>
            <?php
        });
        return;
    }

    // Include field type
    add_action('acf/include_field_types', function() {
        require_once ACF_EDITORJS_PATH . 'src/EditorjsField.php';
        $field = new \Giantpeach\AcfEditorjs\EditorjsField();
        error_log('ACF EditorJS Field registered: ' . get_class($field));
    });
    
    error_log('ACF EditorJS plugin loaded, ACF is active');
}, 20);