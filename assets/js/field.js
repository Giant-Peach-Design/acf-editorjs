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
        
        // Get field settings
        const tools = JSON.parse($input.attr('data-tools') || '[]');
        const placeholder = $input.attr('data-placeholder') || '';
        const minHeight = parseInt($input.attr('data-min-height') || 300);
        
        // Set minimum height
        $input.css('min-height', minHeight + 'px');
        
        // Configure tools
        const toolsConfig = {};
        
        if (tools.includes('header')) {
            toolsConfig.header = {
                class: Header,
                config: {
                    placeholder: 'Enter a header',
                    levels: [1, 2, 3, 4, 5, 6],
                    defaultLevel: 2
                }
            };
        }
        
        if (tools.includes('paragraph')) {
            toolsConfig.paragraph = {
                class: Paragraph,
                config: {
                    placeholder: placeholder || 'Start typing...'
                }
            };
        }
        
        if (tools.includes('list')) {
            toolsConfig.list = {
                class: List,
                inlineToolbar: true
            };
        }
        
        if (tools.includes('quote')) {
            toolsConfig.quote = {
                class: Quote,
                inlineToolbar: true,
                config: {
                    quotePlaceholder: 'Enter a quote',
                    captionPlaceholder: 'Quote\'s author'
                }
            };
        }
        
        if (tools.includes('code')) {
            toolsConfig.code = {
                class: CodeTool,
                config: {
                    placeholder: 'Enter code'
                }
            };
        }
        
        if (tools.includes('delimiter')) {
            toolsConfig.delimiter = Delimiter;
        }
        
        if (tools.includes('table')) {
            toolsConfig.table = {
                class: Table,
                inlineToolbar: true
            };
        }
        
        if (tools.includes('warning')) {
            toolsConfig.warning = {
                class: Warning,
                inlineToolbar: true,
                config: {
                    titlePlaceholder: 'Title',
                    messagePlaceholder: 'Message'
                }
            };
        }
        
        if (tools.includes('image')) {
            toolsConfig.image = {
                class: ImageTool,
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
        
        if (tools.includes('embed')) {
            toolsConfig.embed = {
                class: Embed,
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