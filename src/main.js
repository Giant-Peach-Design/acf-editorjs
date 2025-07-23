// Import EditorJS core and tools
import EditorJS from '@editorjs/editorjs';
import Header from '@editorjs/header';
import List from '@editorjs/list';
import Quote from '@editorjs/quote';
import CodeTool from '@editorjs/code';
import Delimiter from '@editorjs/delimiter';
import Table from '@editorjs/table';
import Warning from '@editorjs/warning';
import ImageTool from '@editorjs/image';
import Embed from '@editorjs/embed';

// Expose EditorJS and tools to global window object
window.EditorJS = EditorJS;
window.EditorJSTools = {
  Header,
  List,
  Quote,
  CodeTool,
  Delimiter,
  Table,
  Warning,
  ImageTool,
  Embed
};

// Import and initialize ACF field functionality
import './field.js';