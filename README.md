# ACF EditorJS Field

A WordPress plugin that adds [Editor.js](https://editorjs.io/) as a field type for Advanced Custom Fields.

## Features

- Rich text editing with Editor.js
- Multiple block types: Header, Paragraph, List, Quote, Code, Table, Warning, Image, Embed
- Configurable tools per field
- JSON data storage
- Composer installation support

## Requirements

- PHP >= 7.4
- WordPress >= 5.0
- Advanced Custom Fields >= 5.8

## Installation

### Via Composer

1. Add the plugin to your project:
```bash
composer require giantpeach/acf-editorjs
```

2. The plugin will be installed to your `mu-plugins` or `plugins` directory (depending on your composer configuration).

### Manual Installation

1. Download the plugin
2. Upload to your `/wp-content/plugins/` directory
3. Activate the plugin through the 'Plugins' menu in WordPress

## Usage

Once activated, you'll have a new "EditorJS" field type available in ACF field groups.

### Field Settings

- **Default Value**: Set the default content for new posts
- **Placeholder Text**: Placeholder shown in empty editor
- **Available Tools**: Choose which Editor.js tools to enable
- **Minimum Height**: Set the minimum height of the editor

### Retrieving Data

The field returns Editor.js data as an array:

```php
$content = get_field('editorjs_field');

// Returns array like:
// [
//     'time' => 1234567890,
//     'blocks' => [
//         [
//             'type' => 'paragraph',
//             'data' => [
//                 'text' => 'Hello world!'
//             ]
//         ]
//     ],
//     'version' => '2.22.0'
// ]
```

### Rendering Content

You'll need to create your own renderer for the Editor.js data. Example:

```php
function render_editorjs_content($data) {
    if (empty($data['blocks'])) {
        return '';
    }
    
    $html = '';
    foreach ($data['blocks'] as $block) {
        switch ($block['type']) {
            case 'paragraph':
                $html .= '<p>' . esc_html($block['data']['text']) . '</p>';
                break;
            case 'header':
                $level = $block['data']['level'];
                $html .= '<h' . $level . '>' . esc_html($block['data']['text']) . '</h' . $level . '>';
                break;
            // Add more block types as needed
        }
    }
    
    return $html;
}
```

## Development

### Building Assets

The plugin uses CDN versions of Editor.js by default. To bundle your own:

1. Install dependencies: `npm install`
2. Build: `npm run build`

## License

MIT