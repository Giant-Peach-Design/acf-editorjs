<?php

namespace Giantpeach\AcfEditorjs;

class EditorjsField extends \acf_field
{
    /**
     * Constructor
     */
    public function __construct()
    {
        $this->name = 'editorjs';
        $this->label = __('EditorJS', 'acf-editorjs');
        $this->category = 'content';
        $this->defaults = [
            'default_value' => '',
            'placeholder' => '',
            'tools' => ['header', 'paragraph', 'list', 'quote', 'code', 'delimiter'],
            'min_height' => 300
        ];
        
        // Environment
        $this->l10n = [
            'error' => __('Error! Please enter a higher value', 'acf-editorjs'),
        ];
        
        // URLs
        $this->settings = [
            'url' => ACF_EDITORJS_URL,
            'path' => ACF_EDITORJS_PATH,
            'version' => ACF_EDITORJS_VERSION,
        ];

        parent::__construct();
    }

    /**
     * Render field settings
     */
    public function render_field_settings($field)
    {
        // Default value
        acf_render_field_setting($field, [
            'label' => __('Default Value', 'acf-editorjs'),
            'instructions' => __('Appears when creating a new post', 'acf-editorjs'),
            'type' => 'textarea',
            'name' => 'default_value',
        ]);

        // Placeholder
        acf_render_field_setting($field, [
            'label' => __('Placeholder Text', 'acf-editorjs'),
            'instructions' => __('Appears within the input', 'acf-editorjs'),
            'type' => 'text',
            'name' => 'placeholder',
        ]);

        // Available tools
        acf_render_field_setting($field, [
            'label' => __('Available Tools', 'acf-editorjs'),
            'instructions' => __('Select which EditorJS tools to enable', 'acf-editorjs'),
            'type' => 'checkbox',
            'name' => 'tools',
            'choices' => [
                'header' => __('Header', 'acf-editorjs'),
                'paragraph' => __('Paragraph', 'acf-editorjs'),
                'list' => __('List', 'acf-editorjs'),
                'quote' => __('Quote', 'acf-editorjs'),
                'code' => __('Code', 'acf-editorjs'),
                'delimiter' => __('Delimiter', 'acf-editorjs'),
                'table' => __('Table', 'acf-editorjs'),
                'warning' => __('Warning', 'acf-editorjs'),
                'image' => __('Image', 'acf-editorjs'),
                'embed' => __('Embed', 'acf-editorjs'),
            ],
            'default_value' => $this->defaults['tools'],
            'layout' => 'horizontal',
        ]);

        // Min height
        acf_render_field_setting($field, [
            'label' => __('Minimum Height', 'acf-editorjs'),
            'instructions' => __('Minimum height of the editor in pixels', 'acf-editorjs'),
            'type' => 'number',
            'name' => 'min_height',
            'default_value' => $this->defaults['min_height'],
            'append' => 'px',
        ]);
    }

    /**
     * Render field in admin
     */
    public function render_field($field)
    {
        // Field attributes
        $atts = [
            'id' => $field['id'],
            'name' => $field['name'],
            'data-tools' => json_encode($field['tools'] ?? $this->defaults['tools']),
            'data-placeholder' => $field['placeholder'] ?? '',
            'data-min-height' => $field['min_height'] ?? $this->defaults['min_height'],
        ];

        // Render field
        ?>
        <div class="acf-editorjs-wrapper">
            <div <?php echo acf_esc_atts($atts); ?> class="acf-editorjs-field"></div>
            <textarea name="<?php echo esc_attr($field['name']); ?>" style="display: none;"><?php echo esc_textarea($field['value']); ?></textarea>
        </div>
        <?php
    }

    /**
     * Enqueue admin scripts
     */
    public function input_admin_enqueue_scripts()
    {
        $url = $this->settings['url'];
        $version = $this->settings['version'];
        
        // ACF EditorJS bundle (includes EditorJS core + tools + field initialization)
        wp_register_script(
            'acf-editorjs',
            "{$url}dist/acf-editorjs.iife.js",
            ['acf-input'],
            $version,
            true
        );
        wp_enqueue_script('acf-editorjs');
        
        // Custom field style
        wp_register_style(
            'acf-editorjs',
            "{$url}assets/css/field.css",
            ['acf-input'],
            $version
        );
        wp_enqueue_style('acf-editorjs');
    }

    /**
     * Format value for frontend
     */
    public function format_value($value, $post_id, $field)
    {
        if (empty($value)) {
            return $value;
        }

        // Decode JSON data
        $data = json_decode($value, true);
        
        if (json_last_error() !== JSON_ERROR_NONE || !isset($data['blocks'])) {
            return $value;
        }

        // Return decoded data for now - you can add HTML rendering here
        return $data;
    }

    /**
     * Validate value
     */
    public function validate_value($valid, $value, $field, $input)
    {
        if (!$valid) {
            return $valid;
        }

        // Validate JSON
        if (!empty($value)) {
            $data = json_decode($value, true);
            if (json_last_error() !== JSON_ERROR_NONE) {
                return __('Invalid EditorJS data', 'acf-editorjs');
            }
        }

        return $valid;
    }
}