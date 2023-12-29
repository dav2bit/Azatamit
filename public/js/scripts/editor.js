const editor = new EditorJS({
    holderId: 'editorjs',
    tools: {
      link: false,
      image: {
        class: ImageTool,
        config: {
         
          endpoints: {
            byFile: '/content/upload_files', 
            byUrl: '/', 
          }
        }
      }
    }
  });