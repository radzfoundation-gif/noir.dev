// Design System Integration Service
// Supports MUI, Chakra UI, Ant Design, TailwindUI, Radix UI, Shadcn/ui

export type DesignSystemLibrary = 
  | 'mui'
  | 'chakra'
  | 'antd'
  | 'tailwindui'
  | 'radix'
  | 'shadcn'
  | 'none';

export type ComponentCategory =
  | 'button'
  | 'input'
  | 'card'
  | 'modal'
  | 'table'
  | 'navigation'
  | 'form'
  | 'feedback'
  | 'data-display'
  | 'layout';

export interface DesignSystemComponent {
  name: string;
  importPath: string;
  library: DesignSystemLibrary;
  category: ComponentCategory;
  props?: Record<string, string>;
  variants?: string[];
  description?: string;
}

export interface DesignSystemConfig {
  library: DesignSystemLibrary;
  framework: 'react' | 'vue' | 'angular';
  theme?: Record<string, any>;
  components?: DesignSystemComponent[];
  customMappings?: Record<string, string>;
}

// Material-UI (MUI) Components
const muiComponents: DesignSystemComponent[] = [
  // Buttons
  { name: 'Button', importPath: '@mui/material/Button', library: 'mui', category: 'button', variants: ['contained', 'outlined', 'text'] },
  { name: 'IconButton', importPath: '@mui/material/IconButton', library: 'mui', category: 'button' },
  { name: 'LoadingButton', importPath: '@mui/lab/LoadingButton', library: 'mui', category: 'button' },
  
  // Inputs
  { name: 'TextField', importPath: '@mui/material/TextField', library: 'mui', category: 'input' },
  { name: 'Select', importPath: '@mui/material/Select', library: 'mui', category: 'input' },
  { name: 'Autocomplete', importPath: '@mui/material/Autocomplete', library: 'mui', category: 'input' },
  { name: 'Checkbox', importPath: '@mui/material/Checkbox', library: 'mui', category: 'input' },
  { name: 'Radio', importPath: '@mui/material/Radio', library: 'mui', category: 'input' },
  { name: 'Switch', importPath: '@mui/material/Switch', library: 'mui', category: 'input' },
  
  // Cards
  { name: 'Card', importPath: '@mui/material/Card', library: 'mui', category: 'card' },
  { name: 'CardContent', importPath: '@mui/material/CardContent', library: 'mui', category: 'card' },
  { name: 'CardHeader', importPath: '@mui/material/CardHeader', library: 'mui', category: 'card' },
  { name: 'CardActions', importPath: '@mui/material/CardActions', library: 'mui', category: 'card' },
  { name: 'Paper', importPath: '@mui/material/Paper', library: 'mui', category: 'card' },
  
  // Modals
  { name: 'Dialog', importPath: '@mui/material/Dialog', library: 'mui', category: 'modal' },
  { name: 'DialogTitle', importPath: '@mui/material/DialogTitle', library: 'mui', category: 'modal' },
  { name: 'DialogContent', importPath: '@mui/material/DialogContent', library: 'mui', category: 'modal' },
  { name: 'DialogActions', importPath: '@mui/material/DialogActions', library: 'mui', category: 'modal' },
  { name: 'Drawer', importPath: '@mui/material/Drawer', library: 'mui', category: 'modal' },
  { name: 'Popover', importPath: '@mui/material/Popover', library: 'mui', category: 'modal' },
  
  // Tables
  { name: 'Table', importPath: '@mui/material/Table', library: 'mui', category: 'table' },
  { name: 'TableBody', importPath: '@mui/material/TableBody', library: 'mui', category: 'table' },
  { name: 'TableCell', importPath: '@mui/material/TableCell', library: 'mui', category: 'table' },
  { name: 'TableHead', importPath: '@mui/material/TableHead', library: 'mui', category: 'table' },
  { name: 'TableRow', importPath: '@mui/material/TableRow', library: 'mui', category: 'table' },
  { name: 'DataGrid', importPath: '@mui/x-data-grid/DataGrid', library: 'mui', category: 'table' },
  
  // Navigation
  { name: 'AppBar', importPath: '@mui/material/AppBar', library: 'mui', category: 'navigation' },
  { name: 'Toolbar', importPath: '@mui/material/Toolbar', library: 'mui', category: 'navigation' },
  { name: 'Tabs', importPath: '@mui/material/Tabs', library: 'mui', category: 'navigation' },
  { name: 'Tab', importPath: '@mui/material/Tab', library: 'mui', category: 'navigation' },
  { name: 'Breadcrumbs', importPath: '@mui/material/Breadcrumbs', library: 'mui', category: 'navigation' },
  { name: 'Link', importPath: '@mui/material/Link', library: 'mui', category: 'navigation' },
  { name: 'Menu', importPath: '@mui/material/Menu', library: 'mui', category: 'navigation' },
  { name: 'MenuItem', importPath: '@mui/material/MenuItem', library: 'mui', category: 'navigation' },
  { name: 'Pagination', importPath: '@mui/material/Pagination', library: 'mui', category: 'navigation' },
  
  // Form
  { name: 'FormControl', importPath: '@mui/material/FormControl', library: 'mui', category: 'form' },
  { name: 'FormLabel', importPath: '@mui/material/FormLabel', library: 'mui', category: 'form' },
  { name: 'FormHelperText', importPath: '@mui/material/FormHelperText', library: 'mui', category: 'form' },
  { name: 'InputLabel', importPath: '@mui/material/InputLabel', library: 'mui', category: 'form' },
  { name: 'OutlinedInput', importPath: '@mui/material/OutlinedInput', library: 'mui', category: 'form' },
  
  // Feedback
  { name: 'Alert', importPath: '@mui/material/Alert', library: 'mui', category: 'feedback', variants: ['error', 'warning', 'info', 'success'] },
  { name: 'Snackbar', importPath: '@mui/material/Snackbar', library: 'mui', category: 'feedback' },
  { name: 'CircularProgress', importPath: '@mui/material/CircularProgress', library: 'mui', category: 'feedback' },
  { name: 'LinearProgress', importPath: '@mui/material/LinearProgress', library: 'mui', category: 'feedback' },
  { name: 'Skeleton', importPath: '@mui/material/Skeleton', library: 'mui', category: 'feedback' },
  { name: 'Badge', importPath: '@mui/material/Badge', library: 'mui', category: 'feedback' },
  
  // Data Display
  { name: 'Avatar', importPath: '@mui/material/Avatar', library: 'mui', category: 'data-display' },
  { name: 'AvatarGroup', importPath: '@mui/material/AvatarGroup', library: 'mui', category: 'data-display' },
  { name: 'Chip', importPath: '@mui/material/Chip', library: 'mui', category: 'data-display' },
  { name: 'Divider', importPath: '@mui/material/Divider', library: 'mui', category: 'data-display' },
  { name: 'List', importPath: '@mui/material/List', library: 'mui', category: 'data-display' },
  { name: 'ListItem', importPath: '@mui/material/ListItem', library: 'mui', category: 'data-display' },
  { name: 'ListItemText', importPath: '@mui/material/ListItemText', library: 'mui', category: 'data-display' },
  { name: 'Tooltip', importPath: '@mui/material/Tooltip', library: 'mui', category: 'data-display' },
  { name: 'Typography', importPath: '@mui/material/Typography', library: 'mui', category: 'data-display' },
  
  // Layout
  { name: 'Box', importPath: '@mui/material/Box', library: 'mui', category: 'layout' },
  { name: 'Container', importPath: '@mui/material/Container', library: 'mui', category: 'layout' },
  { name: 'Grid', importPath: '@mui/material/Grid', library: 'mui', category: 'layout' },
  { name: 'Stack', importPath: '@mui/material/Stack', library: 'mui', category: 'layout' },
];

// Chakra UI Components
const chakraComponents: DesignSystemComponent[] = [
  // Buttons
  { name: 'Button', importPath: '@chakra-ui/react', library: 'chakra', category: 'button', variants: ['solid', 'outline', 'ghost', 'link'] },
  { name: 'IconButton', importPath: '@chakra-ui/react', library: 'chakra', category: 'button' },
  { name: 'ButtonGroup', importPath: '@chakra-ui/react', library: 'chakra', category: 'button' },
  
  // Inputs
  { name: 'Input', importPath: '@chakra-ui/react', library: 'chakra', category: 'input' },
  { name: 'Textarea', importPath: '@chakra-ui/react', library: 'chakra', category: 'input' },
  { name: 'Select', importPath: '@chakra-ui/react', library: 'chakra', category: 'input' },
  { name: 'NumberInput', importPath: '@chakra-ui/react', library: 'chakra', category: 'input' },
  { name: 'Checkbox', importPath: '@chakra-ui/react', library: 'chakra', category: 'input' },
  { name: 'CheckboxGroup', importPath: '@chakra-ui/react', library: 'chakra', category: 'input' },
  { name: 'Radio', importPath: '@chakra-ui/react', library: 'chakra', category: 'input' },
  { name: 'RadioGroup', importPath: '@chakra-ui/react', library: 'chakra', category: 'input' },
  { name: 'Switch', importPath: '@chakra-ui/react', library: 'chakra', category: 'input' },
  
  // Cards
  { name: 'Card', importPath: '@chakra-ui/react', library: 'chakra', category: 'card' },
  { name: 'CardHeader', importPath: '@chakra-ui/react', library: 'chakra', category: 'card' },
  { name: 'CardBody', importPath: '@chakra-ui/react', library: 'chakra', category: 'card' },
  { name: 'CardFooter', importPath: '@chakra-ui/react', library: 'chakra', category: 'card' },
  
  // Modals
  { name: 'Modal', importPath: '@chakra-ui/react', library: 'chakra', category: 'modal' },
  { name: 'ModalOverlay', importPath: '@chakra-ui/react', library: 'chakra', category: 'modal' },
  { name: 'ModalContent', importPath: '@chakra-ui/react', library: 'chakra', category: 'modal' },
  { name: 'ModalHeader', importPath: '@chakra-ui/react', library: 'chakra', category: 'modal' },
  { name: 'ModalBody', importPath: '@chakra-ui/react', library: 'chakra', category: 'modal' },
  { name: 'ModalFooter', importPath: '@chakra-ui/react', library: 'chakra', category: 'modal' },
  { name: 'Drawer', importPath: '@chakra-ui/react', library: 'chakra', category: 'modal' },
  { name: 'Popover', importPath: '@chakra-ui/react', library: 'chakra', category: 'modal' },
  { name: 'Tooltip', importPath: '@chakra-ui/react', library: 'chakra', category: 'modal' },
  
  // Tables
  { name: 'Table', importPath: '@chakra-ui/react', library: 'chakra', category: 'table' },
  { name: 'Thead', importPath: '@chakra-ui/react', library: 'chakra', category: 'table' },
  { name: 'Tbody', importPath: '@chakra-ui/react', library: 'chakra', category: 'table' },
  { name: 'Tr', importPath: '@chakra-ui/react', library: 'chakra', category: 'table' },
  { name: 'Th', importPath: '@chakra-ui/react', library: 'chakra', category: 'table' },
  { name: 'Td', importPath: '@chakra-ui/react', library: 'chakra', category: 'table' },
  
  // Navigation
  { name: 'Breadcrumb', importPath: '@chakra-ui/react', library: 'chakra', category: 'navigation' },
  { name: 'BreadcrumbItem', importPath: '@chakra-ui/react', library: 'chakra', category: 'navigation' },
  { name: 'BreadcrumbLink', importPath: '@chakra-ui/react', library: 'chakra', category: 'navigation' },
  { name: 'Link', importPath: '@chakra-ui/react', library: 'chakra', category: 'navigation' },
  { name: 'Tabs', importPath: '@chakra-ui/react', library: 'chakra', category: 'navigation' },
  { name: 'TabList', importPath: '@chakra-ui/react', library: 'chakra', category: 'navigation' },
  { name: 'TabPanels', importPath: '@chakra-ui/react', library: 'chakra', category: 'navigation' },
  { name: 'Tab', importPath: '@chakra-ui/react', library: 'chakra', category: 'navigation' },
  { name: 'TabPanel', importPath: '@chakra-ui/react', library: 'chakra', category: 'navigation' },
  { name: 'Menu', importPath: '@chakra-ui/react', library: 'chakra', category: 'navigation' },
  { name: 'MenuButton', importPath: '@chakra-ui/react', library: 'chakra', category: 'navigation' },
  { name: 'MenuList', importPath: '@chakra-ui/react', library: 'chakra', category: 'navigation' },
  { name: 'MenuItem', importPath: '@chakra-ui/react', library: 'chakra', category: 'navigation' },
  
  // Form
  { name: 'FormControl', importPath: '@chakra-ui/react', library: 'chakra', category: 'form' },
  { name: 'FormLabel', importPath: '@chakra-ui/react', library: 'chakra', category: 'form' },
  { name: 'FormHelperText', importPath: '@chakra-ui/react', library: 'chakra', category: 'form' },
  { name: 'FormErrorMessage', importPath: '@chakra-ui/react', library: 'chakra', category: 'form' },
  
  // Feedback
  { name: 'Alert', importPath: '@chakra-ui/react', library: 'chakra', category: 'feedback', variants: ['error', 'warning', 'info', 'success'] },
  { name: 'AlertTitle', importPath: '@chakra-ui/react', library: 'chakra', category: 'feedback' },
  { name: 'AlertDescription', importPath: '@chakra-ui/react', library: 'chakra', category: 'feedback' },
  { name: 'Toast', importPath: '@chakra-ui/react', library: 'chakra', category: 'feedback' },
  { name: 'Spinner', importPath: '@chakra-ui/react', library: 'chakra', category: 'feedback' },
  { name: 'Progress', importPath: '@chakra-ui/react', library: 'chakra', category: 'feedback' },
  { name: 'CircularProgress', importPath: '@chakra-ui/react', library: 'chakra', category: 'feedback' },
  { name: 'Skeleton', importPath: '@chakra-ui/react', library: 'chakra', category: 'feedback' },
  { name: 'Badge', importPath: '@chakra-ui/react', library: 'chakra', category: 'feedback' },
  
  // Data Display
  { name: 'Avatar', importPath: '@chakra-ui/react', library: 'chakra', category: 'data-display' },
  { name: 'AvatarGroup', importPath: '@chakra-ui/react', library: 'chakra', category: 'data-display' },
  { name: 'Tag', importPath: '@chakra-ui/react', library: 'chakra', category: 'data-display' },
  { name: 'Divider', importPath: '@chakra-ui/react', library: 'chakra', category: 'data-display' },
  { name: 'List', importPath: '@chakra-ui/react', library: 'chakra', category: 'data-display' },
  { name: 'ListItem', importPath: '@chakra-ui/react', library: 'chakra', category: 'data-display' },
  { name: 'Text', importPath: '@chakra-ui/react', library: 'chakra', category: 'data-display' },
  { name: 'Heading', importPath: '@chakra-ui/react', library: 'chakra', category: 'data-display' },
  { name: 'Code', importPath: '@chakra-ui/react', library: 'chakra', category: 'data-display' },
  { name: 'Kbd', importPath: '@chakra-ui/react', library: 'chakra', category: 'data-display' },
  
  // Layout
  { name: 'Box', importPath: '@chakra-ui/react', library: 'chakra', category: 'layout' },
  { name: 'Container', importPath: '@chakra-ui/react', library: 'chakra', category: 'layout' },
  { name: 'Flex', importPath: '@chakra-ui/react', library: 'chakra', category: 'layout' },
  { name: 'Grid', importPath: '@chakra-ui/react', library: 'chakra', category: 'layout' },
  { name: 'GridItem', importPath: '@chakra-ui/react', library: 'chakra', category: 'layout' },
  { name: 'Stack', importPath: '@chakra-ui/react', library: 'chakra', category: 'layout' },
  { name: 'HStack', importPath: '@chakra-ui/react', library: 'chakra', category: 'layout' },
  { name: 'VStack', importPath: '@chakra-ui/react', library: 'chakra', category: 'layout' },
  { name: 'Wrap', importPath: '@chakra-ui/react', library: 'chakra', category: 'layout' },
  { name: 'Center', importPath: '@chakra-ui/react', library: 'chakra', category: 'layout' },
];

class DesignSystemService {
  getComponentsByLibrary(library: DesignSystemLibrary): DesignSystemComponent[] {
    switch (library) {
      case 'mui':
        return muiComponents;
      case 'chakra':
        return chakraComponents;
      default:
        return [];
    }
  }

  getAllLibraries(): { value: DesignSystemLibrary; label: string; description: string }[] {
    return [
      { value: 'mui', label: 'Material-UI (MUI)', description: 'Google Material Design components' },
      { value: 'chakra', label: 'Chakra UI', description: 'Simple, modular and accessible components' },
      { value: 'antd', label: 'Ant Design', description: 'Enterprise-class UI design language' },
      { value: 'tailwindui', label: 'Tailwind UI', description: 'Official Tailwind CSS components' },
      { value: 'radix', label: 'Radix UI', description: 'Unstyled, accessible components' },
      { value: 'shadcn', label: 'shadcn/ui', description: 'Beautifully designed components' },
      { value: 'none', label: 'No Library', description: 'Use native HTML/Tailwind' },
    ];
  }

  getInstallCommand(library: DesignSystemLibrary): string {
    const commands: Record<DesignSystemLibrary, string> = {
      mui: 'npm install @mui/material @emotion/react @emotion/styled @mui/icons-material',
      chakra: 'npm install @chakra-ui/react @emotion/react @emotion/styled framer-motion',
      antd: 'npm install antd',
      tailwindui: 'npm install @tailwindcss/forms @tailwindcss/typography @headlessui/react',
      radix: 'npm install @radix-ui/react-icons',
      shadcn: 'npx shadcn-ui@latest init',
      none: '',
    };
    return commands[library] || '';
  }

  getSetupInstructions(library: DesignSystemLibrary): string {
    const instructions: Record<DesignSystemLibrary, string> = {
      mui: `// App.tsx or main.tsx
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';

const theme = createTheme({
  // Your custom theme
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      {/* Your app */}
    </ThemeProvider>
  );
}`,
      chakra: `// main.tsx
import { ChakraProvider } from '@chakra-ui/react';

function App() {
  return (
    <ChakraProvider>
      {/* Your app */}
    </ChakraProvider>
  );
}`,
      antd: `// main.tsx
import { ConfigProvider } from 'antd';

function App() {
  return (
    <ConfigProvider>
      {/* Your app */}
    </ConfigProvider>
  );
}`,
      tailwindui: '// No additional setup needed - uses Tailwind CSS',
      radix: '// Import individual components as needed',
      shadcn: '// Run: npx shadcn-ui@latest add [component-name]',
      none: '',
    };
    return instructions[library] || '';
  }

  convertToDesignSystem(
    htmlCode: string,
    library: DesignSystemLibrary,
    _framework: 'react' | 'vue' | 'angular' = 'react'
  ): { code: string; imports: string[] } {
    let convertedCode = htmlCode;
    const imports: string[] = [];

    if (library === 'none') {
      return { code: htmlCode, imports: [] };
    }

    const components = this.getComponentsByLibrary(library);

    // Basic HTML to Design System conversion logic
    // This is a simplified version - in production, use AST parsing
    
    // Replace common HTML elements with design system components
    components.forEach(comp => {
      // Simple tag replacement logic
      const tagMap: Record<string, string> = {
        'button': 'Button',
        'input': 'TextField',
        'textarea': 'Textarea',
        'select': 'Select',
        'card': 'Card',
        'modal': 'Modal',
        'table': 'Table',
      };

      // Add import if component is used
      if (convertedCode.includes(`<${comp.name}`) || convertedCode.includes(`<${tagMap[comp.name.toLowerCase()]}`)) {
        imports.push(comp.name);
      }
    });

    return { code: convertedCode, imports: [...new Set(imports)] };
  }

  getComponentExample(library: DesignSystemLibrary, componentName: string): string {
    const examples: Record<string, Record<string, string>> = {
      mui: {
        Button: `<Button variant="contained" color="primary">
  Click me
</Button>`,
        TextField: `<TextField 
  label="Email" 
  variant="outlined" 
  fullWidth 
/>`,
        Card: `<Card>
  <CardHeader title="Title" subheader="Subtitle" />
  <CardContent>
    Content here
  </CardContent>
</Card>`,
      },
      chakra: {
        Button: `<Button colorScheme="blue" size="md">
  Click me
</Button>`,
        Input: `<Input 
  placeholder="Email" 
  size="md" 
/>`,
        Card: `<Card>
  <CardHeader>
    <Heading size="md">Title</Heading>
  </CardHeader>
  <CardBody>
    Content here
  </CardBody>
</Card>`,
      },
    };

    return examples[library]?.[componentName] || '';
  }
}

export const designSystemService = new DesignSystemService();
