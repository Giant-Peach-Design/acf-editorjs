(function($) {
    
    function initialize_field($field) {
        const $input = $field.find('.acf-editorjs-field');
        const $textarea = $field.find('textarea');
        
        // Check if already initialized
        if ($input.data('editor-initialized')) {
            return;
        }
        
        // Mark as initialized
        $input.data('editor-initialized', true);
        
        initializeEditorJSCore($input, $field, $textarea);
    }
    
    // Register field initialization
    if (typeof acf.add_action !== 'undefined') {
        acf.add_action('ready_field/type=editorjs', initialize_field);
        acf.add_action('append_field/type=editorjs', initialize_field);
    }
    
    function initializeEditorJSCore($input, $field, $textarea) {
        // Check if EditorJS is available
        if (typeof EditorJS === 'undefined') {
            return;
        }
        
        // Get field settings
        const tools = JSON.parse($input.attr('data-tools') || '[]');
        const placeholder = $input.attr('data-placeholder') || '';
        const minHeight = parseInt($input.attr('data-min-height') || 300);
        
        // Set minimum height
        $input.css('min-height', minHeight + 'px');
        
        // Configure tools
        const toolsConfig = {};
        
        if (tools.includes('header') && window.EditorJSTools?.Header) {
            toolsConfig.header = {
                class: window.EditorJSTools.Header,
                config: {
                    placeholder: 'Enter a header',
                    levels: [1, 2, 3, 4, 5, 6],
                    defaultLevel: 2
                }
            };
        }
        
        if (tools.includes('list') && window.EditorJSTools?.List) {
            toolsConfig.list = {
                class: window.EditorJSTools.List,
                inlineToolbar: true
            };
        }
        
        if (tools.includes('quote') && window.EditorJSTools?.Quote) {
            toolsConfig.quote = {
                class: window.EditorJSTools.Quote,
                inlineToolbar: true,
                config: {
                    quotePlaceholder: 'Enter a quote',
                    captionPlaceholder: 'Quote\'s author'
                }
            };
        }
        
        if (tools.includes('code') && window.EditorJSTools?.CodeTool) {
            toolsConfig.code = {
                class: window.EditorJSTools.CodeTool,
                config: {
                    placeholder: 'Enter code'
                }
            };
        }
        
        if (tools.includes('delimiter') && window.EditorJSTools?.Delimiter) {
            toolsConfig.delimiter = window.EditorJSTools.Delimiter;
        }
        
        if (tools.includes('table') && window.EditorJSTools?.Table) {
            toolsConfig.table = {
                class: window.EditorJSTools.Table,
                inlineToolbar: true
            };
        }
        
        if (tools.includes('warning') && window.EditorJSTools?.Warning) {
            toolsConfig.warning = {
                class: window.EditorJSTools.Warning,
                inlineToolbar: true,
                config: {
                    titlePlaceholder: 'Title',
                    messagePlaceholder: 'Message'
                }
            };
        }
        
        if (tools.includes('image') && window.EditorJSTools?.ImageTool) {
            toolsConfig.image = {
                class: window.EditorJSTools.ImageTool,
                config: {
                    endpoints: {
                        byFile: ajaxurl + '?action=acf_editorjs_upload_image',
                        byUrl: ajaxurl + '?action=acf_editorjs_fetch_image'
                    },
                    additionalRequestData: {
                        nonce: acf.get('nonce')
                    }
                }
            };
        }
        
        if (tools.includes('embed') && window.EditorJSTools?.Embed) {
            toolsConfig.embed = {
                class: window.EditorJSTools.Embed,
                config: {
                    services: {
                        youtube: true,
                        vimeo: true,
                        twitter: true,
                        instagram: true,
                        pinterest: true,
                        facebook: true,
                        codepen: true
                    }
                }
            };
        }
        
        // Parse existing data
        let data = {};
        const existingValue = $textarea.val();
        if (existingValue) {
            try {
                data = JSON.parse(existingValue);
            } catch (e) {
                // Ignore parse errors
            }
        }
        
        // Initialize EditorJS
        try {
            const editor = new EditorJS({
                holder: $input[0],
                tools: toolsConfig,
                data: data,
                placeholder: placeholder,
                onReady: function() {
                    $field.removeClass('acf-loading');
                },
                onChange: async function() {
                    try {
                        const outputData = await editor.save();
                        $textarea.val(JSON.stringify(outputData));
                    } catch (e) {
                        // Ignore save errors
                    }
                }
            });
            
            // Store editor instance for later access
            $field.data('editor', editor);
            
        } catch (error) {
            // Ignore initialization errors
        }
    }
    
})(jQuery);