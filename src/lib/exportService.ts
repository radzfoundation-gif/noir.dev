// Multi-framework export service for converting HTML to various frameworks

export type ExportFormat = 'html' | 'react' | 'vue' | 'angular' | 'svelte';

export interface ExportOptions {
  format: ExportFormat;
  includeTypescript: boolean;
  useTailwind: boolean;
  useCssModules: boolean;
  componentName: string;
}

export interface FrameworkTemplate {
  name: string;
  extension: string;
  dependencies: string[];
  devDependencies?: string[];
  description?: string;
}

const frameworkTemplates: Record<ExportFormat, FrameworkTemplate> = {
  html: {
    name: 'HTML',
    extension: '.html',
    dependencies: [],
  },
  react: {
    name: 'React',
    extension: '.tsx',
    dependencies: ['react', 'react-dom'],
    devDependencies: ['@types/react', '@types/react-dom', 'typescript'],
  },
  vue: {
    name: 'Vue',
    extension: '.vue',
    dependencies: ['vue'],
    devDependencies: ['@vitejs/plugin-vue'],
  },
  angular: {
    name: 'Angular',
    extension: '.ts',
    dependencies: ['@angular/core', '@angular/common'],
    devDependencies: ['@angular/cli', 'typescript'],
  },
  svelte: {
    name: 'Svelte',
    extension: '.svelte',
    dependencies: ['svelte'],
    devDependencies: ['@sveltejs/vite-plugin-svelte', 'typescript'],
  },
};

class ExportService {
  private extractStyles(htmlCode: string): { css: string; classes: string[] } {
    const styleMatch = htmlCode.match(/<style[^>]*>([\s\S]*?)<\/style>/i);
    const css = styleMatch ? styleMatch[1] : '';
    
    // Extract class names used
    const classRegex = /class="([^"]+)"/g;
    const classes: string[] = [];
    let match;
    while ((match = classRegex.exec(htmlCode)) !== null) {
      classes.push(...match[1].split(' '));
    }
    
    return { css, classes: [...new Set(classes)] };
  }

  private htmlToReact(htmlCode: string, options: ExportOptions): string {
    const { css } = this.extractStyles(htmlCode);
    const componentName = options.componentName || 'GeneratedComponent';
    
    // Remove script and style tags, keep body content
    let jsx = htmlCode
      .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, '')
      .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, '')
      .replace(/<html[^>]*>|<\/html>/gi, '')
      .replace(/<head[^>]*>[\s\S]*?<\/head>/gi, '')
      .replace(/<body[^>]*>|<\/body>/gi, '');

    // Convert class to className
    jsx = jsx.replace(/\sclass=/g, ' className=');

    // Convert for to htmlFor
    jsx = jsx.replace(/\sfor=/g, ' htmlFor=');

    // Self-closing tags
    const selfClosing = ['img', 'br', 'hr', 'input', 'meta', 'link'];
    selfClosing.forEach(tag => {
      const regex = new RegExp(`<${tag}([^>]*)>`, 'gi');
      jsx = jsx.replace(regex, `<${tag}$1 />`);
    });

    if (options.useTailwind) {
      return `import React from 'react';

interface ${componentName}Props {
  // Add your props here
}

export const ${componentName}: React.FC<${componentName}Props> = () => {
  return (
    <>
      ${jsx.trim()}
    </>
  );
};
`;
    }

    return `import React from 'react';
import './${componentName}.css';

interface ${componentName}Props {
  // Add your props here
}

export const ${componentName}: React.FC<${componentName}Props> = () => {
  return (
    <>
      ${jsx.trim()}
    </>
  );
};

/* CSS Styles */
/*
${css}
*/
`;
  }

  private htmlToVue(htmlCode: string, options: ExportOptions): string {
    const { css } = this.extractStyles(htmlCode);
    const componentName = options.componentName || 'GeneratedComponent';
    
    console.log(`Exporting Vue component: ${componentName}`);

    // Extract body content
    let template = htmlCode
      .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, '')
      .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, '')
      .replace(/<html[^>]*>|<\/html>/gi, '')
      .replace(/<head[^>]*>[\s\S]*?<\/head>/gi, '')
      .replace(/<body[^>]*>|<\/body>/gi, '')
      .trim();

    return `<template>
  ${template}
</template>

<script setup lang="ts">
// Component logic here
</script>

<style scoped>
${css}
</style>
`;
  }

  private htmlToAngular(htmlCode: string, options: ExportOptions): string {
    const { css } = this.extractStyles(htmlCode);
    const componentName = options.componentName || 'GeneratedComponent';
    const selector = componentName.toLowerCase().replace(/component$/, '');
    
    console.log(`Exporting Angular component: ${componentName}`);

    // Extract body content
    let template = htmlCode
      .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, '')
      .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, '')
      .replace(/<html[^>]*>|<\/html>/gi, '')
      .replace(/<head[^>]*>[\s\S]*?<\/head>/gi, '')
      .replace(/<body[^>]*>|<\/body>/gi, '')
      .trim();

    return `import { Component } from '@angular/core';

@Component({
  selector: 'app-${selector}',
  template: \`
    ${template}
  \`,
  styleUrls: ['./${selector}.component.css']
})
export class ${componentName}Component {
  // Component logic here
}

/* CSS Styles (save to ${selector}.component.css) */
/*
${css}
*/
`;
  }

  private htmlToSvelte(htmlCode: string, _options: ExportOptions): string {
    const { css } = this.extractStyles(htmlCode);

    // Extract body content
    let template = htmlCode
      .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, '')
      .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, '')
      .replace(/<html[^>]*>|<\/html>/gi, '')
      .replace(/<head[^>]*>[\s\S]*?<\/head>/gi, '')
      .replace(/<body[^>]*>|<\/body>/gi, '')
      .trim();

    return `<script lang="ts">
  // Component logic here
</script>

${template}

<style>
${css}
</style>
`;
  }

  public export(code: string, options: ExportOptions): { code: string; filename: string; additionalFiles?: { name: string; content: string }[] } {
    const template = frameworkTemplates[options.format];
    const componentName = options.componentName || 'GeneratedComponent';
    
    let result: string;
    let additionalFiles: { name: string; content: string }[] | undefined;

    switch (options.format) {
      case 'react':
        result = this.htmlToReact(code, options);
        if (!options.useTailwind) {
          const { css } = this.extractStyles(code);
          additionalFiles = [
            { name: `${componentName}.css`, content: css }
          ];
        }
        break;
      case 'vue':
        result = this.htmlToVue(code, options);
        break;
      case 'angular':
        result = this.htmlToAngular(code, options);
        const { css: angularCss } = this.extractStyles(code);
        additionalFiles = [
          { name: `${componentName.toLowerCase().replace(/component$/, '')}.component.css`, content: angularCss }
        ];
        break;
      case 'svelte':
        result = this.htmlToSvelte(code, options);
        break;
      case 'html':
      default:
        result = code;
        break;
    }

    return {
      code: result,
      filename: `${componentName}${template.extension}`,
      additionalFiles,
    };
  }

  public getFrameworkTemplate(format: ExportFormat): FrameworkTemplate {
    return frameworkTemplates[format];
  }

  public getAllFrameworks(): ExportFormat[] {
    return ['html', 'react', 'vue', 'angular', 'svelte'];
  }

  public downloadFiles(result: { code: string; filename: string; additionalFiles?: { name: string; content: string }[] }) {
    // Download main file
    const mainBlob = new Blob([result.code], { type: 'text/plain' });
    const mainUrl = URL.createObjectURL(mainBlob);
    const mainLink = document.createElement('a');
    mainLink.href = mainUrl;
    mainLink.download = result.filename;
    document.body.appendChild(mainLink);
    mainLink.click();
    document.body.removeChild(mainLink);
    URL.revokeObjectURL(mainUrl);

    // Download additional files
    if (result.additionalFiles) {
      result.additionalFiles.forEach(file => {
        const blob = new Blob([file.content], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = file.name;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
      });
    }
  }
}

export const exportService = new ExportService();
