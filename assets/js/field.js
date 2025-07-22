(function($) {
    
    console.log('ACF EditorJS field.js loaded');
    
    function initialize_field($field) {
        console.log('EditorJS field initialized');
        
        const $input = $field.find('.acf-editorjs-field');
        const $textarea = $field.find('textarea');
        
        console.log('Field elements found:', {
            field: $field.length,
            input: $input.length,
            textarea: $textarea.length
        });
        
        // Check if already initialized
        if ($input.data('editor-initialized')) {
            console.log('Field already initialized, skipping');
            return;
        }
        
        // Mark as initialized
        $input.data('editor-initialized', true);
        
        initializeEditorJSCore($input, $field, $textarea);
    }
    
    // Register field initialization
    if (typeof acf.add_action !== 'undefined') {
        console.log('Registering ACF actions for EditorJS field');
        acf.add_action('ready_field/type=editorjs', initialize_field);
        acf.add_action('append_field/type=editorjs', initialize_field);
    } else {
        console.log('ACF actions not available');
    }
    
    function initializeEditorJSCore($input, $field, $textarea) {
        console.log('initializeEditorJSCore called');
        
        // Check if EditorJS is available
        if (typeof EditorJS === 'undefined') {
            console.error('EditorJS is not loaded');
            return;
        }
        
        console.log('EditorJS is available');
        
        // Get field settings
        const tools = JSON.parse($input.attr('data-tools') || '[]');
        const placeholder = $input.attr('data-placeholder') || '';
        const minHeight = parseInt($input.attr('data-min-height') || 300);
        
        console.log('Field settings:', { tools, placeholder, minHeight });
        
        // Set minimum height
        $input.css('min-height', minHeight + 'px');
        
        // Configure tools
        const toolsConfig = {};
        
        if (tools.includes('header') && typeof window.Header !== 'undefined') {
            console.log('Adding header tool');
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
            console.log('Adding list tool');
            toolsConfig.list = {
                class: window.List,
                inlineToolbar: true
            };
        }
        
        if (tools.includes('quote') && typeof window.Quote !== 'undefined') {
            console.log('Adding quote tool');
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
            console.log('Adding code tool');
            toolsConfig.code = {
                class: window.CodeTool,
                config: {
                    placeholder: 'Enter code'
                }
            };
        }
        
        if (tools.includes('delimiter') && typeof window.Delimiter !== 'undefined') {
            console.log('Adding delimiter tool');
            toolsConfig.delimiter = window.Delimiter;
        }
        
        console.log('Final tools config:', toolsConfig);
        
        // Parse existing data
        let data = {};
        const existingValue = $textarea.val();
        if (existingValue) {
            try {
                data = JSON.parse(existingValue);
                console.log('Parsed existing data:', data);
            } catch (e) {
                console.error('Failed to parse EditorJS data:', e);
            }
        }
        
        console.log('Initializing EditorJS with:', {
            holder: $input[0],
            tools: toolsConfig,
            data: data,
            placeholder: placeholder
        });
        
        // Initialize EditorJS
        try {
            const editor = new EditorJS({
                holder: $input[0],
                tools: toolsConfig,
                data: data,
                placeholder: placeholder,
                onReady: function() {
                    // Editor is ready
                    $field.removeClass('acf-loading');
                    console.log('EditorJS initialized successfully');
                },
                onChange: async function() {
                    // Save data to textarea
                    try {
                        const outputData = await editor.save();
                        $textarea.val(JSON.stringify(outputData));
                        console.log('Data saved:', outputData);
                    } catch (e) {
                        console.error('Saving failed:', e);
                    }
                }
            });
            
            // Store editor instance for later access
            $field.data('editor', editor);
            console.log('EditorJS instance stored');
            
        } catch (error) {
            console.error('Failed to initialize EditorJS:', error);
        }
    }
    
})(jQuery);