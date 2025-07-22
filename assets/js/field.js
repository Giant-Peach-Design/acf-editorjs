(function($) {
    
    // Wait for ACF to be ready
    acf.addAction('ready_field/type=editorjs', function(field) {
        initializeEditorJS(field);
    });

    acf.addAction('append_field/type=editorjs', function(field) {
        initializeEditorJS(field);
    });

    function initializeEditorJS(field) {
        const $field = field.$el;
        const $input = $field.find('.acf-editorjs-field');
        const $textarea = $field.find('textarea');
        
        // Check if EditorJS is available
        if (typeof EditorJS === 'undefined') {
            console.error('EditorJS is not loaded');
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
        
        if (tools.includes('header') && typeof window.Header !== 'undefined') {
            toolsConfig.header = {
                class: window.Header,
                config: {
                    placeholder: 'Enter a header',
                    levels: [1, 2, 3, 4, 5, 6],
                    defaultLevel: 2
                }
            };
        }
        
        if (tools.includes('list') && typeof window.List !== 'undefined') {
            toolsConfig.list = {
                class: window.List,
                inlineToolbar: true
            };
        }
        
        if (tools.includes('quote') && typeof window.Quote !== 'undefined') {
            toolsConfig.quote = {
                class: window.Quote,
                inlineToolbar: true,
                config: {
                    quotePlaceholder: 'Enter a quote',
                    captionPlaceholder: 'Quote\'s author'
                }
            };
        }
        
        if (tools.includes('code') && typeof window.CodeTool !== 'undefined') {
            toolsConfig.code = {
                class: window.CodeTool,
                config: {
                    placeholder: 'Enter code'
                }
            };
        }
        
        if (tools.includes('delimiter') && typeof window.Delimiter !== 'undefined') {
            toolsConfig.delimiter = window.Delimiter;
        }
        
        if (tools.includes('table') && typeof window.Table !== 'undefined') {
            toolsConfig.table = {
                class: window.Table,
                inlineToolbar: true
            };
        }
        
        if (tools.includes('warning') && typeof window.Warning !== 'undefined') {
            toolsConfig.warning = {
                class: window.Warning,
                inlineToolbar: true,
                config: {
                    titlePlaceholder: 'Title',
                    messagePlaceholder: 'Message'
                }
            };
        }
        
        if (tools.includes('image') && typeof window.ImageTool !== 'undefined') {
            toolsConfig.image = {
                class: window.ImageTool,
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
        
        if (tools.includes('embed') && typeof window.Embed !== 'undefined') {
            toolsConfig.embed = {
                class: window.Embed,
                config: {
                    services: {
                        youtube: true,
                        coub: true,
                        codepen: true,
                        imgur: true,
                        gfycat: true,
                        twitch: true,
                        vimeo: true,
                        instagram: true,
                        twitter: true,
                        pinterest: true,
                        facebook: true,
                        aparat: true
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
                console.error('Failed to parse EditorJS data:', e);
            }
        }
        
        // Initialize EditorJS
        const editor = new EditorJS({
            holder: $input[0],
            tools: toolsConfig,
            data: data,
            placeholder: placeholder,
            onReady: function() {
                // Editor is ready
                $field.removeClass('acf-loading');
                console.log('EditorJS initialized');
            },
            onChange: async function() {
                // Save data to textarea
                try {
                    const outputData = await editor.save();
                    $textarea.val(JSON.stringify(outputData));
                } catch (e) {
                    console.error('Saving failed:', e);
                }
            }
        });
        
        // Store editor instance for later access
        $field.data('editor', editor);
    }
    
})(jQuery);